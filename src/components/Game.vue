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

    isMyTurn() {
      return this.$store.getters['game/isMyTurn'];
    },
  },

  methods: {
    handleWordEntry(value) {
      this.wordEntryField = value;
    },

    handleSaveWord() {
      this.$store.dispatch('game/setMyWord', { word: this.wordEntryField });
    },

    handleSaveGuess() {
      this.$store.dispatch('game/setMyGuess', { word: this.wordEntryField });
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
        <div>
          <input onChange={(e) => this.handleWordEntry(e.target.value)}/>
          {this.isMyTurn ? <button onClick={this.handleSaveGuess}>save</button> : null}
        </div>
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
