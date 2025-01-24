<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

import { download } from '@utils/index'
import { linesToLrc } from '@utils/lyrics'

import { Line } from '@type/lyrics'

import LyricsList from '@components/LyricsList/LyricsList.vue'
import FileInput from "@components/FileInput.vue";
import AudioControls from "@components/AudioControls.vue";

const audioFile = ref<{ name: string, type: string, url: string } | null>(null);
const audioControlsRef = ref<InstanceType<typeof AudioControls> | null>(null)
const lyricsList = ref<InstanceType<typeof LyricsList> | null>(null);

const lyrics = ref<string | null>(null);
const lines = computed<Line[]>(() => {
  if (lyrics.value === null) return []

  return lyrics.value?.split(/(?<!;)\n/)
               .filter((line) => line.trim().length > 0)
               .map((line, index) => ({ text: line.trim(), start: 0, end: 0, index } as Line))
});

const currentLine = ref<number>(0)
const keyIsPressed = ref<boolean>(false)

async function onFilesLoad(files: File[]) {
  if (files.length == 0) return
  audioFile.value = null
  await nextTick()
  audioFile.value = { name: files[0].name, type: files[0].type, url: URL.createObjectURL(files[0]) }
}

function resetFillAnimations() {
  lyricsList.value?.lineFillRefs?.forEach((ref) => {
    ref.style.animation = 'none';
    ref.offsetHeight; /* trigger reflow */
    ref.style.animation = '';
  })
}

function exportLines() {
  download(`${ audioFile.value?.name.replace(/\..{2,}$/, '') ?? 'lyrics' }.lrc`, linesToLrc(lines.value))
}

onMounted(() => {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Prevents frm scrolling to the bottom when holding space
    if (e.key == ' ' && !e.ctrlKey && e.repeat) e.preventDefault()
    if (e.key != ' ' || e.ctrlKey || e.repeat) return
    e.preventDefault()
    keyIsPressed.value = true
  })
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key != ' ' || e.ctrlKey || e.repeat) return
    keyIsPressed.value = false
  })
})

watch(keyIsPressed, (isPressed) => {
  if (!audioControlsRef.value) return
  if (isPressed) {
    if (currentLine.value >= 0 && currentLine.value < lines.value.length) {
      lines.value[currentLine.value].start = audioControlsRef.value.currentTime
    }
  } else {
    if (currentLine.value >= 0 && currentLine.value < lines.value.length) {
      lines.value[currentLine.value].end = audioControlsRef.value.currentTime
    }
    currentLine.value++
  }
})
watch(currentLine, (line) => {
  lyricsList.value?.lineContentRefs?.forEach((ref) => {
    if (ref.dataset.index !== line.toString()) return
    ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
})
</script>

<template>
  <main class="max-w-3xl mx-auto px-2 mb-10 relative">
    <div v-if="audioFile" class="mt-6 p-2 border-full col-span-full sticky top-2 z-10 bg-zinc-100 dark:bg-zinc-800">
      <AudioControls ref="audioControlsRef" v-model="audioFile" @timeUpdated="resetFillAnimations"/>
    </div>
    <form>
      <FileInput class="max-w-3xl" accept="audio/.*" @filesChange="onFilesLoad" @fileDeleted="() => audioFile = null"/>
      <textarea class="w-full input p-2" v-model="lyrics"/>
    </form>
    <LyricsList ref="lyricsList" v-model="lines" v-model:current-line="currentLine" :key-is-pressed="keyIsPressed"
                :audio-controls-ref="audioControlsRef"/>
    <button class="btn btn-primary px-4 py-2 mt-3" :disabled="lines.length <= 0" @click="exportLines">Export to LRC
    </button>
  </main>
</template>
