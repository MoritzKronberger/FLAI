<script setup lang="ts">
import { inject } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'

interface Options {
  [key: string]: string | number | undefined | boolean
  email?: string
  username?: string
  rightHanded?: boolean
  targetLearningTime?: number
}

const store: any = inject('store')
const userData = store.userdata

const user = userData.user

const options: Options = {
  id: user.id,
  email: user.email,
  username: user.username,
  rightHanded: user.rightHanded,
  targetLearningTime: user.targetLearningTime,
}

const information = {
  op1: { label: 'Name', value: userData.user.username },
  op2: { label: 'E-Mail', value: userData.user.email },
  op3: { label: 'Haendigkeit', value: userData.user.rightHanded },
  op4: { label: 'Lernziel', value: userData.user.targetLearningTime },
}

const submitChanges = (): void => {
  const changes: Options = {}
  for (const prop in user) {
    if (user[prop] !== options[prop]) {
      changes[prop] = options[prop]
    }
  }
  userData.actions.patchValues(changes)
}
</script>

<template>
  <h1>Profile</h1>
  <h2>User information</h2>
  <div>
    <li v-for="(value, key) in information" :key="key">
      <p>{{ value.label }} : {{ value.value }}</p>
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
      v-model="options.targetLearningTime"
      label-name="Target Learning Time"
      placeholder="15"
      element-class="input-primary"
      component-class="input"
    />
    <custom-checkbox
      v-model="options.rightHanded"
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
