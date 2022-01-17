<script setup lang="ts">
import { ref } from 'vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import Register from './RegisterPage.vue'
import LoginPage from './LoginPage.vue'

const showRegister = ref(false)
const showLogin = ref(false)

function openModalLogin() {
  showLogin.value = true
  showRegister.value = false
}

function openModalRegister() {
  showLogin.value = false
  showRegister.value = true
}
</script>

<template>
  <div class="main">
    <div class="heading-large">Wilkommen bei FLAI!</div>
    <div class="heading-medium">
      Lerne mithilfe unserer AI die Grundlagen deutscher Gebärdensprache.
    </div>
    <div class="register">
      <custom-button
        label="Konto erstellen"
        btnclass="prim_small_button_blue"
        @button-click="showRegister = true"
      />
    </div>
    <div v-show="showRegister" class="modal" @click="showRegister = false">
      <Register @open-login="openModalLogin" @click.stop />
    </div>
    <div class="login">
      Du hast bereits ein Konto?
      <span id="login" @click="showLogin = true">Login</span>
    </div>
    <div v-show="showLogin" class="modal" @click="showLogin = false">
      <LoginPage @open-register="openModalRegister" @click.stop />
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/startpanel';

#login {
  cursor: pointer;
  color: $main-blue;
}
</style>
