import { defineStore } from "pinia";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import type { Survey } from "@/types/survey";

export const useSurveysStore = defineStore('surveys', () => {
    const { data: items, isFinished } = useIDBKeyval<Survey[]>(
        'dc97-surveys',
        []
    )

    const getByFacility = (whq: string) => {
        const surveys = items.value
            .filter(f => f.whq == whq)
            .sort((a, b) => a.year - b.year);

        return {
            previous: surveys.length > 0 ? surveys[0] : undefined,
            newSurvey: surveys.length > 1 ? surveys[1] : undefined
        }
    }

    const add = (survey: Survey) => {
        const exist = items.value.find(f => f.uniqueKey === survey.uniqueKey);
        if (!exist) {
            items.value.push(survey)
        }
    }

    const remove = (uniqueKey: string) => {
        items.value = items.value.filter(f => f.uniqueKey !== uniqueKey);
        // cascade delete elements
    }

    return {
        items,
        add,
        remove,
        getByFacility
    }
})