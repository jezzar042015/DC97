<template>
    <div class="space-y-3 p-5 shadow bg-white">
        <div v-if="showheader">
            <h3 class="font-bold text-xl uppercase pb-2">Evaluation Details</h3>
            <hr class="border-amber-400">
        </div>
        <div v-if="facility" class="">
            <DetailItemValue :label="facility.primaryUse" :value="facility.location" />
        </div>
        <div class="flex justify-between">
            <DetailItemValue label="Evaluation Date" :value="evaluationDate" />
            <DetailItemValue label="Evaluation Year" :value="survey.year" />
        </div>
        <DetailItemValue label="Evaluation Description" :value="survey.description" :bold="false" />
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useDateFormat } from '@vueuse/core';
    import { useFacilitiesStore } from '@/stores/facilities';
    import type { Survey } from '@/types/survey';
    import DetailItemValue from './DetailItemValue.vue';

    const facilities = useFacilitiesStore()

    const { survey, showheader = true } = defineProps<{
        survey: Survey
        showheader?: boolean
    }>()

    const evaluationDate = computed(() => {
        return useDateFormat(survey.date, "MMM DD, YYYY").value
    })

    const facility = computed(() => {
        return facilities.facilities.find(f => f.whq === survey.whq)
    })
</script>