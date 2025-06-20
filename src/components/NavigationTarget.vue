<template>
    <div class="min-w-20 flex flex-col pt-7 py-3 -mt-5 h-24 w-28 rounded-full space-y-1 items-center cursor-pointer relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
        @click="handleClick">
        <span :class="['text-xs', currentView === item.name ? 'text-blue-500' : 'text-black']">
            {{ item.label }}
        </span>
        <component :is="item.icon" class="h-5" :stroke="currentView === item.name ? 'blue-500' : 'default'" />

        <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
            :size="ripple.size" @remove="removeRipple" />
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useRipple } from '@/composables/useRipple';
    import type { NavigationItem } from '@/types/navigation';
    import Ripple from './Ripple.vue';

    const router = useRouter()
    const { item } = defineProps<{
        item: NavigationItem
    }>()

    const currentView = computed(() => router.currentRoute.value.name)

    const { ripples, createRipple, removeRipple } = useRipple();

    const handleClick = (event: MouseEvent) => {
        createRipple(event, event.currentTarget as HTMLElement);
    };

</script>