<script>
import SheetRow from '@/components/SheetRow.vue';

export default {
  name: 'Game',

  data() {
    return {
      wordEntryField: '',
    };
  },

  computed: {
    isInGame() {
      return !!this.$store.state.game.id;
    },

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

    status() {
      return 0;
      // your turn
      // their turn
      // waiting for you to enter a word
      // waiting for them to enter a word
      // you won
      // you lost
      // draw
      // clean slate
    },
  },

  methods: {
    handleNewGame() {
      this.$store.dispatch('game/create');
    },

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
    const statusBar = () => (
      <div class='status-bar'>
        it's your turn!
      </div>
    );

    const sheetHeader = () => (
      <div class='sheet-header'>
        <SheetRow header left active word='poopy'/>
        <div>
          <button
            class='button small'
            onClick={this.handleNewGame}
          >
            New game
          </button>
        </div>
        <SheetRow header/>
      </div>
    );

    return (
      <div class='game-container'>
        {statusBar()}
        {sheetHeader()}
        <div id='my-sheet' class='sheet'>
          <SheetRow left score={4}/>
          <SheetRow left score={5}/>
          <SheetRow left score={4}/>
          <SheetRow left score={5}/>
          <SheetRow left score={4} active/>
          <SheetRow left score={5}/>
          <SheetRow left score={4}/>
          <SheetRow left score={5}/>
          <SheetRow left score={4}/>
          <SheetRow left score={5}/>
        </div>
        <div id='their-sheet' class='sheet'>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
          <SheetRow score={4} active/>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
          <SheetRow score={4}/>
        </div>
      </div>
    );
  },
};

</script>

<style>
.game-container {
  display: grid;
  grid-template-columns: var(--column-size) var(--column-size);
  column-gap: var(--column-gap);
  justify-content: center;
  grid-template-rows: min-content min-content;
  grid-template-areas:
    "status status"
    "header header"
    "mysheet theirsheet";
}

.status-bar {
  grid-area: status;
  display: flex;
  justify-content: center;
  /* display: flex;
  justify-content: space-between; */

  /* margin: 20px; */
}

.sheet-header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sheet {
  /* background-color: white; */
}

#my-sheet {
  grid-area: mysheet;
}

#their-sheet {
  grid-area: theirsheet;
}
</style>
