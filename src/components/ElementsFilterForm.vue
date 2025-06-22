<template>
    <ModalWrapper :px="5">
        <div class="bg-white shadow rounded-sm p-3 w-full mt-24">
            <div class="pt-5">
                <div class="space-y-4">
                    <div class="flex flex-col space-y-1">
                        <label for="">Facility</label>
                        <select name="" id="" v-model="whq" @change="updateFilter('whq', whq)"
                            class="py-2 px-1 border border-gray-300 outline-0 rounded-sm">
                            <option :value="''">All Facilities</option>
                            <option v-for="f in facilities" :key="f.whq" :value="f.whq">{{ f.location }}</option>
                        </select>
                    </div>

                    <div class="flex flex-col space-y-1">
                        <label for="">Category</label>
                        <select name="" id="" v-model="categoryGroup"
                            @change="updateFilter('categoryGroup', categoryGroup)"
                            class="py-2 px-1 border border-gray-300 outline-0 rounded-sm">
                            <option :value="''">All Categories</option>
                            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>

                    <div class="flex flex-col space-y-1">
                        <label for="">Status</label>
                        <select name="" id="" v-model="status" @change="updateFilter('status', status)"
                            class="py-2 px-1 border border-gray-300 outline-0 rounded-sm">
                            <option :value="''">All Status</option>
                            <option :value="'evaluated'">Evaluated</option>
                            <option :value="'not-evaluated'">Not Evaluated</option>
                        </select>
                    </div>
                </div>

                <div class="pt-5 space-x-2 text-sm">
                    <button @click="resetFilters" class="text py-2 px-4 rounded bg-blue-500 text-white shadow">
                        Clear Filters
                    </button>
                    <button @click="close" class="text py-2 px-4 shadow bg-white text-blue-500 rounded">
                        Cancel
                    </button>
                </div>
            </div>

        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import { useElementsStore } from '@/stores/elements';
    import { useFacilitiesStore } from '@/stores/facilities';
    import ModalWrapper from './ModalWrapper.vue';

    const emits = defineEmits(['hide-filter-form', 'update-filter'])
    const close = () => emits('hide-filter-form')
    const whq = ref('')
    const categoryGroup = ref('')
    const status = ref('')

    const updateFilter = (prop: string, value: string) => {
        emits('update-filter', prop, value)
    }

    const resetFilters = () => {
        whq.value = ''
        categoryGroup.value = ''
        status.value = ''
    }

    const facilitiesStore = useFacilitiesStore()
    const elements = useElementsStore()


    const facilities = computed(() => {
        return facilitiesStore.facilities.map(a => ({
            whq: a.whq,
            location: a.location
        }))
    })

    const categories = computed(() => {
        if (!whq.value) return []
        const groups = elements.elements.filter(f => f.whq === whq.value).map(e => e.categoryGroup)
        return [...new Set(groups)].filter(Boolean)
    })

    watch(
        () => whq.value,
        () => {
            categoryGroup.value = ''
        }
    )

</script>
