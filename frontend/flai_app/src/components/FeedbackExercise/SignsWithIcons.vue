<template>
  <div class="sign-with-icon">
    <div class="sign-with-icon-container">
      <div
        v-for="(letter, count) of signs"
        :key="letter.name"
        :class="
          'item ' +
          `${
            count === index ? 'current-letter heading-large' : 'heading-small'
          }`
        "
      >
        <div>{{ letter.name.toUpperCase() }}</div>
        <IconLoader
          v-if="path[count] !== undefined"
          :key="count"
          :path="path[count]"
          alt="Icon, das die Korrektheit anzeigt"
          element-class="feedback-icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sign } from '../../store/signdata'
import IconLoader from '../IconLoader.vue'

defineProps<{ signs: Sign[]; index: number; path: string[] }>()
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
</style>
