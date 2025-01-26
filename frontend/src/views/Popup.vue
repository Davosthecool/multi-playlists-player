<script setup lang="ts">
import PlayList from '../components/PlayList.vue';
import { ref, onMounted } from 'vue';
import { getUserPlaylistsFromBackground, PlaylistObject } from '../scripts/fetchDatas';

const playlists = ref<PlaylistObject[]>([]);
onMounted(async () => {
  try {
    const result = await getUserPlaylistsFromBackground();
    playlists.value = result;
    console.log("Playlists récupérées :", result);
  } catch (error) {
    console.error("Erreur lors de la récupération des playlists :", error);
  }
});
</script>

<template>
  <div>
    <div v-if="playlists.length === 0" class="loading">Chargement des playlists...</div>
    <div v-else>
      <PlayList :playlists="playlists" />
    </div>
    
  </div>
</template>

<style scoped>
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
