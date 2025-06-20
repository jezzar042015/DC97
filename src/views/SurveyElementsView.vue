<template>
    <main class="h-screen bg-gray-100">
        <div class="px-4 pb-4 pt-12 h-full space-y-2">
            <ElementsFilter :keywords="keyWords" @update-search="updateSearch" />
            <div class="px-4 bg-white">
                <template v-for="element in filtered" :key="`${element.whq}_${element.srcRow}`">
                    <ElementListItem :element="element" @click="viewElement(element.whq, element.srcRow)" />
                </template>
            </div>
        </div>

    </main>
    <NavigationBar />
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useElementsStore } from '@/stores/elements';
    import { useRouter } from 'vue-router';
    import ElementListItem from '@/components/ElementListItem.vue';
    import ElementsFilter from '@/components/ElementsFilter.vue';
    import NavigationBar from '@/components/NavigationBar.vue';

    const elementsStore = useElementsStore()
    const router = useRouter()
    const keyWords = ref('')

    const updateSearch = (search: string) => {
        keyWords.value = search
    }

    const filtered = computed(() => {

        if (keyWords.value) {
            const search = keyWords.value.toLowerCase()
            return elementsStore.elements.filter((e) => {
                const elementString = JSON.stringify(e).toLowerCase()
                return elementString.includes(search)
            })
        }

        return elementsStore.elements
    })

    const viewElement = async (whq: string, srcRow: number) => {
        await new Promise(resolve => setTimeout(resolve, 200));
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