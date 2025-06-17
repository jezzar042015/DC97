import type { ElementSurvey } from "@/types/elementSurvey";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import { defineStore } from "pinia";
import { watch } from "vue";

export const useElementSurveys = defineStore('element-surveys', () => {

    const { data: elementSurveys, isFinished } = useIDBKeyval<ElementSurvey[]>(
        'dc97-element-surveys',
        []
    )

    const waitUntilFinished = async () => {
        if (isFinished.value) return;
        await new Promise<void>((resolve) => {
            const stop = watch(isFinished, (val) => {
                if (val) {
                    stop();
                    resolve();
                }
            });
        });
    };

    const batchAdd = async (surveyKey: string, newElementSurveys: ElementSurvey[]) => {
        await batchRemoveBySurvey(surveyKey)


        elementSurveys.value = [
            ...elementSurveys.value.map(e => JSON.parse(JSON.stringify(e))),
            ...newElementSurveys.map(e => JSON.parse(JSON.stringify(e)))
        ]
    }

    const add = async (elementSurve: ElementSurvey) => {
        elementSurveys.value.push(elementSurve);
        await waitUntilFinished()
    }

    const batchRemoveByWHQ = async (whq: string) => {
        const filtered = elementSurveys.value.filter(f => f.whq !== whq);
        elementSurveys.value = JSON.parse(JSON.stringify(filtered));
        await waitUntilFinished()
    }

    const batchRemoveBySurvey = async (surveyKey: string) => {
        const filtered = elementSurveys.value.filter(f => f.surveyKey !== surveyKey);
        elementSurveys.value = JSON.parse(JSON.stringify(filtered));
        await waitUntilFinished()
    }

    return {
        elementSurveys,
        batchRemoveByWHQ,
        batchRemoveBySurvey,
        batchAdd,
        add
    }
})