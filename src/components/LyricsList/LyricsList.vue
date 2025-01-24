<script setup lang="ts">
import { ref } from 'vue'

import { getTime } from '@utils/time'

import { Line } from '@type/lyrics'

import AudioControls from '@components/AudioControls'


const lines = defineModel<Line[]>({ default: [] });
const currentLine = defineModel<number>('currentLine', { default: 0 })
const props = defineProps<{
  keyIsPressed: boolean
  audioControlsRef: InstanceType<typeof AudioControls> | null
}>()
const lineFillRefs = ref<HTMLDivElement[] | null>(null);
const lineContentRefs = ref<HTMLDivElement[] | null>(null);

const activeLineClass = (line: Line, ...other: boolean[]) => line.index == currentLine.value && other.every((b) => b) ? 'active' : ''

function getFill(line: Line, percent: boolean = false) {
  if (!props.audioControlsRef) return 0
  const value = Math.max(Math.min((props.audioControlsRef.currentTime - line.start) / (line.end - line.start), 1), 0)
  return percent ? value * 100 : value
}

function getLineAnimationState(line: Line) {
  return getFill(line) > 0 && props.audioControlsRef?.isPlaying ? 'running' : 'paused'
}

function setTime(line: Line, type: 'start' | 'end') {
  props.audioControlsRef?.setTime(line[type])
  currentLine.value = line.index
}

defineExpose({
  lineFillRefs,
  lineContentRefs
})
</script>

<template>
  <ul class="flex flex-col gap-3 mt-4 border-full p-2 ">
    <li class="group line" v-for="line in lines" :key="line.index">
      <button class="p-2 btn-inline" @click="setTime(line, 'start')" v-text="getTime(line.start, 3)"
              :class="activeLineClass(line, !props.keyIsPressed)"/>
      <div ref="lineContentRefs" class="p-2 w-full line-content" :data-index="line.index">
        <div ref="lineFillRefs" class="line-fill"
             :style="`--state: ${getLineAnimationState(line)}; --duration: ${audioControlsRef && audioControlsRef.currentTime < line.end ? line.end - line.start : 0}s`"/>
        <span class="block" v-for="l in line.text?.split('\n')" :key="l">
            {{ l.replace(';', '') }}
          </span>
      </div>
      <button class="p-2 btn-inline" @click="setTime(line, 'end')" v-text="getTime(line.end, 3)"
              :class="activeLineClass(line, props.keyIsPressed)"/>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.line {
  & > * {
    @apply transition-colors;
    &.active {
      @apply bg-blue-500 dark:bg-blue-700;
    }
  }

  &-content {
    position: relative;

    .line-fill {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      height: 100%;

      animation: fill-in linear forwards;
      animation-duration: var(--duration);
      animation-play-state: var(--state);

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
}
</style>