<template>
  <div class="game-frame">
    <div class="dice">
      <!-- <div class="dice-itself">{{ currentDice }}</div> -->

      <div class="dice-itself">
        <img
          :src="
            require(`../assets/dices/${
              throwHistory[throwHistory.length - 1]
            }.png`)
          "
          alt=""
          v-if="showDice"
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
            :disabled="!showDice"
          >
            bet lower
          </button>
          <button
            class="higher-bet-button"
            @click="bet('higher')"
            :disabled="!showDice"
          >
            bet higher
          </button>
        </div>
        <div class="start-button">
          <button class="start-button" @click="handleClick()">
            {{ startText }}
          </button>
        </div>
      </div>
      <div class="score">Current score: {{ currentScore / 100 }}</div>
      <div class="counter">
        round {{ currentRoundNumber }} of {{ roundLimit }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { roundHistory } from "@/mixins/types";
import { isNil, sumBy } from "lodash";

export default defineComponent({
  name: "game",
  props: {
    roundLimit: {
      type: Number,
      default: 30,
    },
    history: {
      type: Array as () => Array<roundHistory>,
      default: () => [],
    },
  },
  emits: ["update:history"],
  setup(props, { emit }) {
    const allowBet = true;
    const currentRoundNumber = computed(() => {
      return props.history.length + 1;
    });
    const throwHistory = ref<Array<number>>([]);

    const currentScore = computed(() => {
      return props.history.length === 0
        ? 0
        : props.history[props.history.length - 1].playerScore;
    });
    const showDice = ref<boolean>(false);
    const startText = computed(() => {
      return showDice.value ? "restart" : "start";
    });

    async function handleClick() {
      const result = await throwAgain();
      throwHistory.value = [result];
      if (showDice.value) {
        emit("update:history", []);
      } else {
        showDice.value = true;
      }
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

    async function bet(bet: string) {
      throwHistory.value = [...throwHistory.value, await throwAgain()];
      handleBet(bet);
    }
    function handleBet(bet: string) {
      let roundScore = 0;
      switch (bet) {
        case "lower":
          if (
            throwHistory.value[throwHistory.value.length - 2] >
            throwHistory.value[throwHistory.value.length - 1]
          ) {
            roundScore = 10;
          }

          break;
        case "higher":
          if (
            throwHistory.value[throwHistory.value.length - 2] <
            throwHistory.value[throwHistory.value.length - 1]
          ) {
            roundScore = 10;
          }
          break;
      }

      const newRound: roundHistory = {
        roundNumber: props.history.length + 1,
        throwResult: throwHistory.value[throwHistory.value.length - 1],
        playerBet: bet,

        playerScore:
          sumBy(props.history, (round): number => round.roundScore) +
          roundScore,
        success: roundScore !== 0 ? "success" : "failure",
        roundScore: roundScore,
      };
      emit("update:history", [...props.history, newRound]);
    }

    return {
      allowBet,
      throwHistory,
      currentRoundNumber,
      handleClick,
      startText,
      showDice,
      bet,
      throwAgain,
      currentScore,
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
