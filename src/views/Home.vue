<template>
  <div class="content">
    <DiceGame @current-round-score="updateScoreList($event)" />
    <Summary :diceHistory="history" :headers="headers" />
  </div>

  <Modal :visible="showModal" @update:visible="showModal = false">
    <ModalMessage @yes-or-no="manageAnswer($event)" />
  </Modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
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
    const showModal = ref<boolean>(false);
    function updateScoreList(round: roundHistory) {
      history.value = [...history.value, round];
      localStorage.setItem("history", JSON.stringify(history.value));
    }

    function manageAnswer(answer: boolean) {
      const localStorageData: string | null = localStorage.getItem("history");

      if (answer && !isNil(localStorageData)) {
        history.value = JSON.parse(localStorageData);
      } else {
        localStorage.clear();
      }

      showModal.value = false;
    }

    onMounted(() => {
      if (!isNil(localStorage.getItem("history"))) {
        showModal.value = true;
      }
    });

    return {
      headers,
      updateScoreList,
      history,
      manageAnswer,
      showModal,
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
