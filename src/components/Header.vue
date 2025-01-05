<script setup lang="ts">
import ThemeButton from "./ThemeButton.vue";
</script>

<template>
  <header class="w-full border-b-2 border-gray-300 dark:border-zinc-700">
    <div class="mx-auto flex items-center justify-between gap-2 w-full max-w-2xl p-3">
      LOGO
      <nav class="flex items-center gap-2">
        <ThemeButton />
      </nav>
    </div>
  </header>
</template>