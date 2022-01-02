<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import { inject, ref } from 'vue'

const store: any = inject('store')

declare interface LoginUser {
  username: string
  email: string
  password: string
}

const user = ref<LoginUser>({
  username: '',
  email: '',
  password: '',
})

const errorMessage = ref('')

const userActions = store.userdata.actions
const userMethods = store.userdata.methods

const submit = async (): Promise<void> => {
  const submitUser = { ...user.value }
  console.log(submitUser)
}
</script>

<template>
  <h1>Login</h1>
  <div class="error-message">{{ errorMessage }}</div>
  <form>
    <text-input-field
      v-model="user.email"
      label-name="E-Mail"
      placeholder="Deine E-Mail-Adresse"
      element-class="input-primary"
    />
    <text-input-field
      v-model="user.password"
      label-name="Passwort"
      placeholder="Passwort"
      element-class="input-primary"
    />
    <custom-button
      label="Registrieren"
      btnclass="button-primary"
      @button-click="submit"
    />
  </form>
</template>

<style scoped>
form > * {
  display: block;
}
</style>
