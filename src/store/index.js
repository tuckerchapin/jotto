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
// const PGame = Parse.Object.extend('Game');

let lobbyInstance;
let lobbySubscription;
// let gameInstance;

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

      getters: {

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
      },

      getters: {

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
          lobbySubscription.unsubscribe();

          const newMembers = lobbyInstance.get('members');
          delete newMembers[rootState.session.id];
          lobbyInstance.set('members', newMembers);
          // TODO
          // clean up on parse and dc properly
          lobbyInstance.save().then(() => { lobbyInstance = undefined; });
        },
      },
    },

    game: {
      namespaced: true,

      state: {
        id: '',
        userWord: '',
        oppWord: '',
        userTurns: [],
        oppTurns: [],
      },

      getters: {

      },

      mutations: {
        setId(state, { id }) {
          state.id = id;
        },
      },

      actions: {

      },
    },
  },
});
