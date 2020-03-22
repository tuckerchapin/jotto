<script>
import Game from '@/components/Game.vue';

export default {
  name: 'Lobby',

  data() {
    return {
      lobbyEntryField: '',
    };
  },

  computed: {
    inLobby() {
      return !!this.$store.state.lobby.id;
    },

    isOwner() {
      return this.$store.state.lobby.isOwner;
    },

    theirId() {
      return this.$store.getters['lobby/theirId'];
    },

    theirName() {
      return this.$store.getters['lobby/theirName'];
    },

    myName() {
      return this.$store.getters['lobby/myName'];
    },
  },

  methods: {
    handleLobbyEntered(value) {
      this.lobbyEntryField = value;
    },

    handleJoinLobby() {
      this.$store.dispatch('lobby/join', { id: this.lobbyEntryField });
    },

    handleCreateLobby() {
      this.$store.dispatch('lobby/create');
    },

    handleNewGame() {
      this.$store.dispatch('game/create');
    },
  },

  created() {
    this.$store.dispatch('lobby/autojoin');
  },

  render() {
    if (this.inLobby) {
      if (this.theirId) {
        return (
          <div>
            <Game/>
          </div>
        );
      }

      // {this.isOwner ? <button onClick={th
      // is.handleNewGame}>new game</button> : 'lobby owner starts game'}
      return (
        <div>
          Waiting for another player...
        </div>
      );
    }

    return (
      <div class='lobby-select'>
        <button
          class='button'
          onClick={this.handleCreateLobby}
        >
          Create a lobby
        </button>
        <span>or</span>
        <input
          placeholder='Enter a lobby code...'
          value={this.lobbyEntryField}
          onChange={(e) => this.handleLobbyEntered(e.target.value)}
          onKeyup={(e) => { if (e.key === 'Enter') this.handleJoinLobby(); } }
        />
      </div>
    );
  },
};

</script>

<style src="@/globals.css"></style>

<style>
.lobby-select {
  height: 100vh;
  display: grid;
  grid-template-columns: 300px;
  align-content: center;
  justify-content: center;
  text-align: center;
}

.lobby-select span {
  font-family: var(--sans);
  font-style: italic;
  font-size: 1em;
  margin: 10px;
}
</style>
