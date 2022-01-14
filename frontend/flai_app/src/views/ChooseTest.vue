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
const testReady = ref(false)

const selectTestOne = (): void => {
  store.flainetdata.methods.changeResultBufferSize(10)
  store.flainetdata.methods.changeNewInputTimeout(1500)
  currentTest.value = SelectedTest.TestOne
  testReady.value = true
}

const selectTestTwo = (): void => {
  store.flainetdata.methods.changeResultBufferSize(30)
  store.flainetdata.methods.changeNewInputTimeout(3500)
  currentTest.value = SelectedTest.TestTwo
  testReady.value = true
}

const startTest = (): void => {
  router.push({ name: 'HomePage' })
}
</script>

<template>
  <h1>{{ currentTest ? currentTest : 'Kein Test gewählt' }}</h1>
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
  <custom-button
    ref="startButton"
    label="Start Test"
    :btnclass="testReady ? 'selected-button' : 'to-home-button'"
    @button-click="startTest"
  />
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
</style>
