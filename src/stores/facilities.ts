import { defineStore } from "pinia";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval.mjs";
import type { Facility } from '@/types/facility';

export const useFacilitiesStore = defineStore('facilities', () => {

    const { data: facilities, isFinished } = useIDBKeyval<Facility[]>(
        'dc97-facilities',
        []
    )

    const add = (facility: Facility) => {
        const exist = facilities.value.find(f => f.whq === facility.whq);
        console.log(exist?.whq);
        if (!exist) {

            facilities.value.push(facility)
        }
    }

    const remove = (whq: string) => {
        facilities.value = facilities.value.filter(f => f.whq !== whq);
        // cascade delete surveys, buildings, and elements
    }

    return {
        facilities,
        add,
        remove
    }
})