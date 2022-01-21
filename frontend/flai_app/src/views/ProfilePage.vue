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
  target_learning_time: { label: string; value: number }
  right_handed: { label: string; value: boolean }
}
const options = ref<Options>({
  id: { label: 'id', value: '' },
  username: { label: 'Name', value: '' },
  email: { label: 'E-Mail', value: '' },
  password: { label: 'Passwort', value: passwordReplacement },
  target_learning_time: { label: 'Lernzeit', value: 0 },
  right_handed: { label: 'Händigkeit', value: false },
})

const displayForm = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const rightHanded = ref(false)
const leftHanded = ref(false)

const loadCurrentUser = (): void => {
  for (const prop in user) {
    options.value[prop].value = user[prop]
  }
}

const switchHand = (hand: string): void => {
  if (hand === 'rightHand') {
    if (rightHanded.value === false) {
      leftHanded.value = true
      options.value.right_handed.value = false
    } else {
      options.value.right_handed.value = true
      leftHanded.value = false
    }
  } else if (hand === 'leftHand') {
    if (leftHanded.value === false) {
      rightHanded.value = true
      options.value.right_handed.value = true
    } else {
      options.value.right_handed.value = false
      rightHanded.value = false
    }
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
  if (changes.length !== 0) {
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
  } else displayForm.value = false
}
onMounted(() => {
  loadCurrentUser()
  rightHanded.value = options.value.right_handed.value
  leftHanded.value = !rightHanded.value
})
</script>

<template>
  <div class="profile-page">
    <div class="profile body-medium">
      <div class="property">
        <div v-for="(item, key) in options" :key="key">
          <div v-if="key !== 'id'">
            <li class="key">
              {{ item.label }}
            </li>
          </div>
        </div>
      </div>
      <div v-if="!displayForm" class="information">
        <div v-for="(item, key) in options" :key="key">
          <div v-if="key !== 'id' && key !== 'right_handed'">
            <li class="item">
              {{ item.value }}
            </li>
          </div>
          <div v-else-if="key == 'right_handed'">
            <li v-if="item.value == true" class="item">Rechts</li>
            <li v-else-if="item.value == false" class="item">Links</li>
          </div>
        </div>
        <custom-button
          v-if="!displayForm"
          label="Bearbeiten"
          btnclass="prim_small_button_blue"
          @button-click="openChangeForm"
        />
      </div>
      <div v-if="displayForm" class="profile-form-container">
        <form class="form-items">
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
          <text-input-field
            v-model="options.target_learning_time.value"
            placeholder="00:20:00"
            element-class="default_input_field"
            custom-type="time"
            :time-step="1"
          />
          <div class="checkbox-container">
            <custom-checkbox
              v-model="leftHanded"
              label-name="Links"
              element-class="checkbox-primary"
              component-class="primary-checkbox"
              checkmark-class="checkmark"
              @change="switchHand('leftHand')"
            />
            <custom-checkbox
              v-model="rightHanded"
              label-name="Rechts"
              element-class="primary-checkbox"
              component-class="primary-checkbox"
              checkmark-class="checkmark"
              @change="switchHand('rightHand')"
            />
          </div>
        </form>
        <p v-if="successMessage" class="body-small">{{ successMessage }}</p>
        <p v-if="errorMessage" class="body-small">
          {{ errorMessage }}
        </p>
        <custom-button
          label="Bestätigen"
          btnclass="prim_small_button_blue"
          @button-click="submitChanges"
        />
        <custom-button
          label="Verwerfen"
          btnclass="sec_small_button_blue"
          @button-click="discardChanges"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/buttonMixins';
@import '../assets/scss/components/customCheckbox';
</style>
