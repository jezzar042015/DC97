import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EvaluationsView from '@/views/SurveysListView.vue'
import FacilityDetailView from '@/views/FacilityDetailView.vue'
import ElementDetailView from '@/views/ElementDetailView.vue'
import SurveySummaryView from '@/views/SurveySummaryView.vue'
import SurveyElementsView from '@/views/SurveyElementsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/facility-surveys',
      name: 'surveys',
      component: EvaluationsView,
    },
    {
      path: '/facilities/:whq',
      name: 'facility-detail',
      component: FacilityDetailView,
    },
    {
      path: '/elements/:whq/:srcRow',
      name: 'element-detail',
      component: ElementDetailView,
    },
    {
      path: '/surveys/:key',
      name: 'survey-detail',
      component: SurveySummaryView,
    },
    {
      path: '/facility-elements',
      name: 'elements',
      component: SurveyElementsView,
    },
  ],
})

export default router
