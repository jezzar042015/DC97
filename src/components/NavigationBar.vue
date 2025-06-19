<template>
    <div class="fixed bottom-0 left-0 w-full px-4 py-0 bg-white shadow-2xl">
        <div class="flex justify-between space-x-4 px-5">
            <template v-for="item in navItems" :key="item.name">
                <NavigationTarget :item="item" @click="navigate(item.name)" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import type { NavigationItem } from '@/types/navigation'

    import HomeIcon from './icons/HomeIcon.vue'
    import CheckSquareIcon from './icons/CheckSquareIcon.vue'
    import LayersMinimilasticIcon from './icons/LayersMinimilasticIcon.vue'
    import NavigationTarget from './NavigationTarget.vue'

    const router = useRouter()

    const navItems: NavigationItem[] = [
        { name: 'home', label: 'Facilities', icon: HomeIcon },
        { name: 'surveys', label: 'Evaluations', icon: CheckSquareIcon },
        { name: 'elements', label: 'Elements', icon: LayersMinimilasticIcon },
    ]

    const navigate = async (name: string) => {
        router.push({ name })
    }
</script>
