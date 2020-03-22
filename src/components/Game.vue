<script>

export default {
  name: 'Game',

  data() {
    return {
    };
  },

  computed: {
  },

  methods: {
  },

  created() {
    this.$store.dispatch('game/autojoin');
  },

  render() {
    return (
      <div>
        this is a game
      </div>
    );
  },
};

</script>

<style src="@/globals.css"></style>

<style>
</style>
