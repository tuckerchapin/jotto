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
        // name: '',
        members: [],
      },

      getters: {

      },

      mutations: {
        setId(state, { id }) {
          state.id = id;

          const url = new URL(window.location.href);
          url.searchParams.set('', id);
          window.history.pushState(null, null, url);
        },

        // setName(state, { name }) {
        //   state.name = name;
        // },

        setMembers(state, { members }) {
          state.members = members;
        },
      },

      actions: {
        sync({ dispatch }) {
          const url = new URL(window.location.href);
          if (url.searchParams.has('')) {
            dispatch('join', { id: url.searchParams.get('') });
          }
        },

        create({ rootState, dispatch }) {
          const lobby = new PLobby();
          lobby.set('members', [rootState.session.id]);
          lobby.save()
            .then((newLobby) => {
              dispatch('join', { id: newLobby.id });
            });
        },

        join({ rootState, commit, dispatch }, { id }) {
          console.log(`attempting to join ${id}`);
          const query = new Parse.Query(PLobby);
          query.get(id)
            .then((lobby) => {
              if (lobby.get('members').includes(rootState.session.id)) { // rejoining lobby user is already in
                commit('setId', { id: lobby.id });
                dispatch('subscribe');
              } else if (lobby.get('members').length < 2) { // joining lobby with at least one open slot
                lobby.add('members', rootState.session.id); // add user to lobby
                lobby.save().then(() => {
                  commit('setId', { id: lobby.id });
                  dispatch('subscribe');
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

        async subscribe({ state }) {
          const query = new Parse.Query(PLobby);
          query.get(state.id);

          lobbySubscription = await query.subscribe();

          lobbySubscription.on('update', (thing) => {
            console.log(thing);
          });
        },

        leave() {
          // TODO
          // commit('setId', { id: '' });
          // commit('setName', { name: '' });
          // commit('setMembers', { members: [] });
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
