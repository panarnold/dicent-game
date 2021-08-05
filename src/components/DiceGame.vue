<template>
  <div class="game-frame">
    <div class="dice">
      <div class="dice-itself">
        <img
          :src="require(`../assets/dices/${currentDice}.png`)"
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
            :disabled="!showDice || !allowBet"
          >
            bet lower
          </button>
          <button
            class="higher-bet-button"
            @click="bet('higher')"
            :disabled="!showDice || !allowBet"
          >
            bet higher
          </button>
        </div>

        <button class="start-button" @click="handleStart()">
          {{ startText }}
        </button>
      </div>
      <div class="score">Total score: {{ currentScore / 100 }}</div>
      <div class="counter">
        {{ roundInfoText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { roundHistory } from "@/mixins/types";
import { sumBy, take } from "lodash";

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
    currentDice: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:history", "update:currentDice", "update:endgame"],
  setup(props, { emit }) {
    const allowBet = computed((): boolean => {
      return showDice.value && props.history.length < props.roundLimit;
    });
    const currentRoundNumber = computed((): number => {
      return props.history.length + 1;
    });

    const currentScore = computed((): number => {
      return props.history.length === 0
        ? 0
        : props.history[props.history.length - 1].totalScore;
    });
    const startText = computed((): string => {
      return props.currentDice !== 0 ? "restart" : "start";
    });
    const showDice = computed((): boolean => {
      return props.currentDice > 0;
    });
    const roundInfoText = computed((): string => {
      return currentRoundNumber.value <= props.roundLimit
        ? "Current round: " +
            currentRoundNumber.value +
            " of " +
            props.roundLimit
        : "END OF GAME";
    });

    async function handleStart() {
      const newCurrentDice = await throwAgain();
      emit("update:currentDice", newCurrentDice);
      emit("update:history", []);
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
      let roundScore = 0;
      const throwResult = await throwAgain();
      switch (bet) {
        case "lower":
          if (throwResult < props.currentDice) {
            roundScore = 10;
          }

          break;
        case "higher":
          if (throwResult > props.currentDice) {
            roundScore = 10;
          }
          break;
      }

      const newRound: roundHistory = {
        roundNumber: props.history.length + 1,
        currentDice: props.currentDice,
        throwResult: throwResult,
        playerBet: bet,
        totalScore:
          sumBy(props.history, (round): number => round.roundScore) +
          roundScore,
        success: roundScore !== 0 ? "success" : "failure",
        roundScore,
      };
      emit("update:history", [...props.history, newRound]);
      emit("update:currentDice", throwResult);
    }

    return {
      allowBet,
      roundInfoText,
      currentRoundNumber,
      handleStart,
      startText,
      bet,
      throwAgain,
      currentScore,
      showDice,
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
        & > * {
          cursor: pointer;
        }
        .higher-bet-button {
          color: red;
        }
        .lower-bet-button {
          color: green;
        }
      }
    }
    .start-button {
      cursor: pointer;
    }
  }
}
</style>
