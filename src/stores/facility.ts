import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useFacilitiesStore } from "./facilities";

export const useFacilityStore = defineStore('facility', () => {

    const facilities = useFacilitiesStore();
    const targetWhq = ref<string>("")

    const facility = computed(() => {
        return facilities.facilities.find(f => f.whq === targetWhq.value);
    });

    const load = async (whq: string) => {
        targetWhq.value = whq
    }

    return {
        facility,
        load
    }
})