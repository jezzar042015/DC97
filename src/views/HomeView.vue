<template>
  <main class="h-screen bg-gray-50">
    <div class="px-5 pb-4 pt-12 h-full">

      <div class="space-y-2 flex flex-col justify-between h-full flex-1">
        <div>
          <div class="flex justify-between items-center">
            <div>

              <h2 class="font-bold text-2xl uppercase">Facilities</h2>
            </div>

            <!-- DC97 importer button -->
            <label @click="handleRipplerClick"
              class="block cursor-pointer text-green-800 bg-white text-center py-2 px-4 rounded shadow relative overflow-hidden transition-all duration-300 active:scale-[0.98]">
              <div class="flex items-center gap-2">
                <ExcelIcon class="h-5" />
                <span> Import DC-97</span>
              </div>
              <Ripple v-for="ripple in ripples" :key="ripple.id" :id="ripple.id" :x="ripple.x" :y="ripple.y"
                :size="ripple.size" :color="'green'" @remove="removeRipple" />
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
  import { useRouter } from 'vue-router';
  import { useXlsmParser } from '@/services/xlsm.parser';
  import { useRipple } from '@/composables/useRipple';
  import FacilityListItem from '@/components/FacilityListItem.vue';
  import NavigationBar from '@/components/NavigationBar.vue';
  import ExcelIcon from '@/components/icons/ExcelIcon.vue';
  import Ripple from '@/components/Ripple.vue';

  const facilitiesStore = useFacilitiesStore();
  const router = useRouter()
  const { handleFileImport } = useXlsmParser()

  const loadDetail = async (whq: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    router.push({ name: 'facility-detail', params: { whq } })
  }

  const onFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input || !input.files) return
    const file = input.files[0];
    await handleFileImport(file);
  }

  const { ripples, createRipple, removeRipple } = useRipple();
  const handleRipplerClick = (event: MouseEvent) => {
    createRipple(event, event.currentTarget as HTMLElement);
  };
</script>