<script>
import Game from '@/components/Game.vue';

let copiedTimeout;

export default {
  name: 'Lobby',

  data() {
    return {
      lobbyEntryField: '',
      justCopied: false,
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

    handleCopyInvite() {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          this.justCopied = true;
          clearTimeout(copiedTimeout);
          copiedTimeout = setTimeout(() => { this.justCopied = false; }, 2000);
        })
        .catch(() => {});
    },
  },

  created() {
    this.$store.dispatch('lobby/autojoin');
  },

  render() {
    if (this.theirId) {
      return (
        <div class='in-game'>
          <div class='lobby-header'>
          </div>
          <Game/>
        </div>
      );
    }

    if (this.inLobby) {
      return (
        <div class='lobby-select'>
          <span>Waiting for another player...</span>
          <button
            class={`button small ${!this.justCopied || 'copied'}`}
            onClick={this.handleCopyInvite}
          >
            {this.justCopied ? 'Copied!' : 'Copy invite link'}
          </button>
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
          class='input'
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

.copied {
  color: var(--light-blue);
}
</style>

<style>
.in-game {
  min-height: 100vh;
}
.lobby-header {

}
</style>
