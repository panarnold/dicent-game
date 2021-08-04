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
    // const currentBet = ref<string>();
    const counter = ref<number>(0);
    const history = ref<Array<roundHistory>>([]);
    const diceHistory = ref<Array<number>>([]);
    const currentScore = ref(0);

    const previousDice = computed(() => {
      return diceHistory.value.length === 0
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

    function throwAgain(): void {
      fetch("http://roll.diceapi.com/json/d6")
        .then((response) => response.json())
        .then((data) => {
          // currentDice.value = data.dice[0].value;
          diceHistory.value = [...diceHistory.value, data.dice[0].value];
          // console.log("Wyrzuciłem", currentDice.value);
        })
        .catch((error) => {
          console.log(error);
        });

      // const json = await response.json();

      // return json;
    }

    onMounted(() => {
      throwAgain();
    });

    //next: funkcja, która odpowiedniej wartosci currentDice dokłada odpowiedni jpg
    //next2: licznik rund: przy 30 robi gratulacje
    //next3: modale: previous/do you want to start again
    // next4: local storage
    // next5: styling

    // function throwAgain() {
    //   fetchData().then((json) => {
    //     const dice = json.dice[0].value;
    //     return dice;
    //   });
    // }

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

    function bet(bet: string) {
      // currentBet.value = "";
      counter.value += 1;

      throwAgain();
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
