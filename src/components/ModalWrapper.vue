<template>
    <div class="fixed top-0 left-0 min-h-screen w-full bg-black/75">
        <div :class="['flex flex-col items-center', `px-${px} py-${py}`]">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { px = 3, py = 3 } = defineProps<{
        px?: number
        py?: number
    }>()
</script>