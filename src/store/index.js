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

        sync({ rootState, commit, dispatch }, { id }) {
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

            commit('setGameId', { gameId: lobbyInstance.get('gameId') });
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
        player0Word: '',
        player1Word: '',
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
          return state[`player${getters.myPlayerNumber}Word`];
        },

        theirWord(state, getters) {
          return state[`player${getters.theirPlayerNumber}Word`];
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
          if (!state.winner) {
            state.winner = winner;
          }
        },

        // setWord(state, { player, word }) {
        //   if (!state.words[player]) {
        //     Vue.set(state.words, player, word);
        //   }
        // },

        setWords(state, { player0Word, player1Word }) {
          state.player0Word = player0Word;
          state.player1Word = player1Word;
        },

        // setTurn(state, { player, word }) {

        // }
      },

      actions: {
        autojoin({ rootState, dispatch }) {
          if (rootState.lobby.gameId) {
            dispatch('join', { id: rootState.lobby.gameId });
          }
        },

        create({
          state, rootState, commit, dispatch,
        }) {
          const game = new PGame();

          const players = {};
          players[rootState.session.id] = 0;
          players[rootState.lobby.opponentId] = 1;
          if (!rootState.lobby.isOwner) {
            players[rootState.session.id] = 1;
            players[rootState.lobby.opponentId] = 0;
          }
          commit('setPlayers', players);
          game.set('players', players);
          game.set('player0Word', '');
          game.set('player1Word', '');
          game.set('winner', state.winner);

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
            commit('setWords', {
              player0word: gameInstance.get('player0Word'),
              player1word: gameInstance.get('player1Word'),
            });
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

        forfeit({ getters, dispatch }) {
          gameInstance.set('winner', getters.theirId);
          gameInstance.save().then(() => dispatch('sync', {}));
        },

        setMyWord({ getters, dispatch }, { word }) {
          gameInstance.set(`player${getters.myPlayerNumber}Word`, word);
          gameInstance.save().then(() => dispatch('sync', {}));
        },
      },
    },
  },
});
