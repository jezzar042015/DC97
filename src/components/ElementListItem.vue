<template>
    <div class=" border-b border-b-gray-200 py-3 px-1">
        <div class="text-xs">{{ element.category }}</div>
        <div class="font-medium">{{ element.name }}</div>
        <div class="text-sm">{{ element.component }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { Element } from '@/types/element';

    const { element } = defineProps<{
        element: Element
    }>()
</script>