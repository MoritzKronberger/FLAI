<script setup lang="ts">
import { ref, inject, computed } from 'vue'

const store: any = inject('store')

//sesiondata
const session = computed(() => store.sessiondata.session)
const sessionMethods = store.sessiondata.methods
const props = defineProps<{
  link: string
  icon: string
  description: string
  state: boolean
}>()
const show = ref()
function updateLink() {
  sessionMethods.updateMenuItemLink(props.link)
}
</script>

<template>
  <ul>
    <li @mouseover="show = true" @mouseleave="show = false">
      <span v-if="session.menuItemLink == link" class="active"></span>
      <a :href="link" @click="updateLink()">
        <span class="icon">{{ icon }}</span>
        <span v-if="show">{{ description }}</span>
      </a>
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

span.active {
  border: 2px solid #4a7bf6;
  margin-right: 5px;
}
</style>
