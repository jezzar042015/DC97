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
        batchAdd
    }
})