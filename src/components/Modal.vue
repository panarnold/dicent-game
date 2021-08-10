<template>
  <div
    v-if="visible"
    :style="{ '--width': width, '--height': height }"
    class="modal"
  >
    <div class="modal__content" v-on:click.stop>
      <slot />
      <!-- <slot :close="() => $emit('update:visible', false)" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    width: { type: String, default: "60%" },
    height: {
      type: String,
      default: "40%",
    },
    visible: { type: Boolean, required: true },
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);
  &__content {
    display: grid;
    align-content: center;
    margin: 15% auto;
    background: salmon;
    padding: 2rem;
    width: var(--width);
    height: var(--height);
    z-index: 101;
  }
}
</style>
