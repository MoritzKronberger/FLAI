<template>
  <h1>Debug</h1>
  <div id="nav">
    <router-link :to="{ name: 'HomePage' }">Home</router-link>
    <router-link :to="{ name: 'ShowStore' }">ShowStore</router-link>
    <router-link :to="{ name: 'LearningExercise' }">Exercise</router-link>
    <router-link :to="{ name: 'TestComponents' }">TestComponents</router-link>
    <router-link :to="{ name: 'TestFlaiNet' }">TestFlaiNet</router-link>
    <router-link :to="{ name: 'ProfilePage' }">Profile</router-link>
    <router-link :to="{ name: 'RegisterPage' }">Register</router-link>
    <router-link :to="{ name: 'LoginPage' }">Login</router-link>
  </div>
</template>
