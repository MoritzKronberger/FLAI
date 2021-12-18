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
const exerciseId = ref()

const exerciseMethods = store.exercisedata.methods
const exercisesettings = computed(() => store.exercisedata.exerciseSettings)
const exercises = computed(() => store.exercisedata.exercises)

function changeExerciseSettingsWordLength() {
  store.exercisedata.methods.changeExerciseSettingsWordLength(wordLength.value)
}
function startNewExercise() {
  exerciseId.value = store.exercisedata.methods.startNewExercise(
    'Exercise',
    'Description'
  )
}

//signdata
const signs = computed(() => store.signdata.signs)
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
  <p>Settings:</p>
  <p v-for="(value, name) in exercisesettings" :key="value">
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
  <Button @click="startNewExercise">Start new exercise</Button>
  <Button @click="store.exercisedata.methods.stopExercise(exerciseId)"
    >Stop last exercise</Button
  >
  <h2>Session</h2>
  <p v-for="(value, name) in session" :key="value">{{ name }}: {{ value }}</p>
  <Button @click="sessionMethods.startTimer">Start Timer</Button>
  <Button @click="sessionMethods.updateTimer">Update Timer</Button>
  <h2>Signdata</h2>
  <p v-for="(value, name) in signs" :key="value">{{ name }}: {{ value }}</p>
  <Button @click="signMethods.createNewSigns">Create new signs</Button>
  <h3>Update progress + 10:</h3>
  <label>letter:</label>
  <input
    v-model="letter"
    type="text"
    @keyup.enter="signMethods.updateProgress(letter, 10)"
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
