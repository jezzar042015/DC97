<template>
    <div class="fixed bottom-0 left-0 w-full px-4 py-4 bg-gray-200 shadow-2xl">
        <div class="flex justify-between space-x-8 px-10">
            <div class="flex flex-col space-y-1 items-center" @click="gotoFacilities">
                <span class="text-xs"> Facilities</span>
                <HomeIcon class="h-5" />
            </div>
            <div class="flex flex-col space-y-1 items-center">
                <span class="text-xs"> Evaluations</span>
                <CheckSquareIcon class="h-5" />
            </div>
            <div class="flex flex-col space-y-1 items-center">
                <span class="text-xs"> Elements</span>
                <LayersMinimilasticIcon class="h-5" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import HomeIcon from './icons/HomeIcon.vue';
    import CheckSquareIcon from './icons/CheckSquareIcon.vue';
    import LayersMinimilasticIcon from './icons/LayersMinimilasticIcon.vue';

    const router = useRouter()

    const gotoFacilities = () => {
        router.push({ name: 'home' })
    }
</script>