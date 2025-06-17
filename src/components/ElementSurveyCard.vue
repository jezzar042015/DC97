<template>
    <div class="space-y-3 py-6 px-3 shadow bg-white">
        <div class="px-3">
            <h3 class="font-bold text-xl uppercase pb-2">{{ surveyYear }} Evaluation</h3>
            <hr class="border-amber-400">
        </div>
        <div v-if="survey" class="space-y-2">
            <div :class="['flex justify-between space-x-4 rounded shadow py-2 px-4',
                { 'bg-blue-200': survey.condition == 1 },
                { 'bg-yellow-100': survey.condition == 2 },
                { 'bg-orange-200': survey.condition == 3 },
                { 'bg-red-200': survey.condition == 4 }
            ]">
                <DetailItemValue label="Condition" :value="survey.condition" :size="'2xl'" />
                <DetailItemValue v-if="conditionDetails" :label="conditionDetails?.label" :value="conditionDetails.desc"
                    :bold="false" :size="'xs'" />
            </div>
            <div class="px-3 space-y-1">
                <DetailItemValue v-if="survey.information" label="Additional Information" :value="survey.information"
                    :bold="false" />
                <DetailItemValue label="Year Last Replaced or Added" :value="survey.lastYear" />
                <div class="flex justify-between">
                    <DetailItemValue label="Remaining Years" :value="survey.remainingYears" />
                    <DetailItemValue label="Adjusted Rem. Years" :value="survey.adjRemainingYears" />
                </div>
                <DetailItemValue label="Quantity" :value="`${survey.qty} ${element.qtyUnit}`" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useElementSurveys } from '@/stores/element.surveys';
    import { useSurveysStore } from '@/stores/surveys';
    import { elementConditionDescriptions } from '@/data/lib/desc';
    import type { Element } from '@/types/element';
    import DetailItemValue from './DetailItemValue.vue';

    const { element, scope = 'previous' } = defineProps<{
        element: Element,
        scope: 'previous' | 'current'
    }>()

    const elementSurveys = useElementSurveys()
    const surveysStore = useSurveysStore()

    const previousSurvey = computed(() => {
        const surveys = surveysStore.items
            .filter(s => s.whq === element.whq)
            .sort((a, b) => a.year - b.year);

        return surveys.length > 0 ? surveys[0] : null
    })

    const currentSurvey = computed(() => {
        const surveys = surveysStore.items
            .filter(s => s.whq === element.whq)
            .sort((a, b) => a.year - b.year);

        return surveys.length > 1 ? surveys[1] : null
    })

    const survey = computed(() => {
        if (!previousSurvey.value) return null
        const targetSurveyKey = scope == 'previous' ? previousSurvey.value?.uniqueKey : currentSurvey.value?.uniqueKey

        if (!targetSurveyKey) return null

        return elementSurveys.elementSurveys.find(e =>
            e.key === (element.uniqueKey) &&
            e.surveyKey === targetSurveyKey &&
            e.srcRow === element.srcRow
        )
    })

    const conditionDetails = computed(() => {
        return survey.value ? elementConditionDescriptions[survey.value.condition as 1 | 2 | 3 | 4] : null
    })

    const surveyYear = computed(() => {
        return scope == 'previous' ? previousSurvey.value?.year : currentSurvey.value?.year
    })
</script>