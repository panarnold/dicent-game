<template>
  <div class="div">
      <div class="summary" v-for="(dice,index) in diceHistory" :key="index">
          Round: {{ index + 1 }}, dice: {{ dice }}, bet: {{ dice.playerBet }}, score: {{ dice.playerScore }}
      </div>
  </div>
</template>


<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Summary',
  props: {
      diceHistory: {
          type: Array as ()=> Array<number>,
          default: []
      }
  },
  setup() {
    return {};
 },
});
</script>

<style scoped lang="scss">
.Summary {
  
}
</style>
