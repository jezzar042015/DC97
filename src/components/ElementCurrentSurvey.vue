<template>
    <ElementSurveyCard v-if="survey" :element="element" :scope="'current'"
        @update-survey="loadSurveyForm('element-survey', 'update')" />

    <div v-else class="mt-5">
        <RippledButton v-if="!currentSurvey" label="Start Current Facility Evaluation"
            @click="loadSurveyForm('facility-survey')" />

        <RippledButton v-else label="Start Element Evaluation" @click="loadSurveyForm('element-survey')" />

    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useElementSurveys } from '@/stores/element.surveys';
    import type { Element } from '@/types/element';
    import ElementSurveyCard from './ElementSurveyCard.vue';
    import RippledButton from './RippledButton.vue';
    import type { FormMode } from '@/data/lib/form';

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
        return elementSurveys.elementSurveys.find(e =>
            e.key === element.uniqueKey &&
            e.srcRow === element.srcRow &&
            e.surveyKey === currentSurvey.value?.uniqueKey
        )
    })

    const loadSurveyForm = async (form: 'facility-survey' | 'element-survey' | '', mode: FormMode = 'new') => {
        await new Promise(resolve => setTimeout(resolve, 200));
        emits('load-survey-form', form, mode)
    }


</script>