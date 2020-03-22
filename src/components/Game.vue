<script>

export default {
  name: 'Game',

  data() {
    return {
    };
  },

  computed: {
    isWon() {
      return !!this.$store.state.game.winner;
    },

    myWord() {
      return this.$store.getters['game/myWord'];
    },

    theirWord() {
      return this.$store.getters['game/theirWord'];
    },
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
        <br/>
        my word: {this.myWord}
        <br/>
        their word: {this.theirWord}
      </div>
    );
  },
};

</script>

<style src="@/globals.css"></style>

<style>
</style>
