<template>
  <div v-if="showSign">
    <video :src="videoSource" type="video/webm" autoplay loop />
    <br />
    <CustomButton
      label="Perspektive wechseln"
      btnclass="controls"
      @click="switchPerspective()"
    />
  </div>
  <CustomButton
    v-else
    label="Hinweis"
    btnclass="controls"
    @click="emit('useHint')"
  />
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, watchEffect } from 'vue'
import { Sign } from '../../store/signdata'
import CustomButton from '../CustomButton.vue'

const props = defineProps<{ signs: Sign[]; index: number; showSign: boolean }>()

const perspective = ref('front')

function getSource() {
  const rec = props.signs[props.index].recordings.find(
    (el) => el.perspectiveId === perspective.value
  )
  console.log('el', JSON.stringify(rec))
  if (rec === undefined) {
    return 'src/assets/error.webm'
  }
  return rec.path
}
const videoSource: ComputedRef<string> = computed(() => getSource())
watchEffect(() => console.log('newIndex', props.index))

function switchPerspective() {
  if (perspective.value === 'front') {
    perspective.value = 'side'
  } else {
    perspective.value = 'front'
  }
}

const emit = defineEmits(['useHint'])
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div:focus {
  outline: none;
}
h3 {
  margin: 40px 0 0;
}
video {
  width: 40%;
}
.controls {
  background: lightblue;
}
.waiting {
  color: grey;
}
.right {
  color: green;
}
.wrong {
  color: red;
}
</style>
