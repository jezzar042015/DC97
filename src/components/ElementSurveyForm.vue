<template>
    <ModalWrapper :px="0" :py="0">
        <div class="bg-white w-full h-screen rounded flex flex-col">
            <div class="mt-8 px-4 py-2 shadow bg-white">
                <div class="text-lg mb-2">
                    Element Evaluation
                </div>
                <hr class="border-amber-400 my-2">
                <div class="space-y-2 py-1">
                    <DetailItemValue label="" :value="form.categoryGroup" :bold="false" :size="'sm'" />
                    <div class="flex space-x-2 items-start">
                        <!-- <LayersMinimilasticIcon class="h-5 mt-1" /> -->
                        <DetailItemValue :label="element.name" :value="element.component" />
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-auto px-4 bg-gray-50">
                <div>
                    <hr class="border-dotted border-gray-300 my-2">
                    <span class="text-gray-500">Element Information</span>
                    <textarea class="text-blue-500 font-medium w-full border border-gray-200 outline-0 p-2" type="text"
                        v-model="form.information"></textarea>
                </div>

                <ElementSurveyQuestion v-if="(form.qty ?? -1) < 0" :property="'qty'" :suggested-value="survey?.qty ?? 0"
                    :question="`Is the quantity of the element <strong>${survey?.qty} ${element.qtyUnit}</strong>?`"
                    @update="updateForm" />

                <div v-else class="py-3 relative">
                    <DetailItemValue label="Quantity" :value="`${form.qty} ${element.qtyUnit}`" />
                    <UpdateIcon class="absolute right-3 top-8 h-6 opacity-30" />
                </div>

                <ElementSurveyQuestion v-if="((form.lastYear ?? 0) === 0)" :property="'lastYear'"
                    :suggested-value="survey?.lastYear ?? 0"
                    :question="`Was the element last added or replaced in <strong>${survey?.lastYear}</strong>?`"
                    @update="updateForm" />

                <div v-else class="py-3 relative">
                    <DetailItemValue label="Latest Year Added or Replaced" :value="form.lastYear" />
                    <UpdateIcon class="absolute right-3 top-8 h-6 opacity-30" />
                </div>

                <ElementSurveyQuestion v-if="((form.adjRemainingYears ?? 0) <= 0)" :property="'adjRemainingYears'"
                    :suggested-value="survey?.remainingYears ?? 0"
                    :question="`Do you agree that the element's remaining life is <strong>${survey?.remainingYears}</strong> years?`"
                    @update="updateForm" />
                <div v-else class="py-3 relative">
                    <DetailItemValue label="Adjusted Remaining Years" :value="form.adjRemainingYears" />
                    <UpdateIcon class="absolute right-3 top-8 h-6 opacity-30" />
                </div>

                <ElementSurveyQuestion :property="'condition'" :suggested-value="form.condition ?? 1"
                    :question="`What is the condition of the element?`" :options="'condition'" @update="updateForm" />



                <div class="flex space-x-3 my-10">
                    <button v-if="completed" @click="confirm" class="py-2 px-4 shadow text-white bg-blue-500 rounded">
                        Confirm Evaluation
                    </button>
                    <button @click="close" class="py-2 px-4 shadow rounded">Cancel</button>
                </div>
            </div>



        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useElementSurveys } from '@/stores/element.surveys';
    import type { ConditionNumber, Element } from '@/types/element';
    import type { ElementSurvey } from '@/types/elementSurvey';
    import ModalWrapper from './ModalWrapper.vue';
    import DetailItemValue from './DetailItemValue.vue';
    import ElementSurveyQuestion from './ElementSurveyQuestion.vue';
    import UpdateIcon from './icons/UpdateIcon.vue';

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
        qty: -1,
        lastYear: 0,
        condition: 1,
        remainingYears: 0,
        adjRemainingYears: -1,
        information: '',
    })

    const completed = computed(() => {
        return ((form.value.qty ?? 0) >= 0) &&
            (form.value.lastYear ?? 0 > 1990) &&
            ((form.value.adjRemainingYears ?? 0) >= 0) &&
            ([1, 2, 3, 4].includes(form.value.condition ?? 0))
    })

    type FormKeys = keyof typeof form.value;
    const updateForm = (property: FormKeys, value: ConditionNumber | string | number) => {
        // @ts-expect-error: Type narrowing is handled by the caller
        form.value[property] = value
    }

    const confirm = async () => {
        const storable = JSON.parse(JSON.stringify(form.value))
        await elementSurveys.add(storable);
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
            form.value.condition = n.condition
            form.value.information = n.information
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