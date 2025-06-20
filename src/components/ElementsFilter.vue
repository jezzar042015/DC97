<template>
    <div class="w-full space-y-2">
        <div class="flex space-x-2">
            <input type="search" class="bg-white shadow p-3 outline-0 rounded-sm flex-1" placeholder="Search"
                :value="keyWords" @input="onInput">
            <div>
                <button class="bg-white shadow py-4 px-5 text-sm rounded-sm whitespace-nowrap flex-1"
                    @click="toggleFilters">
                    Filters
                </button>
            </div>
        </div>
        <div v-if="filters" class="bg-white shadow rounded-sm p-3">
            <div class="flex flex-col">
                <label for="">Facility</label>
                <select name="" id="" class="">
                    <option :value="''">All Facilities</option>
                </select>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';

    const emits = defineEmits(['update-search']);

    const filters = ref(true)
    const toggleFilters = () => filters.value = !filters.value

    const props = defineProps<{
        keywords: string
    }>();
    const keyWords = ref(props.keywords);

    watch(() => props.keywords, (k) => {
        keyWords.value = k;
    });

    function onInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        keyWords.value = value;
        emits('update-search', value);
    }
</script>