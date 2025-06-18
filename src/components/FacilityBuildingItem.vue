<template>
    <div class="px-3 py-2 shadow relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
        @click="handleClick">
        <div class="space-y-3">
            <div class="text-orange-400">
                <div>Building {{ i + 1 }}</div>
                <div class="text-xl font-bold ">{{ bldg.name }}</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <DetailItemValue label="Building WHQ" :value="bldg.whq" />
                <DetailItemValue label="Occupancy" :value="bldg.occupancy" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <DetailItemValue label="Building Condition" :value="bldg.building" />
                <DetailItemValue label="Maintenance Condition" :value="bldg.maintenance" />
            </div>
            <div class="grid grid-cols-3 gap-2">
                <DetailItemValue label="Construction" :value="bldg.construction" />
                <DetailItemValue label="Gross Floor Area" :value="bldg.gfa" />
                <DetailItemValue label="Levels" :value="bldg.levels" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <DetailItemValue label="Last Major Renovation" :value="bldg.renMajYear" v-if="bldg.renMajYear" />
                <DetailItemValue label="Projected Major Reno" :value="bldg.projRenYear" />
            </div>
        </div>
        <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
            :size="ripple.size" @remove="removeRipple" />
    </div>
</template>

<script setup lang="ts">
    import { useRipple } from '@/composables/useRipple';
    import type { Building } from '@/types/building';
    import Ripple from './Ripple.vue';
import DetailItemValue from './DetailItemValue.vue';

    const { bldg, i } = defineProps<{
        bldg: Building,
        i: number
    }>()
    const { ripples, createRipple, removeRipple } = useRipple();

    const handleClick = (event: MouseEvent) => {
        createRipple(event, event.currentTarget as HTMLElement);
    };

</script>
