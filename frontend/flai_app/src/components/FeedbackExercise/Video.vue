<template>
  <div class="video-column">
    <div v-if="showSign" class="video">
      <video
        ref="videoPlayer"
        :src="videoSource"
        type="video/webm"
        autoplay
        loop
      />
    </div>
    <div v-if="showSign" class="video-controls">
      <div v-if="showSign" class="perspective-buttons">
        <CustomButton
          label="Front"
          btnclass="sec_small_button_blue"
          @click="frontPerspective()"
        />
        <CustomButton
          label="Seite"
          btnclass="sec_small_button_blue"
          @click="sidePerspective()"
        />
      </div>
      <div v-if="showSign" class="speed-buttons">
        <CustomButton
          label="Start"
          btnclass="sec_small_button_blue"
          @click="console.log('click start, not working sorry')"
        />
      </div>
    </div>
    <CustomButton
      v-else
      label="Hinweis"
      btnclass="sec_small_button_blue"
      @click="emit('useHint')"
    />
  </div>
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
