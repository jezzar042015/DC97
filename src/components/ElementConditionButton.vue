<template>
    <button @click="handleClick($event, number)" :class="[
        'text-base flex-1 py-2 px-5 rounded relative overflow-hidden transition-all duration-300 active:scale-[0.98]',
        {
            1: isActive(1) ? 'bg-blue-500 text-white shadow' : defaultClass,
            2: isActive(2) ? 'bg-yellow-300 text-black shadow' : defaultClass,
            3: isActive(3) ? 'bg-orange-400 text-white shadow' : defaultClass,
            4: isActive(4) ? 'bg-red-500 text-white shadow' : defaultClass,
        }[number]
    ]">
        {{ number }}
        <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
            :size="ripple.size" @remove="removeRipple" :color="bgRipple" />
    </button>
</template>

<script setup lang="ts">
    import { useRipple } from '@/composables/useRipple';
    import { computed } from 'vue'
    import type { ConditionNumber } from '@/types/element';
    import Ripple from './Ripple.vue';
    import type { RippleColor } from '@/data/lib/themes';

    const props = defineProps<{
        number: ConditionNumber
        active: ConditionNumber
    }>()

    const emits = defineEmits(['click'])

    const defaultClass = 'bg-white text-black/90 border border-gray-200'

    function isActive(n: number) {
        return props.active === n
    }

    const { ripples, createRipple, removeRipple } = useRipple();

    const handleClick = (event: MouseEvent, num: ConditionNumber) => {
        createRipple(event, event.currentTarget as HTMLElement);
        emits('click', num)
    };

    const bgRipple = computed(() => {
        const lib: Record<ConditionNumber, RippleColor> = {
            1: 'blue',
            2: 'yellow',
            3: 'orange',
            4: 'red',
        }
        return lib[props.active]
    })
</script>
