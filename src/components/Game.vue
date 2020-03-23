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
        <div class='status-flank'></div>
        <div class='status-text'>Set your secret word</div>
        <div class='status-flank'></div>
      </div>
    );

    const sheetHeader = () => (
      <div class='sheet-header'>
        <SheetRow header left/>
        <div class='sheet-header-actions'>
          {/* <button
            class='button small'
            onClick={this.handleNewGame}
          >
            New Game
          </button> */}
          {/* */}<button
            class='button small'
            disabled
          >
            Set word
          </button>{/* */}
        </div>
        <SheetRow header disabled/>
      </div>
    );

    return (
      <div class='game-container'>
        {statusBar()}
        {sheetHeader()}
        <div id='my-sheet' class='sheet'>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow disabled score={4} left/>
          <SheetRow score={4} left/>
        </div>
        <div id='their-sheet' class='sheet'>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
          <SheetRow disabled score={4}/>
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

.sheet-header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

#my-sheet {
  grid-area: mysheet;
}

#their-sheet {
  grid-area: theirsheet;
}
</style>

<style>
.status-bar {
  grid-area: status;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  margin: 10px 0 15px;
}

  .status-bar > * {
    padding: 5px 10px;
  }

  .status-text {
    font-family: var(--sans);
    font-style: italic;
    font-weight: 300;
  }

  .action-waiting .status-text {
    background-color: var(--light-blue);
    font-style: normal;
    color: white;
    z-index: 1;
  }

  .action-waiting .status-flank:first-of-type {
    animation: flash-left 2s ease-in-out infinite;
    background-image: linear-gradient(to left, var(--light-blue) 20px, transparent 30%);
  }

  .action-waiting .status-flank:last-of-type {
    animation: flash-right 2s ease-in-out infinite;
    background-image: linear-gradient(to right, var(--light-blue) 20px, transparent 30%);
  }

  @keyframes flash-left {
    50% {
      transform: translateX(20px);
    }
  }

  @keyframes flash-right {
    50% {
      transform: translateX(-20px);
    }
  }
</style>

<style>
@media print {
  .status-bar {
    display: none;
  }

  .sheet-header-actions {
    visibility: hidden;
  }
}
</style>
