import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSurveysStore } from "./surveys";
import { useElementsStore } from "./elements";
import { useFacilitiesStore } from "./facilities";

export const useSurveyStore = defineStore('survey', () => {

    const surveys = useSurveysStore();
    const elementsStore = useElementsStore()
    const facilities = useFacilitiesStore()
    const targetKey = ref<string>('')

    const target = computed(() => {
        return surveys.items.find(s => s.uniqueKey === targetKey.value)
    });

    const load = async (key: string) => {
        targetKey.value = key;
    }

    const facility = computed(() => {
        return facilities.facilities.find(f => f.whq == target.value?.whq)
    })

    const elements = computed(() => {
        if (!target.value) return []
        return elementsStore.elements.filter(e => e.whq.startsWith(target.value?.whq ?? ''))
    })

    return {
        target,
        elements,
        facility,
        load
    }
})