<template>
    <div class="border-b border-b-gray-200 py-3 px-1 flex space-x-4 items-center">
        <div
            :class="['h-10 w-10 rounded-full flex items-center', hasCurrentElementSurvey ? 'bg-white' : 'bg-gray-200']">
            <CheckCircle class="h-12" v-if="hasCurrentElementSurvey" />
        </div>
        <div class="flex-1 relative">
            <div class="text-xs">{{ element.categoryGroup }}</div>
            <div :class="['absolute text-xs -right-4 rounded-tl-full rounded-bl-full text-center flex items-center justify-center shadow text-white',
                { 'bg-green-700': condition === 1 },
                { 'bg-yellow-500': condition === 2 },
                { 'bg-orange-500': condition === 3 },
                { 'bg-red-500': condition === 4 },
            ]" style="width: 1.5rem; height: 1.5rem;">
                {{ condition }}
            </div>
            <div class="font-medium pr-1">{{ element.name }}</div>
            <div class="text-sm">{{ element.component }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useElementSurveys } from '@/stores/element.surveys';
    import { useSurveysStore } from '@/stores/surveys';
    import type { Element } from '@/types/element';
    import CheckCircle from './icons/CheckCircle.vue';

    const elementSurveys = useElementSurveys()
    const surveysStore = useSurveysStore()
    const { element } = defineProps<{
        element: Element
    }>();

    const previousSurvey = computed(() => {
        const surveys = surveysStore.items
            .filter(s => s.whq === element.whq)
            .sort((a, b) => a.year - b.year);

        return surveys.length > 0 ? surveys[0] : null
    })

    const prevElemSurvey = computed(() => {
        if (!previousSurvey.value) return null
        return elementSurveys.elementSurveys.find(e => e.key === (element.uniqueKey) && e.surveyKey === previousSurvey.value?.uniqueKey)
    })

    const currentSurvey = computed(() => {
        const surveys = surveysStore.items
            .filter(s => s.whq === element.whq)
            .sort((a, b) => b.year - a.year);

        return surveys.length > 1 ? surveys[0] : null
    })

    const currentElemSurvey = computed(() => {
        if (!currentSurvey.value) return null
        return elementSurveys.elementSurveys.find(e => e.key === (element.uniqueKey) && e.surveyKey === currentSurvey.value?.uniqueKey)
    })

    const hasCurrentElementSurvey = computed(() => {
        return Boolean(currentElemSurvey.value)
    })


    const condition = computed(() => {
        if (hasCurrentElementSurvey.value) {
            return currentElemSurvey.value?.condition ?? 0
        }
        return prevElemSurvey.value?.condition ?? 0
    })
</script>