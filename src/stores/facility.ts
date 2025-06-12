import type { Facility } from "@/types/facility";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useFacilitiesStore } from "./facilities";

export const useFacilityStore = defineStore('facility', () => {

    const facility = ref<Facility | undefined>();
    const facilities = useFacilitiesStore();

    const load = async (whq: string) => {
        const target = facilities.facilities.find(f => f.whq === whq);
        facility.value = target;
    }

    return {
        facility,
        load
    }
})