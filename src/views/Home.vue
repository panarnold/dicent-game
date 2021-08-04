<template>
  <DiceGame />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DiceGame from "@/components/DiceGame.vue";

export default defineComponent({
  name: "Home",
  components: {
    DiceGame,
  },
});
</script>
