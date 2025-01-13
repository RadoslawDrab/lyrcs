<script setup lang="ts">

import { computed, nextTick, onMounted, ref, watch } from "vue";
import { getTime } from '../utils/time'
import FileInput from "./FileInput.vue";
import {computed, nextTick, ref} from "vue";
import {Line} from "../types/lyrics";
import AudioControls from "./AudioControls.vue";

const audioFile = ref<{type: string, url: string} | null>(null);
const audioControlsRef = ref<InstanceType<typeof AudioControls> | null>(null)

const lyrics = ref<string | null>(null);
const lines = computed<Line[]>(() => {
  if (lyrics.value === null) return []

  const l = lyrics.value?.split(/(?<!;)\n/)
      .filter((line) => line.trim().length > 0)
      .map((line, index) => ({text: line.trim(), start: 0, end: 0, index }))
  console.log(l)
  return l
});
const currentLine = ref<number>(0)
const keyIsPressed = ref<boolean>(false)

function submit() {

  console.log(lines.value)
}
async function onFilesLoad(files: File[]) {
  if (files.length == 0) return
  audioFile.value = null
  await nextTick()
  audioFile.value = {type: files[0].type, url: URL.createObjectURL(files[0]) }
}
function getFill(line: Line, percent: boolean = false) {
    if (!audioControlsRef.value) return 0
    const value = Math.max(Math.min((audioControlsRef.value.currentTime - line.start) / (line.end - line.start), 1), 0)
    return percent ? value * 100 : value
}
function getLineAnimationState(line: Line) {
    return getFill(line) > 0 && getFill(line) < 1 && audioControlsRef.value?.isPlaying ? 'running' : 'paused'
}
const activeLineClass = (line: Line) => line.index == currentLine.value ? 'active' : ''

onMounted(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code != 'Space') return
        e.preventDefault()

        keyIsPressed.value = true
    })
    document.addEventListener('keyup', (e: KeyboardEvent) => {
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
</script>

<template>
    <main class="max-w-3xl mx-auto px-2 relative">
        <div v-if="audioFile" class="mt-6 p-2 border-full col-span-full sticky top-2 bg-zinc-100 dark:bg-zinc-800">
            <AudioControls ref="audioControlsRef" v-model="audioFile" />
        </div>
        <form @submit.prevent="submit">
            <FileInput class="max-w-3xl" accept="audio/.*" @filesChange="onFilesLoad" @fileDeleted="() => audioFile = null" />
            <textarea class="w-full input p-2" v-model="lyrics" />
        </form>
        <ul class="flex flex-col gap-3 mt-4 border-full p-2 ">
            <li class="group" v-for="line in lines" :key="line.index">
                <span class="p-2" v-text="getTimeFormatted(line.start)" />
                <div class="p-2 w-full line" :class="activeLineClass(line)">
                    <div class="line-fill" :style="`--state: ${getLineAnimationState(line)}; --duration: ${line.end - line.start}s`" />
                    <span class="block" v-for="l in line.text?.split('\n')" :key="l">
                        {{ l.replace(';', '') }}
                    </span>
                </div>
                <span class="p-2" v-text="getTime(line.end, 3)" :class="activeLineClass(line, keyIsPressed)" />
            </li>
        </ul>
        <button :disabled="lines.length <= 0" type="submit">Submit</button>
    </main>
</template>

<style scoped lang="scss">
.line {
    position: relative;
    &.active {
        @apply border-blue-500;
    }
    .line-fill {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        height: 100%;
        animation: fill-in linear forwards;
        animation-duration: var(--duration);
        animation-play-state: var(--state);
        //width: var(--fill);

        @apply bg-blue-500 opacity-15;
    }
    @keyframes fill-in {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }
}
</style>