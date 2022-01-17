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
  <div class="bg-white">
    <div class="main-left">
      <IconLoader
        path="/assets/logos/logo.svg"
        alt="FLAI Icon"
        element-class="flai-logo"
      />
    </div>
  </div>

  <div class="bg-blue">
    <div class="main-left">
      <div class="heading-large">
        Lerne die deutsche Gebärdensprache mit Hilfe von live Feedback
      </div>
      <div class="text body-medium">
        mithilfe der künstlichen Intelligenz von <span id="orange">FLAI </span>.
        <br />
        Bekomme direktes Feedback über die Kameraausgabe und lerne so effizient
        die DGB.
      </div>
    </div>
  </div>

  <div class="bg-white">
    <div class="buttons">
      <div class="login">
        <custom-button
          label="Login"
          btnclass="sec_medium_button_blue"
          @button-click="showLogin = true"
        />
      </div>
      <div v-show="showLogin" class="modal" @click="showLogin = false">
        <LoginPage @open-register="openModalRegister" @click.stop />
      </div>
      <div class="register">
        <custom-button
          label="Registrieren"
          btnclass="prim_medium_button_blue"
          @button-click="showRegister = true"
        />
      </div>
      <div v-show="showRegister" class="modal" @click="showRegister = false">
        <Register @open-login="openModalLogin" @click.stop />
      </div>
    </div>
    <IconLoader
      path="/assets/landingPage/one.png"
      alt="FLAI woman sign language"
      element-class="img"
    />
  </div>
  <div class="bg-blue">
    <div class="main-right">
      <div class="heading-large">Durch direktes Feedback</div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
