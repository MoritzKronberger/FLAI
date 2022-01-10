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
      label="Front"
      btnclass="controls"
      @click="frontPerspective()"
    />
    <CustomButton
      label="Seite"
      btnclass="controls"
      @click="sidePerspective()"
    />
    <CustomButton
      v-for="item in speedItems"
      :key="item.label"
      :label="item.label"
      btnclass="controls"
      @click="changeSpeed(item.value)"
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
    return '/assets/error.webm'
  }
  return `${rec.path}.${rec.mimetype}`
}
const videoSource: ComputedRef<string> = computed(() => getSource())

function frontPerspective() {
  perspective.value = 'front'
}

function sidePerspective() {
  perspective.value = 'side'
}

const speedItems: DropDown[] = [
  { label: '1x', value: 1 },
  { label: '0.5x', value: 0.5 },
  { label: '0.25x', value: 0.25 },
]

function changeSpeed(newSpeed: any) {
  const videoHtml = unref(videoPlayer)
  if (videoHtml) {
    videoHtml.playbackRate = newSpeed
  }
}

const emit = defineEmits(['useHint'])
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../../assets/scss/main.scss';
</style>
