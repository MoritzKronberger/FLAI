<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import router from '../router'
import { inject, ref } from 'vue'

const store: any = inject('store')

declare interface RegisterUser {
  username: string
  email: string
  password: string
  /* eslint-disable */
  right_handed: boolean
  /* eslint-enable */
}

const user = ref<RegisterUser>({
  username: '',
  email: '',
  password: '',
  /* eslint-disable */
  right_handed: true,
  /* eslint-enable */
})

const errorMessage = ref('')

const userActions = store.userdata.actions
const userMethods = store.userdata.methods

const submit = async (): Promise<void> => {
  const submitUser = { ...user.value }
  const result = await userActions.postNewUser(submitUser)
  if (result.status === 200) {
    userMethods.changeId(result.data.ids.id)
    userMethods.changeEmail(submitUser.email)
    userMethods.changeUsername(submitUser.username)
    /* eslint-disable */
    userMethods.changeRightHanded(submitUser.right_handed)
    /* eslint-enable */
    router.push({ name: 'LoginPage' })
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
      v-model="user.username"
      label-name="Name"
      placeholder="Dein Benutzername"
      element-class="input-primary"
    />
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
    <custom-checkbox
      v-model="user.right_handed"
      label-name="Rechtshänder:in"
      element-class="checkbox-primary"
    />
    <custom-button
      label="Registrieren"
      btnclass="button-primary"
      @button-click="submit"
    />
  </form>
  <div>Du hast bereits einen Account?<router-link to="/login">Login</router-link></div>
</template>

<style scoped>
form > * {
  display: block;
}
</style>
