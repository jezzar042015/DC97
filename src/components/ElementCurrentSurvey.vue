<template>
    <ElementSurveyCard v-if="survey" :element="element" :scope="'current'" />

    <div v-else class="mt-5">
        <button v-if="!currentSurvey" class="shadow py-3 w-full bg-blue-700 text-white"
            @click="loadSurveyForm('facility-survey')">
            Start Current Facility Evaluation
        </button>
        <button v-else class="shadow py-3 w-full bg-blue-700 text-white" @click="loadSurveyForm('element-survey')">
            Start Element Evaluation
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useElementSurveys } from '@/stores/element.surveys';
    import type { Element } from '@/types/element';
    import ElementSurveyCard from './ElementSurveyCard.vue';

    const { element } = defineProps<{
        element: Element
    }>()

    const emits = defineEmits(['load-survey-form'])
    const surveysStore = useSurveysStore()
    const elementSurveys = useElementSurveys()

    const currentSurvey = computed(() => {
        const surveys = surveysStore.items
            .filter(s => s.whq === element.whq)
            .sort((a, b) => a.year - b.year);

        return surveys.length > 1 ? surveys[1] : null
    })

    const survey = computed(() => {
        if (!currentSurvey.value) return null
        return elementSurveys.elementSurveys.find(e => e.key === (element.uniqueKey) && e.surveyKey === currentSurvey.value?.uniqueKey)
    })

    const loadSurveyForm = (form: 'facility-survey' | 'element-survey' | '') => {
        emits('load-survey-form', form)
    }


</script>