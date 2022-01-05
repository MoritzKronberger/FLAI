<script setup lang="ts">
import { onMounted, ref } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'
import store from '../store'
import { Changes } from '../store/userdata'

const actions = store.userdata.actions
const user = store.userdata.user

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
  password: { label: 'Passwort', value: '*****' },
  right_handed: { label: 'Rechtshänder', value: true },
  target_learning_time: { label: 'Lernzeit', value: 0 },
})

const displayForm = ref('nodisplay')
const errorMessage = ref('')
const successMessage = ref('')

const loadCurrentUser = (): void => {
  for (const prop in user) {
    options.value[prop].value = user[prop]
  }
}

const discardChanges = (): void => {
  loadCurrentUser()
  displayForm.value = 'nodisplay'
}

const openChangeForm = (): void => {
  displayForm.value = 'display'
  successMessage.value = ''
  errorMessage.value = ''
}
const submitChanges = async (): Promise<void> => {
  const changes: Changes = {}
  for (const prop in options.value) {
    if (user[prop] !== options.value[prop].value) {
      if (prop !== 'password' || options.value[prop].value !== '*****')
        changes[prop] = options.value[prop].value
    }
  }
  const result = await actions.patchValues(changes)
  if (result?.status === 200) {
    successMessage.value = 'Profil wurde erfolgreich geändert'
    displayForm.value = 'nodisplay'
  } else {
    errorMessage.value = result?.data.message
    loadCurrentUser()
    options.value['password'].value = '*****'
  }
}
onMounted(() => {
  loadCurrentUser()
})
</script>

<template>
  <h1>Profil</h1>
  <div class="profile">
    <div class="information">
      <ul v-for="(item, key) in options" :key="key">
        <li v-if="key !== 'id'">{{ item.label }}: {{ item.value }}</li>
      </ul>
    </div>
    <form :class="displayForm">
      <text-input-field
        v-model="options.username.value"
        placeholder="username"
        element-class="input-primary"
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
  <input type="button" value="Profil ändern" @click="openChangeForm" />
</template>

<style scoped lang="scss">
.profile {
  display: flex;
  .information {
    margin-right: 100px;
  }
  ul li {
    margin-bottom: 10px;
  }
}
.nodisplay {
  display: none;
}
.display {
  display: block;
}
</style>
