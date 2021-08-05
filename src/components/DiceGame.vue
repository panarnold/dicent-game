<template>
  <div class="game-frame">
    <div class="dice">
      <!-- <div class="dice-itself">{{ currentDice }}</div> -->

      <div class="dice-itself">
        <img
          :src="require(`../assets/dices/${currentDice}.png`)"
          alt=""
          v-if="started"
          style="height: 100%; width: 100%; object-fit: contain"
        />
        <img
          :src="require('../assets/readdy.png')"
          alt=""
          style="
            height: 100%;
            width: 100%;
            object-fit: contain;
            transform: translateY(20%);
          "
          v-else
        />
      </div>
    </div>

    <div class="score">
      <div class="buttons">
        <div class="bet-buttons">
          <button
            class="lower-bet-button"
            @click="bet('lower')"
            :disabled="!started"
          >
            bet lower
          </button>
          <button
            class="higher-bet-button"
            @click="bet('higher')"
            :disabled="!started"
          >
            bet higher
          </button>
        </div>
        <div class="start-button">
          <button class="start-button" @click="start()">
            {{ startText }}
          </button>
        </div>
      </div>
      <div class="score">Current score: {{ currentScore / 100 }}</div>
      <div class="counter">round {{ counter }} of {{ roundLimit }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { roundHistory } from "@/mixins/types";

export default defineComponent({
  name: "game",
  props: {
    roundLimit: {
      type: Number,
      default: 30,
    },
    cowhistory: {
      type: Array as () => Array<roundHistory>,
      default: () => [],
    },
  },
  emits: ["current-round-score"],
  setup(props, { emit }) {
    const initialDice = ref<number>(1);
    const counter = ref<number>(0);
    const history = ref<Array<roundHistory>>([]);
    const diceHistory = ref<Array<number>>([]);
    const succesOrFailure = ref<string>("failure");
    const roundScore = ref<number>(0);
    const currentScore = ref(0);
    const started = ref<boolean>(false);
    const startText = ref<string>("start game");

    const previousDice = computed(() => {
      return diceHistory.value.length === (0 || 1)
        ? initialDice.value
        : diceHistory.value[diceHistory.value.length - 2];
    });
    const currentDice = computed(() => {
      return diceHistory.value.length === 0
        ? initialDice.value
        : diceHistory.value[diceHistory.value.length - 1];
    });

    onMounted(() => {
      checkIfLocalStorage();
    });

    function checkIfLocalStorage() {
      if (localStorage.length > 0) {
        localStorage.getItem("storedData");
      }
    }

    async function start() {
      setTimeout(async () => {
        started.value = !started.value;
        startText.value = "restart";
      }, 600);

      initialDice.value = await throwAgain();
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

    function createDiceHistory(
      roundNumber: number,
      playerBet: string,
      success: string,
      roundScore: number,
      playerScore: number
    ): roundHistory {
      return {
        roundNumber: roundNumber,
        dice: currentDice.value,
        success: success,
        playerBet: playerBet,
        roundScore: roundScore,
        playerScore: playerScore,
      };
    }

    async function bet(bet: string) {
      checkCounter(props.roundLimit);

      const result = await throwAgain();
      diceHistory.value = [...diceHistory.value, result];
      handleBet(bet);
    }
    function handleBet(bet: string) {
      console.log("poprzedni:", previousDice.value);
      console.log("obecny:", currentDice.value);
      roundScore.value = 0;
      switch (bet) {
        case "lower":
          if (previousDice.value > currentDice.value) {
            roundScore.value = 10;
          }

          break;
        case "higher":
          if (previousDice.value < currentDice.value) {
            roundScore.value = 10;
          }
          break;
      }
      currentScore.value += roundScore.value;

      const round: roundHistory = createDiceHistory(
        counter.value,
        bet,
        succesOrFailure.value,
        roundScore.value,
        currentScore.value
      );
      history.value = [...history.value, round];
      emit("current-round-score", round);
    }
    function checkCounter(limit: number) {
      counter.value += 1;
      if (counter.value === limit + 1) {
        alert(`gratuluje, twoj wynik to ${currentScore.value}`);
        counter.value = 1;
      }
    }

    return {
      start,
      startText,
      started,
      bet,
      previousDice,
      succesOrFailure,
      currentDice,
      throwAgain,
      currentScore,
      roundScore,
      history,
      counter,
      diceHistory,
    };
  },
});
</script>

<style scoped lang="scss">
.game-frame {
  margin-left: 10rem;
  display: grid;
  grid-auto-flow: row;
  grid-gap: 3rem;
  height: 30rem;
  width: 25rem;

  .score {
    display: grid;
    grid-gap: 1rem;
    .buttons {
      display: grid;
      grid-gap: 1rem;
      .bet-buttons {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 1rem;
        .higher-bet-button {
          color: red;
        }
        .lower-bet-button {
          color: green;
        }
      }
    }
  }
}
</style>
