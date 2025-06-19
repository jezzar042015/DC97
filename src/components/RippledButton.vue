<template>
    <button @click="handleClick"
        class="shadow py-3 w-full bg-blue-700 text-white relative overflow-hidden transition-all duration-300 active:scale-[0.98]">
        {{ label }}
        <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
            :size="ripple.size" @remove="removeRipple" />
    </button>
</template>

<script setup lang="ts">
    import { useRipple } from '@/composables/useRipple';
    import Ripple from './Ripple.vue';

    const { label } = defineProps<{
        label: string
    }>()

    const { ripples, createRipple, removeRipple } = useRipple();

    const handleClick = (event: MouseEvent) => {
        createRipple(event, event.currentTarget as HTMLElement);
    };
</script>