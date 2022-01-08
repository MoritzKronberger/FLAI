<script setup lang="ts">
import IconLoader from '../IconLoader.vue'

defineProps<{
  viewName: string
  iconPath: string
  iconMimetype: string
  flyoutText: string
  iconAltText: string
}>()
</script>

<template>
  <div class="container">
    <router-link :to="{ name: viewName }">
      <div class="item">
        <div class="icon">
          <icon-loader
            :path="iconPath"
            :mimetype="iconMimetype"
            :alt="iconAltText"
            element-class="sidebar-icon"
          />
        </div>
        <span class="sidebar-flyout">{{ flyoutText }}</span>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
