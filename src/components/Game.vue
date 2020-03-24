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
      letterTracker: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        h: 0,
        i: 0,
        j: 0,
        k: 0,
        l: 0,
        m: 0,
        n: 0,
        o: 0,
        p: 0,
        q: 0,
        r: 0,
        s: 0,
        t: 0,
        u: 0,
        v: 0,
        w: 0,
        x: 0,
        y: 0,
        z: 0,
      },
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

    handleLetterClicked(letter) {
      this.$set(this.letterTracker, letter, this.letterTracker[letter] + 1);
    },

    setStatusBarContent(status) {
      switch (status) {
        case NEW_GAME:
          if (this.isOwner) {
            this.statusText = 'Start a new game.';
            this.statusClass = 'gentle';
          } else {
            this.statusText = 'Waiting for lobby owner to start a new game...';
            this.statusClass = 'neutral';
          }
          break;
        case AWAIT_MY_SECRET:
          this.statusText = 'Choose your secret word.';
          this.statusClass = 'attention pulse gentle';
          break;
        case AWAIT_THEIR_SECRET:
          this.statusText = 'Waiting for opponent to choose their secret word...';
          this.statusClass = 'neutral';
          break;
        case GAME_OVER:
          if (this.winner === this.myId) {
            this.statusText = 'You win!';
            this.statusClass = 'pulse win';
          } else if (this.winner === this.theirId) {
            this.statusText = `${this.theirName} wins!`;
            this.statusClass = 'neutral';
          } else {
            this.statusText = 'Draw!';
            this.statusClass = 'draw';
          }

          if (this.isOwner) {
            this.statusText += ' Play again?';
          }
          break;
        case MY_TURN:
          this.statusText = 'Your turn.';
          this.statusClass = 'pulse gentle';
          break;
        case THEIR_TURN:
          this.statusText = `${this.theirName}'s turn...`;
          this.statusClass = 'neutral';
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
      <div class={`status-bar ${this.statusClass}`}>
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
          word={this.status === GAME_OVER ? this.theirWord : ''}
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
        <div id='letter-tracker'>
          {Object.keys(this.letterTracker).map((letter) => (
              <div
                class='a-letter'
                onClick={() => this.handleLetterClicked(letter)}
              >
                <svg class={`letter-circle ${this.letterTracker[letter] % 3 === 2 ? 'show' : ''}`} version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="m50 5c-24.816 0-45 20.184-45 45s20.184 45 45 45 45-20.184 45-45-20.184-45-45-45zm0 6c21.574 0 39 17.426 39 39s-17.426 39-39 39-39-17.426-39-39 17.426-39 39-39z"/>
                </svg>
                <svg class={`letter-slash ${this.letterTracker[letter] % 3 === 1 ? 'show' : ''}`} version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="m3.125 100c-0.80078 0-1.6016-0.30469-2.2109-0.91406-1.2188-1.2188-1.2188-3.1992 0-4.418l93.75-93.75c1.2188-1.2188 3.1992-1.2188 4.418 0s1.2188 3.1992 0 4.418l-93.75 93.75c-0.60547 0.60937-1.4062 0.91406-2.207 0.91406z"/>
                </svg>
                {letter}
              </div>
          ))}
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
  grid-template-rows: repeat(4, min-content);
  grid-template-areas:
    "status status"
    "header header"
    "mysheet theirsheet"
    "tracker tracker";
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
#letter-tracker {
  grid-area: tracker;
  display: grid;
  grid-template-columns: repeat(13, 40px);
  grid-template-rows: 40px 40px;
  row-gap: 10px;
  column-gap: 10px;
  align-content: center;
  justify-content: center;
  padding: 10px 10px 0;
}

.a-letter {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-family: var(--sans);
  font-weight: 500;
  font-size: 1.25em;
  text-transform: uppercase;

  user-select: none;
  cursor: pointer;
  position: relative;
}

.letter-slash, .letter-circle {
  height: 30px;
  width: 30px;
  position: absolute;
  display: none;
}

.letter-slash.big {
  height: 35px;
  width: 35px;
}

.letter-circle.big {
  height: 50px;
  width: 50px;
}

.letter-slash {
  fill: var(--dark-grey);
}

.letter-circle {
  fill: var(--medium-red);
}

.show {
  display: unset;
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
    font-style: normal;
    z-index: 1;
  }

    .neutral .status-text {
      background-color: var(--neutral);
      color: white;
    }

    .neutral .status-flank:first-of-type {
      background-image: linear-gradient(to left, var(--neutral) 20px, transparent 30%);
    }

    .neutral .status-flank:last-of-type {
      background-image: linear-gradient(to right, var(--neutral) 20px, transparent 30%);
    }

    .gentle .status-text {
      background-color: var(--gentle);
      color: white;
    }

    .gentle .status-flank:first-of-type {
      background-image: linear-gradient(to left, var(--gentle) 20px, transparent 30%);
    }

    .gentle .status-flank:last-of-type {
      background-image: linear-gradient(to right, var(--gentle) 20px, transparent 30%);
    }

    .win .status-text {
      background-color: var(--win);
      color: white;
    }

    .win .status-flank:first-of-type {
      background-image: linear-gradient(to left, var(--win) 20px, transparent 30%);
    }

    .win .status-flank:last-of-type {
      background-image: linear-gradient(to right, var(--win) 20px, transparent 30%);
    }

    .draw .status-text {
      background-color: var(--draw);
      color: white;
    }

    .draw .status-flank:first-of-type {
      background-image: linear-gradient(to left, var(--draw) 20px, transparent 30%);
    }

    .draw .status-flank:last-of-type {
      background-image: linear-gradient(to right, var(--draw) 20px, transparent 30%);
    }

  .pulse .status-flank:first-of-type {
    animation: pulse-left 2s ease-in-out infinite;
  }

  .pulse .status-flank:last-of-type {
    animation: pulse-right 2s ease-in-out infinite;
  }

  @keyframes pulse-left {
    50% {
      transform: translateX(0px);
    }
  }

  @keyframes pulse-right {
    50% {
      transform: translateX(0px);
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
