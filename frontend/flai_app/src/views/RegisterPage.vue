<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import { inject, ref } from 'vue'

const store: any = inject('store')

const username = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const rightHanded = ref(true)

const submit = (): void => {
  const user = {
    username: username.value,
    email: email.value,
    password: password.value,
    passwordRepeat: passwordRepeat.value,
    rightHanded: rightHanded.value,
  }
  console.log(user)
}
</script>

<template>
  <h1>Registrieren</h1>
  <form>
    <text-input-field
      v-model="username"
      label-name="Name"
      placeholder="Dein Benutzername"
      element-class="input-primary"
    />
    <text-input-field
      v-model="email"
      label-name="E-Mail"
      placeholder="Deine E-Mail-Adresse"
      element-class="input-primary"
    />
    <text-input-field
      v-model="password"
      label-name="Passwort"
      placeholder="Passwort"
      element-class="input-primary"
    />
    <text-input-field
      v-model="passwordRepeat"
      label-name="Passwort wiederholen"
      placeholder="Passwort wiederholen"
      element-class="input-primary"
    />
    <custom-checkbox
      v-model="rightHanded"
      label-name="Rechtshänder:in"
      element-class="checkbox-primary"
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
