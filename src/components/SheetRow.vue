<script>

export default {
  name: 'SheetRow',

  props: {
    header: Boolean,
    left: Boolean,
    word: String,
    score: Number,
  },

  data() {
    return {
      wordEntryField: '',
    };
  },

  computed: {
  },

  methods: {
  },

  created() {
  },

  render() {
    return (
      <div class={`sheet-row ${!this.header || 'header'}`}>
        {!this.left ? <div class='score-box'>{this.score || ''}</div> : null}
        <div class='letter-box-container'>
          <input class='letter-box'/>
          <input class='letter-box'/>
          <input class='letter-box'/>
          <input class='letter-box'/>
          <input class='letter-box'/>
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
  padding: 5px 10px;
}

  .header .letter-box-container {
    background-color: var(--letter-box-header-border);
    padding: 10px;
    /* border-radius: 2px; */
  }

.letter-box, .score-box {
  font-family: var(--sans);
  font-weight: 400;
  font-size: 2em;
  width: var(--letter-box-dimension);
  height: var(--letter-box-dimension);
  text-align: center;
  border: none;
}

.letter-box {
  margin-right: 10px;
}

 .letter-box:last-of-type {
    margin-right: 0;
  }

.score-box {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--paper);
  color: var(--dark-grey);
  font-weight: 300;
}

  .header .score-box {
    display: none;
  }
</style>
