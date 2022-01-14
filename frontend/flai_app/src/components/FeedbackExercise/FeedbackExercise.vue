<template>
  <div
    v-if="word !== undefined && word.length > 0 && wordSet"
    :key="startSession"
  >
    <WatchWord
      v-if="stepOneWatch && newSigns.length > 0"
      :signs="newSigns"
      :exercise-id="exerciseId"
      @next="onNextStep"
      @correct="emit('correct')"
      @wrong="emit('wrong')"
      @rendered="emit('watch-word')"
    />
    <ShowWord
      v-else
      :signs="signsFromWord"
      :exercise-id="exerciseId"
      @new-word="newWord"
      @correct="emit('correct')"
      @wrong="emit('wrong')"
      @rendered="emit('show-word')"
    />
  </div>
  <div v-else>
    <!-- TODO: second loading needed? -->
    <p>Generating word...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'
import store from '../../store'
import { initExerciseRound } from '../../ressources/ts/methods'
import { useRouter } from 'vue-router'

const router = useRouter()

const allSigns: ComputedRef<Sign[]> = computed(() => store.signdata.signs)

const word: ComputedRef<string[]> = computed(
  () => store.exercisedata.word.signs
)
const signsFromWord: ComputedRef<Sign[]> = computed(() => {
  const wordArray: Sign[] = []
  for (const signId of word.value) {
    const sign = allSigns.value?.find((el) => el.id === signId)
    if (sign) wordArray.push(sign)
  }
  return wordArray
})
const startSession = ref('false') // forces the div to rerender via the key: must be string/number
const newSigns = ref<Sign[]>([])
const stepOneWatch = ref(true)
const exerciseId: ComputedRef<string> = computed(
  () => store.exercisedata.exercises[0].id
)
const wordSet = ref(true)
const currentWordCount = computed(
  () => store.exercisedata.wordsCompleted.currentValue
)
const maxWordCount = computed(() => store.exercisedata.wordsCompleted.maxWords)

const emit = defineEmits(['watch-word', 'show-word', 'correct', 'wrong'])

function getNewSigns() {
  newSigns.value.length = 0
  for (const signId of word.value) {
    const sign = allSigns.value?.find((el) => el.id === signId)
    if (sign?.intro_done === false) {
      if (!newSigns.value.includes(sign)) {
        newSigns.value.push(sign)
      }
    }
  }
  console.log('newSigns', JSON.stringify(newSigns.value))
}

function onNextStep() {
  stepOneWatch.value = false
  console.log('nextStep')
}

// add word counter
// redirect to ChooseText after third word
async function newWord() {
  startSession.value = 'false'
  wordSet.value = false

  store.exercisedata.methods.changeCurrentWords(currentWordCount.value + 1)
  if (currentWordCount.value === maxWordCount.value) {
    router.push({ name: 'ChooseTest' })
    return
  }

  await initExerciseRound()
  wordSet.value = true
}

onBeforeMount(() => {
  store.sessiondata.methods.startTimer()
  startSession.value = 'true'
  getNewSigns()
  console.log(newSigns.value.length)
})
</script>
