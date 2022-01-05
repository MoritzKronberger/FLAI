<script setup lang="ts">
import { onMounted, ref } from 'vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'
import store from '../store'

const actions = store.userdata.actions
const user = store.userdata.user

interface Options {
  [key: string]: string | number | undefined | boolean
  email?: { label: string; value: string }
  username?: { label: string; value: string }
  password?: { label: string; value: string }
  right_handed?: { label: string; value: boolean }
  target_learning_time?: { label: string; value: number }
}

const options = ref<Options>({
  id: { label: 'id', value: '' },
  email: { label: 'E-Mail', value: '' },
  username: { label: 'Name', value: '' },
  password: { label: 'Passwort', value: '***' },
  right_handed: { label: 'Haendigkeit', value: true },
  target_learning_time: { label: 'Lernzeit', value: 0 },
})

const displayForm = ref('nodisplay')
const errorMessage = ref('')
const successMessage = ref('')
onMounted(() => {
  for (const prop in user) {
    options.value[prop].value = user[prop]
  }
})

const onChange = (): void => {
  displayForm.value = 'display'
  successMessage.value = ''
  errorMessage.value = ''
}
const submitChanges = async (): void => {
  const changes: Options = {}
  for (const prop in options.value) {
    if (user[prop] !== options.value[prop].value) {
      if (prop !== 'password' || options.value[prop].value !== '***')
        changes[prop] = options.value[prop].value
    }
  }
  const result = await actions.patchValues(changes)
  if (result?.status === 200) {
    successMessage.value = 'Profile changed successfully'
  } else {
    errorMessage.value = result?.data.message
    for (const prop in user) {
      options.value[prop].value = user[prop]
    }
  }
}
</script>

<template>
  <h1>Profile</h1>
  <h2>User information</h2>
  <div class="profile">
    <div class="information">
      <ul v-for="(item, key) in options" :key="key">
        <li v-if="key !== 'id'">{{ item.label }} : {{ item.value }}</li>
      </ul>
    </div>
    <form :class="displayForm">
      <text-input-field
        v-model="options.email.value"
        placeholder="x.y@email.com"
        element-class="email"
        component-class="input"
      />
      <text-input-field
        v-model="options.username.value"
        placeholder="username"
        element-class="input-primary"
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
        placeholder="15"
        element-class="input-primary"
        component-class="input"
      />
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <input type="button" value="Submit Changes" @click="submitChanges" />
    </form>
  </div>
  <input type="button" value="Change Profile" @click="onChange" />
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
