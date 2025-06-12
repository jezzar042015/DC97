import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import { defineStore } from "pinia";
import type { Element } from "@/types/element";
import { watch } from "vue";

export const useElementsStore = defineStore('elements', () => {

    const { data: elements, isFinished } = useIDBKeyval<Element[]>(
        'dc97-elements',
        []
    )

    const batchAdd = async (whq: string, facilityElements: Element[]) => {
        await batchRemove(whq)
        if (!isFinished.value) {
            await new Promise(resolve => {
                const stop = watch(isFinished, (val) => {
                    if (val) {
                        stop();
                        resolve(null);
                    }
                });
            });
        }
        // Ensure only plain objects are stored (remove reactivity)
        elements.value = [
            ...elements.value.map(e => JSON.parse(JSON.stringify(e))),
            ...facilityElements.map(e => JSON.parse(JSON.stringify(e)))
        ]
    }

    const batchRemove = async (whq: string) => {
        elements.value = elements.value.filter(f => f.whq !== whq);
        // cascade delete surveys, buildings, and elements
    }


    return {
        elements,
        batchAdd,
        batchRemove
    }
})