<template>
    <main class="h-screen bg-gray-50">
        <div class="p-4 space-y-3">

            <div v-if="surveyStore.target" class="space-y-3 p-5 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Evaluation Details</h3>
                    <hr class="border-amber-400">
                </div>
                <div v-if="facilityStore.facility" class="">
                    <DetailItemValue :label="facilityStore.facility.primaryUse"
                        :value="facilityStore.facility.location" />
                </div>
                <div class="flex justify-between">
                    <DetailItemValue label="Evaluation Date" :value="surveyStore.target.date" />
                    <DetailItemValue label="Evaluation Year" :value="surveyStore.target.year" />
                </div>
                <DetailItemValue label="Evaluation Description" :value="surveyStore.target.description" :bold="false" />
            </div>

            <div class="space-y-3 p-5 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl uppercase pb-2">Elements &bullet; {{ surveyStore.elements.length }}
                    </h3>
                    <hr class="border-amber-400">
                </div>
                <div class="pb-7">
                    <div v-for="elem in surveyStore.elements" :key="`${elem.whq}_${elem.srcRow}`"
                        @click="viewElementDetail(elem.whq, elem.srcRow)">
                        <ElementListItem :element="elem" />
                    </div>

                </div>
            </div>
        </div>
    </main>
    <NavigationBar />
</template>

<script setup lang="ts">
    import DetailItemValue from '@/components/DetailItemValue.vue';
    import ElementListItem from '@/components/ElementListItem.vue';
    import NavigationBar from '@/components/NavigationBar.vue';
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
        if (facilityStore.facility) return
        const whq = key.toString().split('_')[0]
        facilityStore.load(whq)
    }

    const viewElementDetail = (whq: string, srcRow: number) => {
        router.push({ name: 'element-detail', params: { whq, srcRow } })
    }

    onMounted(async () => {
        await loadUrlSurveyKey()
    })
</script>