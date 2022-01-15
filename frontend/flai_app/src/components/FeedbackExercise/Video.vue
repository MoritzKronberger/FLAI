<template>
  <div v-if="showSign">
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
      <div class="play-button">
        <CustomButton
          :label="play ? 'play' : 'pause'"
          btnclass="video_controls_button_blue"
          @click="togglePlay()"
        />
      </div>
    </div>
  </div>
  <CustomButton
    v-else
    label="Hinweis"
    btnclass="sec_small_button_blue"
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

const play = ref(true)

function togglePlay() {
  const videoHtml = unref(videoPlayer)
  if (videoHtml) {
    if (play.value) {
      play.value = false
      videoHtml.pause()
    } else {
      play.value = true
      videoHtml.play()
    }
  }
}

const emit = defineEmits(['useHint'])
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../../assets/scss/main.scss';
</style>
