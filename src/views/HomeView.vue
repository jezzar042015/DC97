<template>
  <main class="h-screen bg-gray-50">
    <div class="p-4">
      <div class="font-bold"></div>

      <div class="space-y-2">
        <div class="font-bold text-2xl uppercase">Facilities</div>
        <div class="mt-4">
          <ul class="space-y-2">
            <li v-for="facility in facilitiesStore.facilities" :key="facility.whq" @click="loadDetail(facility.whq)">
              <FacilityListItem :facility="facility" />
            </li>
          </ul>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
  import FacilityListItem from '@/components/FacilityListItem.vue';
  import { useFacilitiesStore } from '@/stores/facilities';
  import { useFacilityStore } from '@/stores/facility';
  import { useRouter } from 'vue-router';

  const facilitiesStore = useFacilitiesStore();
  const facilityStore = useFacilityStore()
  const router = useRouter()

  const loadDetail = async (whq: string) => {
    await facilityStore.load(whq)
    router.push({ name: 'facility-detail', params: { whq } })
  }
</script>