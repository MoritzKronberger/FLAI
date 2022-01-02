<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import { inject, ref } from 'vue'

const store: any = inject('store')

const username = ref('')
const email = ref('')
const password = ref('')
const rightHanded = ref(true)

const errorMessage = ref('')

const userActions = store.userdata.actions
const userMethods = store.userdata.methods

const submit = async (): Promise<void> => {
  const user = {
    username: username.value,
    email: email.value,
    password: password.value,
    /* eslint-disable */
    right_handed: rightHanded.value,
    /* eslint-enable */
  }

  const result = await userActions.postNewUser(user)
  if (result.status === 200) {
    userMethods.changeId(result.data.ids.id)
    console.log(result.data)
  } else {
    errorMessage.value = result.data.message
  }
}
</script>

<template>
  <h1>Registrieren</h1>
  <div class="error-message">{{ errorMessage }}</div>
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
