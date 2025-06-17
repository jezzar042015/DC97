import { defineStore } from "pinia";
import { useElementsStore } from "./elements";
import { computed, ref } from "vue";
import { useElementSurveys } from "./element.surveys";

export const useElementStore = defineStore('element', () => {
    const elements = useElementsStore()
    const elementSurveys = useElementSurveys()
    const currentSrcRow = ref<number>(0)
    const currentWhq = ref<string>("")

    const load = async (srcRow: number, whq: string) => {
        currentSrcRow.value = srcRow
        currentWhq.value = whq
    }

    const element = computed(() => {
        return elements.elements.find(
            f => f.srcRow === currentSrcRow.value &&
                f.whq === currentWhq.value
        );
    })

    const surveys = computed(() => {
        if (!element.value) return []
        const srcRow = Number(element.value.srcRow)
        return elementSurveys.elementSurveys
            .filter(
                e => e.srcRow == srcRow &&
                    e.whq === element.value?.whq)
            .sort(
                (a, b) => a.surveyKey.localeCompare(b.surveyKey)
            )
    })

    const previousSurvey = computed(() => {
        if (surveys.value.length == 0) return null
        return surveys.value[0]
    })

    const currentSurvey = computed(() => {
        if (surveys.value.length > 1) return null
        return surveys.value[1]
    })

    return {
        element,
        load,
        surveys,
        previousSurvey,
        currentSurvey
    }
})