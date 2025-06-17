<template>
    <main class="h-screen bg-gray-50">
        <div class="px-4 pt-12 pb-24 min-h-full">
            <div class="space-y-5">
                <div @click="loadSurvey(survey)" v-for="survey in surveysStore.items" :key="survey.uniqueKey"
                    class="border-t-6 border-t-orange-500">
                    <FacilitySurveyCard :survey="survey" :showheader="false" />
                </div>
            </div>
        </div>
    </main>
    <NavigationBar />
</template>

<script setup lang="ts">
    import FacilitySurveyCard from '@/components/FacilitySurveyCard.vue';
    import NavigationBar from '@/components/NavigationBar.vue';
    import { useSurveysStore } from '@/stores/surveys';
    import type { Survey } from '@/types/survey';
    import { useRouter } from 'vue-router';

    const surveysStore = useSurveysStore()
    const router = useRouter()

    const loadSurvey = async (survey: Survey) => {
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