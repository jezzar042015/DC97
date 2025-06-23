<template>
    <main class="h-full bg-gray-100">
        <div class="px-4 pb-24 pt-12 space-y-3">
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

            <div class="py-5 shadow bg-white" v-if="facilityStore.facility">
                <h3 class="font-bold text-xl uppercase pb-2 px-5">Buildings</h3>
                <hr class="border-amber-400 mx-5">
                <FacilityBuildings :whq="facilityStore.facility.whq" />
            </div>

            <div class="py-5 shadow bg-white" v-if="facilityStore.facility">
                <h3 class="font-bold text-xl uppercase pb-2 px-5">Evaluation Visits</h3>
                <hr class="border-amber-400 mx-5">

                <div class="py-2">
                    <FacilitySurveyItem v-if="currentFev" :survey="currentFev"
                        @click="viewSurveyItems(currentFev.uniqueKey)" />

                    <FacilitySurveyItem v-if="previousFev" :survey="previousFev"
                        @click="viewSurveyItems(previousFev.uniqueKey)" />

                </div>


            </div>
            <div class="py-5 shadow bg-white">
                <h3 class="font-bold text-xl uppercase pb-2 px-5">Actions</h3>
                <hr class="border-amber-400 mx-5">

                <div class="py-3 px-5 space-y-3">
                    <button class="p-4 text-center w-full bg-gray-100 rounded shadow outline-0">
                        Export Facility Back-up
                    </button>

                    <button class="p-4 text-center w-full bg-red-400 rounded text-white outline-0"
                        @click="loadDeleteConfirmation">
                        Delete this DC-97
                    </button>
                </div>
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
    import FacilityBuildings from '@/components/FacilityBuildings.vue';
    import FacilitySurveyItem from '@/components/FacilitySurveyItem.vue';

    const facilityStore = useFacilityStore()
    const surveysStore = useSurveysStore()
    const router = useRouter()

    const previousFev = computed(() => {
        if (!facilityStore.facility) return null
        const { previous } = surveysStore.getByFacility(facilityStore.facility.whq)
        if (!previous) return null
        return previous
    })

    const currentFev = computed(() => {
        if (!facilityStore.facility) return null
        const { newSurvey } = surveysStore.getByFacility(facilityStore.facility.whq)
        if (!newSurvey) return null
        return newSurvey
    })

    const viewSurveyItems = async (key: string) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        router.push({
            name: 'survey-detail',
            params: { key }
        })
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