<template>
    <div class="pb-3" ref="target">
        <hr class="border-dotted border-gray-300 my-2">
        <div v-html="question"></div>
        <div class="mt-4" v-if="options == 'yes-no'">
            <div class="space-x-2" v-if="!overriding">
                <button @click="confirmedSuggestedValue"
                    class="text-base py-2 px-4 shadow bg-blue-500 text-white rounded">Yes!</button>
                <button @click="loadOverride" class="text-base py-2 px-4 shadow bg-white text-blue-500 rounded">No! It
                    needs to be
                    changed!</button>
            </div>
            <div v-else class="space-x-3 flex">
                <input :type="inputType" class="override-input border-b border-b-gray-300 py-2 px-1 outline-0 w-[45%]"
                    v-model="override">
                <div class="space-x-1">
                    <button @click="updateNewValue"
                        :class="['text-sm py-2 px-3 shadow-md rounded text-white', validOverride ? 'bg-blue-500' : 'bg-blue-500/50']">Confirm</button>
                    <button @click="unloadOverride" class="text-sm py-2 px-3 shadow-md rounded">Cancel</button>
                </div>
            </div>
        </div>

        <div class="" v-if="options == 'condition'">
            <div class="flex justify-between space-x-2 my-2">
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
            <div>
                <div>
                    <div>{{ defination.label }}</div>
                    <div class="text-sm text-gray-500">{{ defination.desc }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { elementConditionDescriptions } from '@/data/lib/desc';
    import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';
    import { onClickOutside } from '@vueuse/core'
    import type { ConditionNumber } from '@/types/element';

    const overriding = ref(false);
    const override = ref<string | null>(null)

    const defination = ref<{
        label: string
        desc: string
    }>({
        label: '',
        desc: ''
    })

    const { question, property, suggestedValue, options = 'yes-no' } = defineProps<{
        question: string
        property: 'qty' | 'lastYear' | 'adjRemainingYears' | 'condition'
        options?: 'yes-no' | 'condition',
        suggestedValue: string | number | ConditionNumber
    }>()

    const emits = defineEmits(['update'])

    const updateCondition = (condition: ConditionNumber) => {
        emits('update', property, condition)
        updateConditionDefination(condition)
    }

    const confirmedSuggestedValue = () => {
        emits('update', property, suggestedValue)
    }

    // handling overrides
    const inputType = computed(() => {
        const numberProps = ['qty', 'lastYear', 'adjRemainingYears', 'condition']
        if (numberProps.includes(property)) return 'number'
        return 'text'
    })

    const loadOverride = () => {
        overriding.value = true
        override.value = ''
        nextTick(() => {
            const input = document.querySelector('.override-input') as HTMLInputElement
            input?.focus();
        })
    }

    const unloadOverride = () => {
        overriding.value = false
    }

    const validOverride = computed(() => {
        return Boolean(override.value)
    })

    const target = useTemplateRef<HTMLElement>('target')

    onClickOutside(target, event => {
        unloadOverride()
    })

    const updateNewValue = () => {
        if (!override.value) return
        emits('update', property, override.value)
    }

    const updateConditionDefination = (condition: ConditionNumber) => {
        if (!condition) return
        const res = elementConditionDescriptions[condition]
        if (res) {
            defination.value.desc = res.desc
            defination.value.label = res.label
        }
    }

    onMounted(() => {
        if (property == 'condition') {
            updateConditionDefination(suggestedValue as ConditionNumber)
        }
    })

</script>