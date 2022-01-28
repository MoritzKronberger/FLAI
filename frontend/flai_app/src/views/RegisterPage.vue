<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import store from '../store'
import { ref, watchEffect, reactive } from 'vue'
import { RegisterUser } from '../store/userdata'
//import { useRouter } from 'vue-router'

//const router = useRouter()

const defaultTargetTime = '00:20:00'

const user = ref<RegisterUser>({
  username: '',
  email: '',
  password: '',
  right_handed: true,
  target_learning_time: defaultTargetTime,
})
const leftHanded = ref(!user.value.right_handed)

watchEffect(() => {
  leftHanded.value = !user.value.right_handed
})
watchEffect(() => {
  user.value.right_handed = !leftHanded.value
})

const inputFieldValidation = reactive({
  username: false,
  password: false,
  email: false,
})

type inputFieldKey = keyof typeof inputFieldValidation

const errorMessage = reactive([{ message: '', type: '' }])
const userActions = store.userdata.actions
const userMethods = store.userdata.methods

const emit = defineEmits(['openLogin'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('openLogin')
}

const submit = async (): Promise<void> => {
  errorMessage.length = 0
  const submitUser = { ...user.value }
  const result = await userActions.postNewUser(submitUser)
  if (result?.status === 200) {
    userMethods.changeEmail(submitUser.email)
    emit('openLogin')
  } else {
    for (const el in inputFieldValidation) {
      inputFieldValidation[el as inputFieldKey] = false
    }
    for (let i = 0; i < result?.data.length; i++) {
      errorMessage.push({
        message: result?.data[i].message,
        type: result?.data[i].path[0],
      })
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
      <div
        v-for="err in errorMessage"
        :key="err.message"
        class="error-message body-small"
      >
        {{ err.message }}
      </div>
      <form>
        <text-input-field
          v-model="user.username"
          label-name="Benutzername"
          placeholder="MaxMuster"
          element-class="default_input_field input-form-primary"
          :validation-wrong="inputFieldValidation.username"
        />
        <text-input-field
          v-model="user.email"
          label-name="E-Mail-Adresse"
          placeholder="maxmusterman@flai.de"
          element-class="default_input_field input-form-primary"
          :validation-wrong="inputFieldValidation.email"
        />
        <text-input-field
          v-model="user.password"
          label-name="Passwort"
          placeholder="********"
          element-class="default_input_field input-form-primary"
          custom-type="password"
          :validation-wrong="inputFieldValidation.password"
        />
        <text-input-field
          v-model="user.target_learning_time"
          label-name="Tägliches Lernziel"
          :placeholder="defaultTargetTime"
          element-class="default_input_field input-form-primary"
          custom-type="time"
          :time-step="1"
        />
        <div class="toggle-checkbox">
          <p class="body-medium">Händigkeit</p>
          <custom-checkbox
            v-model="leftHanded"
            label-name="Links"
            element-class="primary-checkbox"
            component-class="primary-checkbox body-small"
            checkmark-class="checkmark"
          />
          <custom-checkbox
            v-model="user.right_handed"
            label-name="Rechts"
            element-class="primary-checkbox"
            component-class="primary-checkbox body-small"
            checkmark-class="checkmark"
          />
        </div>
        <div class="button-container">
          <custom-button
            label="Registrieren"
            btnclass="button-form-primary prim_small_button_blue"
            @button-click="submit"
          />
        </div>
      </form>
      <div class="divider-line"></div>
      <div class="bottom-paragraph center-text body-small">
        Du hast ein Konto?
        <span class="link" @click="onclick">Melde dich an</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
