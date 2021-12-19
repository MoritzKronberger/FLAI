<template>
  <h2>
    Hallo, <b>{{ user.username }}!</b>
  </h2>
</template>

<script lang="ts">
import { inject, computed } from 'vue'

export default {
  setup() {
    const store: any = inject('store')

    const user = computed(() => store.userdata.user)

    return {
      user,
    }
  },
}
</script>

<style>
h2 {
  font-weight: 200;
}
</style>
