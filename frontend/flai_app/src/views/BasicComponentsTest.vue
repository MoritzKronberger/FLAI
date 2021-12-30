<script setup lang="ts">
import { ref } from 'vue'
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import iconLoader from '../components/IconLoader.vue'

const testInput = ref('')
const testCheckbox = ref(false)
</script>

<template>
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
</template>
