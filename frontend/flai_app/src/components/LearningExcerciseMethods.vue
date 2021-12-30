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
      <SpeedDropDown
        title=">>"
        :items="speeds"
        @first="setSpeed(1)"
        @second="setSpeed(0.5)"
        @third="setSpeed(0.25)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SpeedDropDown from './SpeedDropDown.vue'

export default defineComponent({
  name: 'LearningExerciseMethods',
  components: {
    SpeedDropDown,
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
      this.$refs.videoPlayer.playbackRate = speed
      console.log('speed is:', speed)
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
