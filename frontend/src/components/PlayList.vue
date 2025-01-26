<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PlayListItem from './PlayListItem.vue';
import { PlaylistObject, TrackObject } from '../scripts/fetchDatas';
import PlayListTracks from './PlayListTracks.vue';

defineProps<{
    playlists: PlaylistObject[]
}>()

const tracks = ref<TrackObject[]>([]);
onMounted(() => {
    chrome.runtime.onMessage.addListener(async (message, _sender, _sendResponse) => {
        console.error("Message received:", message.action);
        if (message.action === "show_playlist_tracks") {
            tracks.value = message.tracks;
        }
    });
})
</script>

<template>
    <div id="playlist-container" class="overflow-x-auto bg-base-100">
        <div v-if="tracks.length>0">
            <button @click="tracks=[]">Back</button>
            <PlayListTracks :tracks="tracks"/>
        </div>
        
        <PlayListItem v-else
            v-for="(item,index) in playlists"
            :key="index"
            :playlist="item"
        />
    </div>
</template>

<style scoped>
#playlist-container {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;

    min-width: 200px;
    height: 100%;
    gap: 20px;
    padding: 20px;
    border-radius: 5px;

    background-color: grey;
}


</style>