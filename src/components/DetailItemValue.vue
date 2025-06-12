<template>
    <div class="space-x-3 items-center">
        <div class="text-sm text-gray-600">{{ label }}</div>
        <div class="font-bold">{{ value }}</div>
    </div>
</template>

<script setup lang="ts">
    const { label, value } = defineProps<{
        label: string,
        value: string | number | undefined
    }>()
</script>