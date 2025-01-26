<script setup lang="ts">
import PlayListItem from './PlayListItem.vue';
import { PlaylistObject } from '../scripts/fetchDatas';

defineProps<{
    playlists: PlaylistObject[]
}>()
console.error("Dans Playlist")
</script>

<template>
    <div id="playlist-container" class="overflow-x-auto bg-base-100">
        <PlayListItem
            v-for="(item,index) in playlists"
            :key="index"
            :name="item.name"
            :imageUrl="item.imageUrl"
        />
    </div>
</template>

<style scoped>
#playlist-container {
    display: flex;
    flex-direction: column;

    min-width: 200px;
    height: 220px;
    gap: 20px;
    padding: 20px;
    border-radius: 5px;

    background-color: black;
}


</style>