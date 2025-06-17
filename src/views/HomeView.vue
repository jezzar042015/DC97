<template>
  <main class="h-screen bg-gray-50">
    <div class="px-5 pb-4 pt-12 h-full">
      <!-- <div class="font-bold"></div> -->

      <div class="space-y-2 flex flex-col justify-between h-full flex-1">
        <div>
          <div class="flex justify-between items-center">
            <div>

              <h2 class="font-bold text-2xl uppercase">Facilities</h2>
            </div>

            <label class="block cursor-pointer text-green-800 bg-white text-center py-2 px-4 rounded shadow">
              <div class="flex items-center gap-2">
                <ExcelIcon class="h-5" />
                <span> Import DC-97</span>
              </div>
              <input type="file" accept=".xlsm" class="hidden" @change="onFileChange($event)" />
            </label>
          </div>
          <div class="mt-4">
            <ul class="space-y-2">
              <li v-for="facility in facilitiesStore.facilities" :key="facility.whq" @click="loadDetail(facility.whq)">
                <FacilityListItem :facility="facility" />
              </li>
            </ul>
            <div v-if="facilitiesStore.facilities.length === 0"
              class="mt-15 text-gray-500 border bg-yellow-50 border-gray-100 rounded p-3">
              No facilities were added yet! Start by importing a DC-97.
            </div>
          </div>
        </div>


      </div>

    </div>
  </main>
  <NavigationBar />
</template>

<script setup lang="ts">
  import { useFacilitiesStore } from '@/stores/facilities';
  import { useFacilityStore } from '@/stores/facility';
  import { useRouter } from 'vue-router';
  import { useXlsmParser } from '@/services/xlsm.parser';
  import FacilityListItem from '@/components/FacilityListItem.vue';
  import NavigationBar from '@/components/NavigationBar.vue';
  import ExcelIcon from '@/components/icons/ExcelIcon.vue';

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