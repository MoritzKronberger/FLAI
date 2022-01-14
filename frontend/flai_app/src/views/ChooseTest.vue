<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import customButton from '../components/CustomButton.vue'
import store from '../store'

enum SelectedTest {
  TestOne = 'Test 1',
  TestTwo = 'Test 2',
}

const router = useRouter()
const currentTest = ref<SelectedTest>()
const startButton = ref()
const errorMessage = ref<string>()

const selectTestOne = (): void => {
  store.flainetdata.methods.changeResultBufferSize(10)
  store.flainetdata.methods.changeNewInputTimeout(1500)
  store.exercisedata.methods.changeCurrentWords(0)
  currentTest.value = SelectedTest.TestOne
  errorMessage.value = undefined
}

const selectTestTwo = (): void => {
  store.flainetdata.methods.changeResultBufferSize(30)
  store.flainetdata.methods.changeNewInputTimeout(3500)
  store.exercisedata.methods.changeCurrentWords(0)
  currentTest.value = SelectedTest.TestTwo
  errorMessage.value = undefined
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
  <div class="choose-test-container">
    <h1 class="heading-large">
      {{ currentTest ? currentTest : 'Kein Test gewählt' }}
    </h1>
    <p class="error-message body-medium">{{ errorMessage }}</p>
    <div class="choose-test-buttons">
      <custom-button
        label="Test 1"
        :btnclass="
          currentTest === SelectedTest.TestOne
            ? 'selected-button'
            : 'not-selected-button'
        "
        @button-click="selectTestOne"
      />
      <custom-button
        label="Test 2"
        :btnclass="
          currentTest === SelectedTest.TestTwo
            ? 'selected-button'
            : 'not-selected-button'
        "
        @button-click="selectTestTwo"
      />
    </div>
    <custom-button
      ref="startButton"
      label="Start Test"
      :btnclass="currentTest ? 'selected-button' : 'to-home-button'"
      @button-click="startTest"
    />
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/_buttonMixins.scss';

.to-home-button {
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

.choose-test-buttons {
  margin-bottom: $gutter-vertical;
}

.error-message {
  color: $main-red;
  margin-bottom: $gutter-vertical;
}
</style>
