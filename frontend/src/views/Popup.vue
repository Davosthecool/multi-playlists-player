<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PlayList from '../components/PlayList.vue';
import PlayListTracks from '../components/PlayListTracks.vue';

import { getUserPlaylistsFromBackground, PlaylistObject, TrackObject } from '../scripts/fetchDatas';

const playlists = ref<PlaylistObject[]>([]);
const tracks = ref<TrackObject[]>([]);
onMounted(async () => {
  try {
    const result = await getUserPlaylistsFromBackground();
    playlists.value = result;
  } catch (error) {
    console.error("Erreur lors de la récupération des playlists :", error);
  }

  chrome.runtime.onMessage.addListener(async (message, _sender, _sendResponse) => {
    console.error("Message received:", message.action);
    if (message.action === "show_playlist_tracks") {
      tracks.value = message.tracks;
    }
  });
});
</script>

<template>
  <div class="section" id="header">

  </div>


  <div v-if="playlists.length === 0" class="section" id="sidebar">
    <div class="loading"></div>
  </div>
  <div v-else class="section" id="sidebar">
    <PlayList :playlists="playlists" />
  </div>

  <div class="section" id="main">
    <div v-if="tracks.length>0">
      <button @click="tracks=[]">Back</button>
      <PlayListTracks :tracks="tracks"/>
    </div>
    
    <div v-else></div>

  </div>

  <div class="section" id="music-player">

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
  grid-template-columns: 0.3fr 0.7fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";

  gap: 10px;
  margin : 0;
  width: 100%;
  height: 100%;

  background-color: white;
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

.section {
  background-color: black;
  border-radius: 15px;

  padding: 10px;

  overflow-y: scroll !important;
  scrollbar-width: none !important;
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
