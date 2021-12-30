<script setup lang="ts">
import { ref } from 'vue'
import textInputField from '../components/TextInputField.vue'

const testInput = ref('')
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
  <main>
    <router-view />
  </main>
</template>
