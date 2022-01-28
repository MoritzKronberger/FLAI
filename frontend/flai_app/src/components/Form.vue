<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import customButton from '../components/CustomButton.vue'
import { ref, watchEffect, toRefs } from 'vue'
import { RegisterUser } from '../store/userdata'

interface InputFieldValidation {
  username: boolean
  password: boolean
  email: boolean
}

const props = defineProps<{
  errorMessage: string[]
  inputFieldValidation: InputFieldValidation
  submitType: string
  diabledForm: boolean
  userInfo?: RegisterUser
}>()

const { errorMessage, inputFieldValidation, userInfo } = toRefs(props)

const defaultTargetTime = '00:20:00'

const user = userInfo?.value
  ? ref(userInfo?.value)
  : ref({
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

const emit = defineEmits(['submit'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('submit', user.value)
}
</script>

<template>
  <div v-for="err in errorMessage" :key="err" class="error-message body-small">
    {{ err }}
  </div>
  <form>
    <text-input-field
      v-model="user.username"
      label-name="Benutzername"
      placeholder="MaxMuster"
      element-class="default_input_field input-form-primary"
      :validation-wrong="inputFieldValidation.username"
      :disabled="diabledForm"
    />
    <text-input-field
      v-model="user.email"
      label-name="E-Mail-Adresse"
      placeholder="maxmusterman@flai.de"
      element-class="default_input_field input-form-primary"
      :validation-wrong="inputFieldValidation.email"
      :disabled="diabledForm"
    />
    <text-input-field
      v-model="user.password"
      label-name="Passwort"
      placeholder="********"
      element-class="default_input_field input-form-primary"
      custom-type="password"
      :validation-wrong="inputFieldValidation.password"
      :disabled="diabledForm"
    />
    <text-input-field
      v-model="user.target_learning_time"
      label-name="Tägliches Lernziel"
      :placeholder="defaultTargetTime"
      element-class="default_input_field input-form-primary"
      custom-type="time"
      :time-step="1"
      :disabled="diabledForm"
    />
    <div class="toggle-checkbox">
      <p class="body-medium">Händigkeit</p>
      <custom-checkbox
        v-model="leftHanded"
        label-name="Links"
        element-class="primary-checkbox"
        component-class="primary-checkbox body-small"
        checkmark-class="checkmark"
        :disabled="diabledForm"
      />
      <custom-checkbox
        v-model="user.right_handed"
        label-name="Rechts"
        element-class="primary-checkbox"
        component-class="primary-checkbox body-small"
        checkmark-class="checkmark"
        :disabled="diabledForm"
      />
    </div>
    <div class="button-container">
      <custom-button
        :label="submitType"
        btnclass="prim_small_button_blue"
        @button-click="onclick"
      />
      <slot></slot>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
