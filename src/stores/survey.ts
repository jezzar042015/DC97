import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSurveysStore } from "./surveys";
import { useElementsStore } from "./elements";

export const useSurveyStore = defineStore('survey', () => {

    const surveys = useSurveysStore();
    const elementsStore = useElementsStore()
    const targetKey = ref<string>('')

    const target = computed(() => {
        return surveys.items.find(s => s.uniqueKey === targetKey.value)
    });

    const load = async (key: string) => {
        targetKey.value = key;
    }

    const elements = computed(() => {
        if (!target.value) return []
        return elementsStore.elements.filter(e => e.whq.startsWith(target.value?.whq ?? ''))
    })

    return {
        target,
        elements,
        load
    }
})