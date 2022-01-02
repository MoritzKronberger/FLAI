<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import router from '../router'
import { computed, ComputedRef, inject, onMounted, ref } from 'vue'
import { LoginUser } from '../store/authdata'
import { User } from '../store/userdata'

const store: any = inject('store')

const userMethods = store.userdata.methods
const authActions = store.authdata.actions
const userData = computed(() => store.userdata.user) as ComputedRef<User>

const user = ref<LoginUser>({
  email: '',
  password: '',
})

const errorMessage = ref('')

onMounted(() => {
  user.value.email = userData.value.email
})

const submit = async (): Promise<void> => {
  const submitUser = { ...user.value }
  const result = await authActions.loginUser(submitUser)
  if (result.status === 200) {
    userMethods.changeId(result.data.id)
    // TODO: call download all userdata method
    router.push({ name: 'HomePage' })
  } else {
    errorMessage.value = result.data.message
  }
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
      label="Login"
      btnclass="button-primary"
      @button-click="submit"
    />
  </form>
  <div>
    Du hast noch keinen Account?<router-link to="/register"
      >Registrieren</router-link
    >
  </div>
</template>

<style scoped>
form > * {
  display: block;
}
</style>
