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
    active: {
      type: Boolean,
      default: false,
    },
    word: {
      type: String,
      default: '',
    },
    score: Number,
  },

  data() {
    return {
      letterList: ['', '', '', '', ''],
    };
  },

  computed: {
    displayWord() {
      return this.letterList.join('');
    },
  },

  methods: {
    // handle
  },

  created() {
    if (this.word) {
      for (let i = 0; i < this.word.length; i += 1) {
        this.$set(this.letterList, i, this.word[i].toUpperCase());
      }
    }
  },

  render() {
    return (
      <div class={`sheet-row ${!this.header || 'header'} ${!this.active || 'active'}`}>
        {!this.left ? <div class='score-box'>{this.score || ''}</div> : null}
        <div class='letter-box-container'>
          <div class='letter-box'>{this.letterList[0]}</div>
          <div class='letter-box'>{this.letterList[1]}</div>
          <div class='letter-box' disabled={!this.active}>{this.letterList[2]}</div>
          <div class='letter-box' disabled={!this.active}>{this.letterList[3]}</div>
          <div class='letter-box' disabled={!this.active}>{this.letterList[4]}</div>
        </div>
        {this.left ? <div class='score-box'>{this.score || ''}</div> : null}
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
}

  .header .letter-box-container {
    background-color: var(--letter-box-header-border);
    padding: 8px;
  }

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
  background-color: white;
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

.score-box {
  background-color: var(--paper);
  color: var(--dark-grey);
  font-weight: 300;
}

  .header .score-box {
    display: none;
  }
</style>
