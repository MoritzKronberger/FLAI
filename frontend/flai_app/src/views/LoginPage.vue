<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { computed, onMounted, ref } from 'vue'
import { LoginUser } from '../store/authdata'
import store from '../store'
import { useRouter } from 'vue-router'

const router = useRouter()

const userActions = store.userdata.actions
const authActions = store.authdata.actions
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
  const result = await authActions.loginUser(submitUser)
  if (result?.status === 200) {
    await userActions.getUser()
    router.push({ name: 'HomePage' })
  } else {
    errorMessage.value = result?.data.message
  }
}
</script>

<template>
  <div class="login-form-container">
    <router-link :to="{ name: 'HomePage' }">
      <IconLoader
        path="/assets/logos/faces.svg"
        alt="FLAI Icon"
        element-class="flai-icon"
      />
    </router-link>
    <div class="form-items">
      <div class="error-message body-normal">{{ errorMessage }}</div>
      <form>
        <text-input-field
          v-model="user.email"
          label-name="E-Mail-Adresse"
          placeholder="E-Mail-Adresse"
          element-class="default_input_field input-form-primary"
        />
        <text-input-field
          v-model="user.password"
          label-name="Passwort"
          placeholder="Passwort"
          element-class="default_input_field input-form-primary"
          custom-type="password"
        />
        <custom-button
          label="Login"
          btnclass="button-form-primary prim_small_button_blue"
          @button-click="submit"
        />
      </form>
      <div class="divider-line"></div>
      <div class="bottom-paragraph center-text body-normal">
        Du hast noch keinen Account?
        <router-link to="/register">Registrieren</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
