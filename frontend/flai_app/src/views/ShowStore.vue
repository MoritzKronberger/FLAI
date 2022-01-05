<script setup lang="ts">
import { ref, inject, computed } from 'vue'
const store: any = inject('store')

//sesiondata
const session = store.sessiondata.session
const sessionMethods = store.sessiondata.methods

//user
const email = ref('')
const username = ref('')
const righthanded = ref(true)
const targetLearningTime = ref(10)

const user = computed(() => store.userdata.user)

function changeEmail() {
  store.userdata.methods.changeEmail(email.value)
}
function changeUsername() {
  store.userdata.methods.changeUsername(username.value)
}
function changeRightHanded() {
  store.userdata.methods.changeRightHanded(righthanded.value)
}
function changeTargetLearningTime() {
  store.userdata.methods.changeTargetLearningTime(targetLearningTime.value)
}

//exercises
const wordLength = ref()
const exerciseSession = ref()

const exerciseMethods = store.exercisedata.methods
const exerciseSettings = computed(() => store.exercisedata.exerciseSettings)
const exerciseSettingsUser = computed(
  () => store.exercisedata.exerciseSettingsUser
)
const exercises = computed(() => store.exercisedata.exercises)
const exerciseSessions = computed(() => store.exercisedata.exerciseSessions)
const word = ref('')

function changeExerciseSettingsWordLength() {
  store.exercisedata.methods.changeExerciseSettingsWordLength(wordLength.value)
}
function startNewExerciseSession() {
  exerciseSession.value = store.exercisedata.methods.startNewExerciseSession()
}
function generateWord() {
  word.value = exerciseSession.value = store.exercisedata.methods.generateWord()
}

//signdata
const signs = computed(() => store.exercisedata.exercises[0].signs)
const signMethods = store.signdata.methods

const letter = ref()

//exercise actions
async function getAllExercises() {
  await store.exercisedata.actions.getAllExercises()
  console.log('exercises in showstore', JSON.stringify(exercises.value))
}
async function postNewExerciseSession() {
  await store.exercisedata.actions.postNewExerciseSession(
    exercises.value.at(-1).id
  )
}
async function patchExerciseSession() {
  await store.exercisedata.actions.patchExerciseSession(
    exercises.value.at(-1).id,
    exerciseSessions.value.at(-1),
    100
  )
}
//signactions
</script>

<template>
  <h2>Test Actions</h2>
  <h3>Exercise Actions</h3>
  <button label="action" @click="getAllExercises">all exercises</button>
  <button
    label="action"
    @click="store.exercisedata.actions.getFullExerciseForUser(exercises[0].id)"
  >
    getFullExerciseForUser
  </button>
  <button
    label="action"
    @click="
      store.exercisedata.actions.patchExerciseSettings(exercises[0].id, 4, 20)
    "
  >
    patchExerciseSettings
  </button>
  <button
    label="action"
    @click="
      store.exercisedata.actions.getActiveExerciseSession(exercises[0].id)
    "
  >
    getActiveExerciseSession
  </button>
  <button label="action" @click="postNewExerciseSession">
    postNewExerciseSession
  </button>
  <button label="action" @click="patchExerciseSession">
    patchExerciseSession
  </button>

  <h3>Sign Actions</h3>
  <button
    label="action"
    @click="store.signdata.actions.getFullSignForExercise(exercises[0].id)"
  >
    getFullSignForExercise
  </button>
  <button
    label="action"
    @click="store.signdata.actions.getSignRecording(exercises[0].signs[0].id)"
  >
    getSignRecording
  </button>
  <button
    label="action"
    @click="store.signdata.actions.getSignRecordingForExercise(exercises[0].id)"
  >
    getSignRecordingForExercise
  </button>
  <button
    label="action"
    @click="
      store.signdata.actions.getProgress(
        exercises[0].id,
        exercises[0].signs[0].id
      )
    "
  >
    getProgress
  </button>
  <button
    @click="
      store.signdata.actions.patchProgress(
        exercises[0].id,
        exercises[0].signs[0].id,
        10
      )
    "
  >
    Update first Sign progress to 10
  </button>
  <button
    @click="
      store.signdata.actions.patchProgress(
        exercises[0].id,
        exercises[0].signs[0].id,
        100
      )
    "
  >
    Update firstSign progress to 100
  </button>

  <h2>Userdata</h2>
  <p v-for="(value, name) in user" :key="value">{{ name }}: {{ value }}</p>
  <label>Change Email:</label
  ><input v-model="email" type="text" @keyup.enter="changeEmail()" />
  <label>Change Username:</label
  ><input v-model="username" type="text" @keyup.enter="changeUsername" />
  <label>Change righthanded:</label
  ><input v-model="righthanded" type="checkbox" /><Button
    @click="changeRightHanded"
    >Submit</Button
  >
  <label>Change targetLearningTime:</label
  ><input
    v-model="targetLearningTime"
    type="text"
    @keyup.enter="changeTargetLearningTime"
  />
  <h2>Exercisedata</h2>
  <h3>Settings per Exercise:</h3>
  <p v-for="(value, name) in exerciseSettings" :key="value">
    {{ name }}: {{ value }}
  </p>
  <h3>Settings per User:</h3>
  <p v-for="(value, name) in exerciseSettingsUser" :key="value">
    {{ name }}: {{ value }}
  </p>
  <label>Change wordLength:</label
  ><input
    v-model="wordLength"
    type="text"
    @keyup.enter="changeExerciseSettingsWordLength"
  />
  <Button @click="exerciseMethods.increaseUnlockedSigns"
    >Increase unlockedSigns</Button
  >
  <Button @click="exerciseMethods.decreaseUnlockedSigns"
    >Decrease unlockedSigns</Button
  >
  <p>Exercises:</p>
  <p v-for="(value, name) in exercises" :key="value">{{ name }}: {{ value }}</p>
  <br />
  <p>ExerciseSessions:</p>
  <p v-for="(value, name) in exerciseSessions" :key="value">
    {{ name }}: {{ value }}
  </p>
  <Button @click="startNewExerciseSession">Start new exerciseSession</Button>
  <Button @click="generateWord">Generate new word</Button> {{ word }}

  <h2>Session</h2>
  <p v-for="(value, name) in session" :key="value">{{ name }}: {{ value }}</p>
  <Button @click="sessionMethods.startTimer">Start Timer</Button>
  <Button @click="sessionMethods.updateTimer">Update Timer</Button>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
