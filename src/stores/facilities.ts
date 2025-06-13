import { defineStore } from "pinia";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import { useBuildingsStore } from "./buildings";
import { useElementsStore } from "./elements";
import { useSurveysStore } from "./surveys";
import { useElementSurveys } from "./element.surveys";
import type { Facility } from '@/types/facility';
import { watch } from "vue";

export const useFacilitiesStore = defineStore('facilities', () => {

    const buildingsStore = useBuildingsStore();
    const elementsStore = useElementsStore()
    const surveysStore = useSurveysStore()
    const elemSurveysStore = useElementSurveys()

    const { data: facilities, isFinished } = useIDBKeyval<Facility[]>(
        'dc97-facilities',
        []
    )

    const add = (facility: Facility) => {
        const exist = facilities.value.find(f => f.whq === facility.whq);

        if (!exist) {
            facilities.value.push(facility)
        }
    }

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

    const remove = async (whq: string) => {

        await waitUntilFinished();

        const filtered = facilities.value.filter(f => f.whq !== whq);
        facilities.value = JSON.parse(JSON.stringify(filtered));

        await buildingsStore.batchRemove(whq);
        await elementsStore.batchRemove(whq);
        await surveysStore.batchRemove(whq);
        await elemSurveysStore.batchRemoveByWHQ(whq);
    }

    return {
        facilities,
        add,
        remove
    }
})