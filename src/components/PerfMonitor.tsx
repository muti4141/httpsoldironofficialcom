import { useEffect, useRef, useState } from "react";

type Metrics = {
  loadMs: number | null;
  domReadyMs: number | null;
  fcpMs: number | null;
  lcpMs: number | null;
  fps: number;
  fpsAvg: number;
  fpsMin: number;
};

export function PerfMonitor() {
  const [open, setOpen] = useState(false);
  const [m, setM] = useState<Metrics>({
    loadMs: null,
    domReadyMs: null,
    fcpMs: null,
    lcpMs: null,
    fps: 0,
    fpsAvg: 0,
    fpsMin: Infinity,
  });

  const samplesRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Show only when explicitly enabled
    const enabled =
      typeof window !== "undefined" &&
      (window.location.search.includes("perf=1") ||
        localStorage.getItem("perf") === "1");
    if (!enabled) return;
    setOpen(true);

    // Navigation timing
    const readNav = () => {
      const nav = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        setM((s) => ({
          ...s,
          loadMs: Math.round(nav.loadEventEnd || nav.duration),
          domReadyMs: Math.round(nav.domContentLoadedEventEnd),
        }));
      }
    };
    if (document.readyState === "complete") readNav();
    else window.addEventListener("load", readNav, { once: true });

    // FCP
    try {
      const fcpObs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.name === "first-contentful-paint") {
            setM((s) => ({ ...s, fcpMs: Math.round(e.startTime) }));
          }
        }
      });
      fcpObs.observe({ type: "paint", buffered: true });
    } catch {}

    // LCP
    try {
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) setM((s) => ({ ...s, lcpMs: Math.round(last.startTime) }));
      });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // FPS loop
    let last = performance.now();
    let frames = 0;
    let acc = 0;
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      frames++;
      acc += dt;
      if (acc >= 500) {
        const fps = Math.round((frames * 1000) / acc);
        samplesRef.current.push(fps);
        if (samplesRef.current.length > 60) samplesRef.current.shift();
        const arr = samplesRef.current;
        const avg = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
        const min = Math.min(...arr);
        setM((s) => ({ ...s, fps, fpsAvg: avg, fpsMin: min }));
        frames = 0;
        acc = 0;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!open) return null;

  const fpsColor =
    m.fps >= 50 ? "#22c55e" : m.fps >= 30 ? "#eab308" : "#ef4444";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 99999,
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        font: "12px/1.4 ui-monospace, monospace",
        padding: "10px 12px",
        borderRadius: 8,
        minWidth: 180,
        pointerEvents: "auto",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <strong>Perf</strong>
        <button
          onClick={() => {
            localStorage.removeItem("perf");
            setOpen(false);
          }}
          style={{ background: "transparent", color: "#aaa", border: 0, cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
      <div>
        FPS: <span style={{ color: fpsColor, fontWeight: 700 }}>{m.fps}</span>{" "}
        <span style={{ color: "#aaa" }}>
          (avg {m.fpsAvg}, min {isFinite(m.fpsMin) ? m.fpsMin : "-"})
        </span>
      </div>
      <div>DOM Ready: {m.domReadyMs ?? "…"} ms</div>
      <div>Load: {m.loadMs ?? "…"} ms</div>
      <div>FCP: {m.fcpMs ?? "…"} ms</div>
      <div>LCP: {m.lcpMs ?? "…"} ms</div>
    </div>
  );
}
