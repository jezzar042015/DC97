import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImportView from '@/views/ImportView.vue'
import FacilityDetailView from '@/views/FacilityDetailView.vue'
import ElementDetailView from '@/views/ElementDetailView.vue'
import SurveySummaryView from '@/views/SurveySummaryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/import',
      name: 'import',
      component: ImportView,
    },
    {
      path: '/facilities/:whq',
      name: 'facility-detail',
      component: FacilityDetailView,
    },
    {
      path: '/elements/:whq/:key',
      name: 'element-detail',
      component: ElementDetailView,
    },
    {
      path: '/surveys/:key',
      name: 'survey-detail',
      component: SurveySummaryView,
    },
  ],
})

export default router
