<template>
    <main class="h-screen bg-gray-50">
        <div class="p-4 space-y-3" v-if="elementStore.element">
            <div class="space-y-3 p-6 shadow bg-white">
                <div v-if="facilityStore.facility" class="">
                    <DetailItemValue :label="`${facilityStore.facility.primaryUse}  (${facilityStore.facility.whq})`"
                        :value="facilityStore.facility.location" />
                    <hr class="border-amber-400 mt-2">
                </div>

                <DetailItemValue label="Category" :value="elementStore.element.categoryGroup" />

                <div class="flex justify-between">
                    <DetailItemValue label="Element No" :value="elementStore.element.num" />
                    <DetailItemValue label="Cost Code" :value="elementStore.element.costCode" />
                    <DetailItemValue label="Unit" :value="elementStore.element.unit" />
                </div>

                <DetailItemValue :label="elementStore.element.name" :value="elementStore.element.component"
                    :size="'2xl'" />
            </div>

            <ElementPreviousSurvey :element="elementStore.element" />
            <ElementCurrentSurvey :element="elementStore.element" @load-survey-form="loadSurveyForm" />
        </div>
    </main>
    <SurveyForm v-if="surveyForm === 'facility-survey'" @unload-survey-form="unloadSurveyForm" />
    <ElementSurveyForm v-if="surveyForm === 'element-survey' && elementStore.element" :element="elementStore.element"
        @unload-survey-form="unloadSurveyForm" />
</template>

<script setup lang="ts">
    import { useElementStore } from '@/stores/element';
    import { useFacilityStore } from '@/stores/facility';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import ElementPreviousSurvey from '@/components/ElementPreviousSurvey.vue';
    import ElementCurrentSurvey from '@/components/ElementCurrentSurvey.vue';
    import SurveyForm from '@/components/SurveyForm.vue';
    import ElementSurveyForm from '@/components/ElementSurveyForm.vue';

    const elementStore = useElementStore()
    const router = useRouter()
    const facilityStore = useFacilityStore()

    const surveyForm = ref<'facility-survey' | 'element-survey' | ''>('')
    const loadSurveyForm = (form: 'facility-survey' | 'element-survey') => surveyForm.value = form
    const unloadSurveyForm = (next?: string) => {
        surveyForm.value = ''
        if (next == 'element-survey-form') {
            loadSurveyForm('element-survey')
        }
    }

    const loadUrlWhq = async () => {
        const whq = router.currentRoute.value.params.whq
        const srcRow = router.currentRoute.value.params.srcRow

        if (!srcRow || !whq) return
        await elementStore.load(Number(srcRow), whq.toString())

        if (facilityStore.facility) return
        facilityStore.load(whq.toString())
    }

    onMounted(async () => {
        await loadUrlWhq()
    })
</script>