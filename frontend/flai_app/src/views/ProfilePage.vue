<script setup lang="ts">
import { onMounted, ref } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import store from '../store'
import { Changes } from '../store/userdata'

const actions = store.userdata.actions
const user = store.userdata.user

const passwordReplacement = '*****'

interface Options {
  [key: string]:
    | { label: string; value: string }
    | { label: string; value: boolean }
    | { label: string; value: number }
    | { label: string; value: undefined }
  username: { label: string; value: string }
  email: { label: string; value: string }
  password: { label: string; value: string }
  right_handed: { label: string; value: boolean }
  target_learning_time: { label: string; value: number }
}

const options = ref<Options>({
  id: { label: 'id', value: '' },
  username: { label: 'Name', value: '' },
  email: { label: 'E-Mail', value: '' },
  password: { label: 'Passwort', value: passwordReplacement },
  right_handed: { label: 'Rechtshänder', value: true },
  target_learning_time: { label: 'Lernzeit', value: 0 },
})

const displayForm = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loadCurrentUser = (): void => {
  for (const prop in user) {
    options.value[prop].value = user[prop]
  }
}

const discardChanges = (): void => {
  loadCurrentUser()
  displayForm.value = false
}

const openChangeForm = (): void => {
  displayForm.value = true
  successMessage.value = ''
  errorMessage.value = ''
}
const submitChanges = async (): Promise<void> => {
  const changes: Changes = {}
  for (const prop in options.value) {
    if (user[prop] !== options.value[prop].value) {
      if (
        prop !== 'password' ||
        options.value[prop].value !== passwordReplacement
      )
        changes[prop] = options.value[prop].value
    }
  }
  const result = await actions.patchValues(changes)
  if (result?.status === 200) {
    successMessage.value = 'Profil wurde erfolgreich geändert'
    options.value['password'].value = passwordReplacement
    displayForm.value = false
  } else {
    errorMessage.value = result?.data.message
    loadCurrentUser()
    options.value['password'].value = passwordReplacement
  }
}
onMounted(() => {
  loadCurrentUser()
})
</script>

<template>
  <div class="profile-page">
    <div class="profile">
      <div class="information">
        <div v-for="(item, key) in options" :key="key">
          <div v-if="key !== 'id'" class="flex">
            <li class="body-medium">
              {{ item.label }}
            </li>
            <li v-if="!displayForm" class="item">
              {{ item.value }}
            </li>
          </div>
        </div>
      </div>
      <div v-if="displayForm" class="profile-form-container">
        <p v-if="successMessage" class="body-small">{{ successMessage }}</p>
        <p v-if="errorMessage" class="body-small">{{ errorMessage }}</p>
        <div class="form-items">
          <form>
            <text-input-field
              v-model="options.username.value"
              placeholder="username"
              element-class="default_input_field"
            />
            <text-input-field
              v-model="options.email.value"
              placeholder="x.y@email.com"
              element-class="default_input_field"
            />
            <text-input-field
              v-model="options.password.value"
              placeholder="passwort"
              element-class="default_input_field"
              custom-type="password"
            />
            <custom-checkbox
              v-model="options.right_handed.value"
              element-class="checkbox-primary"
              component-class=""
              checkmark-class="checkmark"
            />
            <text-input-field
              v-model="options.target_learning_time.value"
              placeholder="00:20:00"
              element-class="default_input_field"
              custom-type="time"
              :time-step="1"
            />
          </form>
        </div>
        <custom-button
          label="Bestätigen"
          btnclass="prim_small_button_blue"
          @button-click="submitChanges"
        />
        <custom-button
          label="Verwerfen"
          btnclass="prim_small_button_orange"
          @button-click="discardChanges"
        />
      </div>
      <custom-button
        v-if="!displayForm"
        label="Bearbeiten"
        btnclass="prim_small_button_blue"
        @button-click="openChangeForm"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/buttonMixins';
</style>
