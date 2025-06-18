<template>
    <div class="py-2 px-2 space-y-3">
        <template v-for="(bldg, i) in buildings" :key="bldg.whq">
            <FacilityBuildingItem  :bldg="bldg" :i="i"/>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { useBuildingsStore } from '@/stores/buildings';
    import { computed } from 'vue';
    import FacilityBuildingItem from './FacilityBuildingItem.vue';

    const { whq } = defineProps<{
        whq: string
    }>()

    const buildingsStore = useBuildingsStore()

    const buildings = computed(() => {
        return buildingsStore.buildings.filter(b => b.facilityWhq === whq)
    })

</script>
