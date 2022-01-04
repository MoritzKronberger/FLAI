<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import IconLoader from '../IconLoader.vue'

const store: any = inject('store')

//sesiondata
const session = computed(() => store.sessiondata.session)
const sessionMethods = store.sessiondata.methods
const props = defineProps<{
  viewName: string
  iconPath: string
  iconMimetype: string
  description: string
  state: boolean
}>()
const show = ref(false)
const setShow = (newShow: boolean): void => {
  show.value = newShow
}
function updateLink() {
  sessionMethods.updateMenuItemLink(props.viewName)
}
</script>

<template>
  <ul>
    <li @mouseover="setShow(true)" @mouseleave="setShow(false)">
      <span v-if="session.menuItemLink == viewName" class="active"></span>
      <router-link :to="{ name: viewName }">
        <span v-if="show">{{ description }}</span>
        <icon-loader
          :path="iconPath"
          :mimetype="iconMimetype"
          :alt="description"
          element-class="sidebar-icon"
        />
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
li {
  padding-left: 15px;
  text-align: left;
  list-style-type: none;
}

a {
  color: black;
  text-decoration: none;
}

.icon {
  margin-right: 25px;
}

.router-link-exact-active {
  border-left: 3px solid #4a7bf6;
  margin-right: 5px;
}
</style>
