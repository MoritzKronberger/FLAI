<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import customButton from '../components/CustomButton.vue'
import store from '../store'
import { SelectedTest } from '../store/uxtestdata'

const router = useRouter()
const currentTest = ref<SelectedTest>()
const errorMessage = ref<string>()
const roundsComplete = computed(() => store.uxtestdata.uxTest.roundsComplete)
const maxRounds = computed(() => store.uxtestdata.uxTest.testRounds)
const firstTest = computed(() => store.uxtestdata.uxTest.firstTest)

const selectTestOne = (): void => {
  store.flainetdata.methods.changeResultBufferSize(10)
  store.flainetdata.methods.changeNewInputTimeout(1500)
  store.uxtestdata.methods.changeCurrentWords(0)
  if (!firstTest.value)
    store.uxtestdata.methods.changeFirstTest(SelectedTest.TestOne)
  currentTest.value = SelectedTest.TestOne
  errorMessage.value = undefined
}

const selectTestTwo = (): void => {
  store.flainetdata.methods.changeResultBufferSize(30)
  store.flainetdata.methods.changeNewInputTimeout(3500)
  store.uxtestdata.methods.changeCurrentWords(0)
  currentTest.value = SelectedTest.TestTwo
  if (!firstTest.value)
    store.uxtestdata.methods.changeFirstTest(SelectedTest.TestTwo)
  errorMessage.value = undefined
}

const getTestButtonClass = (test: SelectedTest): string => {
  if (test === currentTest.value) {
    return 'selected-button'
  } else if (test === firstTest.value) {
    return 'inactive-button'
  }
  return 'not-selected-button'
}

const startTest = (): void => {
  if (currentTest.value) {
    router.push({ name: 'HomePage' })
  } else {
    errorMessage.value = 'Kein Test gewählt'
  }
}
</script>

<template>
  <div class="main-container">
    <div v-if="roundsComplete !== maxRounds" class="choose-test-container">
      <h1 class="heading-large">
        {{ currentTest ? currentTest : 'Kein Test gewählt' }}
      </h1>
      <p class="error-message body-medium">{{ errorMessage }}</p>
      <div class="choose-test-buttons">
        <custom-button
          label="Test 1"
          :btnclass="getTestButtonClass(SelectedTest.TestOne)"
          @button-click="selectTestOne"
        />
        <custom-button
          label="Test 2"
          :btnclass="getTestButtonClass(SelectedTest.TestTwo)"
          @button-click="selectTestTwo"
        />
      </div>
      <custom-button
        class="start-button"
        label="Start Test"
        :btnclass="currentTest ? 'selected-button' : 'inactive-button'"
        @button-click="startTest"
      />
      <p>Durchgang {{ roundsComplete + 1 }}/{{ maxRounds }}</p>
    </div>
    <div v-else class="choose-test-container">
      <h1>Danke fürs Testen!</h1>
      <p>
        Hier geht's zum
        <a href="https://forms.gle/ZT2gqc5LPSzSVN189">Fragebogen</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/_buttonMixins.scss';

.inactive-button {
  @include import-button(
    $button-Prim-width-Small,
    $button-Prim-height-Small,
    $font-size-Small,
    $main-white,
    $light-grey,
    $light-grey
  );
}

.selected-button {
  @include import-button(
    $button-Sec-width-Small,
    $button-Prim-height-Small,
    $font-size-Small,
    $main-white,
    $main-blue,
    $main-blue
  );
}

.not-selected-button {
  @include import-button(
    $button-Prim-width-Small,
    $button-Sec-height-Small,
    $font-size-Small,
    $main-blue,
    $main-white,
    $main-blue
  );
}

.choose-test-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

h1 {
  margin-bottom: $gutter-vertical * 1.2;
}

.choose-test-buttons,
.start-button {
  margin-bottom: $gutter-vertical;
}

.error-message {
  color: $main-red;
  margin-bottom: $gutter-vertical;
}
</style>
