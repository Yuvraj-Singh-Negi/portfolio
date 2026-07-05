/// Performance Monitoring

export function reportWebVitals(): void {
  if (typeof window === "undefined") return;
  if (!("performance" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("[Perf] LCP:", entry.startTime.toFixed(0), "ms");
        }
        if (entry.entryType === "first-input") {
          const fi = entry as unknown as { processingStart: number; startTime: number };
          console.log("[Perf] FID:", (fi.processingStart - fi.startTime).toFixed(0), "ms");
        }
        if (entry.entryType === "layout-shift") {
          const shift = entry as unknown as { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) {
            const rating =
              shift.value < 0.1 ? "good" : shift.value < 0.25 ? "needs improvement" : "poor";
            console.log("[Perf] CLS:", rating, `(${shift.value.toFixed(3)})`);
          }
        }
      }
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });
    observer.observe({ type: "first-input", buffered: true });
    observer.observe({ type: "layout-shift", buffered: true });
  } catch {
    // PerformanceObserver not supported
  }
}

export function measureRender(name: string, fn: () => void): void {
  if (typeof performance === "undefined") {
    fn();
    return;
  }
  const start = performance.now();
  fn();
  const end = performance.now();
  if (end - start > 16) {
    console.warn(`[Perf] "${name}" took ${(end - start).toFixed(0)}ms (exceeds 16ms frame budget)`);
  }
}
