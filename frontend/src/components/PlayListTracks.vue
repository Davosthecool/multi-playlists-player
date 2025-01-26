<script setup lang="ts">
import { TrackObject } from '../scripts/fetchDatas';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/vue'

defineProps<{
  tracks: TrackObject[]
}>();
</script>

<template>

    <!-- <CListGroup id="tracks-container">
        <CListGroupItem as="a" href="#"
        v-for="(item,_) in tracks">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1"> {{ item.name }} </h5>
                <small> {{ item.duration }} </small>
            </div>
            <p class="mb-1"> {{ item.artists.toString().replace('[','').replace(']','') }} </p>
            <small>Added by Placeholder</small>
        </CListGroupItem>
    </CListGroup> -->

    <CTable align="middle" reponsive hover>
        <CTableHead>
            <CTableRow>
                <CTableHeaderCell scope="col" class="w-25">#</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-25">Title</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-25">Artists</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-25">Duration</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(item,index) in tracks">
                <CTableDataCell> {{ index+1 }} </CTableDataCell>
                <CTableDataCell> {{ item.name }} </CTableDataCell>
                <CTableDataCell> {{ item.artists.toString().replace('[','').replace(']','') }} </CTableDataCell>
                <CTableDataCell> {{ item.duration }} </CTableDataCell>
            </CTableRow>

        </CTableBody>
    </CTable> 

</template>

<style scoped>
#tracks-container {
    min-width: 500px;
}
</style>