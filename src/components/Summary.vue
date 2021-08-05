<template>
  <div class="table" v-if="visible">
    <div class="headers">
      <div class="header" v-for="(header, index) in headers" :key="index">
        {{ header }}
      </div>
    </div>
    <div class="summary">
      <div class="round" v-for="(round, index) in diceHistory" :key="index">
        <div>{{ round.roundNumber }}</div>
        <div>{{ round.dice }}</div>
        <div>{{ round.playerBet }}</div>
        <div>{{ round.success }}</div>
        <div>{{ round.roundScore / 100 }}</div>
        <div id="total">{{ round.playerScore / 100 }}</div>
      </div>
    </div>
  </div>
  <div id="click-to-info" v-else @click="visible = !visible">
    Click here to show the history of this game
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { roundHistory } from "@/mixins/types";

export default defineComponent({
  name: "Summary",
  props: {
    diceHistory: {
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
.table {
  margin-top: 10vh;
  display: grid;
  grid-template-rows: 3rem 1fr;
  grid-gap: none;

  .headers {
    display: grid;
    font-weight: bold;
    height: 2rem;
    grid-template-columns: repeat(6, 8rem);
  }
  .summary {
    display: grid;
    grid-auto-flow: row;
    align-content: start;
  }

  .round {
    display: grid;
    height: 2rem;
    grid-auto-flow: column;
    grid-template-columns: repeat(6, 8rem);
    // align-self: baseline;

    #total {
      font-weight: bolder;
      color: red;
    }
  }
}
#click-to-info {
  cursor: pointer;
  background-color: salmon;
  width: 48rem;
  height: 2rem;
}
</style>
