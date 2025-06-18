<template>
    <div class="fixed bottom-0 left-0 w-full px-4 py-3 bg-gray-200 shadow-2xl">
        <div class="flex justify-between space-x-8 px-10">
            <div v-for="item in navItems" :key="item.name" class="flex flex-col space-y-1 items-center cursor-pointer"
                @click="navigate(item.name)">
                <span :class="['text-xs', currentView === item.name ? 'text-blue-500' : 'text-black']">
                    {{ item.label }}
                </span>
                <component :is="item.icon" class="h-5" :stroke="currentView === item.name ? 'blue-500' : 'default'" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'

    import HomeIcon from './icons/HomeIcon.vue'
    import CheckSquareIcon from './icons/CheckSquareIcon.vue'
    import LayersMinimilasticIcon from './icons/LayersMinimilasticIcon.vue'

    const router = useRouter()

    const currentView = computed(() => router.currentRoute.value.name)

    const navItems = [
        { name: 'home', label: 'Facilities', icon: HomeIcon },
        { name: 'surveys', label: 'Evaluations', icon: CheckSquareIcon },
        { name: 'elements', label: 'Elements', icon: LayersMinimilasticIcon },
    ]

    const navigate = (name: string) => router.push({ name })
</script>
