"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ───────────────────── DATA ───────────────────── */

const DETECTION_BOXES = [
  { id: "cpu", label: "CPU: 1756-L85E", confidence: 98.2, top: "12%", left: "8%", w: "22%", h: "30%" },
  { id: "di",  label: "DI: 1756-IB32",  confidence: 96.7, top: "14%", left: "32%", w: "18%", h: "28%" },
  { id: "do",  label: "DO: 1756-OB16E", confidence: 94.1, top: "15%", left: "52%", w: "18%", h: "27%", fault: true },
  { id: "ai",  label: "AI: 1756-IF16H", confidence: 91.8, top: "13%", left: "72%", w: "18%", h: "29%" },
  { id: "psu", label: "PSU: 1756-PA75", confidence: 99.1, top: "50%", left: "8%", w: "15%", h: "38%" },
];

const TERMINAL_LINES = [
  { time: "00.0s", text: "Initializing SnapPLC vision engine..." },
  { time: "00.4s", text: "Loading YOLO-PLC v3.2 weights..." },
  { time: "01.1s", text: "Preprocessing image (2048×1536)..." },
  { time: "01.8s", text: "Running inference on rack assembly..." },
  { time: "02.3s", text: "Detected 5 modules in 1 rack" },
  { time: "02.9s", text: "Cross-referencing Rockwell catalog..." },
  { time: "03.4s", text: "Analyzing LED states via color model..." },
  { time: "03.9s", text: "Checking I/O wiring topology..." },
  { time: "04.2s", text: "Generating ladder logic inference..." },
  { time: "04.6s", text: "Compiling fault report..." },
];

const MODULES_TABLE = [
  { slot: 0, part: "1756-PA75",  type: "Power Supply",    status: "OK" },
  { slot: 1, part: "1756-L85E",  type: "CPU / Processor", status: "OK" },
  { slot: 2, part: "1756-IB32",  type: "32-pt Digital In", status: "OK" },
  { slot: 3, part: "1756-OB16E", type: "16-pt Digital Out", status: "FAULT" },
  { slot: 4, part: "1756-IF16H", type: "16-pt Analog In",  status: "OK" },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Snap the Cabinet", body: "Take a clear photo of your PLC rack, control panel, or enclosure. Any angle, any lighting." },
  { n: "02", title: "AI Identifies Hardware", body: "YOLO-PLC detects every module, power supply, and terminal block — across 500+ part numbers." },
  { n: "03", title: "LED State Analysis", body: "Our color model reads every indicator light and maps it to known fault codes and run states." },
  { n: "04", title: "Ladder Logic Inference", body: "System infers probable ladder logic rungs from detected I/O configuration and wiring topology." },
  { n: "05", title: "Fault Report Delivered", body: "Plain-English diagnostics with severity tags, root cause assessment, and recommended next steps." },
];

const FEATURES = [
  { icon: "🔍", title: "Hardware Recognition", desc: "Identifies 500+ PLC module types across Allen-Bradley, Siemens, ABB, Mitsubishi, and 40+ other manufacturers. Detects slot position, part number, and firmware tier." },
  { icon: "🗺️", title: "I/O Topology Mapping", desc: "Reconstructs digital and analog I/O maps from wiring and label analysis. Full topology export to CSV and L5X." },
  { icon: "🔗", title: "Ladder Logic Inference", desc: "Infers probable ladder logic rungs from hardware configuration, LED state patterns, and detected I/O relationships." },
  { icon: "⚡", title: "Fault Correlation Engine", desc: "Cross-references active fault LEDs against 12,000+ known module behaviors to isolate root cause in seconds." },
  { icon: "📡", title: "Protocol Detection", desc: "Identifies communication protocols in use: EtherNet/IP, PROFIBUS, Modbus TCP, DeviceNet, CC-Link, and PROFINET." },
  { icon: "📷", title: "Change Detection", desc: "Compares cabinet photos over time to flag undocumented hardware changes. It noticed someone added a relay. No one told us." },
];

