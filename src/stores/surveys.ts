import { defineStore } from "pinia";
import { ref } from "vue";
import type { Survey } from "@/types/survey";
import { testSurveys } from "@/data/test/surveys";

export const useSurveysStore = defineStore('surveys', () => {
    const items = ref<Survey[]>([...testSurveys])

    const getByFacility = (whq: string) => {
        const surveys = items.value
            .filter(f => f.whq == whq)
            .sort((a, b) => a.year - b.year);

        return {
            previous: surveys.length > 0 ? surveys[0] : undefined,
            newSurvey: surveys.length > 1 ? surveys[1] : undefined
        }
    }

    return {
        items,
        getByFacility
    }
})