<template>
    <main class="h-screen bg-gray-50">
        <div class="px-6 pb-24 pt-12 space-y-3">
            <div class="px-1 uppercase">Building Update</div>
            <hr class="border-amber-400">
            <div class="space-y-8">
                <div class="flex flex-col">
                    <label for="bf-whq" class="px-1 text-sm text-gray-500">WHQ Building Number</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-whq" type="text"
                        v-model="form.whq" readonly>
                </div>

                <div class="flex flex-col">
                    <label for="bf-name" class="px-1 text-sm text-gray-500">Building Name</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-name" type="text"
                        v-model="form.name">
                </div>

                <div class="flex flex-col">
                    <label for="bf-levels" class="px-1 text-sm text-gray-500">Number of Levels</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-levels" type="text"
                        v-model="form.levels" readonly>
                </div>

                <div class="flex flex-col">
                    <label for="bf-occupancy" class="px-1 text-sm text-gray-500">Occupancy Category</label>
                    <select class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-occupancy"
                        v-model="form.occupancy">
                        <option v-for="o in bldgOccupancyOptions" :value="o">{{ o }}</option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="bf-gfa" class="px-1 text-sm text-gray-500">Gross Floor Area</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-gfa" type="number"
                        v-model="form.gfa">
                </div>

                <div class="flex flex-col">
                    <label for="bf-construction" class="px-1 text-sm text-gray-500">Original Construction Year</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-construction"
                        type="number" v-model="form.construction">
                </div>

                <div class="flex flex-col">
                    <label for="bf-renMajYear" class="px-1 text-sm text-gray-500">Last Major Renovation Year</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-renMajYear" type="number"
                        v-model="form.renMajYear">
                </div>

                <div class="flex flex-col">
                    <label for="bf-maintenance" class="px-1 text-sm text-gray-500">Maintenance Condition</label>
                    <select class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-maintenance"
                        v-model="form.maintenance">
                        <option v-for="o in bldgMaintenanceConditionOptions" :value="o">{{ o }}</option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="bf-building" class="px-1 text-sm text-gray-500">Building Condition</label>
                    <select class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-building"
                        v-model="form.building">
                        <option v-for="o in bldgConditionOptions" :value="o">{{ o }}</option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label for="bf-projRenYear" class="px-1 text-sm text-gray-500">Projected Renovation Year</label>
                    <input class="pt-2 pb-1 px-1 outline-0 border-b border-b-gray-400" id="bf-projRenYear" type="number"
                        v-model="form.projRenYear">
                </div>

                <div class="space-x-2">
                    <button @click="save" :disabled="!hasChanges" :class="[
                        'text-base py-2 px-4 rounded',
                        hasChanges ? 'bg-blue-500 text-white shadow' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    ]">
                        Save Updates
                    </button>
                    <button @click="cancel" class="text-base py-2 px-4 shadow bg-white text-blue-500 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useBuildingsStore } from '@/stores/buildings';
    import { bldgConditionOptions, bldgMaintenanceConditionOptions, bldgOccupancyOptions, type Building } from '@/types/building';

    const router = useRouter();
    const buildings = useBuildingsStore();

    // Form and original data
    const form = ref<Building>({
        facilityWhq: '',
        building: 'No Construction Needed',
        construction: 0,
        gfa: 0,
        levels: 1,
        maintenance: 'Average',
        name: '',
        occupancy: 'Meeting Place',
        projRenYear: 0,
        renMajYear: 0,
        whq: ''
    });
    const original = ref<Building | null>(null);

    // Detect if form has changes compared to original
    const hasChanges = computed(() => {
        if (!original.value) return false;
        return JSON.stringify(form.value) !== JSON.stringify(original.value);
    });

    // Load building to form and set original snapshot
    const loadBldgToForm = (bldg: Building) => {
        const editable = JSON.parse(JSON.stringify(bldg));
        form.value = { ...editable };
        original.value = { ...editable };
    };


    const save = async () => {
        await buildings.update(form.value)
        cancel()
    }

    // Go back
    const cancel = async () => {
        router.back();
    };

    // On load, set form and original
    onMounted(() => {
        const bldgWhq = router.currentRoute.value.params.bldgwhq;
        const bldg = buildings.buildings.find(b => b.whq === bldgWhq);
        if (bldg) loadBldgToForm(bldg);
    });


</script>