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
      <p class="number">5</p>
      <p class="underline">Statistik Platzhalter</p>
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
.row {
  display: flex;
}
.row img {
  height: 30vh;
}
#exercisePicture {
  margin: 0;
  border-radius: 3vw;
}
</style>
