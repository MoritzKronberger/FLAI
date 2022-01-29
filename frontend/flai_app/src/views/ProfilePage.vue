<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import customButton from '../components/CustomButton.vue'
import store from '../store'
import ProfileForm from '../components/ProfileForm.vue'
import { Changes, RegisterUser } from '../store/userdata'
import { profileValidation } from '../ressources/ts/validation'

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
  password: false,
  email: false,
})

const getUserInformation = (): void => {
  for (const prop in user) {
    options.value[prop] = user[prop]
  }
}

const discardChanges = (): void => {
  getUserInformation()
  displayForm.value = false
  errorMessage.value = []
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
    profileValidation(result, errorMessage, inputFieldValidation, () => {
      options.value['password'] = passwordReplacement
      displayForm.value = false
    })
    // TODO: needed?
    //options.value['password'] = passwordReplacement
  } else displayForm.value = false
}
onMounted(() => {
  getUserInformation()
})
</script>
<template>
  <div class="profile-page">
    <div class="profile body-medium">
      <div v-if="!displayForm" class="information">
        <div id="edit-button">
          <ProfileForm
            :error-message="errorMessage"
            :input-field-validation="inputFieldValidation"
            :disabled-form="true"
            submit-name="Bearbeiten"
            :user-info="options"
            @submit="openEditForm"
          ></ProfileForm>
        </div>
      </div>
      <div v-if="displayForm" class="profile-form-container">
        <ProfileForm
          :error-message="errorMessage"
          :input-field-validation="inputFieldValidation"
          :disabled-form="false"
          submit-name="Bestätigen"
          :user-info="options"
          @submit="submitChanges"
        >
          <custom-button
            label="Verwerfen"
            btnclass="sec_small_button_blue"
            @button-click="discardChanges"
        /></ProfileForm>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/abstracts/buttonMixins';
@import '../assets/scss/components/customCheckbox';
</style>
