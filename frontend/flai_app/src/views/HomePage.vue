<template>
  <h2>Hallo, {{ username }}!</h2>
</template>

<script lang="ts">
import { inject, computed } from 'vue'

export default {
  setup() {
    const store: any = inject('store')

    const username = computed(() => store.userdata.user.username)
  },
}
</script>
