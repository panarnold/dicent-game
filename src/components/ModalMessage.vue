<template>
  <div class="choice">
    <slot>
      {{ modalMessage }}
      <div class="buttons">
        <button @click="yesOrNo(true)">YES</button>
        <button @click="yesOrNo(false)">NO</button>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModalMessage",
  props: {
    modalMessage: {
      type: String,
      default: "Reload the previous game",
    },
  },
  emits: ["yes-or-no"],
  setup(props, { emit }) {
    function yesOrNo(choice: boolean) {
      emit("yes-or-no", choice);
    }
    return {
      yesOrNo,
    };
  },
});
</script>

<style scoped lang="scss">
.choice {
  font-weight: bold;
  display: grid;
  //   grid-template-rows: 10rem 40rem;
  grid-auto-flow: row;
  .buttons {
    display: grid;
    grid-template-columns: 2rem 2rem;
    justify-content: center;
    grid-gap: 1rem;
  }
}
</style>
