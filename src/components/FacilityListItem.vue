<template>
    <div class="px-4 py-5 shadow-lg bg-white rounded-sm space-y-0">
        <div class="flex justify-between">
            <span class="text-sm uppercase">{{ facility.primaryUse }}</span>
            <span class="text-xs">{{ facility.whq }}</span>
        </div>
        <div class="font-bold text-lg">{{ facility.location }}</div>
        <div class="space-x-2">
            <span class="text-sm">Previous Evaluation:</span>
            <span>{{ previousFEV }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { Facility } from '@/types/facility';
    import { useSurveysStore } from '@/stores/surveys';
    import { useDateFormat } from '@vueuse/core';

    const surveysStore = useSurveysStore()
    const { facility } = defineProps<{
        facility: Facility
    }>()

    const previousFEV = computed(() => {
        const { previous } = surveysStore.getByFacility(facility.whq)
        if (!previous) return ''
        return useDateFormat(previous.date, "MMMM DD, YYYY")
    })
</script>