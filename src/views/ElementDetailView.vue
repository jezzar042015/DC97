<template>
    <main class="h-screen bg-gray-50">
        <div class="p-4 space-y-3" v-if="elementStore.element">
            <div class="space-y-3 p-4">
                <DetailItemValue label="Element No" :value="elementStore.element.num" />
                <DetailItemValue label="Element" :value="elementStore.element.name" />
                <DetailItemValue label="Component" :value="elementStore.element.component" />
                <DetailItemValue label="Category" :value="elementStore.element.category" />
                <DetailItemValue label="Cost Code" :value="elementStore.element.costCode" />
                <DetailItemValue label="Unit" :value="elementStore.element.unit" />
                <DetailItemValue label="WHQ" :value="elementStore.element.whq" />
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import { useElementStore } from '@/stores/element';
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const elementStore = useElementStore()
    const router = useRouter()
    const loadUrlWhq = async () => {
        const key = router.currentRoute.value.params.key
        const whq = router.currentRoute.value.params.whq
        if (!key || !whq) return
        await elementStore.load(key.toString(), whq.toString())
    }

    onMounted(async () => {
        await loadUrlWhq()
    })
</script>