<script>

export default {
  name: 'Game',

  data() {
    return {
      wordEntryField: '',
    };
  },

  computed: {
    winner() {
      return this.$store.state.game.winner;
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

    myGuesses() {
      return this.$store.getters['game/myGuesses'];
    },

    theirGuesses() {
      return this.$store.getters['game/theirGuesses'];
    },
  },

  methods: {
    handleWordEntry(value) {
      this.wordEntryField = value;
    },

    handleSaveWord() {
      this.$store.dispatch('game/setMyWord', { word: this.wordEntryField });
      this.wordEntryField = '';
    },

    handleSaveGuess() {
      this.$store.dispatch('game/setMyGuess', { word: this.wordEntryField });
      this.wordEntryField = '';
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
                <input
                  value={this.wordEntryField}
                  onChange={(e) => this.handleWordEntry(e.target.value)}
                />
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
        <div class='column'>
        my word: {this.myWord}
        {this.myGuesses.map((guess) => <div>{guess[1]} | {guess[0]}</div>)}
          <div>
            <input onChange={(e) => this.handleWordEntry(e.target.value)}/>
            {this.isMyTurn ? <button onClick={this.handleSaveGuess}>save</button> : null}
          </div>
        </div>
        <div class='column'>
        their word: {this.theirWord}
        {this.theirGuesses.map((guess) => <div>{guess[1]} | {guess[0]}</div>)}
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

.column {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
}
</style>
