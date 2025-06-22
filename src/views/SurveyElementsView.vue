<template>
    <main class="h-screen bg-gray-100">
        <div class="px-4 pb-4 pt-12 h-full space-y-2">
            <ElementsFilters :keywords="keyWords" @update-search="updateSearch" @show-filter-form="showFilterForm" />
            <div class="px-4 bg-white">
                <p class="text-xs text-right pt-2">{{ filtered.length }} items</p>
                <template v-for="element in filtered" :key="`${element.whq}_${element.srcRow}`">
                    <ElementListItem :element="element" @click="viewElement(element.whq, element.srcRow)" />
                </template>
            </div>
        </div>

    </main>
    <NavigationBar />
    <ElementsFilterForm v-if="filterForm" @hide-filter-form="hideFilterForm" @update-filter="updateFilter" />
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useElementsStore } from '@/stores/elements';
    import { useRouter } from 'vue-router';
    import ElementListItem from '@/components/ElementListItem.vue';
    import ElementsFilters from '@/components/ElementsFilters.vue';
    import NavigationBar from '@/components/NavigationBar.vue';
    import ElementsFilterForm from '@/components/ElementsFilterForm.vue';

    const elementsStore = useElementsStore()
    const router = useRouter()
    const keyWords = ref('')

    const filterForm = ref(false)
    const showFilterForm = () => filterForm.value = true
    const hideFilterForm = () => filterForm.value = false

    const updateSearch = (search: string) => {
        keyWords.value = search
    }

    const whq = ref('')
    const categoryGroup = ref('')
    const status = ref('')

    const updateFilter = (prop: string, value: string) => {
        if (prop === 'whq') {
            whq.value = value
        } else if (prop === 'categoryGroup') {
            categoryGroup.value = value
        } else if (prop === 'status') {
            status.value = value
        }
    }

    const filtered = computed(() => {
        let list = [...elementsStore.elements]

        if (whq.value) {
            list = list.filter(e => e.whq === whq.value)
        }

        if (categoryGroup.value) {
            list = list.filter(e => e.categoryGroup === categoryGroup.value)
        }

        if (keyWords.value) {
            const search = keyWords.value.toLowerCase()
            return list.filter((e) => {
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