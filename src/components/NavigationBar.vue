<template>
    <div class="fixed bottom-0 left-0 w-full px-4 py-5 bg-gray-200 shadow-2xl">
        <div class="flex justify-center">
            <div class="flex space-x-2 items-center" @click="gotoHome">
                <HomeIcon class="h-5" />
                <span> Home</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import HomeIcon from './icons/HomeIcon.vue';

    const router = useRouter()

    const gotoHome = () => {
        router.push({ name: 'home' })
    }
</script>