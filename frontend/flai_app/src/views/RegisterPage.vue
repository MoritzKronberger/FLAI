<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import store from '../store'
import { ref } from 'vue'
import { RegisterUser } from '../store/userdata'
import { useRouter } from 'vue-router'

const router = useRouter()

const defaultTargetTime = '00:20:00'

const user = ref<RegisterUser>({
  username: '',
  email: '',
  password: '',
  right_handed: true,
  target_learning_time: defaultTargetTime,
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
  <div class="register-form">
    <div class="register-items">
      <div class="register-top-text">
        Registriere dich, um die deutsche Gebärdensprache zu erlernen.
      </div>
      <div class="error-message">{{ errorMessage }}</div>
      <form>
        <text-input-field
          v-model="user.username"
          placeholder="Benutzername"
          element-class="input-primary"
        />
        <text-input-field
          v-model="user.email"
          placeholder="E-Mail-Adresse"
          element-class="input-primary"
        />
        <text-input-field
          v-model="user.password"
          placeholder="Passwort"
          element-class="input-primary"
          custom-type="password"
        />
        <custom-checkbox
          v-model="user.right_handed"
          label-name="Rechtshänder:in?"
          element-class="checkbox-primary"
        />
        <text-input-field
          v-model="user.target_learning_time"
          label-name="Tägliches Lernziel"
          :placeholder="defaultTargetTime"
          element-class="input-primary"
          custom-type="time"
          :time-step="1"
        />
        <custom-button
          label="Registrieren"
          btnclass="button-primary"
          @button-click="submit"
        />
      </form>
      <div class="divider-line"></div>
      <div class="login-offer">
        Du ein Konto? <router-link to="/login">Melde dich an</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';

form > * {
  display: block;
}
</style>
