<template>
  <div v-if="showSign">
    <video
      ref="videoPlayer"
      :src="videoSource"
      type="video/webm"
      autoplay
      loop
    />
    <br />
    <CustomButton
      label="Perspektive wechseln"
      btnclass="controls"
      @click="switchPerspective()"
    />
    <DropDownMenu
      title="Geschwindigkeit"
      :items="dropDownItems"
      @click-element="changeSpeed"
    />
  </div>
  <CustomButton
    v-else
    label="Hinweis"
    btnclass="controls"
    @click="emit('useHint')"
  />
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, unref } from 'vue'
import { Sign } from '../../store/signdata'
import { DropDown } from '../../ressources/ts/interfaces'
import CustomButton from '../CustomButton.vue'
import DropDownMenu from '../DropDownMenu.vue'

const props = defineProps<{ signs: Sign[]; index: number; showSign: boolean }>()

const perspective = ref('front')
const videoPlayer = ref()

function getSource() {
  const rec = props.signs[props.index].recordings.find(
    (el) => el.perspective === perspective.value
  )
  console.log('el', JSON.stringify(rec))
  if (rec === undefined) {
    return 'src/assets/error.webm'
  }
  return `${rec.path}.${rec.mimetype}`
}
const videoSource: ComputedRef<string> = computed(() => getSource())

function switchPerspective() {
  if (perspective.value === 'front') {
    perspective.value = 'side'
  } else {
    perspective.value = 'front'
  }
}

const dropDownItems: DropDown[] = [
  { label: '1x', value: 1 },
  { label: '0.5x', value: 0.5 },
  { label: '0.25x', value: 0.25 },
]

function changeSpeed(output: any) {
  const videoHtml = unref(videoPlayer)
  if (videoHtml) {
    videoHtml.playbackRate = output
  }
}

const emit = defineEmits(['useHint'])
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div:focus {
  outline: none;
}
h3 {
  margin: 40px 0 0;
}
.controls {
  background: lightblue;
}
.waiting {
  color: grey;
}
.right {
  color: green;
}
.wrong {
  color: red;
}
</style>
