<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import { computed, inject, onMounted, ref } from 'vue'

const store: any = inject('store')

declare interface LoginUser {
  email: string
  password: string
}

const userActions = store.userdata.actions
const userMethods = store.userdata.methods
const userData = computed(() => store.userdata.user)

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
