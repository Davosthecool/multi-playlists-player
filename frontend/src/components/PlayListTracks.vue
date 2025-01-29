<script setup lang="ts">
import { TrackObject } from '../scripts/fetchDatas';
import { CCard, CCardBody, CRow, CCol } from '@coreui/vue'
import { millisToMinutesSeconds } from '../scripts/utils';

defineProps<{
  tracks: TrackObject[]
}>();
</script>

<template>
<CCard class="p-3 shadow-sm" id="track-card"
v-for="(item,index) in tracks">
    <CCardBody id="track-card-body">
        <CRow id="track-card-row">
            <CCol class="text-center" id="track-card-cell"> {{ index+1 }} </CCol>
            <CCol class="text-center" id="track-card-cell"> {{ item.name }} </CCol>
            <CCol class="text-center" id="track-card-cell"> {{ item.artists.toString().replace('[','').replace(']','') }} </CCol>
            <CCol class="text-center" id="track-card-cell"> {{ millisToMinutesSeconds(item.duration) }} </CCol>
        </CRow>
    </CCardBody>
</CCard>

</template>

<style scoped>
#tracks-container {
    min-width: 500px;
}

#track-card {
    padding: 0.5em !important;
}

#track-card-body {
    padding: 0 !important;
}

#track-card-row {
    gap: 5px;
}

#track-card-cell {
    padding: 0;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden !important;
}
</style>