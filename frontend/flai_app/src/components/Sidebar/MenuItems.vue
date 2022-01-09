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
    <div class="item">
      <router-link :to="{ name: viewName }">
        <div class="bar">
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
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
