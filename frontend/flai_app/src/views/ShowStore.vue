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
</script>

<template>
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
  <h2>Signdata</h2>
  <h3>Update progress + 10:</h3>
  <label>letter:</label>
  <input
    v-model="letter"
    type="text"
    @keyup.enter="exerciseMethods.increaseProgress('0', letter)"
  />
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
