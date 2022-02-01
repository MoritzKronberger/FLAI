<template>
  <div v-if="showSign" class="video">
    <video
      ref="videoPlayer"
      :class="rightHanded ? 'mirrored' : ''"
      :src="videoSource"
      type="video/webm"
      autoplay
      loop
    />
  </div>
  <div v-if="showSign" class="video-controls">
    <SwitchButton
      :labels="['Front', 'Seite']"
      btnclass="sec_small_button_blue_switch"
      @button-click="switchClick"
    />
    <div v-if="showSign" class="play-button">
      <CustomButton
        label=""
        :iconpath="
          play ? 'assets/icons/FLAI_Pause.svg' : 'assets/icons/FLAI_Play.svg'
        "
        btnclass="sec_small_icon_button_blue"
        @click="togglePlay()"
      />
    </div>
  </div>
  <div v-else class="hint-container">
    <div v-if="showProgressWarning" class="progress-warning body-medium">
      <p>
        Du beherrscht diesen Buchstaben bereits sehr gut. Wenn du den Hinweis
        nutzt, erhältst du daher keinen Fortschritt.
      </p>
      <p>Möchtest du das Hinweisvideo trotzdem sehen?</p>
    </div>
    <CustomButton
      label="Hinweis"
      btnclass="sec_small_button_blue"
      @click="useHint"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, unref } from 'vue'
import { Sign } from '../../store/signdata'
import CustomButton from '../CustomButton.vue'
import SwitchButton from '../SwitchButton.vue'
import store from '../../store'

const props = defineProps<{
  signs: Sign[]
  index: number
  showSign: boolean
  progressWarning?: boolean
}>()

const emit = defineEmits(['useHint'])

const perspective = ref('front')
const videoPlayer = ref()
const showProgressWarning = ref(false)

const rightHanded = computed(() => store.userdata.user.right_handed)

function getSource() {
  const rec = props.signs[props.index].recordings.find(
    (el) => el.perspective === perspective.value
  )
  console.log('el', JSON.stringify(rec))
  showProgressWarning.value = false
  if (rec === undefined) {
    return '/assets/error.webm'
  }
  return `${rec.path}.${rec.mimetype}`
}
const videoSource: ComputedRef<string> = computed(() => getSource())

const play = ref(true)

function useHint() {
  console.log(props.progressWarning)
  console.log(showProgressWarning.value)
  if (props.progressWarning && !showProgressWarning.value) {
    showProgressWarning.value = true
  } else {
    emit('useHint')
  }
}

function frontPerspective() {
  play.value = true
  perspective.value = 'front'
}

function sidePerspective() {
  play.value = true
  perspective.value = 'side'
}

function switchClick(label: string) {
  if (label === 'Front') frontPerspective()
  else if (label === 'Seite') sidePerspective()
}

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
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
</style>
