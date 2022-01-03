<script setup lang="ts">
import { inject, ref } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'

const store: any = inject('store')
const userData = store.userdata

const user = userData.user

const newEmail = ref('')
const newUserName = ref('')
const newRightHand = ref(false)
const newTargetTime = ref(15)

const setNewEmail = (): void => {
  userData.methods.changeEmail(newEmail.value)
}
const setNewUserName = (): void => {
  userData.methods.changeUsername(newUserName.value)
}
const setNewRightHand = (): void => {
  userData.methods.changeRightHanded(newRightHand.value)
}
const setNewTargetLearningTime = (): void => {
  userData.methods.changeTargetLearningTime(newTargetTime.value)
}
</script>

<template>
  <h1>Profile</h1>
  <h2>User information</h2>
  <div>
    <li v-for="(value, key) in user" :key="value">
      <p>{{ key }} : {{ value }}</p>
    </li>
  </div>
  <div class="login">
    <text-input-field
      v-model="newEmail"
      label-name="Email"
      placeholder="x.y@email.com"
      element-class="input-primary"
      component-class="input"
      @keyup.enter="setNewEmail"
    />
    <text-input-field
      v-model="newUserName"
      label-name="Username"
      placeholder="username"
      element-class="input-primary"
      component-class="input"
      @keyup.enter="setNewUserName"
    />
    <text-input-field
      v-model="newTargetTime"
      label-name="Target Learning Time"
      placeholder="15"
      element-class="input-primary"
      component-class="input"
      @keyup.enter="setNewTargetLearningTime"
    />
    <custom-checkbox
      v-model="newRightHand"
      label-name="Use right hand"
      element-class="checkbox-primary"
      @input="setNewRightHand"
    />
  </div>
</template>

<style>
.input {
  margin: 5px;
}
</style>
