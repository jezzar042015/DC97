import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import { defineStore } from "pinia";
import type { Element } from "@/types/element";
import { watch } from "vue";

export const useElementsStore = defineStore('elements', () => {

    const { data: elements, isFinished } = useIDBKeyval<Element[]>(
        'dc97-elements',
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

    const batchAdd = async (whq: string, facilityElements: Element[]) => {
        await batchRemove(whq)

        elements.value = [
            ...elements.value.map(e => JSON.parse(JSON.stringify(e))),
            ...facilityElements.map(e => JSON.parse(JSON.stringify(e)))
        ]
    }

    const batchRemove = async (whq: string) => {
        const filtered = elements.value.filter(f => f.whq !== whq);
        elements.value = JSON.parse(JSON.stringify(filtered));
        await waitUntilFinished();

    }


    return {
        elements,
        batchAdd,
        batchRemove
    }
})