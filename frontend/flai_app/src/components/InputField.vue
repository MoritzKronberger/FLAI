<template>
  <div>
    <input
      v-model="newInput"
      type="text"
      :placeholder="placeholder"
      @input="$emit('input', inputData)"
      @keyup.enter="addInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  name: 'InputField',

  props: {
    placeholder: { type: String, required: true, default: '' },
  },
  setup() {
    const newInput = ref<string>('')
    const inputData = ref('')

    function addInput() {
      if (newInput.value !== '') {
        inputData.value = newInput.value
        //console.log(inputData)
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
