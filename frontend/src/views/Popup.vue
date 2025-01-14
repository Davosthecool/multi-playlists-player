<script setup lang="ts">
// import HelloWorld from '../components/HelloWorld.vue'
import PlayList from '../components/PlayList.vue'

const playlists = [
  {imageUrl: "../assets/vue.svg", name: "Playlist Exemple Item 1"},
  {imageUrl: "../assets/vue.svg", name: "Playlist Exemple Item 2"},
  {imageUrl: "../assets/vue.svg", name: "Playlist Exemple Item 3"},
  {imageUrl: "../assets/vue.svg", name: "Playlist Exemple Item 4"},
]
</script>

<template>
  <PlayList :playlists="playlists"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
