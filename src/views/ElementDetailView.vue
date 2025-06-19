<template>
    <main class="h-screen bg-gray-100">
        <div ref="swipe-target" class="px-4 pt-12 pb-24 space-y-3" v-if="elementStore.element">
            <div class="space-y-3 p-6 shadow bg-white">
                <div class="flex space-x-2 items-center">
                    <LeftArrow class="h-5" @click="gotoSurveySummary" />
                    <div class="text-xl">ELEMENT EVALUATION</div>
                </div>
                <hr class="border-amber-400 mt-2">
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
        </div>
    </main>
    <NavigationBar />
    <SurveyForm v-if="surveyForm === 'facility-survey'" @unload-survey-form="unloadSurveyForm" />
    <ElementSurveyForm v-if="surveyForm === 'element-survey' && elementStore.element" :element="elementStore.element"
        :mode="formMode" @unload-survey-form="unloadSurveyForm" />
</template>

<script setup lang="ts">
    import { onMounted, ref, useTemplateRef, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { useSwipe } from '@vueuse/core'

    import { useElementStore } from '@/stores/element'
    import { useFacilityStore } from '@/stores/facility'
    import type { Element } from '@/types/element'

    import DetailItemValue from '@/components/DetailItemValue.vue'
    import ElementSurveyCard from '@/components/ElementSurveyCard.vue'
    import ElementCurrentSurvey from '@/components/ElementCurrentSurvey.vue'
    import SurveyForm from '@/components/SurveyForm.vue'
    import ElementSurveyForm from '@/components/ElementSurveyForm.vue'
    import NavigationBar from '@/components/NavigationBar.vue'
    import LeftArrow from '@/components/icons/LeftArrow.vue'

    const elementStore = useElementStore()
    const facilityStore = useFacilityStore()
    const router = useRouter()

    const nextElement = ref<Element | undefined>()
    const prevElement = ref<Element | undefined>()

    const surveyForm = ref<'facility-survey' | 'element-survey' | ''>('')
    const formMode = ref<'new' | 'update'>('new')

    const loadSurveyForm = (form: 'facility-survey' | 'element-survey', mode: 'new' | 'update' = 'new') => {
        surveyForm.value = form
        formMode.value = mode
    }

    const unloadSurveyForm = (next?: string) => {
        surveyForm.value = ''
        if (next === 'element-survey-form') {
            loadSurveyForm('element-survey')
        }
    }

    const loadUrlWhq = async () => {
        const whq = router.currentRoute.value.params.whq
        const srcRow = router.currentRoute.value.params.srcRow

        if (!srcRow || !whq) return
        await elementStore.load(Number(srcRow), whq.toString())

        if (!facilityStore.facility) {
            await facilityStore.load(whq.toString())
        }
    }

    const findElementSiblings = (index: number) => {
        const elements = facilityStore.elements
        nextElement.value = elements[index + 1] ?? undefined
        prevElement.value = index > 0 ? elements[index - 1] : undefined
    }

    const swipeEl = useTemplateRef('swipe-target')
    const { direction, isSwiping } = useSwipe(swipeEl)
    const isNavigating = ref(false)

    const gotoNextElement = async () => {
        if (isNavigating.value || !nextElement.value) return
        isNavigating.value = true

        await router.push({
            name: 'element-detail',
            params: {
                whq: nextElement.value.whq,
                srcRow: nextElement.value.srcRow,
            },
        })

        await loadUrlWhq()
        isNavigating.value = false
    }

    const gotoPreviousElement = async () => {
        if (isNavigating.value || !prevElement.value) return
        isNavigating.value = true

        await router.push({
            name: 'element-detail',
            params: {
                whq: prevElement.value.whq,
                srcRow: prevElement.value.srcRow,
            },
        })

        await loadUrlWhq()
        isNavigating.value = false
    }

    const gotoSurveySummary = async () => {
        await router.push({
            name: 'survey-detail',
            params: {
                key: elementStore.previousSurvey?.surveyKey,
            },
        })
    }

    watch(
        () => elementStore.element,
        (element) => {
            if (!element) return
            const index = facilityStore.elements.findIndex(e => e.srcRow === element.srcRow)
            findElementSiblings(index)
        }
    )

    watch(
        () => direction.value,
        (dir) => {
            if (!isSwiping.value) return
            if (dir === 'left') gotoNextElement()
            else if (dir === 'right') gotoPreviousElement()
        }
    )

    onMounted(async () => {
        await loadUrlWhq()
    })
</script>
