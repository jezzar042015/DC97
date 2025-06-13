<template>
    <ModalWrapper>
        <div class="bg-white p-4 rounded-lg w-full mt-20" @click.stop>
            <div class="text-xl mb-2">
                Confirm Deletion
            </div>
            <hr class="border-amber-400">

            <div class="py-4">
                Are you sure to remove this DC-97? You can't undo this action.
            </div>
            <div class="flex space-x-3 mt-10">
                <button @click="confirmRemove" class="py-2 px-4 shadow text-white bg-red-700 rounded">Yes!
                    Delete</button>
                <button @click="close" class="py-2 px-4 shadow rounded">No, Don't Delete</button>
            </div>
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
    import { useFacilitiesStore } from '@/stores/facilities';
    import { useFacilityStore } from '@/stores/facility';
    import { useRouter } from 'vue-router';
    import ModalWrapper from './ModalWrapper.vue';

    const facilities = useFacilitiesStore()
    const facility = useFacilityStore()
    const router = useRouter()
    const emits = defineEmits(['close-delete-confirmation'])
    const close = () => {
        emits('close-delete-confirmation')
    }

    const confirmRemove = () => {
        if (!facility.facility) return
        facilities.remove(facility.facility.whq)
        close()
        router.push({ name: 'home' })
    }

</script>