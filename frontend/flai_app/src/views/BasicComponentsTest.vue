<script setup lang="ts">
import { ref } from 'vue'
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'

const testInput = ref('')
const testCheckbox = ref(false)
</script>

<template>
  <div>
    <h1>Buttons</h1>
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
  <main>
    <router-view />
  </main>
</template>
