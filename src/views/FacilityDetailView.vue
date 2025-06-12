<template>
    <main class="h-screen bg-gray-50">
        <div class="p-4 space-y-3">
            <div v-if="facilityStore.facility" class="space-y-3 p-3 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Facility Details</h3>
                    <hr class="border-amber-400">
                </div>
                <DetailItemValue label="Location Address" :value="facilityStore.facility.location" />
                <DetailItemValue label="Number of Auditoriums" :value="facilityStore.facility.auditoriums" />
                <DetailItemValue label="Number of Buildings on Site" :value="facilityStore.facility.buildings" />
                <DetailItemValue label="Climate" :value="facilityStore.facility.climate" />
                <DetailItemValue label="Number of Congregations" :value="facilityStore.facility.congregations" />
                <DetailItemValue label="Units of Measurement" :value="facilityStore.facility.measurements" />
                <DetailItemValue label="Primary Use" :value="facilityStore.facility.primaryUse" />
                <DetailItemValue label="WHQ Number" :value="facilityStore.facility.whq" />
            </div>
            <div class="p-3 shadow bg-white">
                <h3 class="font-bold text-xl uppercase pb-2">Evaluation Visits</h3>
                <hr class="border-amber-400">
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import { useFacilityStore } from '@/stores/facility';

    const facilityStore = useFacilityStore()
</script>