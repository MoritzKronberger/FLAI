<template>
  <input :value="label" class="vbutton" type="Button" @click="doSomething()" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentButton',
  props: { label: String },

  data() {
    return {
      platzhalter: 'Hier steht irgendwas',
    }
  },

  methods: {
    doSomething() {
      this.platzhalter =
        'irgendwas musste hier stehen, damit ich commiten kann.'
    },
  },
})
</script>

<style lang="scss" scoped></style>
