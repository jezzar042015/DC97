<template>
    <main class="h-screen bg-gray-100">
        <div class="px-4 pb-4 pt-12 h-full space-y-2">
            <div class="w-full">
                <div class="flex space-x-2">
                    <input type="search" class="bg-white shadow p-3 outline-0 rounded-sm" placeholder="Search">
                    <div>
                        <button class="bg-white shadow py-4 px-5 text-sm rounded-sm whitespace-nowrap"> Show
                            Filter</button>
                    </div>
                </div>
            </div>
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