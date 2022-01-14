<template>
  <div>
    <video
      ref="videoPlayer"
      :src="videoSource"
      type="video/webm"
      autoplay
      loop
    />
    <div class="video-controls">
      <div class="perspective-buttons">
        <CustomButton
          label="Front"
          btnclass="video_controls_button_blue"
          @click="frontPerspective()"
        />
        <CustomButton
          label="Seite"
          btnclass="video_controls_button_blue"
          @click="sidePerspective()"
        />
      </div>
      <div class="speed-buttons">
        <CustomButton
          v-for="item in speedItems"
          :key="item.label"
          :label="item.label"
          btnclass="video_controls_button_blue"
          @click="changeSpeed(item.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, unref } from 'vue'
import { Sign } from '../../store/signdata'
import { DropDown } from '../../ressources/ts/interfaces'
import CustomButton from '../CustomButton.vue'

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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../../assets/scss/main.scss';
</style>
