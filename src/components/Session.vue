<script>
import Lobby from '@/components/Lobby.vue';

export default {
  name: 'Session',

  created() {
    this.$store.dispatch('session/sync');
  },

  render() {
    return (
      <div id="app">
        <Lobby/>

        <div id="data">
          session id: {this.$store.state.session.id || '<empty>'}
          <br/>
          name: {this.$store.state.session.name || '<empty>'}
          <br/>
          lobby id: {this.$store.state.lobby.id || '<not in a lobby>'}
          {this.$store.state.lobby.id ? <button onClick={() => this.$store.dispatch('lobby/leave')}>leave lobby</button> : null}
          <br/>
          owner: {this.$store.state.lobby.isOwner ? 'yes' : 'no'}
          <br/>
          opponent: {this.$store.state.lobby.opponentName || '<no opponent>'}
          <br/>
          game id: {this.$store.state.game.id || '<not in a game>'}
          <br/>
        </div>
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
