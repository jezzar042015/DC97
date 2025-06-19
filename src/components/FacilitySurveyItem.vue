<template>
    <div class="py-2 px-2">
        <div class="py-3 px-4 rounded shadow border-l-4 border-l-orange-400 relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
            @click="handleClick">
            <div class="text-sm text-orange-500">{{ survey.year }} FCS</div>
            <div class="flex justify-between">
                <DetailItemValue label="Evaluation Date" :value="surveyDate" />
                <DetailItemValue label="Evaluation Year" :value="survey.year" />
            </div>
            <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
                :size="ripple.size" @remove="removeRipple" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useDateFormat } from '@vueuse/core';
    import { useRipple } from '@/composables/useRipple';
    import type { Survey } from '@/types/survey';
    import DetailItemValue from './DetailItemValue.vue';
    import Ripple from './Ripple.vue';

    const { survey } = defineProps<{
        survey: Survey
    }>();

    const surveyDate = computed(() => {
        if (!survey) return null
        return useDateFormat(survey.date, "MMM DD, YYYY").value
    })

    const { ripples, createRipple, removeRipple } = useRipple();

    const handleClick = (event: MouseEvent) => {
        createRipple(event, event.currentTarget as HTMLElement);
    };
</script>