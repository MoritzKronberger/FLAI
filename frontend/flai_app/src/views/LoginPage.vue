<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { LoginUser } from '../store/authdata'
import store from '../store'
import { useRouter } from 'vue-router'
import { loginValidation } from '../ressources/ts/validation'

const router = useRouter()

const userActions = store.userdata.actions
const authActions = store.authdata.actions
const userData = computed(() => store.userdata.user)

const user = ref<LoginUser>({
  email: '',
  password: '',
})

const errorMessage = ref<string[]>([])

onMounted(() => {
  user.value.email = userData.value.email
})

//onMounted will not work on modal view
function updateUser(mail: string) {
  user.value.email = mail
}

watchEffect(() => updateUser(userData.value.email))

const submit = async (): Promise<void> => {
  const submitUser = { ...user.value }
  const result = await authActions.loginUser(submitUser)
  loginValidation(result, errorMessage, async () => {
    await userActions.getUser()
    router.push({ name: 'HomePage' })
  })
}

const emit = defineEmits(['openRegister'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('openRegister')
}
</script>

<template>
  <div class="login-form-container">
    <IconLoader
      path="/assets/logos/logo.svg"
      alt="FLAI Icon"
      element-class="flai-logo"
    />
    <div class="form-items">
      <div class="lead-paragraph center-text body-small">
        Melde dich an, um die deutsche Gebärdensprache zu erlernen.
      </div>
      <div
        v-for="err in errorMessage"
        :key="err"
        class="error-message body-small"
      >
        {{ err }}
      </div>
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
        <div class="button-container">
          <custom-button
            label="Login"
            btnclass="button-form-primary prim_small_button_blue"
            @button-click="submit"
          />
        </div>
      </form>
      <div class="divider-line"></div>
      <div class="bottom-paragraph center-text body-small">
        Du hast noch keinen Account?
        <span class="link" @click="onclick">Registrieren</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
