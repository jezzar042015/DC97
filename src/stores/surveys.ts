import { defineStore } from "pinia";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import type { Survey } from "@/types/survey";
import { computed, watch } from "vue";

export const useSurveysStore = defineStore('surveys', () => {
    const { data: items, isFinished } = useIDBKeyval<Survey[]>(
        'dc97-surveys',
        []
    )

    const orderedList = computed(() => {
        return items.value.sort((a, b) => b.date.localeCompare(a.date) && b.whq.localeCompare(a.whq))
    })

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

    const remove = async (uniqueKey: string) => {
        items.value = items.value.filter(f => f.uniqueKey !== uniqueKey);
        await waitUntilFinished();
    }

    const batchRemove = async (whq: string) => {
        const filtered = items.value.filter(s => s.whq !== whq);
        items.value = JSON.parse(JSON.stringify(filtered));
        await waitUntilFinished();
    }

    return {
        items,
        orderedList,
        add,
        remove,
        getByFacility,
        batchRemove
    }
})