<template>
  <div class="content" vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <div class="signRow">
        <div v-for="(letter, count) of signs" :key="letter.name" class="item">
          <span v-if="count === index" class="currentLetter">
            {{ letter.name }}
          </span>
          <span v-else>{{ letter.name }}</span>
        </div>
        <IconLoader
          v-if="pathToIcon !== undefined"
          :key="pathToIcon"
          :path="pathToIcon"
          mimetype="svg"
          alt="Icon, das die Korrektheit anzeigt"
          element-class="img"
        />
      </div>
      <Video
        id="video"
        :show-sign="showSign"
        :signs="signs"
        :index="index"
        @use-hint="showSign = true"
      />
      <p :class="feedbackClass">TODO: Add webcam component</p>
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, onBeforeMount, watchEffect } from 'vue'
import { Progress } from '../../store/exercisedata'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'
import store from '../../store'
import { getFlaiNetResults } from '../../ressources/ts/flaiNetCheck'
import { useRouter } from 'vue-router'
import { FlaiNetResults } from '../../store/flainetdata'
import IconLoader from '../IconLoader.vue'

const router = useRouter()

const inputAccepted = ref(true)
const index = ref(0)
const pathToIcon = ref<string>()

const feedbackClass = ref('waiting')
const progressSmallerLevelTwo = ref(true)
const progressSmallerLevelThree = ref(true)
const showSign = ref(true)

const progressStep: ComputedRef<Progress> = computed(
  () => store.exercisedata.progressStep
)

const resultBuffer = computed(() => store.flainetdata.resultBuffer.results)
const newInputTimeout = computed(
  () => store.flainetdata.flaiNetOptions.newInputTimeout
)
const status = ref('Loading')

const props = defineProps<{ signs: Sign[]; exerciseId: string }>()

function checkProgress(sign: Sign) {
  if (sign.progress >= store.exercisedata.exerciseSettings.level_1) {
    progressSmallerLevelTwo.value = true
    progressSmallerLevelThree.value = true
    showSign.value = false
    if (sign.progress >= store.exercisedata.exerciseSettings.level_2) {
      progressSmallerLevelTwo.value = false
      if (sign.progress >= store.exercisedata.exerciseSettings.level_3) {
        progressSmallerLevelThree.value = false
        if (!sign.level_3_reached) {
          store.exercisedata.methods.increaseUnlockedSigns()
        }
      }
    }
  } else {
    showSign.value = true
  }
  console.log(
    'progress',
    sign.progress,
    'smaller2',
    progressSmallerLevelTwo.value,
    'smaller3',
    progressSmallerLevelThree.value,
    sign.level_3_reached
  )
}

onBeforeMount(() => checkProgress(props.signs[index.value]))

function reEnableInput() {
  store.flainetdata.methods.clearResultBuffer()
  inputAccepted.value = true
}

async function correct() {
  inputAccepted.value = false
  pathToIcon.value = '/assets/icons/FLAI_Richtig'
  if (progressSmallerLevelTwo.value || !showSign.value) {
    console.log('update correct')
    const progress =
      props.signs[index.value].progress + progressStep.value.progressAdd
    await store.signdata.actions.patchProgress(
      props.exerciseId,
      props.signs[index.value].id,
      progress
    )
  }
  feedbackClass.value = 'right'
  if (index.value < props.signs.length - 1) {
    index.value++
    console.log('index', index.value)
    checkProgress(props.signs[index.value])
    // TODO: remove debug status timeout
    // maybe the webcam opacity could be lowered or something else to signify the disabled input?
    status.value = 'timeout'
    setTimeout(reEnableInput, newInputTimeout.value)
  } else {
    router.push({ name: 'HomePage' })
  }
}
async function wrong() {
  inputAccepted.value = false
  pathToIcon.value = '/assets/icons/FLAI_Fehler'
  if (progressSmallerLevelTwo.value || !showSign.value) {
    console.log('update wrong')
    const progress =
      props.signs[index.value].progress + progressStep.value.progressSubtract
    await store.signdata.actions.patchProgress(
      props.exerciseId,
      props.signs[index.value].id,
      progress
    )
  }
  feedbackClass.value = 'wrong'
  if (index.value < props.signs.length - 1) {
    index.value++
    console.log('index', index.value)
    checkProgress(props.signs[index.value])
    // TODO: remove debug status timeout
    // maybe the webcam opacity could be lowered or something else to signify the disabled input?
    status.value = 'timeout'
    setTimeout(reEnableInput, newInputTimeout.value)
  } else {
    router.push({ name: 'HomePage' })
  }
}

// TODO: Add adjustable timeout to inputAccepted reenable?
const onBufferUpdate = (buffer: FlaiNetResults) => {
  console.log(inputAccepted.value)
  if (inputAccepted.value) {
    status.value = getFlaiNetResults(
      buffer,
      props.signs[index.value].name,
      correct,
      wrong
    )
  }
}

watchEffect(() => onBufferUpdate(resultBuffer.value))
</script>

<style>
div.content {
  width: 50%;
}
div:focus {
  outline: none;
}
.signRow {
  width: 100%;
  align-items: center;
  justify-content: space-around;
  display: flex;
}
#video {
  width: 100%;
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
.currentLetter {
  font-size: 20px;
  font-weight: bold;
}
div.item {
  display: inline;
}
span {
  display: inline;
}
</style>
