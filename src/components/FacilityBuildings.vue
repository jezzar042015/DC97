<template>
    <div class="py-2 px-2 space-y-3">
        <div v-for="bldg in buildings" :key="bldg.whq" class="px-3 py-2 shadow">
            <div class="space-y-3">
                <div class="text-xl font-bold text-orange-400"  >{{ bldg.name }}</div>
                <DetailItemValue label="Building WHQ" :value="bldg.whq" />
                <DetailItemValue label="Occupancy" :value="bldg.occupancy" />
                <div class="flex justify-between">
                    <DetailItemValue label="Building Condition" :value="bldg.building" />
                    <DetailItemValue label="Maintenance Condition" :value="bldg.maintenance" />
                </div>
                <div class="flex justify-between">
                    <DetailItemValue label="Gross Floor Area" :value="bldg.gfa" />
                    <DetailItemValue label="Construction" :value="bldg.construction" />
                    <DetailItemValue label="Levels" :value="bldg.levels" />
                </div>
                <DetailItemValue label="Projected Major Renovation Year" :value="bldg.projRenYear" />
                <DetailItemValue label="Last Major Renovation Year" :value="bldg.renMajYear" v-if="bldg.renMajYear" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useBuildingsStore } from '@/stores/buildings';
    import { computed } from 'vue';
    import DetailItemValue from './DetailItemValue.vue';

    const { whq } = defineProps<{
        whq: string
    }>()

    const buildingsStore = useBuildingsStore()

    const buildings = computed(() => {
        return buildingsStore.buildings.filter(b => b.facilityWhq === whq)
    })
</script>
