<template>
  <div>
    <video ref="videoPlayer" loop>
      <source
        src="../assets/signs/vid/front/a_vid_front.webm"
        type="video/mp4"
      />
    </video>
    <div id="wrapper">
      <button @click="toggleState">
        {{ playOrPause }}
      </button>
      <DropDownMenu title=">>" :items="speeds" @change-speed="setSpeed" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DropDownMenu from './DropDownMenu.vue'

export default defineComponent({
  name: 'LearningExerciseMethods',
  components: {
    DropDownMenu: DropDownMenu,
  },

  setup() {
    let isPlaying = false
    const playOrPause = ref<string>('play')

    function play() {
      this.$refs.videoPlayer.play()
    }

    function pause() {
      this.$refs.videoPlayer.pause()
    }

    function setSpeed(speed: number) {
      console.log('speed is:', speed)
      this.$refs.videoPlayer.playbackRate = speed
    }

    function toggleState() {
      isPlaying = !isPlaying
      console.log(isPlaying === true ? 'play' : 'pause')

      if (isPlaying) {
        this.$refs.videoPlayer.play()
        playOrPause.value = 'pause'
      } else {
        this.$refs.videoPlayer.pause()
        playOrPause.value = 'play'
      }
    }

    return { playOrPause, toggleState, play, pause, setSpeed }
  },

  data() {
    return {
      speeds: ['1x', '0.5x', '0.25x'],
    }
  },
})
</script>

<style scoped>
#wrapper {
  display: flex;
}
</style>
