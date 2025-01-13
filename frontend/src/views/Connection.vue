<script setup lang="ts">
import ImageButton from '../components/ImageButton.vue'
</script>

<template>

    <div id="connection-container">
        <div id="buttons-container">
            <ImageButton image="spotify-icon.png" service="spotify"/>
            <ImageButton image="deezer-icon.png" service="deezer"/>
            <ImageButton image="apple-music-icon.png" service="apple"/>
            <ImageButton image="youtube-music-icon.png" service="youtube"/>
        </div>
        
        <h id="explain-text"> Connect for start using this extension </h>
    </div>

</template>

<style>

body {
    width: 300px;
    height: 100px;

    background: linear-gradient(0.25turn,#e66465, #9198e5);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
}

#buttons-container {
    display: flex ;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
}

#explain-text {
    font-size: medium;
}

</style>