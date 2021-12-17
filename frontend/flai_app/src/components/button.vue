<template>
  <input
    :value="bText"
    class="vbutton"
    type="button"
    @click="doSomething()"
    /> 
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Button",
  props: {bText: String, activeLabel: String},
  
  data() {
    return {
      bText: "Ich bin ein Button.",
    }
  },

  methods: {
    doSomething() {
      this.bText = "du hast mich gedrückt!"
    }
  }
});
</script>


<style lang="scss" scoped>

</style>