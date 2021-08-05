<template>
  <div class="content">
    <DiceGame @current-round-score="updateScoreList($event)" />
    <Summary :diceHistory="history" :headers="headers" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DiceGame from "@/components/DiceGame.vue";
import Summary from "@/components/Summary.vue";
import { roundHistory, headers } from "@/mixins/types";

export default defineComponent({
  name: "Home",
  components: {
    DiceGame,
    Summary,
  },
  setup() {
    const history = ref<Array<roundHistory>>([]);

    function updateScoreList(round: roundHistory) {
      history.value = [...history.value, round];
    }
    return {
      headers,
      updateScoreList,
      history,
    };
  },
});
</script>
<style scoped lang="scss">
.content {
  display: grid;
  grid-auto-flow: column;
}
</style>
