<template>
    <div class="space-y-3 p-6 shadow bg-white">
        <div>
            <h3 class="font-bold text-xl uppercase pb-2">{{ previousSurvey?.year }} Evaluation</h3>
            <hr class="border-amber-400">
        </div>
        <div v-if="survey" class="space-y-2">
            <div class="flex justify-between space-x-4">
                <DetailItemValue label="Condition" :value="survey.condition" :size="'2xl'" />
                <DetailItemValue v-if="conditionDetails" :label="conditionDetails?.label" :value="conditionDetails.desc"
                    :bold="false" :size="'sm'" />
            </div>
            <DetailItemValue v-if="survey.information" label="Additional Information" :value="survey.information" />
            <DetailItemValue label="Year Last Replaced or Added" :value="survey.lastYear" />
            <div class="flex justify-between">
                <DetailItemValue label="Remaining Years" :value="survey.remainingYears" />
                <DetailItemValue label="Adjusted Rem. Years" :value="survey.adjRemainingYears" />
            </div>
            <DetailItemValue label="Quantity" :value="`${survey.qty} ${element.qtyUnit}`" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useElementSurveys } from '@/stores/element.surveys';
    import { useSurveysStore } from '@/stores/surveys';
    import type { Element } from '@/types/element';
    import DetailItemValue from './DetailItemValue.vue';

    const { element } = defineProps<{
        element: Element
    }>()

    const elementSurveys = useElementSurveys()
    const surveysStore = useSurveysStore()

    const previousSurvey = computed(() => {
        const surveys = surveysStore.items
            .filter(s => s.whq === element.whq)
            .sort((a, b) => a.year - b.year);

        return surveys.length > 0 ? surveys[0] : null
    })

    const survey = computed(() => {
        if (!previousSurvey.value) return null
        return elementSurveys.elementSurveys.find(e =>
            e.key === (element.uniqueKey) &&
            e.surveyKey === previousSurvey.value?.uniqueKey &&
            e.srcRow === element.srcRow
        )
    })

    const conditionDetails = computed(() => {
        const library: Record<1 | 2 | 3 | 4, {
            label: string
            desc: string
        }> = {
            1: {
                label: "Good",
                desc: "Element is in 'as new' condition or without noticeable defect"
            },
            2: {
                label: "Acceptable",
                desc: "Still in reasonable overall serviceable condition; could have had previous repairs. "
            },
            3: {
                label: "Deffective",
                desc: "Element needs some major repairs in the very near future"
            },
            4: {
                label: "Seriously Deffective",
                desc: "Element is is deteriorating or malfunctioning beyond repair and needs replacement."
            },
        }

        return survey.value ? library[survey.value.condition as 1 | 2 | 3 | 4] : null
    })
</script>