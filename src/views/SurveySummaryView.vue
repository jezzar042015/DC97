<template>
    <main class="h-screen bg-gray-50">
        <div class="p-4 space-y-3">

            <div v-if="surveyStore.target" class="space-y-3 p-5 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Evaluation Details</h3>
                    <hr class="border-amber-400">
                </div>
                <div v-if="facilityStore.facility" class="">
                    <DetailItemValue label="Location Address" :value="facilityStore.facility.location" />
                </div>
                <div class="flex justify-between">
                    <DetailItemValue label="Evaluation Date" :value="surveyStore.target.date" />
                    <DetailItemValue label="Evaluation Year" :value="surveyStore.target.year" />
                </div>
                <DetailItemValue label="Evaluation Description" :value="surveyStore.target.description" />
            </div>

            <div class="space-y-3 p-5 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Elements &bullet; {{ surveyStore.elements.length }}
                    </h3>
                    <hr class="border-amber-400">
                </div>
                <div class="">
                    <div v-for="elem in surveyStore.elements" :key="elem.uniqueKey"
                        @click="viewElementDetail(elem.uniqueKey, elem.whq)">
                        <ElementListItem :element="elem" />
                    </div>

                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import ElementListItem from '@/components/ElementListItem.vue';
    import { useFacilityStore } from '@/stores/facility';
    import { useSurveyStore } from '@/stores/survey';
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const facilityStore = useFacilityStore()
    const surveyStore = useSurveyStore()
    const router = useRouter()

    const loadUrlSurveyKey = async () => {
        const key = router.currentRoute.value.params.key
        if (!key) return
        await surveyStore.load(key.toString())
    }

    const viewElementDetail = (key: string, whq: string) => {
        router.push({ name: 'element-detail', params: { key, whq } })
    }

    onMounted(async () => {
        await loadUrlSurveyKey()
    })
</script>