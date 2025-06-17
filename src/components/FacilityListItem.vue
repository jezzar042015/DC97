<template>
    <div class="px-4 py-5 shadow-lg bg-white rounded-sm space-y-0">
        <div class="flex justify-between">
            <span class="text-sm uppercase">{{ facility.primaryUse }}</span>
            <span class="text-xs">{{ facility.whq }}</span>
        </div>
        <div class="text-lg text-amber-600 leading-6">{{ facility.location }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { Facility } from '@/types/facility';

    const { facility } = defineProps<{
        facility: Facility
    }>()

</script>