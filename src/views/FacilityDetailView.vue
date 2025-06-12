<template>
    <main class="h-screen bg-gray-50">
        <div class="p-4 space-y-3">
            <div v-if="facilityStore.facility" class="space-y-3 p-5 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Facility Details</h3>
                    <hr class="border-amber-400">
                </div>
                <DetailItemValue label="Location Address" :value="facilityStore.facility.location" />
                <DetailItemValue label="Number of Auditoriums" :value="facilityStore.facility.auditoriums" />
                <DetailItemValue label="Number of Buildings on Site" :value="facilityStore.facility.buildings" />
                <DetailItemValue label="Climate" :value="facilityStore.facility.climate" />
                <DetailItemValue label="Number of Congregations" :value="facilityStore.facility.congregations" />
                <DetailItemValue label="Units of Measurement" :value="facilityStore.facility.measurements" />
                <DetailItemValue label="Primary Use" :value="facilityStore.facility.primaryUse" />
                <DetailItemValue label="WHQ Number" :value="facilityStore.facility.whq" />
            </div>
            <div class="p-5 shadow bg-white">
                <h3 class="font-bold text-xl uppercase pb-2">Evaluation Visit</h3>
                <hr class="border-amber-400">
                <div class="py-4" v-if="previousFev">
                    <div class="py-3 px-4  rounded shadow" @click="viewSurveyItems(previousFev?.uniqueKey)">
                        <div class="text-2xl font-bold text-gray-700">{{ previousFevYear }}</div>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
    import { useFacilityStore } from '@/stores/facility';
    import { computed, onMounted } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useRouter } from 'vue-router';
    import DetailItemValue from '@/components/DetailItemValue.vue';

    const facilityStore = useFacilityStore()
    const surveysStore = useSurveysStore()
    const router = useRouter()

    const previousFev = computed(() => {
        if (!facilityStore.facility) return null
        const { previous } = surveysStore.getByFacility(facilityStore.facility.whq)
        if (!previous) return null
        return previous
    })

    const previousFevYear = computed(() => {
        if (!previousFev.value) return ''
        return previousFev.value.year
    })

    const viewSurveyItems = (key: string) => {
        router.push({ name: 'survey-detail', params: { key } })
    }

    const loadUrlWhq = async () => {
        const whq = router.currentRoute.value.params.whq
        if (!whq) return
        await facilityStore.load(whq.toString())
    }

    onMounted(async () => {
        await loadUrlWhq()
    })
</script>