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
  <header id="stick">
    <div class="header-left">
      <IconLoader
        path="/assets/logos/logo.svg"
        alt="FLAI Icon"
        element-class="flai-logo-1"
      />
    </div>
    <div id="buttons">
      <div class="login">
        <custom-button
          label="Login"
          btnclass="sec_large_button_blue"
          @button-click="showLogin = true"
        />
      </div>
      <div v-show="showLogin" class="modal" @click="showLogin = false">
        <LoginPage @open-register="openModalRegister" @click.stop />
      </div>
      <div class="register">
        <custom-button
          label="Registrieren"
          btnclass="prim_large_button_blue"
          @button-click="showRegister = true"
        />
      </div>
      <div v-show="showRegister" class="modal" @click="showRegister = false">
        <Register @open-login="openModalLogin" @click.stop />
      </div>
    </div>
  </header>

  <body>
    <div class="first-section">
      <div class="main-left">
        <div class="heading-large">Lerne die deutsche Gebärdensprache</div>
        <div class="text body-medium">
          Nutze die künstlichen Intelligenz von <span id="blue">FLAI </span>
          und bekomme direktes Feedback über die Kameraausgabe. Lerne so
          effizient und selbstbewusst die deutsche Gebärdensprache.
        </div>
        <a class="prim_large_button_blue skip-to" href="#skip">Mehr erfahren</a>
      </div>
      <div class="main-right">
        <IconLoader
          path="/assets/landingPage/first.png"
          alt="FLAI woman sign language"
          element-class="img"
        />
      </div>
    </div>

    <div class="second-section">
      <div class="main-left">
        <div id="skip"></div>
        <IconLoader
          path="/assets/landingPage/second.png"
          alt="FLAI woman sign language"
          element-class="img"
        />
      </div>
      <div class="main-right">
        <div class="heading-large">Selbstbewusst durch direktes Feedback</div>
        <div class="text body-medium">
          Mithilfe von Farbe und Symbolik, erfährst du direkt ob du die Gebärde
          richtig machst. Vergiss hierbei nicht, das zu einer Gebärde auch das
          richtige Mundbild gehört. Sprich also gerne laut mit wenn du übst.
        </div>
      </div>
    </div>

    <div class="third-section">
      <div class="main-left">
        <div class="heading-large">Automatisches Lerntempo</div>
        <div class="text body-medium">
          Wir haben in unserer Software ein
          <span class="body-emphasised">Levelsystem</span> eingebaut das sich an
          deinen Lernfortschritt anpasst. Je öfter eine Gebärde richtig gemacht
          wurde, desto höher ist der
          <span class="body-emphasised">Fortschritt</span> und die Lernmethode
          wird daran angepasst. So ist das Lernen automatisch an dein Tempo
          angepasst.
        </div>
      </div>
      <div class="main-right">
        <IconLoader
          path="/assets/landingPage/third.png"
          alt="FLAI woman sign language"
          element-class="img"
        />
      </div>
    </div>

    <div class="end-section">
      <div class="main-left">
        <IconLoader
          path="/assets/landingPage/second.png"
          alt="FLAI woman sign language"
          element-class="img"
        />
      </div>
      <div class="main-right">
        <div class="heading-large">FLAI ist ein Studentenprojekt</div>
        <div class="text body-medium">
          Das Team FLAI besteht aus 7 Studenten des Studiengangs
          <span class="body-emphasised">Interaktive Medien</span> der Hochschule
          Augsburg. Im Rahmen unseres Projekt-Semester haben wir uns zum Ziel
          gemacht eine Lernapplikation zu entwickeln, die einem die deutsche
          Gebärdensprache beibringen soll. Dieses Projekt umfasste die
          Konzeption, Planung und Umsetzung von Design und Programmierung.
          Mithilfe von Neuralen Netzen haben wir uns darauf konzentriert,
          direktes Feedback an den Lernenden zu übermitteln um somit
          <span class="body-emphasised">einfacheres</span> und
          <span class="body-emphasised">motivierendes</span> lernen zu
          ermöglichen.
        </div>
      </div>
    </div>
  </body>

  <hr id="line" />
  <footer id="footer">
    <a href="">Kontakt</a>
    <a href="https://www.hs-augsburg.de/Service/Impressum.html">Impressum</a>
    <span>© Hochschule Augsburg</span>
  </footer>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
