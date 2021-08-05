<template>
  <div class="summary-wrapper">
    <div id="click-to-info" @click="visible = !visible">
      <span v-if="!visible">click here to see the history of current game</span>
      <span v-else>hide it, you mysterious human creature</span>
    </div>
    <div class="table" v-if="visible">
      <div class="headers">
        <div class="header" v-for="(header, index) in headers" :key="index">
          {{ header }}
        </div>
      </div>
      <div class="summary">
        <div class="round" v-for="(round, index) in history" :key="index">
          <div>{{ round.roundNumber }}</div>
          <div>{{ round.currentDice }}</div>
          <div>{{ round.throwResult }}</div>
          <div>{{ round.playerBet }}</div>
          <div>{{ round.success }}</div>
          <div>{{ round.roundScore / 100 }}</div>
          <div id="total">{{ round.totalScore / 100 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { roundHistory } from "@/mixins/types";

export default defineComponent({
  name: "Summary",
  props: {
    history: {
      type: Array as () => Array<roundHistory>,
      default: () => [],
    },
    headers: {
      type: Array as () => Array<string>,
      required: true,
    },
  },
  setup() {
    const visible = ref<boolean>(false);
    return {
      visible,
    };
  },
});
</script>

<style scoped lang="scss">
.summary-wrapper {
  display: grid;
  grid-template-rows: 3rem 20rem;
  width: 40vw;
  .table {
    display: grid;
    grid-template-rows: 3rem 25rem;
    grid-gap: none;

    .headers {
      display: grid;
      font-weight: bold;
      height: 2rem;
      grid-template-columns: repeat(7, 8rem);
    }
    .summary {
      display: grid;
      grid-auto-flow: row;
      align-content: start;
      height: inherit;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .round {
      display: grid;
      height: 2rem;
      grid-auto-flow: column;
      grid-template-columns: repeat(7, 8rem);
      #total {
        font-weight: bolder;
        color: red;
      }
    }
  }
  #click-to-info {
    cursor: pointer;
    display: grid;
    background-color: salmon;
    font-weight: bolder;
    align-items: center;
    width: 56rem;
    height: 2rem;
  }
}
</style>
