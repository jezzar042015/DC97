import { ref } from 'vue';

export function useRipple() {
    const ripples = ref<Array<{ id: number, x: number, y: number, size: number }>>([]);

    const createRipple = (event: MouseEvent, element: HTMLElement) => {
        const rect = element.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = {
            id: Date.now(),
            x,
            y,
            size
        };

        ripples.value.push(ripple);
    };

    const removeRipple = (id: number) => {
        ripples.value = ripples.value.filter(r => r.id !== id);
    };

    return {
        ripples,
        createRipple,
        removeRipple
    };
}