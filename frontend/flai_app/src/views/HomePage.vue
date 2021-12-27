<template>
  <h2>
    Hallo, <b>{{ user.username }}!</b>
  </h2>
  <div class="row">
    <div>
      <h2>Tagesaufgabe</h2>
      <img
        id="exercisePicture"
        alt="Tagesaufgabe"
        src="../assets/exercise.png"
      />
    </div>
    <div>
      <h2>Abzeichen</h2>
      <img
        id="badge"
        alt="Abzeichen des aktuellen Levels"
        src="../assets/badgeLevel3.png"
      />
    </div>
  </div>
  <h2>Statistik</h2>
  <div class="row">
    <div class="statistic">
      <div class="circle">
        <p class="number">5</p>
      </div>
      <p class="underline">Statistik Platzhalter</p>
    </div>
    <div class="statistic">
      <div class="circle">
        <p class="number">3</p>
      </div>
      <p class="underline">Statistik Platzhalter2</p>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, computed } from 'vue'

export default {
  setup() {
    const store: any = inject('store')
    const user = computed(() => store.userdata.user)
    return {
      user,
    }
  },
}
</script>

<style>
h2 {
  font-weight: 200;
}
p {
  margin: 0;
}
.row {
  display: flex;
}
.row img {
  margin: 0 1vw;
  height: 30vh;
  border-radius: 3vw;
}
.statistic {
  margin: 1vw;
  padding: 3vh 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: lightblue;
  border-radius: 2vw;
  text-align: center;
}
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: yellow;
  margin: auto;
  margin-bottom: 2vh;
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
}
.number {
  margin: auto;
  width: 100%;
  font-size: 5vh;
}
</style>
