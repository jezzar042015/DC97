import { defineStore } from "pinia";
import { useElementsStore } from "./elements";
import { computed, ref } from "vue";

export const useElementStore = defineStore('element', () => {
    const elements = useElementsStore()
    const currentSrcRow = ref<number>(0)
    const currentWhq = ref<string>("")

    const load = async (srcRow: number, whq: string) => {
        currentSrcRow.value = srcRow
        currentWhq.value = whq
    }

    const element = computed(() => {
        return elements.elements.find(
            f => f.srcRow === currentSrcRow.value &&
                f.whq === currentWhq.value
        );
    })

    return {
        element,
        load
    }
})