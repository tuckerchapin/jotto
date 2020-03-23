<script>
import SheetRow from '@/components/SheetRow.vue';

const NEW_GAME = 0;
const AWAIT_MY_SECRET = 1;
const AWAIT_THEIR_SECRET = 2;
const GAME_OVER = 3;
const MY_TURN = 4;
const THEIR_TURN = 5;

export default {
  name: 'Game',

  data() {
    return {
      secretWord: '',
      statusText: '',
      statusClass: '',
    };
  },

  computed: {
    turnLimit() {
      return this.$store.state.turnLimit;
    },

    isInGame() {
      return !!this.$store.state.game.id;
    },

    isOwner() {
      return this.$store.state.lobby.isOwner;
    },

    winner() {
      return this.$store.state.game.winner;
    },

    myId() {
      return this.$store.getters['game/myId'];
    },

    theirId() {
      return this.$store.getters['game/theirId'];
    },

    theirName() {
      return this.$store.getters['lobby/theirName'];
    },

    isValidSecretWord() {
      return this.secretWord.length === 5;
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
      if (!this.isInGame) {
        // waiting to start new game (first time)
        return NEW_GAME;
      }

      if (!this.myWord) {
        // waiting for you to enter your word
        return AWAIT_MY_SECRET;
      }

      if (!this.theirWord) {
        // waiting for opponent to enter a word
        return AWAIT_THEIR_SECRET;
      }

      if (this.winner) {
        // game over
        return GAME_OVER;
      }

      if (this.isMyTurn) {
        return MY_TURN;
      }

      return THEIR_TURN;
    },
  },

  watch: {
    status(newStatus) {
      this.setStatusBarContent(newStatus);
    },
  },

  methods: {
    handleNewGame() {
      this.$store.dispatch('game/create');
    },

    handleSetWord() {
      if (this.isValidSecretWord) {
        this.$store.dispatch('game/setMyWord', { word: this.secretWord });
        this.secretWord = '';
      }
    },

    handleSaveGuess(word) {
      if (word.length === 5) {
        this.$store.dispatch('game/setMyGuess', { word });
      }
    },

    handleSecretWordChanged(newWord) {
      this.secretWord = newWord;
    },

    setStatusBarContent(status) {
      switch (status) {
        case NEW_GAME:
          if (this.isOwner) {
            this.statusText = 'Start a new game.';
          } else {
            this.statusText = 'Waiting for lobby owner to start a new game...';
          }
          break;
        case AWAIT_MY_SECRET:
          this.statusText = 'Choose your secret word.';
          break;
        case AWAIT_THEIR_SECRET:
          this.statusText = 'Waiting for opponent to choose their secret word...';
          break;
        case GAME_OVER:
          if (this.winner === this.myId) {
            this.statusText = 'You win!';
          } else if (this.winner === this.theirId) {
            this.statusText = `${this.theirName} wins!`;
          } else {
            this.statusText = 'Draw!';
          }

          if (this.isOwner) {
            this.statusText += ' Play again?';
          }
          break;
        case MY_TURN:
          this.statusText = 'Your turn.';
          break;
        case THEIR_TURN:
          this.statusText = `${this.theirName}'s turn...`;
          break;
        default:
          break;
      }
    },
  },

  created() {
    this.$store.dispatch('game/autojoin');
    this.setStatusBarContent(this.status);
  },

  render() {
    const statusBar = () => (
      <div class='status-bar'>
        <div class='status-flank'></div>
        <div class='status-text'>{this.statusText}</div>
        <div class='status-flank'></div>
      </div>
    );

    const sheetHeader = () => (
      <div class='sheet-header'>
        <SheetRow
          header
          hide
          disabled={this.status === AWAIT_MY_SECRET}
        />
        <div class='sheet-header-actions'>
          {(this.status === NEW_GAME || this.status === GAME_OVER) && this.isOwner
            ? (
              <button
                class='button small'
                onClick={this.handleNewGame}
              >
                New Game
              </button>
            )
            : null
          }
          {this.status === AWAIT_MY_SECRET
            ? (
              <button
                class='button small'
                disabled={!this.isValidSecretWord}
                onClick={this.handleSetWord}
              >
                Set word
              </button>
            )
            : null
          }
        </div>
        <SheetRow
          header
          left
          highlight={this.status === AWAIT_MY_SECRET}
          word={this.myWord}
          disabled={this.status !== AWAIT_MY_SECRET}
          onChange={this.handleSecretWordChanged}
        />
      </div>
    );

    return (
      <div class='game-container'>
        {statusBar()}
        {sheetHeader()}
        <div id='my-sheet' class='sheet'>
          {this.myGuesses.map(
            ([word, score]) => <SheetRow disabled word={word} score={score} left/>,
          )}
          {[...Array(this.turnLimit - this.myGuesses.length)].map((_, key) => {
            if (key === 0 && this.status !== GAME_OVER && this.status !== NEW_GAME) {
              return (
                <SheetRow
                  left
                  disabled={!this.myWord}
                  highlight={this.isMyTurn}
                  noSubmit={!this.isMyTurn}
                  onSubmit={this.handleSaveGuess}
                />
              );
            }
            return <SheetRow disabled left/>;
          })}
        </div>

        <div id='their-sheet' class='sheet'>
          {this.theirGuesses.map(
            ([word, score]) => <SheetRow disabled word={word} score={score}/>,
          )}
          {[...Array(this.turnLimit - this.theirGuesses.length)].map(() => <SheetRow disabled/>)}
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
    background-color: var(--medium-blue);
    font-style: normal;
    color: white;
    z-index: 1;
  }

  .action-waiting .status-flank:first-of-type {
    animation: flash-left 2s ease-in-out infinite;
    background-image: linear-gradient(to left, var(--medium-blue) 20px, transparent 30%);
  }

  .action-waiting .status-flank:last-of-type {
    animation: flash-right 2s ease-in-out infinite;
    background-image: linear-gradient(to right, var(--medium-blue) 20px, transparent 30%);
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
