<template>
    <div :class="['absolute rounded-full opacity-40 pointer-events-none', bg]" :style="{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'scale(0)',
        animation: 'ripple 600ms linear',
    }" @animationend="$emit('remove', id)"></div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    type RippleColor = 'blue' | 'green'
    const bgColorLibrary: Record<RippleColor, string> = {
        'blue': 'bg-blue-300',
        'green': 'bg-emerald-300',
    }

    const { id,
        x,
        y,
        size,
        color = 'blue',
    } = defineProps<{
        id: number;
        x: number;
        y: number;
        size: number;
        color?: RippleColor
    }>();

    const bg = computed(() => {
        return bgColorLibrary[color]
    })

    defineEmits(['remove']);
</script>

<style>
    @keyframes ripple
    {
        to
        {
            transform: scale(4);
            opacity: 0;
        }
    }
</style>