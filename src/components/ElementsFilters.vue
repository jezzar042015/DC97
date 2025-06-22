<template>
    <div class="w-full space-y-2">
        <div class="flex space-x-2">
            <input type="search" class="bg-white shadow p-3 outline-0 rounded-sm flex-1" placeholder="Search"
                :value="keyWords" @input="onInput">
            <div>
                <button class="bg-white shadow py-4 px-5 text-sm rounded-sm whitespace-nowrap flex-1"
                    @click="showFilterForm">
                    Filters
                </button>
            </div>
        </div>

        <div v-if="false" class="bg-white shadow rounded-sm p-3">
            <!-- Filters here -->
        </div>

    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';

    const emits = defineEmits(['update-search', 'show-filter-form']);

    const filters = ref(true)
    const showFilterForm = () => emits('show-filter-form')

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