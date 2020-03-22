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
