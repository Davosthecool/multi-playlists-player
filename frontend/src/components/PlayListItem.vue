<script setup lang="ts">
import { CCard, CCardBody, CCardImage, CCardTitle, CRow, CCol } from '@coreui/vue'
import type { PlaylistObject } from '../scripts/fetchDatas';
import { sendPlaylistClickedEvent } from '../scripts/sendEvents';

const props = defineProps<{playlist: PlaylistObject}>()
var showed_name = ""

if (props.playlist.name.length > 25) {
    showed_name = props.playlist.name.substring(0,22) + "..."
}else {
    showed_name = props.playlist.name
}

const onClickEvent = function() {sendPlaylistClickedEvent(props.playlist.id) }
</script>

<template>
    <CCard class="playlist-card" :onclick="onClickEvent">
        <CRow class="g-0 playlist-card-items">
            <CCol :xs="4">
                <CCardImage class="playlist-card-image" :src="playlist.imageUrl" />
            </CCol>
            <CCol :xs="8">
                <CCardBody class="playlist-card-body">
                    <CCardTitle class="playlist-card-title">{{ showed_name }}</CCardTitle>
                </CCardBody>
            </CCol>
        </CRow>
    </CCard>
</template>

<style scoped>

.playlist-card {
    max-width: 540px;
    padding: 0;
    border: none;
    background-color: lightgray;
    margin-bottom: 0 !important;
    cursor: pointer;
}

.playlist-card-items {
    user-select: none;
    pointer-events: none;
}

.playlist-card-image {
    box-shadow: grey 5px 0px 5px -2px;
    border-radius: var(--cui-card-inner-border-radius) 0 0 var(--cui-card-inner-border-radius) !important;
}

.playlist-card-body {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
}

.playlist-card-title {
    margin-bottom: 0;
    width: 100%;
}
</style>