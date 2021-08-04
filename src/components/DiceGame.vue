<template>
  <div class="game-frame">
    <div class="live-dice-frame">
      <!-- <div class="dice-itself">{{ currentDice }}</div> -->
      <div class="dice-itself">
        <img
          :src="require(`../assets/dices/${currentDice}.png`)"
          alt=""
          class="dice"
        />
      </div>

      <div class="buttons">
        <button class="lower-bet-button" @click="bet('lower')">
          bet lower
        </button>
        <button class="higher-bet-button" @click="bet('higher')">
          bet higher
        </button>
      </div>
      <div class="score">Current score: {{ currentScore.toFixed(1) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from "vue";
import { cloneDeep } from "lodash";

export default defineComponent({
  name: "game",
  props: {},
  setup() {
    // const currentDice = ref<number>(1);
    // const previousDice = ref<number>(1);
    // const currentBet = ref<string>();
    const counter = ref<number>(0);
    const history = ref<Array<roundHistory>>([]);
    const diceHistory = ref<Array<number>>([]);
    const currentScore = ref(0);

    const previousDice = computed(() => {
      return diceHistory.value.length === (0 || 1)
        ? 1
        : diceHistory.value[diceHistory.value.length - 2];
    });
    const currentDice = computed(() => {
      return diceHistory.value.length === 0
        ? 1
        : diceHistory.value[diceHistory.value.length - 1];
    });

    type roundHistory = {
      roundNumber: number;
      playerBet: string;
      playerScore: string;
    };

    async function firstThrow() {
      const result = await throwAgain();
    }

    function throwAgain(): Promise<number> {
      return new Promise((resolve) => {
        fetch("http://roll.diceapi.com/json/d6")
          .then((response) => response.json())
          .then((data) => {
            resolve(data.dice[0].value);
          });
      });
    }

    onMounted(() => {
      firstThrow();
    });

    function createDiceHistory(
      roundNumber: number,
      playerBet: string,
      playerScore: number
    ): roundHistory {
      return {
        roundNumber: roundNumber,
        playerBet: playerBet,
        playerScore: playerScore.toFixed(1),
      };
    }

    async function bet(bet: string) {
      counter.value += 1;

      const result = await throwAgain();
      diceHistory.value = [...diceHistory.value, result];
      handleBet(bet);
    }
    function handleBet(bet: string) {
      console.log("poprzedni:", previousDice.value);
      console.log("obecny:", currentDice.value);

      // console.log(currentDice.value, lastDice.value);

      switch (bet) {
        case "lower":
          // currentBet.value = "lower";
          if (previousDice.value > currentDice.value) {
            currentScore.value += 0.1;
          }

          break;
        case "higher":
          // currentBet.value = "higher";
          if (previousDice.value < currentDice.value) {
            currentScore.value += 0.1;
          }
          break;
      }
      const round: roundHistory = createDiceHistory(
        counter.value,
        bet,
        currentScore.value
      );
      history.value = [...history.value, round];
      // currentBet.value = "";
    }
    function checkCounter(limit: number) {
      if (counter.value === limit) {
        console.log(
          "gratulacje, zacznij nową grę, twoje wyniki to:",
          history.value
        );
        counter.value = 1;
      }
    }

    return {
      bet,
      previousDice,
      currentDice,
      throwAgain,
      currentScore,
      history,
      counter,
      diceHistory,
    };
  },
});
</script>

<style scoped lang="scss">
.game-frame {
  display: grid;
  grid-auto-flow: column;
  height: 20rem;
  width: 20rem;
  .live-dice-frame {
    .dice-itself {
      .dice {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>

function cloneDeep(value: number): number { throw new Error("Function not
implemented."); }
