<template>
    <ModalWrapper>
        <div class="bg-white w-full h-full p-4 mt-10">
            <div class="flex flex-col min-h-52">
                <div>{{ elem.name }}</div>
                <div class="text-xl font-bold">{{ elem.component }}</div>
                <hr class="border-amber-400 mt-2">
                <div v-if="dictionary">
                    <p class="py-2 font-medium">{{ dictionary.defination }}</p>

                    <div v-if="dictionary.photos" class="space-y-2">
                        <img class="w-full" v-for="img in dictionary.photos" :src="`/facility-components/${img}`"
                            :alt="img">
                    </div>
                </div>

                <p v-else class="pt-2 text-gray-400">Sorry! No defination is added for this component yet</p>


            </div>
            <div class="flex justify-end mt-3">
                <button @click="emits('close')" class="text-sm py-2 px-3 shadow-md rounded">Close</button>
            </div>
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { componentDictionary } from '@/data/lib/components.helper';
    import type { Element } from '@/types/element';
    import ModalWrapper from './ModalWrapper.vue';

    const { elem } = defineProps<{
        elem: Element
    }>()

    const emits = defineEmits(['close'])

    const dictionary = computed(() => {
        return componentDictionary[elem.uniqueKey]
    })
</script>