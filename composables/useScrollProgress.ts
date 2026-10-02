import type { Ref } from "vue";

/**
 * Avanzamento (0 → 1) dello scroll dentro una sezione più alta del viewport,
 * pensata con un figlio `position: sticky` che resta fermo mentre la sezione
 * scorre: 0 quando la sezione tocca il bordo alto, 1 quando ne esce il fondo.
 *
 * Un solo calcolo per frame, anche se il browser emette più eventi di scroll.
 */
export function useScrollProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(0);
  let frame = 0;

  const measure = () => {
    frame = 0;
    const el = target.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) {
      progress.value = rect.top <= 0 ? 1 : 0;
      return;
    }
    progress.value = Math.min(1, Math.max(0, -rect.top / travel));
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  onMounted(() => {
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
  });

  return progress;
}

/** Avanzamento locale di un tratto [start, end] dentro un progresso 0 → 1. */
export const scrollSegment = (value: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (value - start) / (end - start)));

/** Interpolazione lineare. */
export const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

/** Uscita morbida, per i movimenti legati allo scroll. */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
