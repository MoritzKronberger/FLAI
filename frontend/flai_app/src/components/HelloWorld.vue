<script setup lang="ts">
import { ref, inject, computed } from 'vue'
const store: any = inject('store')

defineProps<{ msg: string }>()

const count = ref(0)
const username = computed(() => store.userdata.user.username)
store.userdata.methods.changeUsername('Bob')
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>{{ username }}</p>
  <Button @click="store.sessiondata.methods.updateTimer">
    Click to show new time
  </Button>
  <p>Time: {{ store.sessiondata.session.timer }}</p>
  <Button
    @click="
      store.exercisedata.methods.stopExercise(
        store.exercisedata.exercises[0].id
      )
    "
  >
    Stop exercise time
  </Button>
  <p>{{ store.exercisedata.exercises[0].lastStart }}</p>
  <Button @click="store.signdata.methods.updateProgress('b', 10)"
    >Add 10 progress to B</Button
  >
  <p>B: {{ store.signdata.signs[1] }}</p>
  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
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
