import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useFacilitiesStore } from "./facilities";
import { useElementsStore } from "./elements";

export const useFacilityStore = defineStore('facility', () => {

    const facilities = useFacilitiesStore();
    const elementsStore = useElementsStore()
    const targetWhq = ref<string>("")

    const facility = computed(() => {
        return facilities.facilities.find(f => f.whq === targetWhq.value);
    });

    const load = async (whq: string) => {
        targetWhq.value = whq
    }

    const elements = computed(() => {
        if (!facility.value) return []
        return elementsStore.elements.filter(f => f.whq === facility.value?.whq)
    })

    return {
        facility,
        load,
        elements
    }
})