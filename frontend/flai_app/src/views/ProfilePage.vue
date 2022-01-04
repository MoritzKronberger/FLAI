<script setup lang="ts">
import { onMounted, ref } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'
import store from '../store'

const actions = store.userdata.actions
const user = store.userdata.user

interface Options {
  [key: string]: string | number | undefined | boolean
  email?: string
  username?: string
  right_handed?: boolean
  target_learning_time?: number
}

const options = ref<Options>({
  id: '',
  email: '',
  username: '',
  /* eslint-disable */
  right_handed: true,
  target_learning_time: 0,
  /* eslint-enable */
})

onMounted(() => {
  options.value.email = user.email
  console.log(options.value.email)
})

const submitChanges = (): void => {
  const changes: Options = {}
  for (const prop in user) {
    if (user[prop] !== options[prop]) {
      changes[prop] = options[prop]
    }
  }
  console.log(changes)
}
</script>

<template>
  <h1>Profile</h1>
  <h2>User information</h2>
  <div>
    <li v-for="(item, key) in user" :key="key">
      <p>{{ key }} : {{ item }}</p>
    </li>
  </div>
  <form>
    <text-input-field
      v-model="options.email"
      label-name="Email"
      placeholder="x.y@email.com"
      element-class="input-primary"
      component-class="input"
    />
    <text-input-field
      v-model="options.username"
      label-name="Username"
      placeholder="username"
      element-class="input-primary"
      component-class="input"
    />
    <text-input-field
      v-model="options.target_learning_time"
      label-name="Target Learning Time"
      placeholder="15"
      element-class="input-primary"
      component-class="input"
    />
    <custom-checkbox
      v-model="options.right_handed"
      label-name="Use right hand"
      element-class="checkbox-primary"
    />
    <input type="button" value="Submit Changes" @click="submitChanges" />
  </form>
</template>

<style>
.input {
  margin: 5px;
}
</style>
