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
      <br />
      <div class="text body-medium">
        Mithilfe der künstlichen Intelligenz von <span id="orange">FLAI </span>.
        <br />
        Bekomme direktes Feedback über die Kamera-Ausgabe und lerne so effizient
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
      element-class="img-right"
    />
  </div>

  <div class="bg-blue">
    <div class="main-right bottom">
      <div class="heading-large">Durch direktes Feedback</div>
    </div>
  </div>

  <div class="bg-white">
    <div class="main-right">
      <div class="short-text body-medium">
        Mithilfe von Farbe und Symbolik, erfährst du direkt ob du die Gebärde
        richtig machst.
        <br />
        Vergiss hierbei nicht, das zu einer Gebärde auch das richtige Mundbild
        gehört.
        <br />
        Sprich also gerne laut mit wenn du übst.
      </div>
    </div>
    <IconLoader
      path="/assets/landingPage/second.png"
      alt="FLAI man sign language"
      element-class="img-left"
    />
  </div>

  <div id="rect"></div>

  <div id="spacing-one">
    <div class="bg-blue">
      <div class="main-left bottom">
        <div class="heading-large">
          Lernfortschritt wird
          <br />
          automatisch an dein
          <br />
          Tempo angepasst
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white">
    <div class="main-left">
      <div class="text body-medium">
        Wir haben in unserer Software ein
        <span class="body-emphasised">Levelsystem</span> eingebaut das sich an
        deinen Lernfortschritt anpasst. Je öfter eine Gebärde richtig gemacht
        wurde, desto höher ist der
        <span class="body-emphasised">Fortschritt</span> und die Lernmethode
        wird daran angepasst.
        <br />
        So ist das Lernen automatisch an dein Tempo angepasst.
      </div>
    </div>
    <IconLoader
      path="/assets/landingPage/third.png"
      alt="FLAI woman studying"
      element-class="img-right-large"
    />
  </div>

  <div id="spacing-two">
    <div class="bg-blue">
      <div class="main">
        <IconLoader
          path="/assets/logos/logo.svg"
          alt="FLAI Icon"
          element-class="flai-logo"
        />
        <div class="heading-large">FLAI ist ein Studentenprojekt</div>
      </div>
    </div>
  </div>

  <div class="bg-white">
    <div class="main-right">
      <div class="long-text body-medium">
        Das Team FLAI besteht aus 7 Studenten des Studiengangs Interaktive
        Medien der Hochschule Augsburg.
        <br />
        Im Rahmen unseres Projekt-Semester haben wir uns zum Ziel gemacht eine
        Lernapplikation<br />
        zu entwicklen, die einem die deutsche Gebärdensprache beibringen soll.
        <br />
        Dieses Projekt umfasste die Konzeption, Planung und Umsetzung von Design
        und Programmierung.
        <br />
        Mithilfe von Neuralen Netzten haben wir uns darauf konzentriert direktes
        Feedback<br />
        an den Lernenden zu übermitteln um somit
        <span class="body-emphasised">einfacheres</span> und
        <span class="body-emphasised">motivierendes</span> lernen zu
        ermöglichen.
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
