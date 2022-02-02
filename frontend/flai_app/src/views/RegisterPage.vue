<template>
  <div class="register-form-container">
    <IconLoader
      path="/assets/logos/logo.svg"
      alt="FLAI Icon"
      element-class="flai-logo"
    />
    <div class="form-items">
      <ProfileForm
        :error-message="errorMessage"
        :input-field-validation="inputFieldValidation"
        :disabled-form="false"
        submit-name="Registrieren"
        component-class="form-input"
        @submit="submit"
      ></ProfileForm>
      <div class="divider-line"></div>
    </div>
    <div class="bottom-paragraph center-text body-small">
      Du hast ein Konto?
      <span class="link" @click="onclick">Melde dich an</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconLoader from '../components/IconLoader.vue'
import store from '../store'
import { reactive, ref } from 'vue'
import { RegisterUser } from '../store/userdata'
import ProfileForm from '../components/ProfileForm.vue'
import { profileValidation } from '../ressources/ts/validation'

const inputFieldValidation = reactive({
  username: false,
  password: false,
  email: false,
})

const errorMessage = ref<string[]>([])
const userActions = store.userdata.actions
const userMethods = store.userdata.methods

const emit = defineEmits(['openLogin'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('openLogin')
}

const submit = async (user: RegisterUser): Promise<void> => {
  const submitUser = { ...user }
  const result = await userActions.postNewUser(submitUser)
  profileValidation(result, errorMessage, inputFieldValidation, () => {
    userMethods.changeEmail(submitUser.email)
    emit('openLogin')
  })
}
</script>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
