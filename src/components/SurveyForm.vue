<template>
    <ModalWrapper>
        <div class="bg-white p-4 w-full rounded mt-8">
            <div>
                <div class="text-xl mb-2">
                    Confirm Evaluation Date
                </div>
                <hr class="border-amber-400">
                <div class="space-y-2 mt-10">
                    <div class="flex flex-col">
                        <label class="text-gray-500" for="fev-date">Evaluation Date</label>
                        <input class="w-full py-2 border-b outline-0 text-3xl font-bold" type="date" name=""
                            id="fev-date" v-model="form.date">
                    </div>
                </div>
            </div>
            <div class="flex space-x-3 mt-10">
                <button @click="confirm" class="py-2 px-4 shadow text-white bg-blue-700 rounded">
                    Start Evaluation
                </button>
                <button @click="close" class="py-2 px-4 shadow rounded">Cancel</button>
            </div>
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useFacilityStore } from '@/stores/facility';
    import { useDateFormat } from '@vueuse/core';
    import { useSurveysStore } from '@/stores/surveys';
    import type { Survey } from '@/types/survey';
    import ModalWrapper from './ModalWrapper.vue';

    const facilityStore = useFacilityStore()
    const surveysStore = useSurveysStore()
    const form = ref<Survey>({
        whq: facilityStore.facility?.whq ?? '',
        date: useDateFormat(new Date(), 'YYYY-MM-DD').value,
        year: Number(useDateFormat(new Date(), 'YYYY').value),
        uniqueKey: `${facilityStore.facility?.whq ?? ''}_${useDateFormat(new Date(), 'YYYYMMDD').value}`,
        elements: [],
    })

    watch(() => form.value.date,
        (newDate) => {
            form.value.year = Number(useDateFormat(new Date(newDate), 'YYYY').value)
            form.value.uniqueKey = `${facilityStore.facility?.whq ?? ''}_${useDateFormat(new Date(newDate), 'YYYYMMDD').value}`
        }
    )

    const emits = defineEmits(['unload-survey-form'])

    const close = () => emits('unload-survey-form')
    const confirm = async () => {
        const storable = JSON.parse(JSON.stringify(form.value))
        surveysStore.add(storable)
        emits('unload-survey-form', 'element-survey-form')
    }
</script>