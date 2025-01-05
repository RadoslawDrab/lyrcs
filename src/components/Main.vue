<script setup lang="ts">

import FileInput from "./FileInput.vue";
import {ref} from "vue";
import {Line} from "../types/lyrics";
import AudioControls from "./AudioControls.vue";
import {PhPlus, PhX} from "@phosphor-icons/vue";

const audioFile = ref<{type: string, url: string} | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);
const lines = ref<Line[]>([])

function createLine(index: number) {
  lines.value.push({index})
}
function deleteLine(index: number) {
  lines.value = lines.value.filter((line) => line.index !== index)
}
function submit() {

  console.log(lines.value)
}
function onFilesLoad(files: File[]) {
  if (files.length == 0) return
  console.log(files)
  audioFile.value = {type: files[0].type, url: URL.createObjectURL(files[0]) }
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-2">
    <form @submit.prevent="submit">
      <FileInput accept="audio/.*" @filesChange="onFilesLoad" />
    </form>
      <div v-if="audioFile" class="mt-6 p-2 border-full">
        <AudioControls v-model="audioFile" />
      </div>
      <ul class="flex flex-col gap-3 mt-4 border-full p-2">
        <li class="group" v-for="line in lines" :key="line.index">
          <button class="btn-outline btn-danger p-1" @click="() => deleteLine(line.index)">
            <PhX :size="24" />
          </button>
          <span class="p-2">00:00:000</span>
          <input class="w-full input p-2" v-model="line.text" />
          <span class="p-2">00:00:000</span>
        </li>
        <li>
          <button class="btn btn-success p-2 w-full flex gap-2 items-center justify-center" @click="() => createLine(lines.length)">
            <PhPlus :size="24" weight="bold" />
            <span>Add line</span>
          </button>
        </li>
      </ul>
    <button :disabled="lines.length <= 0" type="submit">Submit</button>
  </main>
</template>