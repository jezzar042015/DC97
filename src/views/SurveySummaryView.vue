<template>
    <main class="h-screen bg-gray-50">
        <div class="px-4 pb-4 pt-12 space-y-3">

            <template v-if="surveyStore.target && facilityStore.facility">
                <FacilitySurveyCard :survey="surveyStore.target" />
            </template>

            <div class="space-y-3 py-5 pr-2 pl-2 shadow bg-white">
                <div>
                    <h3 class="font-bold text-xl pl-3 pr-3 uppercase pb-2">Elements &bullet; {{
                        surveyStore.elements.length
                        }}
                    </h3>
                    <hr class="border-amber-400 ml-3">
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
    import { onMounted } from 'vue';
    import { useFacilityStore } from '@/stores/facility';
    import { useRouter } from 'vue-router';
    import { useSurveyStore } from '@/stores/survey';
    import ElementListItem from '@/components/ElementListItem.vue';
    import FacilitySurveyCard from '@/components/FacilitySurveyCard.vue';
    import NavigationBar from '@/components/NavigationBar.vue';

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

    const viewElementDetail = async (whq: string, srcRow: number) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        router.push(
            {
                name: 'element-detail',
                params: { whq, srcRow }
            }
        )
    }

    onMounted(async () => {
        await loadUrlSurveyKey()
    })
</script>