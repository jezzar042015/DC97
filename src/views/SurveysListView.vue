<template>
    <main class="h-screen">
        <div class="px-4 pt-12 pb-24 min-h-full">
            <div class="space-y-5" v-if="surveysStore.orderedList.length > 0">
                <div @click="loadSurvey(survey)" v-for="survey in surveysStore.orderedList" :key="survey.uniqueKey"
                    class="border-t-6 border-t-orange-500">
                    <FacilitySurveyCard :survey="survey" :showheader="false" />
                </div>
            </div>
            <div v-else class="mt-15 text-center text-gray-500 border bg-white border-gray-100 rounded px-3 py-5">
                No facility evaluations found!
            </div>
        </div>
    </main>
    <NavigationBar />
</template>

<script setup lang="ts">
    import FacilitySurveyCard from '@/components/FacilitySurveyCard.vue';
    import NavigationBar from '@/components/NavigationBar.vue';
    import { useSurveysStore } from '@/stores/surveys';
    import { useRouter } from 'vue-router';
    import type { Survey } from '@/types/survey';

    const surveysStore = useSurveysStore()
    const router = useRouter()

    const loadSurvey = async (survey: Survey) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        await router.push(
            {
                name: 'survey-detail',
                params: {
                    key: survey.uniqueKey
                }
            }

        )
    }
</script>