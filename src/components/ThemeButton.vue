<script setup lang="ts">
import {watch} from "vue";
import {PhMoon, PhSun} from "@phosphor-icons/vue";

export type Theme = 'dark' | 'light'

const props = withDefaults(defineProps<{size?: number}>(), {
  size: 24
})
const currentTheme = defineModel<Theme>({default: 'light'})

function set(theme: Theme) {
  const htmlEl = document.documentElement
  if (!htmlEl) return
  htmlEl.classList.remove('dark')
  htmlEl.classList.remove('light')
  htmlEl.classList.add(theme)
}
function toggle() {
  currentTheme.value = currentTheme.value == 'light' ? 'dark' : 'light'
}
watch(currentTheme, set)
</script>

<template>
  <button class="btn-inline btn-primary p-1" @click="toggle" :data-theme="currentTheme" aria-label="Theme mode toggle button">
    <PhSun v-if="currentTheme === 'light'" :size="props.size" />
    <PhMoon v-if="currentTheme === 'dark'" :size="props.size" />
  </button>
</template>