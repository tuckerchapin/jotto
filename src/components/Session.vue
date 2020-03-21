<script>
import Lobby from '@/components/Lobby.vue';

export default {
  name: 'Session',

  created() {
    this.$store.dispatch('session/sync');
  },

  render() {
    const stateViz = () => (
      <div id="data">
        session id: {this.$store.state.session.id || '<empty>'}
        <br/>
        name: {this.$store.state.session.name || '<empty>'}
        <br/>
        lobby id: {this.$store.state.lobby.id || '<empty>'}
        <br/>
        game id: {this.$store.state.game.id || '<empty>'}
        <br/>
      </div>
    );

    return (
      <div id="app">
        <Lobby/>
        {stateViz()}
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
