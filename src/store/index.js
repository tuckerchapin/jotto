import Vue from 'vue';
import Vuex from 'vuex';
import Parse from 'parse';
import { generateCombination } from 'gfycat-style-urls';

Vue.use(Vuex);

Parse.serverURL = 'https://parseapi.back4app.com';
Parse.liveQueryServerURL = 'ws://jotto.back4app.io';
Parse.initialize(
  'zgQ2awszgoWkB84nETZ0FgIZUgDsvbwrzZwCb8kc', // app ID
  '6WyFKpJz71ZMUN176Z8awkQtP1ixXQDAdHah7MNe', // js key
);

const PLobby = Parse.Object.extend('Lobby');
const PGame = Parse.Object.extend('Game');

let lobbyInstance;
let lobbySubscription;
let gameInstance;
let gameSubscription;

export default new Vuex.Store({
  state: {
    turnLimit: 10,
    wordLength: 5,
  },

  mutations: {
  },

  actions: {
  },

  modules: {
    session: {
      namespaced: true,

      state: {
        id: '',
        name: '',
      },

      mutations: {
        setId(state, { id }) {
          state.id = id;
        },

        setName(state, { name }) {
          state.name = name;
        },
      },

      actions: {
        sync({ commit }) {
          let id = localStorage.getItem('jotto__sessionId');
          if (!id) {
            id = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
            localStorage.setItem('jotto__sessionId', id);
          }
          commit('setId', { id });

          let name = localStorage.getItem('jotto__nickname');
          if (!name) {
            name = generateCombination(1, '', true); // TODO
            localStorage.setItem('jotto__nickname', name);
          }
          commit('setName', { name });
        },
      },
    },

    lobby: {
      namespaced: true,

      state: {
        id: '',
        opponentId: '',
        opponentName: '',
        isOwner: false,
        gameId: '',
      },

      getters: {
        myId(_state, _getters, rootState) {
          return rootState.session.id;
        },

        myName(_state, _getters, rootState) {
          return rootState.session.name;
        },

        theirId(state) {
          return state.opponentId;
        },

        theirName(state) {
          return state.opponentName;
        },
      },

      mutations: {
        setId(state, { id }) {
          state.id = id;

          const url = new URL(window.location.href);
          if (id) {
            url.searchParams.set('', id);
          } else {
            url.searchParams.delete('');
          }
          window.history.pushState(null, null, url);
        },

        setOpponent(state, { id, name }) {
          state.opponentId = id;
          state.opponentName = name;
        },

        setOwner(state, { isOwner }) {
          state.isOwner = isOwner;
        },

        setGameId(state, { gameId }) {
          state.gameId = gameId;
        },
      },

      actions: {
        autojoin({ dispatch }) {
          const url = new URL(window.location.href);
          if (url.searchParams.has('')) {
            dispatch('join', { id: url.searchParams.get('') });
          }
        },

        create({ rootState, dispatch }) {
          const lobby = new PLobby();

          const newMembers = {};
          newMembers[rootState.session.id] = rootState.session.name;
          lobby.set('members', newMembers);
          lobby.set('gameId', '');

          lobby.save()
            .then((newLobby) => {
              dispatch('join', { id: newLobby.id });
            });
        },

        join({ rootState, dispatch }, { id }) {
          const query = new Parse.Query(PLobby);
          query.get(id)
            .then((lobby) => {
              if (rootState.session.id in lobby.get('members') || Object.keys(lobby.get('members')).length < 2) {
                // rejoining lobby user is already in or if there is an open slot
                lobbyInstance = lobby;

                // add user to lobby
                const newMembers = lobby.get('members');
                newMembers[rootState.session.id] = rootState.session.name;
                lobby.set('members', newMembers);

                lobby.save().then(() => {
                  dispatch('sync', { id: lobby.id });
                });
              } else {
                alert('could not join lobby'); // TODO
              }
            })
            .catch((error) => {
              alert('invalid lobby'); // TODO
              console.error(error);
            });
        },

        sync({
          state, rootState, commit, dispatch,
        }, { id }) {
          if (id) { // initial sync
            // so get id and subscribe
            commit('setId', { id });
            dispatch('subscribe');
          }

          // sync lobby info
          lobbyInstance.fetch().then(() => {
            // get the opponent id and name, decide who is owner
            const members = lobbyInstance.get('members');
            let opponentId = Object.keys(members)[0];
            let isOwner = false;
            if (opponentId === rootState.session.id) {
              // eslint-disable-next-line prefer-destructuring
              opponentId = Object.keys(members)[1] || '';
              isOwner = true;
            }
            commit('setOpponent', { id: opponentId, name: members[opponentId] || '' });
            commit('setOwner', { isOwner });

            const gameId = lobbyInstance.get('gameId');
            const prevGameId = state.gameId;
            commit('setGameId', { gameId });
            if (gameId && gameId !== prevGameId) {
              dispatch('game/join', { id: gameId }, { root: true });
            }
          });
        },

        async subscribe({ state, dispatch }) {
          const query = new Parse.Query(PLobby);
          query.get(state.id);

          lobbySubscription = await query.subscribe();

          lobbySubscription.on('update', () => {
            dispatch('sync', {});
          });
        },

        leave({ rootState, commit }) {
          commit('setId', { id: '' });
          commit('setOpponent', { id: '', name: '' });
          commit('setOwner', { isOwner: false });
          commit('setGameId', { gameId: '' });
          lobbySubscription.unsubscribe();

          const newMembers = lobbyInstance.get('members');
          delete newMembers[rootState.session.id];
          lobbyInstance.set('members', newMembers);
          // TODO
          lobbyInstance.save().then(() => { lobbyInstance = undefined; });
        },
      },
    },

    game: {
      namespaced: true,

      state: {
        id: '',
        players: {},
        words: ['', ''],
        guesses: [[], []],
        winner: '',
      },

      getters: {
        myId(_state, _getters, rootState) {
          return rootState.session.id;
        },

        theirId(_state, _getters, rootState) {
          return rootState.lobby.opponentId;
        },

        myPlayerNumber(state, getters) {
          return state.players[getters.myId];
        },

        theirPlayerNumber(state, getters) {
          return state.players[getters.theirId];
        },

        myWord(state, getters) {
          return state.words[getters.myPlayerNumber] || '';
        },

        theirWord(state, getters) {
          return state.words[getters.theirPlayerNumber] || '';
        },

        isMyTurn(state, getters) {
          if (!getters.myWord || !getters.theirWord) {
            // still choosing secret words
            return false;
          }

          if (getters.myPlayerNumber === 0) {
            // we're the owner, so we go first when equal
            return state.guesses[0].length === state.guesses[1].length;
          }
          // otherwise if they are unequal then its our turn
          return state.guesses[0].length !== state.guesses[1].length;
        },

        myGuesses(state, getters) {
          return state.guesses[getters.myPlayerNumber] || [];
        },

        theirGuesses(state, getters) {
          return state.guesses[getters.theirPlayerNumber] || [];
        },
      },

      mutations: {
        setId(state, { id }) {
          state.id = id;
        },

        setPlayers(state, { players }) {
          state.players = players;
        },

        setWinner(state, { winner }) {
          state.winner = winner;
        },

        setWords(state, { words }) {
          Vue.set(state.words, 0, words[0]);
          Vue.set(state.words, 1, words[1]);
        },

        setGuesses(state, { guesses }) {
          Vue.set(state.guesses, 0, guesses[0]);
          Vue.set(state.guesses, 1, guesses[1]);
        },
      },

      actions: {
        autojoin({ rootState, dispatch }) {
          if (rootState.lobby.gameId) {
            dispatch('join', { id: rootState.lobby.gameId });
          }
        },

        create({ rootState, commit, dispatch }) {
          const game = new PGame();

          const players = {};
          players[rootState.session.id] = 0;
          players[rootState.lobby.opponentId] = 1;
          if (!rootState.lobby.isOwner) {
            players[rootState.session.id] = 1;
            players[rootState.lobby.opponentId] = 0;
          }

          commit('setPlayers', { players });
          game.set('players', players);
          game.set('player0Word', '');
          game.set('player1Word', '');
          game.set('player0Guesses', []);
          game.set('player1Guesses', []);
          game.set('winner', '');

          game.save()
            .then((newGame) => {
              // This feels dirty
              lobbyInstance.set('gameId', newGame.id);
              lobbyInstance.save();
              dispatch('join', { id: newGame.id });
            });
        },

        join({ dispatch }, { id }) {
          const query = new Parse.Query(PGame);
          query.get(id)
            .then((game) => {
              gameInstance = game;
              dispatch('sync', { id: game.id });
            })
            .catch((error) => {
              alert('invalid game'); // TODO
              console.error(error);
            });
        },

        sync({ commit, dispatch }, { id }) {
          if (id) { // initial sync
            // so get id and subscribe
            commit('setId', { id });
            dispatch('subscribe');
          }

          // sync game info
          gameInstance.fetch().then(() => {
            commit('setPlayers', { players: gameInstance.get('players') });
            commit('setWinner', { winner: gameInstance.get('winner') });
            commit('setWords', { words: [gameInstance.get('player0Word'), gameInstance.get('player1Word')] });
            commit('setGuesses', { guesses: [gameInstance.get('player0Guesses'), gameInstance.get('player1Guesses')] });
          });
        },

        async subscribe({ state, dispatch }) {
          const query = new Parse.Query(PGame);
          query.get(state.id);

          gameSubscription = await query.subscribe();

          gameSubscription.on('update', () => {
            dispatch('sync', {});
          });
        },

        clear({ commit }) {
          try {
            gameSubscription.unsubscribe();
          } catch (e) {
            //
          }

          commit('setPlayers', { players: {} });
          commit('setWinner', { winner: '' });
          commit('setWords', { words: ['', ''] });
          commit('setGuesses', { guesses: [[], []] });
        },

        setMyWord({ getters, dispatch }, { word }) {
          gameInstance.set(`player${getters.myPlayerNumber}Word`, word);
          gameInstance.save().then(() => dispatch('sync', {}));
        },

        setMyGuess({ rootState, getters, dispatch }, { word }) {
          // scoring function
          let score = 0;
          const guess = word.toLowerCase().split('');
          const theirWord = getters.theirWord.split('');
          guess.forEach((letter) => {
            // check if target word contains a letter from the guess
            const idx = theirWord.indexOf(letter);
            if (idx > -1) { // it does
              score += 1;
              theirWord.splice(idx, 1); // remove it for dupes
            }
          });
          gameInstance.add(`player${getters.myPlayerNumber}Guesses`, [word.toLowerCase(), score]);

          // check for game win
          if (word.toLowerCase() === getters.theirWord.toLowerCase()) {
            gameInstance.set('winner', getters.myId);
          } else if (
            // if both have used up all their guesses, draw
            getters.theirGuesses.length === rootState.turnLimit
            && getters.myGuesses.length === rootState.turnLimit - 1
          ) {
            gameInstance.set('winner', 'draw');
          }

          gameInstance.save().then(() => dispatch('sync', {}));
        },
      },
    },
  },
});
