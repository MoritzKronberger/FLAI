<script setup lang="ts">
import { ref } from 'vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import Register from './RegisterPage.vue'
import LoginPage from './LoginPage.vue'
import BaseHeader from '../components/BaseHeader.vue'

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
  <base-header header-class="main-header">
    <IconLoader
      path="/assets/logos/logo.svg"
      alt="FLAI Icon"
      element-class="flai-logo"
    />
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
  </base-header>

  <body>
    <div class="first-section">
      <div class="main-left">
        <div class="heading-large">Lerne Deutsche Gebärdensprache</div>
        <div class="text body-medium">
          <span class="body-emphasised">FLAI</span> ist die erste
          <span class="body-emphasised">KI-basierte Lernanwendung</span> für
          Deutsche Gebärdensprache, die dich aktiv beim Üben unterstützt und
          sich deinem individuellen Lern-Rhythmus anpasst.
        </div>
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
        <div class="heading-large">Selbstbewusst gebärden</div>
        <div class="text body-medium">
          Neues Wissen souverän anwenden: Mit dem
          <span class="body-emphasised">Echtzeit-Feedback</span> von FLAI
          erhältst du von Anfang an Rückmeldung zu deiner Fingersprache. So
          gewinnst du spielerisch die Sicherheit, die du brauchst, um
          <span class="body-emphasised">selbstbewusst</span> zu gebärden.
        </div>
      </div>
    </div>

    <div class="third-section">
      <div class="main-left">
        <div class="heading-large">Lernlust statt Lernfrust</div>
        <div class="text body-medium">
          Mit FLAIs Levelsystem nach dem
          <span class="body-emphasised">Karteikasten-Prinzip</span> ist
          Langeweile ausgeschlossen. Lerneinheiten und Übungsaufgaben passen
          sich deinem <span class="body-emphasised">Rhythmus</span> an, während
          deine individuelle Lernstatistik alle Fortschritte dokumentiert und
          dich motiviert ans Ziel bringt.
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
          Augsburg. Im Rahmen unseres Projekt-Semester haben wir uns das Ziel
          gesetzt, eine Lernapplikation zu entwickeln, die einem die deutsche
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
