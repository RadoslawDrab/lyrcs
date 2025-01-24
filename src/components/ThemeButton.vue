<script setup lang="ts">
import { themePreference } from '@utils/index'
import { computed, onMounted, ref, watch } from "vue";
import { PhMinusCircle, PhMoon, PhSun } from "@phosphor-icons/vue";

export type Theme = 'dark' | 'light' | 'default'
const themes: Theme[] = ['default', 'dark', 'light'];

const props = withDefaults(defineProps<{ size?: number, storageKey?: string }>(), {
  size: 24,
  storageKey: 'lyrcs-theme'
})
const currentTheme = defineModel<Theme>()
const currentThemeDescription = computed(() => {
  switch (currentTheme.value) {
    case 'dark':
      return 'Dark'
    case 'light':
      return 'Light'
    case 'default':
      return 'System theme'
  }
})
const themeIndex = ref<number>(themes.indexOf(currentTheme.value))

function set(theme: Theme) {
  const htmlEl = document.documentElement
  if (!htmlEl) return

  htmlEl.classList.remove('dark')
  htmlEl.classList.remove('light')
  if (theme === 'default') {
    htmlEl.classList.add(themePreference())
    localStorage.removeItem(props.storageKey)
  } else htmlEl.classList.add(theme)
}

function toggle() {
  let index = themeIndex.value + 1
  if (index >= themes.length) index = 0

  const newTheme: Theme = themes[index]
  currentTheme.value = newTheme
  localStorage.setItem(props.storageKey, newTheme)
  themeIndex.value = index
}

onMounted(() => {
  currentTheme.value = localStorage.getItem(props.storageKey) ?? themePreference()
})
watch(currentTheme, set)
</script>

<template>
  <button class="btn-inline btn-primary tooltip tooltip__max p-1" @click="toggle" :data-theme="currentTheme"
          aria-label="Theme mode toggle button" :data-tooltip="currentThemeDescription">
    <PhSun v-if="currentTheme === 'light'" :size="props.size"/>
    <PhMoon v-if="currentTheme === 'dark'" :size="props.size"/>
    <PhMinusCircle v-if="currentTheme === 'default'" :size="props.size"/>
  </button>
</template>