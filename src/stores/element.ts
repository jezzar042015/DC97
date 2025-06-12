import { defineStore } from "pinia";
import { useElementsStore } from "./elements";
import { ref } from "vue";
import type { Element } from "@/types/element";

export const useElementStore = defineStore('element', () => {
    const elements = useElementsStore()
    const element = ref<Element | undefined>();

    const load = async (key: string, whq: string) => {
        const target = elements.elements.find(f => f.uniqueKey === key && f.whq === whq);
        element.value = target;
    }

    return {
        element,
        load
    }
})