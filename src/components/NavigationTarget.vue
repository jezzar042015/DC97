<template>
    <div class="min-w-20 rounded-full flex flex-col px-3 py-3 space-y-1 items-center cursor-pointer">
        <span :class="['text-xs', currentView === item.name ? 'text-blue-500' : 'text-black']">
            {{ item.label }}
        </span>
        <component :is="item.icon" class="h-5" :stroke="currentView === item.name ? 'blue-500' : 'default'" />

    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import type { NavigationItem } from '@/types/navigation';

    const router = useRouter()
    const { item } = defineProps<{
        item: NavigationItem
    }>()

    const currentView = computed(() => router.currentRoute.value.name)




</script>