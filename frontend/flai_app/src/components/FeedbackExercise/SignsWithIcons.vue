<template>
  <div class="sign-with-icon">
    <span v-for="(letter, count) of signs" :key="letter.name" class="item">
      <span v-if="count === index" class="currentLetter">
        {{ letter.name }}
      </span>
      <span v-else>{{ letter.name }}</span>
      <IconLoader
        v-if="path[count] !== undefined"
        :key="count"
        :path="path[count]"
        alt="Icon, das die Korrektheit anzeigt"
        element-class="feedback-icon"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { Sign } from '../../store/signdata'
import IconLoader from '../IconLoader.vue'

defineProps<{ signs: Sign[]; index: number; path: string[] }>()
</script>
