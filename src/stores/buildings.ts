import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import { defineStore } from "pinia";
import { watch } from "vue";
import type { Building } from "@/types/building";

export const useBuildingsStore = defineStore('buildings', () => {
    const { data: buildings, isFinished } = useIDBKeyval<Building[]>(
        'dc97-buildings',
        []
    );

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

    const update = async (bldg: Building) => {
        const index = buildings.value.findIndex(b => b.whq == bldg.whq)
        if (index > -1) {
            const storable = JSON.parse(JSON.stringify(bldg))
            buildings.value[index] = storable
            await waitUntilFinished()
        }
    }

    const batchRemove = async (whq: string) => {
        const filtered = buildings.value.filter(b => b.facilityWhq !== whq);
        buildings.value = JSON.parse(JSON.stringify(filtered));
        await waitUntilFinished();
    }

    const batchAdd = async (whq: string, facilityBuildings: Element[]) => {
        await batchRemove(whq)

        // Ensure only plain objects are stored (remove reactivity)
        buildings.value = [
            ...buildings.value.map(e => JSON.parse(JSON.stringify(e))),
            ...facilityBuildings.map(e => JSON.parse(JSON.stringify(e)))
        ]
    }

    return {
        buildings,
        batchRemove,
        batchAdd,
        update
    }
})