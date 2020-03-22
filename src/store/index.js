import Vue from 'vue';
import Vuex from 'vuex';
import Parse from 'parse';

Vue.use(Vuex);

Parse.serverURL = 'https://parseapi.back4app.com';
Parse.liveQueryServerURL = 'ws://jotto.back4app.io';
Parse.initialize(
  'zgQ2awszgoWkB84nETZ0FgIZUgDsvbwrzZwCb8kc', // app ID
  '6WyFKpJz71ZMUN176Z8awkQtP1ixXQDAdHah7MNe', // js key
);

// var client = new Parse.LiveQueryClient({
//   applicationId: 'zgQ2awszgoWkB84nETZ0FgIZUgDsvbwrzZwCb8kc',
//   serverURL: 'wss://jotto.back4app.io', // Example: 'wss://livequerytutorial.back4app.io'
//   javascriptKey: '6WyFKpJz71ZMUN176Z8awkQtP1ixXQDAdHah7MNe',
//   masterKey: 'Your master key here'
// });
// client.open();

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
            name = 'WackyZanyLemur'; // TODO
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
        opponentName: '',
        opponentId: '',
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

        setOpponent(state, { name }) {
          state.opponentName = name;
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
          console.log(`attempting to join ${id}`);
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
          console.log('syncing...');
          if (id) { // initial sync
            // so get id and subscribe
            commit('setId', { id });
            dispatch('subscribe');
          }

          // get the opponent name
          lobbyInstance.fetch().then(() => {
            // TODO bad, but also max of 2 iterations, sooooo...
            // eslint-disable-next-line no-restricted-syntax
            for (const oppId of Object.keys(lobbyInstance.get('members'))) {
              if (oppId !== rootState.session.id) {
                commit('setOpponent', { name: lobbyInstance.get('members')[oppId] });
                break;
              }
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

        leave({ commit }) {
          commit('setId', { id: '' });
          commit('setOpponent', { name: '' });
          lobbySubscription.unsubscribe();
          lobbyInstance = undefined;
          // TODO
          // clean up on parse and dc properly
        },
      },
    },

    game: {
      namespaced: true,

      state: {

      },

      getters: {

      },

      mutations: {

      },

      actions: {

      },
    },
  },
});
