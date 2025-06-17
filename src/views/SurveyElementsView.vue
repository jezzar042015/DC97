<template>
    <main class="h-screen bg-gray-100">
        <div class="px-4 pb-4 pt-12 h-full">
            <div class="px-4 bg-white">
                <template v-for="element in elementsStore.elements" :key="`${element.whq}_${element.srcRow}`">
                    <ElementListItem :element="element" @click="viewElement(element.whq, element.srcRow)" />
                </template>
            </div>
        </div>

    </main>
    <NavigationBar />
</template>

<script setup lang="ts">
    import ElementListItem from '@/components/ElementListItem.vue';
    import NavigationBar from '@/components/NavigationBar.vue';
    import { useElementsStore } from '@/stores/elements';
    import { useRouter } from 'vue-router';

    const elementsStore = useElementsStore()
    const router = useRouter()

    const viewElement = (whq: string, srcRow: number) => {
        router.push(
            {
                name: 'element-detail',
                params: {
                    whq,
                    srcRow
                }
            }
        )
    }
</script>