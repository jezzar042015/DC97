<template>
    <main class="h-screen bg-gray-50">
        <div class="px-4 pb-4 pt-12 space-y-3">
            <div v-if="facilityStore.facility" class="space-y-3 p-5 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Facility Details</h3>
                    <hr class="border-amber-400">
                </div>
                <DetailItemValue label="Location Address" :value="facilityStore.facility.location" />
                <DetailItemValue label="Primary Use" :value="facilityStore.facility.primaryUse" />
                <DetailItemValue label="WHQ Number" :value="facilityStore.facility.whq" />
                <div class="flex space-x-4">
                    <DetailItemValue label="Buildings" :value="facilityStore.facility.buildings" />
                    <DetailItemValue label="Auditoriums" :value="facilityStore.facility.auditoriums" />
                    <DetailItemValue label="Congregations" :value="facilityStore.facility.congregations" />
                </div>
                <div class="flex space-x-4">
                    <DetailItemValue label="Climate" :value="facilityStore.facility.climate" />
                    <DetailItemValue label="Units of Measurement" :value="facilityStore.facility.measurements" />
                </div>
            </div>
            <div class="p-5 shadow bg-white">
                <h3 class="font-bold text-xl uppercase pb-2">Evaluation Visit</h3>
                <hr class="border-amber-400">
                <div class="py-4" v-if="previousFev">
                    <div class="flex justify-between py-3 px-4 rounded shadow"
                        @click="viewSurveyItems(previousFev?.uniqueKey)">
                        <div class="text-2xl font-bold text-gray-700">{{ previousFevYear }} FEV</div>
                        <RightArrowIcon class="h-10" />
                    </div>
                </div>
            </div>
            <div class="p-3 shadow bg-white">
                <button class="p-4 text-center w-full bg-red-400 rounded text-white" @click="loadDeleteConfirmation">
                    Delete this DC-97
                </button>
            </div>
        </div>
    </main>
    <NavigationBar />
    <DeleteConfirmation v-show="deleteConfirmation" @close-delete-confirmation="unloadDeleteConfirmation" />
</template>

<script setup lang="ts">
    import { useFacilityStore } from '@/stores/facility';
    import { computed, onMounted, ref } from 'vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useRouter } from 'vue-router';
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
    import NavigationBar from '@/components/NavigationBar.vue';
    import RightArrowIcon from '@/components/icons/RightArrowIcon.vue';

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

    // deleting facility
    const deleteConfirmation = ref(false);
    const loadDeleteConfirmation = () => {
        deleteConfirmation.value = true
    }

    const unloadDeleteConfirmation = () => {
        deleteConfirmation.value = false
    }

    onMounted(async () => {
        await loadUrlWhq()
    })
</script>