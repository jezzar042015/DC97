import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Facility } from '@/types/facility';
import { testFacilities } from "@/data/test/facilities";

export const useFacilitiesStore = defineStore('facilities', () => {

    const facilities = ref<Facility[]>([...testFacilities])

    return {
        facilities
    }
})