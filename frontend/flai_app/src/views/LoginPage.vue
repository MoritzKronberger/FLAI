<script setup lang="ts">
import textInputField from '../components/TextInputField.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { computed, onMounted, ref } from 'vue'
import { LoginUser } from '../store/authdata'
import store from '../store'
import { useRouter } from 'vue-router'

const router = useRouter()

const userActions = store.userdata.actions
const authActions = store.authdata.actions
const userData = computed(() => store.userdata.user)

const user = ref<LoginUser>({
  email: '',
  password: '',
})

const errorMessage = ref('')

onMounted(() => {
  user.value.email = userData.value.email
})

const submit = async (): Promise<void> => {
  const submitUser = { ...user.value }
  const result = await authActions.loginUser(submitUser)
  if (result?.status === 200) {
    await userActions.getUser()
    router.push({ name: 'HomePage' })
  } else {
    errorMessage.value = result?.data.message
  }
}

const emit = defineEmits(['openRegister'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('openRegister')
}
</script>

<template>
  <div class="login-form-container">
    <div class="form-item">
      <IconLoader
        path="/assets/logos/logo.svg"
        alt="FLAI Icon"
        element-class="flai-logo"
      />
      <br />
      <div class="error-message body-normal">{{ errorMessage }}</div>
      <form>
        <text-input-field
          v-model="user.email"
          label-name="E-Mail-Adresse"
          placeholder="E-Mail-Adresse"
          element-class="default_input_field input-form-primary"
        />
        <text-input-field
          v-model="user.password"
          label-name="Passwort"
          placeholder="Passwort"
          element-class="default_input_field input-form-primary"
          custom-type="password"
        />
        <custom-button
          label="Login"
          btnclass="button-form-primary prim_small_button_blue"
          @button-click="submit"
        />
      </form>
      <div class="divider-line"></div>
      <div class="bottom-paragraph center-text body-small">
        Du hast noch keinen Account?
        <span id="registrieren" @click="onclick">Registrieren</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';

.body-small {
  font-size: $font-size-base * 0.75;
  @include font(GothamSSm, medium);
  color: $dark-grey;
  line-height: 1.7;
}

#registrieren {
  cursor: pointer;
  color: $main-blue;
}

.flai-logo {
  width: 60%;
  margin-bottom: 16px;
}
</style>
