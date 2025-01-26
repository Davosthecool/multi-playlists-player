<script setup lang="ts">
import { CCard, CCardBody, CCardImage, CCardTitle, CRow, CCol } from '@coreui/vue'

const props = defineProps<{ name: string, imageUrl: string}>()
var showed_name = ""

if (props.name.length > 25) {
    showed_name = props.name.substring(0,22) + "..."
}else {
    showed_name = props.name
}
</script>

<template>
    <CCard class="playlist-card">
        <CRow class="g-0">
            <CCol :xs="4">
                <CCardImage class="playlist-card-image" :src="imageUrl" />
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