<template>
    <div class="pb-3">
        <hr class="border-dotted border-gray-300 my-2">
        <div v-html="question"></div>
        <div class="space-x-2 mt-4" v-if="options == 'yes-no'">
            <button @click="confirmedSuggestedValue"
                class="text-base py-2 px-4 shadow bg-blue-500 text-white rounded">Yes!</button>
            <button class="text-base py-2 px-4 shadow bg-white text-blue-500 rounded">No! It needs to be
                changed!</button>
        </div>

        <div class="flex justify-between space-x-2 my-2" v-if="options == 'condition'">
            <button @click="updateCondition(1)" :class="['text-base flex-1 py-2 px-5 rounded ',
                { 'bg-white text-black/90 border border-gray-200': suggestedValue !== 1 },
                { 'bg-blue-500 text-white shadow': suggestedValue === 1 }]">1</button>
            <button @click="updateCondition(2)" :class="['text-base flex-1 py-2 px-5 rounded ',
                { 'bg-white text-black/90 border border-gray-200': suggestedValue !== 2 },
                { 'bg-yellow-300 text-black shadow': suggestedValue === 2 }]">2</button>
            <button @click="updateCondition(3)" :class="['text-base flex-1 py-2 px-5 rounded ',
                { 'bg-white text-black/90 border border-gray-200': suggestedValue !== 3 },
                { 'bg-orange-400 text-white shadow': suggestedValue === 3 }]">3</button>
            <button @click="updateCondition(4)" :class="['text-base flex-1 py-2 px-5 rounded ',
                { 'bg-white text-black/90 border border-gray-200': suggestedValue !== 4 },
                { 'bg-red-500 text-white shadow': suggestedValue === 4 }]">4</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ConditionNumber } from '@/types/element';

    const { question, property, suggestedValue, options = 'yes-no' } = defineProps<{
        question: string
        property: 'qty' | 'lastYear' | 'adjRemainingYears' | 'condition'
        options?: 'yes-no' | 'condition',
        condition?: ConditionNumber
        suggestedValue: string | number | ConditionNumber
    }>()

    const emits = defineEmits(['update'])

    const updateCondition = (condition: ConditionNumber) => {
        emits('update', property, condition)
    }

    const confirmedSuggestedValue = () => {
        emits('update', property, suggestedValue)
    }
</script>