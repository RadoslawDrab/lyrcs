<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
import { PhX } from "@phosphor-icons/vue"

const props = withDefaults(defineProps<{
  accept: string | RegExp | string[];
  multiple?: boolean;
  displayFileName?: boolean
}>(), {
  multiple: false,
  displayFileName: true,
})
const emit = defineEmits<{
  filesLoad: [File[]],
  filesChange: [File[]],
  invalidFileType: [File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const accept = Array.isArray(props.accept) ? props.accept : new RegExp(props.accept)

async function changeEvent(event: Event | DragEvent) {
  let files: File[] = []

  if (event instanceof DragEvent) {
    event.target?.classList.remove('dragging')
  }

  const eventFiles = event instanceof DragEvent ?
      event.dataTransfer?.files ?? [] :
      event instanceof Event ?
          (event.target as HTMLInputElement)?.files ?? [] :
          []

  for (let file of eventFiles) {
    if (Array.isArray(accept) ? !accept.includes(file.type) : !accept.test(file.type)) {
      console.error('File type "' + accept, file.type)
      emit('invalidFileType', file)
      continue
    }
      files.push(file)
  }
  if (files.length == 0) return

  selectedFiles.value = props.multiple ? selectedFiles.value.concat(files) : files
  await nextTick()

  emit('filesLoad', props.multiple ? files : files.slice(0, 1))
}
watch(selectedFiles, (files) => {
  emit('filesChange', props.multiple ? files : files.slice(0, 1))
})
</script>

<template>
  <div class="dropbox border-full p-6 m-4 text-center max-w-lg" @drop.prevent.stop="changeEvent"
       @dragstart.prevent.stop=""
       @dragend.prevent.stop=""
       @dragover.prevent.stop=""
       @dragenter.prevent.stop="(e) => e.target?.classList.add('dragging')"
       @dragleave.prevent.stop="(e) => e.target?.classList.remove('dragging')"
       @drag.prevent.stop="">
    <span>
    Drop here or <input class="btn-inline btn-primary" type="button" value="Choose file" @click="() => fileInput?.click()">
    </span>
    <ul v-if="selectedFiles.length > 0" class="flex flex-col items-start gap-2 mt-4 border-base border-t pt-4">
      <li class="group" v-for="(file, index) in selectedFiles" :key="file.name">
        <button class="btn-outline btn-danger p-2" @click="() => selectedFiles = selectedFiles.filter((_, i) => i !== index)">
          <PhX weight="bold" />
        </button>
        <span class="py-1 px-2">
        {{file.name}}
        </span>
      </li>
    </ul>

    <input ref="fileInput" type="file" :accept="Array.isArray(props.accept) ? props.accept.join(', ') : props.accept.toString()" @change="changeEvent" style="display: none" :multiple="props.multiple" aria-hidden="true">
  </div>
</template>

<style lang="scss">
.dropbox {
  &.dragging {
    cursor: grabbing;
    @apply bg-zinc-300 transition-all;
    @apply dark:bg-zinc-700;
  }
}
</style>