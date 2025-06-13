<template>
    <ModalWrapper>
        <div class="bg-white p-4 w-full rounded mt-8">
            <div>
                <div class="text-xl mb-2">
                    Element Evaluation
                </div>
                <hr class="border-amber-400 my-2">
                <div>
                    <DetailItemValue :label="element.name" :value="element.component" />
                </div>
            </div>
            <div class="flex space-x-3 mt-10">
                <button @click="confirm" class="py-2 px-4 shadow text-white bg-blue-700 rounded">
                    Confirm Evaluation
                </button>
                <button @click="close" class="py-2 px-4 shadow rounded">Cancel</button>
            </div>
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useElementSurveys } from '@/stores/element.surveys';
    import type { Element } from '@/types/element';
    import type { ElementSurvey } from '@/types/elementSurvey';
    import ModalWrapper from './ModalWrapper.vue';
    import DetailItemValue from './DetailItemValue.vue';

    const emits = defineEmits(['unload-survey-form'])
    const close = () => emits('unload-survey-form')
    const surveysStore = useSurveysStore()
    const elementSurveys = useElementSurveys()

    const { element } = defineProps<{
        element: Element
    }>()

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
        return elementSurveys.elementSurveys.find(e =>
            e.key === (element.uniqueKey) &&
            e.surveyKey === previousSurvey.value?.uniqueKey &&
            e.srcRow === element.srcRow
        )
    })

    const form = ref<ElementSurvey>({
        srcRow: 0,
        whq: '',
        categoryGroup: '',
        surveyKey: '',
        key: '',
        qty: 0,
        lastYear: 0,
        condition: 1,
        remainingYears: 0,
        adjRemainingYears: 0,
        information: '',
    })

    const confirm = async () => {
        const storable = JSON.parse(JSON.stringify(form.value))
        emits('unload-survey-form', '')
    }

    watch(
        () => survey.value,
        (n) => {
            if (!n) return
            form.value.srcRow = n.srcRow
            form.value.categoryGroup = n.categoryGroup
            form.value.whq = n.whq
            form.value.key = n.key
        },
        {
            immediate: true
        }
    );

    watch(
        () => currentSurvey.value,
        (n) => {
            if (!n) return
            form.value.surveyKey = n.uniqueKey
            form.value.remainingYears = element.life - (n.year - (survey.value?.lastYear ?? 0))
        },
        {
            immediate: true
        }
    );

</script>