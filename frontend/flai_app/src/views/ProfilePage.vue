<script setup lang="ts">
import { onMounted, ref } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'
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
    <h2>Profil</h2>
    <div class="profile">
      <div class="information">
        <div v-for="(item, key) in options" :key="key">
          <div v-if="key !== 'id'" class="flex">
            <li class="title">{{ item.label }}</li>
            <li>{{ !displayForm ? item.value : '' }}</li>
          </div>
        </div>
        <input
          v-if="!displayForm"
          type="button"
          value="Profil ändern"
          @click="openChangeForm"
        />
      </div>
      <form v-if="displayForm">
        <text-input-field
          v-model="options.username.value"
          placeholder="username"
          element-class="input-form-primary"
          component-class="input"
        />
        <text-input-field
          v-model="options.email.value"
          placeholder="x.y@email.com"
          element-class="email"
          component-class="input"
        />
        <text-input-field
          v-model="options.password.value"
          placeholder="passwort"
          element-class="input-primary"
          component-class="input"
          custom-type="password"
        />
        <custom-checkbox
          v-model="options.right_handed.value"
          element-class="checkbox-primary"
          component-class="input"
        />
        <text-input-field
          v-model="options.target_learning_time.value"
          placeholder="00:20:00"
          element-class="input-primary"
          component-class="input"
          custom-type="time"
          :time-step="1"
        />
        <p v-if="successMessage">{{ successMessage }}</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <input type="button" value="Bestätigen" @click="submitChanges" />
        <input type="button" value="Verwerfen" @click="discardChanges" />
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
