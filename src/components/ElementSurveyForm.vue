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
                        <DetailItemValue :label="element.name" :value="element.component" />
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-auto px-4 bg-gray-50">
                <div>
                    <hr class="border-dotted border-gray-300 my-2">
                    <span class="text-gray-700">Element Information</span>
                    <textarea class="text-blue-500 font-medium w-full border border-gray-200 outline-0 p-2" type="text"
                        v-model="form.information"></textarea>
                </div>

                <div>
                    <ElementSurveyQuestion :mode="mode" v-if="!completedItems.includes('qty')" :property="'qty'"
                        :suggested-value="form.qty ?? 0"
                        :question="`Is the quantity of the element <strong>${form.qty} ${element.qtyUnit}</strong>?`"
                        @update="updateForm" />

                    <div v-else class="py-3 relative">
                        <DetailItemValue label="Quantity" :value="`${form.qty} ${element.qtyUnit}`" />
                        <UpdateIcon class="absolute right-3 top-8 h-6 opacity-30" @click="removeAsCompleted('qty')" />
                    </div>
                </div>

                <ElementSurveyQuestion :mode="mode" v-if="!completedItems.includes('lastYear')" :property="'lastYear'"
                    :suggested-value="form.lastYear ?? 0"
                    :question="`Was the element last added or replaced in <strong>${form.lastYear}</strong>?`"
                    @update="updateForm" />

                <div v-else class="py-3 relative">
                    <DetailItemValue label="Latest Year Added or Replaced" :value="form.lastYear" />
                    <UpdateIcon class="absolute right-3 top-8 h-6 opacity-30" @click="removeAsCompleted('lastYear')" />
                </div>

                <ElementSurveyQuestion :mode="mode" v-if="!completedItems.includes('adjRemainingYears')"
                    :property="'adjRemainingYears'" :suggested-value="form.adjRemainingYears ?? 0"
                    :question="`Do you agree that the element's remaining life is <strong>${form.adjRemainingYears}</strong> years?`"
                    @update="updateForm" />
                <div v-else class="py-3 relative">
                    <DetailItemValue label="Adjusted Remaining Years" :value="form.adjRemainingYears" />
                    <UpdateIcon class="absolute right-3 top-8 h-6 opacity-30"
                        @click="removeAsCompleted('adjRemainingYears')" />
                </div>

                <ElementSurveyQuestion :mode="mode" :property="'condition'" :suggested-value="form.condition ?? 1"
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
    import { computed, onMounted, ref, watch } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useElementSurveys } from '@/stores/element.surveys';
    import type { ConditionNumber, Element } from '@/types/element';
    import type { ElementSurvey } from '@/types/elementSurvey';
    import type { FormMode } from '@/data/lib/form';
    import ModalWrapper from './ModalWrapper.vue';
    import DetailItemValue from './DetailItemValue.vue';
    import ElementSurveyQuestion from './ElementSurveyQuestion.vue';
    import UpdateIcon from './icons/UpdateIcon.vue';

    const emits = defineEmits(['unload-survey-form'])
    const close = () => emits('unload-survey-form')
    const surveysStore = useSurveysStore()
    const elementSurveys = useElementSurveys()

    const { element, mode = 'new' } = defineProps<{
        element: Element
        mode?: FormMode
    }>()

    const completedItems = ref<string[]>([])
    const addAsCompleted = (property: string) => completedItems.value.push(property)
    const removeAsCompleted = (property: string) => completedItems.value = completedItems.value.filter(p => p !== property)

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

        let uniqueKey = '';
        if (mode === 'new') {
            uniqueKey = previousSurvey.value?.uniqueKey ?? '';
        } else if (mode === 'update') {
            uniqueKey = currentSurvey.value?.uniqueKey ?? '';
        }

        return elementSurveys.elementSurveys.find(e =>
            e.key === (element.uniqueKey) &&
            e.surveyKey === uniqueKey &&
            e.srcRow === element.srcRow
        )
    })

    const designAdjustedYear = computed(() => {
        if (!currentSurvey.value) return 0
        return element.life - (currentSurvey.value.year - (form.value.lastYear ?? 0))
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
        const requiredProps = ['qty', 'lastYear', 'adjRemainingYears', 'condition']
        return requiredProps.every(prop => completedItems.value.includes(prop))
    })

    type FormKeys = keyof typeof form.value;
    const updateForm = (property: FormKeys, value: ConditionNumber | string | number) => {
        // @ts-expect-error: Type narrowing is handled by the caller
        form.value[property] = value
        addAsCompleted(property)
    }

    const confirm = async () => {
        const storable = JSON.parse(JSON.stringify(form.value))
        if (mode == 'new') {
            await elementSurveys.add(storable);
        } else if (mode == 'update') {
            await elementSurveys.update(storable);
        }
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

            form.value.qty = n.qty
            form.value.lastYear = n.lastYear
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
            form.value.remainingYears = element.life - (n.year - (form.value.lastYear ?? 0))
            form.value.adjRemainingYears = form.value.remainingYears

        },
        {
            immediate: true
        }
    );

    // TODO: Erronous Here
    watch(
        () => form.value.lastYear,
        (n) => {
            form.value.remainingYears = element.life - (currentSurvey.value?.year ?? 0 - (n ?? 0))
            form.value.adjRemainingYears = form.value.remainingYears
        }
    )

    watch(() => form.value.condition,
        (n) => {
            if (n == 4) {
                form.value.adjRemainingYears = 0
            } else {
                form.value.adjRemainingYears = designAdjustedYear.value
            }
        }
    )

    onMounted(() => {
        if (mode == 'update') {
            completedItems.value = [
                'qty', 'lastYear', 'adjRemainingYears', 'condition'
            ]
        }
    })

</script>