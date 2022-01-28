<script setup lang="ts">
import IconLoader from '../components/IconLoader.vue'
import store from '../store'
import { reactive, ref } from 'vue'
import { RegisterUser } from '../store/userdata'
import Form from '../components/Form.vue'

const inputFieldValidation = reactive({
  username: false,
  password: false,
  email: false,
})

type inputFieldKey = keyof typeof inputFieldValidation

const errorMessage = ref<string[]>([])
const userActions = store.userdata.actions
const userMethods = store.userdata.methods

const emit = defineEmits(['openLogin'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('openLogin')
}

const submit = async (user: RegisterUser): Promise<void> => {
  errorMessage.value.length = 0
  const submitUser = { ...user }
  const result = await userActions.postNewUser(submitUser)
  if (result?.status === 200) {
    userMethods.changeEmail(submitUser.email)
    emit('openLogin')
  } else {
    for (const el in inputFieldValidation) {
      inputFieldValidation[el as inputFieldKey] = false
    }
    for (let i = 0; i < result?.data.length; i++) {
      errorMessage.value.push(result?.data[i].message)
      inputFieldValidation[result?.data[i].path[0] as inputFieldKey] = true
    }
  }
}
</script>

<template>
  <div class="register-form-container">
    <IconLoader
      path="/assets/logos/logo.svg"
      alt="FLAI Icon"
      element-class="flai-logo"
    />
    <div class="form-items">
      <div class="lead-paragraph center-text body-small">
        Registriere dich, um die deutsche Gebärdensprache zu erlernen.
      </div>
      <Form
        :error-message="errorMessage"
        :input-field-validation="inputFieldValidation"
        :diabled-form="false"
        submit-type="Registrieren"
        @submit="submit"
      ></Form>
    </div>
    <div class="divider-line"></div>
    <div class="bottom-paragraph center-text body-small">
      Du hast ein Konto?
      <span class="link" @click="onclick">Melde dich an</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
