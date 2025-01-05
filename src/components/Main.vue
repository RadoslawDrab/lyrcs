<script setup lang="ts">

import FileInput from "./FileInput.vue";
import {ref} from "vue";
import {Line} from "../types/lyrics";

const audioFile = ref<{type: string, url: string} | null>(null);
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
  <form @submit.prevent="submit">
    <FileInput accept="audio/.*" @filesChange="onFilesLoad" />
    <div v-if="audioFile">
      <audio id="audio" controls>
        <source :type="audioFile.type" :src="audioFile.url" />
      </audio>
      <ul>
        <li v-for="line in lines" :key="line.index" class="line">
          <label for="start-input">Start</label>
          <input min="0" name="start-input" id="start-input" v-model.number="line.start" pattern="[0-9]{2,}:[0-9]{2}:[0-9]{2}" />
          <label for="end-input">End</label>
          <input min="0" name="end-input" id="end-input" v-model="line.end" pattern="[0-9]{2,}:[0-9]{2}:[0-9]{2}" />
          <input name="text-input" id="text-input" v-model="line.text" />
          <button @click="() => deleteLine(line.index)">Delete</button>
        </li>
      </ul>
      <button @click="() => createLine(lines.length)">Add line</button>
      <button :disabled="lines.length <= 0" type="submit">Submit</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.line {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.dropbox {
  padding: 7rem;
  border: 1px solid gray;
  border-radius: 5px;
  text-align: center;
}
</style>