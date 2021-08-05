<template>
  <div class="wrapper">
    <div class="content">
      <DiceGame
        @update:history="onUpdateHistory($event)"
        :history="history"
        :roundLimit="roundLimit"
        @update:endgame="onUpdateEndGame($event)"
        v-model:currentDice="currentDice"
      />
      <Summary :history="history" :headers="headers" />
    </div>
  </div>

  <Modal :visible="showModalStartGame">
    <ModalMessage @yes-or-no="manageAnswer($event)" />
  </Modal>
  <Modal :visible="showModalEndGame">
    <ModalMessage>
      <div class="end-message">
        CONGRATULATIONS, YOUR SCORE:
        {{ history[history.length - 1].totalScore / 100 }} points. Press
        *restart* to try it one more time.
        <button @click="showModalEndGame = false">ok</button>
      </div>
    </ModalMessage>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import DiceGame from "@/components/DiceGame.vue";
import Summary from "@/components/Summary.vue";
import Modal from "@/components/Modal.vue";
import ModalMessage from "@/components/ModalMessage.vue";
import { roundHistory, headers } from "@/mixins/types";
import { isNil } from "lodash";

export default defineComponent({
  name: "Home",
  components: {
    DiceGame,
    Summary,
    Modal,
    ModalMessage,
  },
  setup() {
    const history = ref<Array<roundHistory>>([]);

    const showModalStartGame = ref<boolean>(false);
    const showModalEndGame = ref<boolean>(false);
    const currentDice = ref<number>(0);
    const roundLimit = ref<number>(30);
    const reachRountLimit = computed((): boolean => {
      return roundLimit.value === history.value.length;
    });
    function onUpdateHistory(newHistory: Array<roundHistory>): void {
      history.value = newHistory;
      localStorage.setItem("history", JSON.stringify(history.value));
    }

    function manageAnswer(answer: boolean): void {
      const localStorageData: string | null = localStorage.getItem("history");

      if (answer && !isNil(localStorageData)) {
        history.value = JSON.parse(localStorageData);
        console.log(
          "czy w tym?",
          history.value[history.value.length - 1].throwResult
        );
        currentDice.value = history.value[history.value.length - 1].throwResult;
      } else {
        localStorage.clear();
      }

      showModalStartGame.value = false;
    }

    watch(
      () => reachRountLimit.value,
      () => {
        showModalEndGame.value = reachRountLimit.value;
      }
    );

    onMounted(() => {
      if (!isNil(localStorage.getItem("history"))) {
        showModalStartGame.value = true;
      }
    });

    return {
      headers,
      onUpdateHistory,
      history,
      manageAnswer,
      showModalStartGame,
      showModalEndGame,
      roundLimit,
      currentDice,
    };
  },
});
</script>
<style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-rows: 70vh 2rem;
  .content {
    display: grid;
    grid-auto-flow: column;
  }
}
.end-message {
  display: grid;
  grid-auto-flow: row;
  justify-items: center;
  button {
    width: 4rem;
  }
}
</style>
