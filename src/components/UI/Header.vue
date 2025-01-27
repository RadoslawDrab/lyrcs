<script setup lang="ts">
import ThemeButton from "@components/ThemeButton.vue";
</script>

<template>
  <header class="w-full border-b-2 border-gray-300 dark:border-zinc-700">
    <div class="mx-auto flex items-center justify-between gap-2 w-full max-w-3xl p-3">
      <h1 class="logo-text">Lyrcs</h1>
      <nav class="flex items-center gap-2">
        <ThemeButton/>
      </nav>
    </div>
  </header>
</template>
<style scoped lang="scss">
.logo-text {
  @apply text-zinc-300 text-2xl;
  background: linear-gradient(to right, theme('colors.blue.500'), theme('colors.blue.300'), theme('colors.blue.500')) repeat-x;
  background-size: 300% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  animation: slide 10s linear infinite;
  @keyframes slide {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: -150%;
    }
  }

}
</style>