const REVIEWS = [
  { initials: "PM", name: "Gary T.", role: "Plant Manager — Midwest Facility", stars: 5, text: "\"It blamed the controls engineer before production even called.\"" },
  { initials: "CE", name: "Anonymous", role: "Controls Engineer — Not Dave's Facility", stars: 5, text: "\"Operator Mode predicted Dave would press Reset six times. Dave pressed Reset seven times.\"" },
  { initials: "MT", name: "Mike R.", role: "Maintenance Tech — 3rd Shift", stars: 4, text: "\"Told me the E-Stop was physically damaged. Turned out it was just zip-tied shut. Four stars because it was technically correct.\"" },
  { initials: "JW", name: "Janet W.", role: "Plant Manager — Southeast Region", stars: 5, text: "\"It found logic we didn't even know was running.\"" },
];

const TRUST_LOGOS = ["Midwest Controls", "Great Lakes Automation", "Pacific Industrial", "Summit MFG", "Heartland Systems", "Apex Integrators"];


/* ───────────────────── COMPONENT ───────────────────── */

export default function SnapPLC() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [demoStage, setDemoStage] = useState<"idle" | "scanning" | "detecting" | "results">("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleBoxes, setVisibleBoxes] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    clearTimeouts();
    setPreviewUrl(URL.createObjectURL(file));
    setDemoStage("scanning");
    setVisibleLines(0);
    setVisibleBoxes(0);

    // Terminal lines appear during scanning
    TERMINAL_LINES.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), 400 * (i + 1));
      timeoutsRef.current.push(t);
    });

    // Switch to detecting at 2s, start showing boxes
    const t1 = setTimeout(() => {
      setDemoStage("detecting");
      DETECTION_BOXES.forEach((_, i) => {
        const t = setTimeout(() => setVisibleBoxes(i + 1), 500 * (i + 1));
        timeoutsRef.current.push(t);
      });
    }, 2000);
    timeoutsRef.current.push(t1);

    // Show results at 5.5s
    const t2 = setTimeout(() => setDemoStage("results"), 5500);
    timeoutsRef.current.push(t2);
  }

  function scrollToDemo() {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(triggerUpload, 600);
  }

  return (
    <main style={{ background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 60, background: "rgba(13,17,23,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid #30363d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#00d4ff" }}>Snap</span>
          <span>PLC</span>
          <span style={{ fontSize: "0.65rem", background: "#0077b6", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Beta</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="#demo" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Demo</a>
          <a href="#how" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>How it works</a>
          <a href="#features" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Features</a>
          <a href="#reviews" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Reviews</a>
          <a href="/pricing" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Pricing</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "8rem 2rem 6rem" }}>
        {/* grid background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.12, pointerEvents: "none" }} />
        {/* glow */}
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 900, height: 900, background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "1.5rem" }}>
            <span style={{ color: "#00d4ff" }}>Snap</span>PLC<span style={{ color: "#00d4ff" }}>™</span>
          </h1>

          <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "#8b949e", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 2.5rem" }}>
            Point your phone at the panel.<br />
            We&apos;ll handle the rest.
          </p>

          <button onClick={scrollToDemo} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2.5rem", borderRadius: 10, fontSize: "1.05rem", fontWeight: 600, cursor: "pointer", border: "none", background: "#00d4ff", color: "#000", letterSpacing: "-0.3px" }}>
            Scan Your Panel
          </button>

          <p style={{ fontSize: "0.8rem", color: "#4a5568", marginTop: "1.25rem", letterSpacing: "0.3px" }}>
            No documentation required.
          </p>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ padding: "2rem 2rem", borderTop: "1px solid #1c2230", borderBottom: "1px solid #1c2230" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#4a5568", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "1.25rem" }}>Trusted by 200+ facilities worldwide</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            {TRUST_LOGOS.map((name) => (
              <span key={name} style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2a3448", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "monospace", whiteSpace: "nowrap" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI DEMO ── */}
      <section id="demo" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>Live Demo</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" }}>See SnapPLC in action.</h2>
            <p style={{ color: "#8b949e", fontSize: "0.95rem", marginTop: "0.5rem" }}>Upload any PLC cabinet photo and watch the analysis run in real time.</p>
          </div>

          <div data-grid="demo" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", minHeight: 500 }}>
            {/* Left — Image Panel */}
            <div style={{ position: "relative", background: "#0a0e14", border: "1px solid #30363d", borderRadius: 12, overflow: "hidden" }}>
              {/* Panel header */}
              <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#8b949e" }}>INPUT — Cabinet Image</span>
                <span style={{ fontSize: "0.65rem", color: demoStage !== "idle" ? "#3fb950" : "#4a5568" }}>{demoStage !== "idle" ? "● LIVE" : "○ WAITING"}</span>
              </div>

              {/* Image area */}
              <div onClick={triggerUpload} style={{ position: "relative", aspectRatio: "4/3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!previewUrl ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", userSelect: "none" }}>
                    {/* mini PLC cabinet */}
                    <div style={{ width: 180, background: "#1a2030", border: "2px solid #3a4560", borderRadius: 6, padding: 12, boxShadow: "0 0 30px rgba(0,0,0,0.5)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: "0.55rem", fontFamily: "monospace", letterSpacing: 1, color: "#6a7a9a", textTransform: "uppercase" }}>PLC‑7000</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3fb950", boxShadow: "0 0 6px #3fb950" }} />
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f85149", boxShadow: "0 0 6px #f85149", animation: "blink 1.1s step-end infinite" }} />
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#d29922", boxShadow: "0 0 6px #d29922" }} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                        {[
                          { label: "CPU", leds: ["g", "g", "r"] },
                          { label: "DI", leds: ["g", "g", "g"] },
                          { label: "DO", leds: ["a", "g", "g"] },
                          { label: "AI", leds: ["g", "r", "g"] },
                        ].map((mod) => (
                          <div key={mod.label} style={{ background: "#242c3c", border: "1px solid #3a4560", borderRadius: 3, height: 55, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "4px 2px" }}>
                            <span style={{ fontSize: "0.4rem", fontFamily: "monospace", color: "#5a6a8a" }}>{mod.label}</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              {mod.leds.map((c, i) => (
                                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c === "g" ? "#3fb950" : c === "a" ? "#d29922" : "#f85149", boxShadow: c === "g" ? "0 0 4px #3fb950" : c === "a" ? "0 0 4px #d29922" : "0 0 4px #f85149", animation: c === "r" ? "blink 1.1s step-end infinite" : "none" }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#8b949e" }}>Click to upload a cabinet photo</div>
                      <div style={{ fontSize: "0.7rem", color: "#4a5568", marginTop: "0.25rem" }}>JPG, PNG, WEBP · Max 10 MB</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={previewUrl} alt="Uploaded cabinet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {/* Scan line overlay */}
                    {(demoStage === "scanning" || demoStage === "detecting") && (
                      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "#00d4ff", boxShadow: "0 0 20px #00d4ff, 0 0 60px rgba(0,212,255,0.3)", animation: "scanLine 2s ease-in-out infinite", zIndex: 2 }} />
                    )}
                    {/* Detection boxes */}
                    {(demoStage === "detecting" || demoStage === "results") && DETECTION_BOXES.slice(0, visibleBoxes).map((box) => (
                      <div key={box.id} style={{ position: "absolute", top: box.top, left: box.left, width: box.w, height: box.h, border: `2px solid ${box.fault ? "#f85149" : "#00d4ff"}`, borderRadius: 4, animation: "drawBox 0.4s ease-out both", zIndex: 3 }}>
                        <div style={{ position: "absolute", top: -22, left: 0, background: "rgba(10,14,20,0.9)", border: `1px solid ${box.fault ? "#f85149" : "rgba(0,212,255,0.5)"}`, borderRadius: 4, padding: "2px 6px", fontSize: "0.6rem", fontFamily: "monospace", color: box.fault ? "#f85149" : "#00d4ff", whiteSpace: "nowrap" }}>
                          {box.label} — {box.confidence}%
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
              </div>
            </div>

            {/* Right — Terminal Panel */}
            <div style={{ background: "#0a0e14", border: "1px solid #30363d", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Panel header */}
              <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: demoStage !== "idle" ? "#3fb950" : "#4a5568", boxShadow: demoStage !== "idle" ? "0 0 6px #3fb950" : "none", animation: demoStage !== "idle" && demoStage !== "results" ? "pulse 1.5s ease-in-out infinite" : "none" }} />
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#8b949e" }}>SnapPLC Analysis Engine v3.2.1</span>
              </div>

              {/* Terminal body */}
              <div style={{ flex: 1, padding: "1rem", fontFamily: "monospace", fontSize: "0.75rem", lineHeight: 1.8, overflow: "auto" }}>
                {demoStage === "idle" && (
                  <div style={{ color: "#4a5568", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⬡</div>
                      Awaiting image input...<br />
                      <span style={{ fontSize: "0.65rem" }}>Upload a cabinet photo to begin analysis</span>
                    </div>
                  </div>
                )}

                {demoStage !== "idle" && demoStage !== "results" && (
                  <div>
                    {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => {
                      const done = i < visibleLines - 1 || (demoStage === "detecting" && visibleLines === TERMINAL_LINES.length);
                      return (
                        <div key={i} style={{ animation: "fadeInUp 0.3s ease both" }}>
                          <span style={{ color: "#4a5568" }}>[{line.time}]</span>{" "}
                          <span style={{ color: done ? "#e6edf3" : "#8b949e" }}>{line.text}</span>{" "}
                          <span style={{ color: done ? "#3fb950" : "#00d4ff" }}>{done ? "✓" : "..."}</span>
                        </div>
                      );
                    })}
                    {visibleLines === TERMINAL_LINES.length && (
                      <div style={{ marginTop: "1rem", padding: "0.5rem", borderTop: "1px solid #1c2230", color: "#00d4ff" }}>
                        ━━━ ANALYSIS COMPLETE — 4.8 seconds ━━━
                      </div>
                    )}
                  </div>
                )}

                {demoStage === "results" && (
                  <div style={{ animation: "fadeInUp 0.5s ease both" }}>
                    {/* Module map */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ color: "#00d4ff", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.8rem" }}>▸ MODULE MAP</div>
                      <table style={{ width: "100%", fontSize: "0.7rem", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ color: "#4a5568", textAlign: "left" }}>
                            <th style={{ padding: "4px 8px", borderBottom: "1px solid #1c2230" }}>Slot</th>
                            <th style={{ padding: "4px 8px", borderBottom: "1px solid #1c2230" }}>Part #</th>
                            <th style={{ padding: "4px 8px", borderBottom: "1px solid #1c2230" }}>Type</th>
                            <th style={{ padding: "4px 8px", borderBottom: "1px solid #1c2230" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MODULES_TABLE.map((m) => (
                            <tr key={m.slot}>
                              <td style={{ padding: "4px 8px", color: "#8b949e" }}>{m.slot}</td>
                              <td style={{ padding: "4px 8px", color: "#e6edf3" }}>{m.part}</td>
                              <td style={{ padding: "4px 8px", color: "#8b949e" }}>{m.type}</td>
                              <td style={{ padding: "4px 8px", color: m.status === "FAULT" ? "#f85149" : "#3fb950", fontWeight: 600 }}>{m.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* I/O Summary */}
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                      {["32 DI", "16 DO", "16 AI", "0 AO"].map((io) => (
                        <div key={io} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6, padding: "6px 12px", fontSize: "0.75rem" }}>
                          <span style={{ color: "#00d4ff", fontWeight: 700 }}>{io.split(" ")[0]}</span>{" "}
                          <span style={{ color: "#8b949e" }}>{io.split(" ")[1]}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fault Report */}
                    <div style={{ background: "rgba(248,81,73,0.06)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ color: "#f85149", fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.4rem" }}>▸ FAULT REPORT</div>
                      <div style={{ fontSize: "0.75rem", color: "#e6edf3", lineHeight: 1.7 }}>
                        <div>⚠ <strong>Slot 3 — 1756-OB16E</strong>: Output module fault LED active</div>
                        <div>↳ Probable short on output point DO-03</div>
                        <div>↳ Communication bus: EtherNet/IP — healthy</div>
                      </div>
                      <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "#f85149", fontStyle: "italic" }}>
                        Root cause: Rung 47 modified without documentation. Confidence: 94%. Suspect: unnamed.
                      </div>
                    </div>

                    <div style={{ fontSize: "0.65rem", color: "#4a5568", fontFamily: "monospace", marginBottom: "0.75rem" }}>
                      Undocumented timer chain detected · Estimated age: 14 years
                    </div>
                    <a href="#ladder" style={{ fontSize: "0.75rem", color: "#00d4ff", textDecoration: "none" }}>↓ View inferred ladder logic below</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>How it works</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" }}>From photo to fault in five steps.</h2>
        </div>
        <div data-grid="how" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "1.25rem", position: "relative" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontWeight: 700, fontSize: "0.8rem", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>{s.n}</div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.4rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.8rem", color: "#8b949e", lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "5rem 2rem", background: "#161b22", borderTop: "1px solid #30363d", borderBottom: "1px solid #30363d" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>Capabilities</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" }}>Built for the plant floor, not the board room.</h2>
          </div>
          <div data-grid="features" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: "#0d1117", border: "1px solid #30363d", borderTop: "2px solid rgba(0,212,255,0.4)", borderRadius: 12, padding: "1.5rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#8b949e", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LADDER LOGIC VISUALIZATION ── */}
      <section id="ladder" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>Ladder Logic Output</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" }}>AI-reconstructed ladder diagram.</h2>
            <p style={{ color: "#8b949e", fontSize: "0.9rem", marginTop: "0.5rem" }}>Inferred from detected I/O configuration and LED state patterns.</p>
          </div>

          <div style={{ background: "#0a0e14", border: "1px solid #30363d", borderRadius: 12, padding: "2rem", fontFamily: "monospace", fontSize: "0.8rem", overflow: "auto" }}>
            {[
              { rung: "001", label: "Start / Run Circuit", contacts: [{ type: "NO", addr: "I:1/0", name: "StartBtn" }, { type: "NO", addr: "I:1/3", name: "SafetyOK" }], coil: { addr: "O:2/0", name: "MotorRun" } },
              { rung: "002", label: "Conveyor Enable", contacts: [{ type: "NC", addr: "I:1/1", name: "EStop" }, { type: "NO", addr: "B3:0/1", name: "AutoMode" }], coil: { addr: "O:2/1", name: "ConvRun" } },
              { rung: "003", label: "Fault Output — Inferred from DO-03 state", contacts: [{ type: "NO", addr: "I:1/4", name: "SensorIn" }, { type: "NO", addr: "T4:0/DN", name: "TimerDN" }], coil: { addr: "O:2/3", name: "FaultOut", fault: true } },
            ].map((rung) => (
              <div key={rung.rung} style={{ marginBottom: "2rem" }}>
                <div style={{ color: "#4a5568", fontSize: "0.7rem", marginBottom: "0.5rem" }}>
                  Rung {rung.rung} — {rung.label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <div style={{ width: 3, height: 50, background: "#00d4ff", borderRadius: 1, flexShrink: 0 }} />
                  <div style={{ width: 20, height: 2, background: "#00d4ff", flexShrink: 0 }} />
                  {rung.contacts.map((contact, ci) => (
                    <div key={ci} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ border: "1px solid #00d4ff", borderRadius: 3, padding: "6px 12px", color: "#e6edf3", fontSize: "0.75rem", background: "rgba(0,212,255,0.05)", whiteSpace: "nowrap" }}>
                          {contact.type === "NC" ? "]/[" : "] ["} {contact.addr}
                        </div>
                        <span style={{ fontSize: "0.6rem", color: "#4a5568", marginTop: "2px" }}>{contact.name}</span>
                      </div>
                      <div style={{ width: 20, height: 2, background: "#00d4ff", flexShrink: 0 }} />
                    </div>
                  ))}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 50, height: 32, border: `2px solid ${rung.coil.fault ? "#f85149" : "#00d4ff"}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: rung.coil.fault ? "#f85149" : "#e6edf3", fontSize: "0.65rem", background: rung.coil.fault ? "rgba(248,81,73,0.08)" : "rgba(0,212,255,0.05)" }}>
                      ( )
                    </div>
                    <span style={{ fontSize: "0.6rem", color: rung.coil.fault ? "#f85149" : "#4a5568", marginTop: "2px" }}>{rung.coil.addr}</span>
                    <span style={{ fontSize: "0.55rem", color: rung.coil.fault ? "#f85149" : "#4a5568" }}>{rung.coil.name}</span>
                  </div>
                  <div style={{ width: 20, height: 2, background: rung.coil.fault ? "#f85149" : "#00d4ff", flexShrink: 0 }} />
                  <div style={{ width: 3, height: 50, background: rung.coil.fault ? "#f85149" : "#00d4ff", borderRadius: 1, flexShrink: 0 }} />
                </div>
              </div>
            ))}

            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(210,153,34,0.1)", border: "1px solid rgba(210,153,34,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: "0.7rem", color: "#d29922", marginTop: "0.5rem" }}>
              ⚠ Inferred — not verified against project file
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" style={{ padding: "5rem 2rem", background: "#161b22", borderTop: "1px solid #30363d", borderBottom: "1px solid #30363d" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>Engineer-Approved™</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" }}>What the floor is saying.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {REVIEWS.map((r) => (
              <div key={r.name + r.role} style={{ background: "#0d1117", border: "1px solid #30363d", borderLeft: "3px solid rgba(0,212,255,0.4)", borderRadius: 12, padding: "1.5rem", position: "relative" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: "0.75rem" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < r.stars ? "#00d4ff" : "#30363d", fontSize: "0.9rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem", fontStyle: "italic" }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1c2230", border: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#00d4ff", flexShrink: 0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#8b949e" }}>{r.role}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "0.65rem", background: "rgba(63,185,80,0.1)", color: "#3fb950", border: "1px solid rgba(63,185,80,0.25)", padding: "2px 7px", borderRadius: 999 }}>✔ Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", background: "linear-gradient(180deg, #0d1117 0%, #0a1628 100%)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "1rem" }}>Ready to diagnose your next outage?</h2>
          <p style={{ color: "#8b949e", fontSize: "1rem", marginBottom: "2rem" }}>Upload a cabinet photo and get results in under 5 seconds.</p>
          <button onClick={scrollToDemo} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 2rem", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer", border: "none", background: "#00d4ff", color: "#000" }}>
            Try Live Demo
          </button>
        </div>
      </section>

      {/* ── REAL PRODUCT REVEAL ── */}
      <section style={{ padding: "3rem 2rem", borderTop: "1px solid #1c2230", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontSize: "0.95rem", color: "#8b949e", marginBottom: "1rem", lineHeight: 1.6 }}>
            SnapPLC™ isn&apos;t real. But AI-generated PLC code is.
          </p>
          <a href="https://www.plccode.ai" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600, background: "transparent", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)", textDecoration: "none" }}>
            Check out PLCcode.ai →
          </a>
          <p style={{ fontSize: "0.75rem", color: "#4a5568", marginTop: "0.75rem" }}>
            Real AI. Real PLC code generation. No camera required.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "3rem 2rem", borderTop: "1px solid #30363d" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "Documentation", href: "#" },
              { label: "API Reference", href: "#" },
              { label: "Pricing", href: "/pricing" },
              { label: "Careers", href: "/careers" },
              { label: "System Status", href: "/status" },
            ].map((link) => (
              <a key={link.label} href={link.href} style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>{link.label}</a>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              <span style={{ color: "#00d4ff" }}>Snap</span>PLC
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8b949e", marginBottom: "1.5rem" }}>AI-powered diagnostics for the plant floor.</div>
            <div style={{ fontSize: "0.72rem", color: "#3a4560", fontStyle: "italic", lineHeight: 1.8 }}>
              SnapPLC is not responsible for production downtime, finger-pointing, or the realization that Dave has been running the plant in Manual Mode since March.
              <br />© 2026 SnapPLC™ — Results may vary.
              <br /><br />
              <span style={{ color: "#2a3448" }}>
                Powered by 47 layers of neural network and one very tired controls engineer who keeps saying &ldquo;it worked in simulation.&rdquo;
              </span>
              <br />
              <span style={{ color: "#161b22" }}>This is not a real product. Happy April Fools&apos; Day.</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes scanLine { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        @keyframes chipFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes chipFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drawBox { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @media (max-width: 768px) {
          nav > div:last-child { display: none !important; }
          [data-grid="hero"] { grid-template-columns: 1fr !important; gap: 2rem !important; text-align: center; }
          [data-grid="demo"] { grid-template-columns: 1fr !important; min-height: auto !important; }
          [data-grid="how"] { grid-template-columns: repeat(2, 1fr) !important; }
          [data-grid="features"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          [data-grid="how"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
