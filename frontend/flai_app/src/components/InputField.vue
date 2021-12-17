<template>
  <div>
    <input
      v-model="newInput"
      type="text"
      placeholder="Placeholder Text"
      @keyup.enter="addInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  name: 'InputField',
  setup() {
    const newInput = ref<string>('')
    const inputData = ref('')

    console.log(inputData)

    function addInput() {
      if (newInput.value !== '') {
        inputData.value = newInput.value
        console.log(inputData)
      }
    }

    return { newInput, inputData, addInput }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
