<script setup lang="ts">
import PlayList from '../components/PlayList.vue';
import { ref, onMounted } from 'vue';
import { getUserPlaylistsFromBackground, PlaylistObject } from '../scripts/fetchDatas';

const playlists = ref<PlaylistObject[]>([]);
onMounted(async () => {
  try {
    const result = await getUserPlaylistsFromBackground();
    playlists.value = result;
  } catch (error) {
    console.error("Erreur lors de la récupération des playlists :", error);
  }
});
</script>

<template>
  <div id="header">

  </div>
  <div v-if="playlists.length === 0" class="loading"></div>
  <div v-else id="sidebar">
    <PlayList :playlists="playlists" />
  </div>
  <div id="music-player">

  </div>

</template>

<style>

body {
  display: block;

  width: 750px;
  height: 550px;
}

#app {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 0.3fr 0.6fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";

  margin : 0;
  width: 100%;
  height: 100%;

  background-color: black;
}

#header {
  grid-area: header;
}

#sidebar {
  grid-area: sidebar;
  min-height: 100%;
}

#music-player {
  grid-area: footer;
}

.loading {
  font-size: 1.2em;
  color: #646cff;
}
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
