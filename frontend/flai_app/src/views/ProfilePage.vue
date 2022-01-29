<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import customButton from '../components/CustomButton.vue'
import store from '../store'
import Form from '../components/Form.vue'
import { Changes, RegisterUser } from '../store/userdata'

const actions = store.userdata.actions
const user = store.userdata.user

const passwordReplacement = ''

const options = ref<RegisterUser>({
  username: '',
  email: '',
  password: passwordReplacement,
  target_learning_time: '',
  right_handed: false,
})

const displayForm = ref(false)
const errorMessage = ref<string[]>([])

const inputFieldValidation = reactive({
  username: false,
  email: false,
  password: false,
})

type inputFieldKey = keyof typeof inputFieldValidation

const getUserInformation = (): void => {
  for (const prop in user) {
    options.value[prop] = user[prop]
  }
}

const discardChanges = (): void => {
  getUserInformation()
  displayForm.value = false
  errorMessage.value = []
  for (const el in inputFieldValidation) {
    inputFieldValidation[el as inputFieldKey] = false
  }
}

const openEditForm = (): void => {
  displayForm.value = true
  errorMessage.value = []
}
const submitChanges = async (): Promise<void> => {
  const changes: Changes = {}
  for (const prop in options.value) {
    if (user[prop] !== options.value[prop]) {
      if (prop !== 'password' || options.value[prop] !== passwordReplacement)
        changes[prop] = options.value[prop]
    }
  }
  if (changes.length !== 0) {
    const result = await actions.patchValues(changes)
    if (result?.status === 200) {
      options.value['password'] = passwordReplacement
      displayForm.value = false
    } else {
      errorMessage.value = []
      for (const el in inputFieldValidation) {
        inputFieldValidation[el as inputFieldKey] = false
      }
      for (let i = 0; i < result?.data.length; i++) {
        errorMessage.value.push(result?.data[i].message)
        inputFieldValidation[result?.data[i].path[0] as inputFieldKey] = true
      }
      options.value['password'] = passwordReplacement
    }
  } else displayForm.value = false
}
onMounted(() => {
  getUserInformation()
})
</script>
<template>
  <div class="profile-page">
    <div class="profile">
      <div v-if="!displayForm" class="form-items">
        <Form
          :error-message="errorMessage"
          :input-field-validation="inputFieldValidation"
          :disabled-form="true"
          submit-name="Bearbeiten"
          :user-info="options"
          component-class="custom-profile-input"
          @submit="openEditForm"
        ></Form>
      </div>
      <div v-if="displayForm" class="form-items">
        <Form
          :error-message="errorMessage"
          :input-field-validation="inputFieldValidation"
          :disabled-form="false"
          submit-name="Bestätigen"
          :user-info="options"
          component-class="custom-profile-input"
          @submit="submitChanges"
        >
          <custom-button
            label="Verwerfen"
            btnclass="sec_small_button_blue"
            @button-click="discardChanges"
        /></Form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/abstracts/buttonMixins';
@import '../assets/scss/abstracts/mixins';
@import '../assets/scss/components/customCheckbox';
</style>
