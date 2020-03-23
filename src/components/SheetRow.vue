<script>

export default {
  name: 'SheetRow',

  props: {
    header: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    word: {
      type: String,
      default: '',
    },
    score: {
      type: [Number, String],
      default: '',
    },
    noSubmit: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      letterList: ['', '', '', '', ''],
      selected: -1,
    };
  },

  computed: {
    rowWord() {
      return this.letterList.join('').toLowerCase();
    },

    isValidWord() {
      return this.rowWord.length === 5;
    },
  },

  watch: {
    rowWord(newWord, oldWord) {
      if (newWord !== oldWord) {
        this.$emit('change', newWord);
      }
    },

    word() {
      this.parseWord();
    },
  },

  methods: {
    handleSelect(i) {
      if (!this.disabled) {
        this.selected = i;
      }
    },

    handleDeselect() {
      this.selected = -1;
    },

    focus(i) {
      if (i >= 0 && i <= 4) {
        this.$refs[`letterBox${i}`].focus();
      } else {
        for (let j = 0; j <= 4; j += 1) {
          this.$refs[`letterBox${j}`].focus();
        }
      }
    },

    handleKeyPress(e) {
      if (!this.disabled) {
        if (/^[a-zA-Z]$/.test(e.key)) {
          this.$set(this.letterList, this.selected, e.key.toUpperCase());
          if (this.selected < 4) {
            this.selected += 1;
          }
        } else if (e.key === 'Backspace') {
          if (this.letterList[this.selected]) {
            // if there is a letter in this cell, delete it
            this.$set(this.letterList, this.selected, '');

            // ?? unclear on what "feels best" here
            // if (this.selected > 0) {
            //   this.selected -= 1;
            // }
          } else if (this.selected > 0) {
            this.selected -= 1;
            this.$set(this.letterList, this.selected, ''); // ?? unclear on what "feels best" here
          }
        } else if (e.key === 'ArrowLeft') {
          if (this.selected > 0) {
            this.selected -= 1;
          }
        } else if (e.key === 'ArrowRight') {
          if (this.selected < 4) {
            this.selected += 1;
          }
        }

        this.focus(this.selected);

        e.stopPropagation();
        e.preventDefault();
      }
    },

    handleSubmit() {
      if (!this.disabled && this.isValidWord) {
        this.$emit('submit', this.rowWord);
      }
    },

    parseWord() {
      if (this.word) {
        for (let i = 0; i < this.word.length; i += 1) {
          this.$set(this.letterList, i, this.word[i].toUpperCase());
        }
      }
    },
  },

  created() {
    // TODO possibly unnecessary
    this.parseWord();
  },

  render() {
    const scoreBox = () => (
      !this.disabled
        ? (
          <div class={`score-box submit-button ${(this.isValidWord && !this.noSubmit) || 'disabled'}`} onClick={this.handleSubmit}>
            <svg class='icon check' version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="m0 53.891 11.109-14.445 28.891 24.445 46.668-52.223 13.332 12.223-58.891 64.441z"/>
            </svg>
          </div>
        )
        : (
          <div class='score-box'>
            <span class='score'>{this.score || ''}</span>
          </div>
        )
    );

    return (
      <div class={`sheet-row ${!this.header || 'header'} ${!this.highlight || 'highlight'}`} onKeyup={this.handleKeyPress}>
        {!this.left ? scoreBox() : null}
        <div class='letter-box-container'>
          <div class='letter-box-highlighter'></div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              class='letter-box'
              ref={`letterBox${i}`}
              tabindex={(!this.disabled) ? i : ''}
              onFocus={() => this.handleSelect(i)}
              onBlur={() => this.handleDeselect()}
            >
              {this.letterList[i]}
            </div>
          ))}
        </div>
        {this.left ? scoreBox() : null}
      </div>
    );
  },
};

</script>

<style>
.sheet-row {
  display: grid;
  grid-template-columns: auto min-content;
  align-items: center;
}

.letter-box-container {
  display: flex;
  flex-direction: row;
  padding: 4px 8px;
  position: relative;
  /* margin-left: 4px; */
}

  .header .letter-box-container {
    background-color: var(--letter-box-header-border);
    padding: 8px;
  }

  .letter-box-highlighter {
    display: none;
  }

  .highlight .letter-box-highlighter {
    display: initial;
    position: absolute;
    background-color: var(--light-blue);
    opacity: .25;
    top: -2px;
    left: 2px;
    height: calc(100% + 4px);
    width: calc(100% - 3px);
    z-index: -1;
  }

  /* .highlight .letter-box-container {
    background-color: var(--light-blue);
  } */

.letter-box, .score-box {
  font-family: var(--sans);
  font-weight: 400;
  font-size: 2em;
  width: var(--letter-box-dimension);
  height: var(--letter-box-dimension);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--letter-box-color);
  border: 1px solid var(--light-grey);
}

.letter-box {
  margin-right: 8px;
}

  .letter-box:last-of-type {
    margin-right: 0;
  }

  .header .letter-box {
    border-color: var(--letter-box-header-border);
  }

  .letter-box:focus {
    outline: none !important;
    border-color: var(--medium-blue);
    /* animation: blinker 2s ease-in-out infinite; */
  }

  @keyframes blinker {
    50% {
      border-color: transparent;
    }
  }

.score-box {
  background-color: var(--paper);
  color: var(--dark-grey);
  font-weight: 300;
}

  .header .score-box {
    display: none;
  }

  .score-box.submit-button {
    background-color: var(--submit-button);
    cursor: pointer;
  }

    .score-box.submit-button:not(.disabled):hover {
      background-color: var(--submit-button-hover);
    }

    .score-box.submit-button:not(.disabled):active {
      filter: brightness(.9);
    }

    .icon.check {
      fill: var(--submit-button-icon);
    }

    .score-box.submit-button.disabled {
      cursor: not-allowed;
      background-color: var(--submit-button-disabled);
    }

  .score {
    user-select: none;
  }
</style>
