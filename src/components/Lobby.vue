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
    inGame() {
      return !!this.$store.state.lobby.gameId;
    },

    inLobby() {
      return !!this.$store.state.lobby.id;
    },

    isOwner() {
      return this.$store.state.lobby.isOwner;
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
    if (this.inGame) {
      return (
        <div>
          <Game/>
        </div>
      );
    }

    if (this.inLobby) {
      return (
        <div>
          {this.isOwner ? <button onClick={this.handleNewGame}>new game</button> : 'waiting for lobby owner to start'}
        </div>
      );
    }

    return (
      <div>
        join a lobby <input onChange={(e) => this.handleLobbyEntered(e.target.value)}/>
        <button onClick={this.handleJoinLobby}>join</button>
        <br/>
        <button onClick={this.handleCreateLobby}>create a lobby</button>
      </div>
    );
  },
};

</script>

<style src="@/globals.css"></style>

<style>
</style>
