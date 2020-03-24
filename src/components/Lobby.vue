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

    handleCopyInvite() {
      clearTimeout(copiedTimeout);
      const el = document.createElement('textarea');
      el.value = window.location.href;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      this.justCopied = true;
      copiedTimeout = setTimeout(() => { this.justCopied = false; }, 2000);
    },

    renderCrown() {
      return (
        <svg class='icon crown' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 83.3 63.7" xml:space="preserve">
          <g>
            <path d="M75.5,32.3c-3.6-0.5-6.5-3-7.6-6.4l-10.1,5.6l-9.9-17.7c-1.7,1.4-3.8,2.2-6.1,2.2c-2.3,0-4.5-0.8-6.1-2.2l-9.9,17.7 l-10.1-5.6c-1.2,3.3-4.1,5.8-7.7,6.4l6.4,18.8h54.8L75.5,32.3z"/>
            <path d="M16.6,63.7h50.2c0.9,0,1.7-0.8,1.7-1.7v-7.6H14.9v7.6C14.9,63,15.7,63.7,16.6,63.7L16.6,63.7z"/>
            <path d="M6.4,29.1c3.5,0,6.4-2.9,6.4-6.4s-2.9-6.4-6.4-6.4c-3.5,0-6.4,2.9-6.4,6.4C0,26.2,2.9,29.1,6.4,29.1z"/>
            <path d="M35.3,6.4c0,3.5,2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C48,2.9,45.2,0,41.7,0C38.2,0,35.3,2.9,35.3,6.4z"/>
            <path d="M77,16.4c-3.5,0-6.4,2.9-6.4,6.4s2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C83.3,19.2,80.5,16.4,77,16.4z"/>
          </g>
        </svg>
      );
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
            <div class='lobby-name'>{this.theirName}{!this.isOwner ? this.renderCrown() : null}</div>
            <div class='lobby-name'>{this.myName} (You) {this.isOwner ? this.renderCrown() : null}</div>
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
  color: var(--medium-blue);
}
</style>

<style>
.in-game {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
  justify-content: center;
}

.lobby-header {
  display: grid;
  /* eslint-disable-next-line max-len */
  --width: calc(var(--column-size) - var(--letter-box-dimension));
  grid-template-columns: var(--width) var(--width);
  column-gap: calc(var(--column-gap) + 2 * var(--letter-box-dimension));
  justify-content: center;
}

.lobby-name {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 40px;

  font-size: 20px;
  font-family: var(--sans);
}

.icon.crown {
  fill: var(--gold);
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>
