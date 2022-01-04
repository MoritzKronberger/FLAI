<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import store from '../store'
import { ref } from 'vue'
import { RegisterUser } from '../store/userdata'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  if (result?.status === 200) {
    userMethods.changeEmail(submitUser.email)
    router.push({ name: 'LoginPage' })
  } else {
    errorMessage.value = result?.data.message
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
  <div>
    Du hast bereits einen Account?<router-link to="/login">Login</router-link>
  </div>
</template>

<style scoped>
form > * {
  display: block;
}
</style>
