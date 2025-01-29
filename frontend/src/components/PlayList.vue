<script setup lang="ts">
// import { ref, onMounted } from 'vue';
import PlayListItem from './PlayListItem.vue';
import { PlaylistObject } from '../scripts/fetchDatas';

defineProps<{
    playlists: PlaylistObject[]
}>()

</script>

<template>
    <div id="playlist-container" class="overflow-x-auto bg-base-100">
        <PlayListItem
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

    min-width: 100%;
    gap: 10px;

    background-color: transparent;
}


</style>