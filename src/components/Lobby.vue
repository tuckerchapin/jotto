<script>

export default {
  name: 'Lobby',

  data() {
    return {
      lobbyEntryField: '',
    };
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
  },

  created() {
    this.$store.dispatch('lobby/sync');
  },

  render() {
    // if (this.$store.state.lobby) {
    //   if (this.$store.state.game) {
    //     return (
    //       <div>
    //         hi there's a game!!
    //       </div>
    //     );
    //   }
    //   return (
    //     <div>
    //       hi there's no game
    //       <button>start a new game</button>
    //     </div>
    //   );
    // }

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
#data {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, .5);
}
</style>
