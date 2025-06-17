<template>
    <main class="h-screen bg-gray-50">
        <div ref="swipe-target" class="px-4 pb-4 pt-12 space-y-3" v-if="elementStore.element">
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

                <div class="space-x-3 items-center">
                    <div class="text-orange-400">{{ elementStore.element.name }}</div>
                    <div class="font-bold text-xl text-orange-400">{{ elementStore.element.component }}</div>
                </div>
            </div>

            <ElementCurrentSurvey :element="elementStore.element" @load-survey-form="loadSurveyForm" />
            <ElementSurveyCard :scope="'previous'" :element="elementStore.element" />

            <pre>{{ direction }}</pre>
            <pre>{{ dir }}</pre>
            <pre class="xs">{{ nextElement?.srcRow }}</pre>
            <pre class="xs">{{ prevElement?.srcRow }}</pre>
        </div>
    </main>
    <SurveyForm v-if="surveyForm === 'facility-survey'" @unload-survey-form="unloadSurveyForm" />
    <ElementSurveyForm v-if="surveyForm === 'element-survey' && elementStore.element" :element="elementStore.element"
        @unload-survey-form="unloadSurveyForm" />
</template>

<script setup lang="ts">
    import { useElementStore } from '@/stores/element';
    import { useFacilityStore } from '@/stores/facility';
    import { onMounted, ref, useTemplateRef, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useSwipe } from '@vueuse/core';
    import type { Element } from '@/types/element';
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import ElementSurveyCard from '@/components/ElementSurveyCard.vue';
    import ElementCurrentSurvey from '@/components/ElementCurrentSurvey.vue';
    import SurveyForm from '@/components/SurveyForm.vue';
    import ElementSurveyForm from '@/components/ElementSurveyForm.vue';

    const elementStore = useElementStore()
    const router = useRouter()
    const facilityStore = useFacilityStore()
    const nextElement = ref<Element | undefined>()
    const prevElement = ref<Element | undefined>()

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

    const findElementSiblings = (index: number) => {
        if (facilityStore.elements.length - 1 >= index) {
            nextElement.value = facilityStore.elements[index + 1]
        }

        if (index > 0) {
            prevElement.value = facilityStore.elements[index - 1]
        }
    }

    const el = useTemplateRef('swipe-target')
    const { isSwiping, direction } = useSwipe(el)

    const dir = ref('')

    const gotoNextElement = async () => {
        // if (!nextElement.value) return
        dir.value = 'gotoNextElement';
        router.push({ name: 'element-detail', params: { whq: nextElement.value?.whq, srcRow: nextElement.value?.srcRow } })
        await loadUrlWhq()
    }

    const gotoPreviousElement = async () => {
        // if (!prevElement.value) return
        dir.value = 'gotoPreviousElement';
        router.push({ name: 'element-detail', params: { whq: prevElement.value?.whq, srcRow: prevElement.value?.srcRow } })
        dir.value = JSON.stringify(router.currentRoute.value.params)
        await loadUrlWhq()
    }

    watch(
        () => elementStore.element,
        (n) => {
            if (!n) return
            const elementIndex = facilityStore.elements.findIndex(e => e.srcRow == n.srcRow)
            dir.value = String(elementIndex)
            findElementSiblings(elementIndex)
        }
    )

    watch(
        () => direction.value,
        (n) => {
            if (n === 'right') gotoPreviousElement()
            if (n === 'left') gotoNextElement()
        },
        { immediate: true }
    )

    onMounted(async () => {
        await loadUrlWhq()
    })
</script>