<template>
  <div class="container">
    <div class="item">
      <router-link :to="{ name: viewName }">
        <div class="bar">
          <div class="icon">
            <icon-loader
              :path="iconPath"
              :alt="iconAltText"
              element-class="sidebar-icon"
            />
          </div>
          <span class="sidebar-flyout body-medium">{{ flyoutText }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconLoader from '../IconLoader.vue'

defineProps<{
  viewName: string
  iconPath: string
  flyoutText: string
  iconAltText: string
}>()
</script>

<style lang="scss">
@import '@/assets/scss/components/menu_items';
</style>
