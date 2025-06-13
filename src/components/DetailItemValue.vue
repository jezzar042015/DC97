<template>
    <div class="space-x-3 items-center">
        <div class="text-sm text-gray-600">{{ label }}</div>
        <div :class="[{ 'font-bold': bold }, `text-${size}`]">{{ value }}</div>
    </div>
</template>

<script setup lang="ts">
    const { label, value, bold = true, size = 'base' } = defineProps<{
        label: string,
        value: string | number | undefined | null
        bold?: boolean
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    }>()
</script>