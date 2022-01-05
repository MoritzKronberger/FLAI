<script setup lang="ts">
import { ref } from 'vue'
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import iconLoader from '../components/IconLoader.vue'
import webcam from '../components/Webcam.vue'
import customButton from '../components/CustomButton.vue'

const testInput = ref('')
const testCheckbox = ref(false)
const clickCount = ref(0)

const logWebcamFeed = (webcamFeed: object): void => {
  console.log(webcamFeed)
}
const buttonClick = (): void => {
  clickCount.value++
}
</script>

<template>
  <div>
    <h1>Buttons</h1>
    <custom-button
      label="Test Button"
      btnclass="prmBlue"
      @button-click="buttonClick"
    />
    <div>Test Button click count is: {{ clickCount }}</div>
  </div>
  <br />
  <div>
    <h1>Input Fields</h1>
    <text-input-field
      v-model="testInput"
      label-name="Test Input"
      placeholder="your test input"
      element-class="input-primary"
    />
    <div>Test Input is: {{ testInput }}</div>
  </div>
  <br />
  <div>
    <h1>Checkboxes</h1>
    <custom-checkbox
      v-model="testCheckbox"
      label-name="Test Checkbox"
      element-class="checkbox-primary"
    />
    <div>Test Checkbox is: {{ testCheckbox }}</div>
  </div>
  <br />
  <div>
    <h1>Icons</h1>
    <icon-loader
      path="../assets/signs/pic/front/a_pic_front"
      mimetype="webp"
      alt="This is the icon's alt description"
      element-class="icon-large"
    />
  </div>
  <div>
    <h1>Webcam</h1>
    <webcam @webcam-ready="logWebcamFeed" />
  </div>
</template>
