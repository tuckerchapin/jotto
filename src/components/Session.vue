<script>
import Lobby from '@/components/Lobby.vue';

export default {
  name: 'Session',

  created() {
    this.$store.dispatch('session/sync');
  },

  render() {
    return (
      <Lobby/>
    );
  },
};

</script>

<style src="@/globals.css"></style>
