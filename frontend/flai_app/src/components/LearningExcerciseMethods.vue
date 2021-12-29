<template>
  <div>
    <video ref="videoPlayer">
      <source
        src="../assets/signs/vid/front/a_vid_front.webm"
        type="video/mp4"
      />
    </video>
    <div>
      <button @click="toggleState">
        {{ playOrPause }}
      </button>
    </div>
    <div>
      <button @click="play">play</button>
      <button @click="pause">pause</button>
      <button @click="setSpeed(0.5)">0.5x</button>
      <button @click="setSpeed(1)">1x</button>
      <button @click="setSpeed(1.5)">1.5x</button>
      <button @click="setSpeed(2)">2x</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LearningExerciseMethods',

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
})
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
