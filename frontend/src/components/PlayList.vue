<script setup lang="ts">
import PlayListItem from './PlayListItem.vue';


defineProps<{
    playlists: Array<{name: string, imageUrl: string}>
}>()

</script>

<template>
    <!-- <div id="playlist-container">
        <PlayListItem
            v-for="(item,index) in playlists"
            :key="index"
            :name="item.name"
            :imageUrl="item.imageUrl"
        />
    </div> -->
    <div class="overflow-x-auto bg-base-100">
        <table class="table">
            <tbody>
                <PlayListItem
                    v-for="(item,index) in playlists"
                    :key="index"
                    :name="item.name"
                    :imageUrl="item.imageUrl"
                />
            </tbody>
        </table>
    </div>
</template>

<style scoped>
#playlist-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    height: 300px;
    width: min-content;
    overflow-y: scroll;
    gap: 20px;
    padding: 20px;
    border-radius: 5px;

    background-color: black;
}


</style>