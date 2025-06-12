<template>
  <main class="h-screen bg-gray-50">
    <div class="p-6 h-full">
      <!-- <div class="font-bold"></div> -->

      <div class="space-y-2 flex flex-col justify-between h-full flex-1">
        <div>
          <div class="font-bold text-2xl uppercase">Facilities</div>
          <div class="mt-4">
            <ul class="space-y-2">
              <li v-for="facility in facilitiesStore.facilities" :key="facility.whq" @click="loadDetail(facility.whq)">
                <FacilityListItem :facility="facility" />
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label
            class="block cursor-pointer  text-green-800 bg-white text-center font-bold py-5 px-4 rounded shadow-lg mb-2">
            IMPORT DC-97
            <input type="file" accept=".xlsm" class="hidden" @change="onFileChange($event)" />
          </label>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
  import FacilityListItem from '@/components/FacilityListItem.vue';
  import { useXlsmParser } from '@/services/xlsm.parser';
  import { useFacilitiesStore } from '@/stores/facilities';
  import { useFacilityStore } from '@/stores/facility';
  import { useRouter } from 'vue-router';

  const facilitiesStore = useFacilitiesStore();
  const facilityStore = useFacilityStore()
  const router = useRouter()
  const { handleFileImport } = useXlsmParser()

  const loadDetail = async (whq: string) => {
    router.push({ name: 'facility-detail', params: { whq } })
  }

  const onFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input || !input.files) return
    const file = input.files[0];
    await handleFileImport(file);
  }

</script>