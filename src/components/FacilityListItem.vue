<template>
    <div class="px-4 py-5 shadow-lg bg-white rounded-sm space-y-0 relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
        @click="handleClick">
        <div class="flex justify-between">
            <span class="text-sm uppercase">{{ facility.primaryUse }}</span>
            <span class="text-xs">{{ facility.whq }}</span>
        </div>
        <div class="text-lg text-amber-600 leading-6">{{ facility.location }}</div>

        <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
            :size="ripple.size" @remove="removeRipple" />
    </div>
</template>

<script setup lang="ts">
    import type { Facility } from '@/types/facility';
    import { useRipple } from '@/composables/useRipple';
    import Ripple from '@/components/Ripple.vue';

    const { facility } = defineProps<{
        facility: Facility
    }>();

    const { ripples, createRipple, removeRipple } = useRipple();

    const handleClick = (event: MouseEvent) => {
        createRipple(event, event.currentTarget as HTMLElement);
    };
</script>