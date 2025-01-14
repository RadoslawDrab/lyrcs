<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  PhCaretDoubleLeft,
  PhCaretDoubleRight,
  PhCaretLeft,
  PhCaretRight, PhClockCounterClockwise,
  PhPlay,
  PhPlayPause
} from "@phosphor-icons/vue";

import { getTime } from '@utils/time'

const audioFile = defineModel<{ type: string, url: string }>({ required: true });
const props = withDefaults(defineProps<{
  size?: number
}>(), {
  size: 24
})
const emit = defineEmits<{
  timeUpdated: [];
}>()

const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref<boolean>(false)
const currentTime = ref<number>(0)

function getTimeFormatted(inverted: boolean = false) {
  const time = Math.abs(inverted ? (audioElement.value?.duration ?? 0) - currentTime.value : currentTime.value)

  return getTime(time, 3)
}

function togglePlay() {
  if (!audioElement.value) return

  if (audioElement.value.paused) {
    audioElement.value.play()
    isPlaying.value = true
  } else {
    audioElement.value.pause()
    isPlaying.value = false
  }
}

function updateTime(time: number) {
  if (!audioElement.value) return
  audioElement.value.currentTime += time
  emit('timeUpdated')
}

function setTime(time: number) {
  if (!audioElement.value) return
  audioElement.value.currentTime = time
  emit('timeUpdated')
}

onMounted(() => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== " " || !event.ctrlKey || event.repeat) return
    event.preventDefault()
    togglePlay()
    document.documentElement.focus()
  })
  if (!audioElement.value) return
  audioElement.value.addEventListener("timeupdate", (event) => {
    const audio = event.target as HTMLAudioElement
    currentTime.value = audio.currentTime
  })
})

defineExpose({
  currentTime,
  duration: audioElement.value?.duration ?? null,
  isPlaying,
  setTime
})
</script>

<template>
  <div class="grid grid-cols-3 items-start justify-items-center gap-2 p-1">
    <audio ref="audioElement" class="col-span-full">
      <source :type="audioFile.type" :src="audioFile.url"/>
    </audio>
    <div class="progress-bar col-span-full">
      <div class="progress-bar-fill"
           :style="`width: ${audioElement?.duration ? 100 * currentTime / audioElement.duration : 100}%`">
        <!--          <PhCircle class="knob" :size="props.size" weight="fill" />-->
      </div>
    </div>
    <span class="justify-self-start">{{ getTimeFormatted() }}</span>
    <nav class="flex gap-3 self-center">
      <button class="btn-inline" @click="setTime(0)">
        <PhClockCounterClockwise :size="props.size"/>
      </button>
      <button class="btn-inline" @click="updateTime(-5)">
        <PhCaretDoubleLeft :size="props.size"/>
      </button>
      <button class="btn-inline" @click="updateTime(-1)">
        <PhCaretLeft :size="props.size"/>
      </button>
      <button class="btn-outline btn-primary p-1.5" @click="togglePlay">
        <PhPlayPause v-if="isPlaying" :size="props.size"/>
        <PhPlay v-else :size="props.size"/>
      </button>
      <button class="btn-inline" @click="() => updateTime(1)">
        <PhCaretRight :size="props.size"/>
      </button>
      <button class="btn-inline" @click="() => updateTime(5)">
        <PhCaretDoubleRight :size="props.size"/>
      </button>
    </nav>
    <span class="justify-self-end">{{ getTimeFormatted(true) }}</span>

  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  @apply w-full border-full h-5 col-span-full overflow-hidden;
  .progress-bar-fill {
    @apply h-full bg-blue-500 dark:bg-blue-600 relative;
    .knob {
      @apply absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 transition-all;
      @apply fill-blue-400 dark:fill-blue-500;
      @apply hover:cursor-pointer hover:filter-brightness-700;
    }
  }
}
</style>