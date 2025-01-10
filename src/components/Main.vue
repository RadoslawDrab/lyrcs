<script setup lang="ts">

import FileInput from "./FileInput.vue";
import {computed, nextTick, ref} from "vue";
import {Line} from "../types/lyrics";
import AudioControls from "./AudioControls.vue";

const audioFile = ref<{type: string, url: string} | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);
const lyrics = ref<string | null>(null);
const lines = computed<Line[]>(() => {
  if (lyrics.value === null) return []

  const l = lyrics.value?.split(/(?<!;)\n/)
      .filter((line) => line.trim().length > 0)
      .map((line, index) => ({text: line.trim(), index }))
  console.log(l)
  return l
});

function submit() {

  console.log(lines.value)
}
async function onFilesLoad(files: File[]) {
  if (files.length == 0) return
  audioFile.value = null
  await nextTick()
  audioFile.value = {type: files[0].type, url: URL.createObjectURL(files[0]) }
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-2">
    <form @submit.prevent="submit">
      <FileInput accept="audio/.*" @filesChange="onFilesLoad" @fileDeleted="() => audioFile = null" />
      <textarea class="w-full input p-2" v-model="lyrics" />
    </form>
      <div v-if="audioFile" class="mt-6 p-2 border-full">
        <AudioControls v-model="audioFile" />
      </div>
      <ul class="flex flex-col gap-3 mt-4 border-full p-2">
        <li class="group" v-for="line in lines" :key="line.index">
          <span class="p-2" v-text="line.start"></span>
          <p class="p-2 w-full">
            <span class="block" v-for="l in line.text?.split('\n')" v-text="l.replace(';', '')" :key="l" />
          </p>
          <span class="p-2" v-text="line.end"></span>
        </li>
      </ul>
    <button :disabled="lines.length <= 0" type="submit">Submit</button>
  </main>
</template>