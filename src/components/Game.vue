<script>

export default {
  name: 'Game',

  data() {
    return {
      wordEntryField: '',
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
    handleWordEntry(value) {
      this.wordEntryField = value;
    },

    handleSaveWord() {
      console.log(this.myWord, this.theirWord, this.$store.getters['game/myPlayerNumber'], this.$store.getters['game/theirPlayerNumber'], this.wordEntryField);
      this.$store.dispatch('game/setMyWord', { word: this.wordEntryField });
    },
  },

  created() {
    this.$store.dispatch('game/autojoin');
  },

  render() {
    if (!this.myWord || !this.theirWord) { // word entry phase
      return (
        <div class='gamecontainer'>
          {this.myWord
            ? <div>{this.myWord}</div>
            : <div>
              <input onChange={(e) => this.handleWordEntry(e.target.value)}/>
              <button onClick={this.handleSaveWord}>save</button>
            </div>
          }
          <div>
            {this.theirWord ? this.theirWord : 'waiting for opponent to choose a word'}
          </div>
        </div>
      );
    }

    return (
      <div class='gamecontainer'>
        <div>
        my word: {this.myWord}
        </div>
        <div>
        their word: {this.theirWord}
        </div>
      </div>
    );
  },
};

</script>

<style src="@/globals.css"></style>

<style>
.gamecontainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
