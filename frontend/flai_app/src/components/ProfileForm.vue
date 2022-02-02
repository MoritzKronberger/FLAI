<template>
  <validated-form
    :error-message="errorMessage"
    :submit-name="submitName"
    @submit="onclick"
  >
    <template #inputs>
      <text-input-field
        v-model="user.username"
        label-name="Benutzername"
        placeholder="MaxMuster"
        :component-class="componentClass"
        element-class="default_input_field input-form-primary"
        :validation-wrong="inputFieldValidation.username"
        :disabled="disabledForm"
      />
      <text-input-field
        v-model="user.email"
        label-name="E-Mail-Adresse"
        placeholder="maxmusterman@flai.de"
        :component-class="componentClass"
        element-class="default_input_field input-form-primary"
        :validation-wrong="inputFieldValidation.email"
        :disabled="disabledForm"
      />
      <text-input-field
        v-model="user.password"
        label-name="Passwort"
        placeholder="********"
        :component-class="componentClass"
        element-class="default_input_field input-form-primary"
        custom-type="password"
        :validation-wrong="inputFieldValidation.password"
        :disabled="disabledForm"
      />
      <text-input-field
        v-model="user.target_learning_time"
        label-name="Tägliches Lernziel"
        :placeholder="defaultTargetTime"
        :component-class="componentClass"
        element-class="default_input_field input-form-primary"
        custom-type="time"
        :time-step="1"
        :disabled="disabledForm"
      />
      <div class="toggle-checkbox">
        <p class="body-medium">Händigkeit</p>
        <div class="box">
          <custom-checkbox
            v-model="leftHanded"
            label-name="Links"
            element-class="primary-checkbox"
            component-class="primary-checkbox body-small"
            checkmark-class="checkmark"
            :disabled="disabledForm"
          />
          <custom-checkbox
            v-model="user.right_handed"
            label-name="Rechts"
            element-class="primary-checkbox"
            component-class="primary-checkbox body-small"
            checkmark-class="checkmark"
            :disabled="disabledForm"
          />
        </div>
      </div>
    </template>
    <template #additional-buttons>
      <slot></slot>
    </template>
  </validated-form>
</template>

<script setup lang="ts">
import textInputField from './TextInputField.vue'
import customCheckbox from './CustomCheckbox.vue'
import ValidatedForm from './ValidatedForm.vue'
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
  submitName: string
  disabledForm: boolean
  userInfo?: RegisterUser
  componentClass?: string
}>()

const { errorMessage, inputFieldValidation, userInfo, componentClass } =
  toRefs(props)

const defaultTargetTime = '00:20:00'

/*eslint-disable */
const user = userInfo?.value
  ? ref(userInfo?.value)
  : ref({
      username: '',
      email: '',
      password: '',
      right_handed: true,
      target_learning_time: defaultTargetTime,
    })
/*eslint-enable */
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
