"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function SnapPLC() {
  const [fileName, setFileName] = useState("No file selected");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "progress" | "result">("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setStage("progress");
    setProgress(0);

    const steps = [15, 35, 60, 80, 95, 100];
    const delays = [200, 600, 1100, 1600, 2000, 2400];
    steps.forEach((w, i) => setTimeout(() => setProgress(w), delays[i]));
    setTimeout(() => setStage("result"), 2800);
  }

  function scrollToUpload() {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(triggerUpload, 500);
  }

  return (
    <main style={{ background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 60, background: "rgba(13,17,23,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid #30363d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#f0a500" }}>Snap</span>
          <span>PLC</span>
          <span style={{ fontSize: "0.65rem", background: "#e05c2a", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Beta</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="#how"     style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>How it works</a>
          <a href="#reviews" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Reviews</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "7rem 2rem 0", textAlign: "center" }}>
        {/* grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.25, pointerEvents: "none" }} />
        {/* glow */}
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
          {/* eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#f0a500", fontWeight: 600, border: "1px solid rgba(240,165,0,0.3)", padding: "4px 12px", borderRadius: 999, marginBottom: "1.5rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3fb950", animation: "pulse 1.8s ease-in-out infinite" }} />
            AI-Powered Industrial Diagnostics
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: "1.25rem" }}>
            Snap a picture of your PLC.<br />
            <span style={{ background: "linear-gradient(90deg, #f0a500, #e05c2a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Get instant diagnostics.
            </span>
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#8b949e", maxWidth: 580, margin: "0 auto 2.5rem" }}>
            SnapPLC uses computer vision and industrial AI to analyze your PLC cabinet,
            identify faults, and point fingers at the most likely culprit — usually the controls engineer.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <button onClick={scrollToUpload} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", border: "none", background: "#f0a500", color: "#000" }}>
              📸 Upload PLC Photo
            </button>
            <a href="#how" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600, background: "transparent", color: "#e6edf3", border: "1px solid #30363d", textDecoration: "none" }}>
              See How It Works
            </a>
          </div>
        </div>

        {/* hero image */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", borderRadius: 16, overflow: "hidden", border: "1px solid #30363d", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
          <Image src="/SnapPLC.png" alt="SnapPLC app analyzing a PLC control cabinet on the plant floor" width={1320} height={880} style={{ width: "100%", height: "auto", display: "block" }} priority />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, #0d1117, transparent)", pointerEvents: "none" }} />
        </div>
      </section>

      {/* ── UPLOAD CARD ── */}
      <section id="upload" style={{ padding: "4rem 2rem", display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 640 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.3rem" }}>Diagnose Your Cabinet</h2>
          <p style={{ color: "#8b949e", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Upload a photo and our AI will identify issues in seconds.</p>

          {/* drop zone */}
          <div
            onClick={triggerUpload}
            style={{
              position: "relative",
              background: previewUrl ? "none" : "#1c2230",
              backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "2px dashed #30363d",
              borderRadius: 10,
              aspectRatio: "4/3",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {!previewUrl && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", userSelect: "none" }}>
                {/* mini PLC cabinet illustration */}
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
                      { label: "DI",  leds: ["g", "g", "g"] },
                      { label: "DO",  leds: ["a", "g", "g"] },
                      { label: "AI",  leds: ["g", "r", "g"] },
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
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#8b949e" }}>Click to upload a photo</div>
                  <div style={{ fontSize: "0.75rem", color: "#4a5568", marginTop: "0.25rem" }}>JPG, PNG, WEBP · Max 10 MB</div>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          </div>

          {/* button row */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button onClick={triggerUpload} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", border: "none", background: "#f0a500", color: "#000" }}>
              📂 Upload PLC Photo
            </button>
            <span style={{ fontSize: "0.8rem", color: "#8b949e", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</span>
          </div>

          {/* progress bar */}
          {stage === "progress" && (
            <div style={{ height: 4, background: "#30363d", borderRadius: 999, marginTop: "1rem", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #f0a500, #e05c2a)", borderRadius: 999, transition: "width 0.4s ease" }} />
            </div>
          )}

          {/* result */}
          {stage === "result" && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(240,165,0,0.07)", border: "1px solid rgba(240,165,0,0.25)", borderRadius: 8, fontSize: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, marginBottom: "0.4rem", color: "#f0a500" }}>⚠ SnapPLC Analysis Complete</div>
              <div style={{ color: "#e6edf3" }}>
                <div style={{ padding: "2px 0" }}>✔ Cabinet power supply: <strong>nominal</strong></div>
                <div style={{ padding: "2px 0" }}>✔ I/O modules detected: <strong>4 of 4</strong></div>
                <div style={{ padding: "2px 0" }}>⚠ CPU fault LED active: <strong>Output module DO‑03 may be shorted</strong></div>
                <div style={{ padding: "2px 0" }}>✔ Communication bus: <strong>healthy</strong></div>
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#f85149", fontStyle: "italic" }}>
                Root cause assessment: someone modified Rung 47 without documentation. We&apos;re not naming names.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "4rem 2rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#f0a500", fontWeight: 600, marginBottom: "0.5rem" }}>How it works</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "2.5rem", letterSpacing: "-0.5px" }}>From photo to fault in three steps.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {[
            { n: "1", title: "Snap the Cabinet",  body: "Take a photo of your PLC cabinet, control panel, or anything that's been blinking red since the Tuesday shift." },
            { n: "2", title: "AI Analyzes",        body: "Our model identifies module types, LED states, wiring, and whether someone has been cable-tying things together again." },
            { n: "3", title: "Get Diagnostics",    body: "Receive a plain-English fault report, recommended actions, and a probabilistic blame assignment for your team." },
          ].map((s) => (
            <div key={s.n} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "1.5rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.3)", color: "#f0a500", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>{s.n}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.88rem", color: "#8b949e" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" style={{ padding: "4rem 2rem", background: "#161b22", borderTop: "1px solid #30363d", borderBottom: "1px solid #30363d" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#f0a500", fontWeight: 600, marginBottom: "0.5rem" }}>Engineer-Approved™</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "2.5rem", letterSpacing: "-0.5px" }}>What the floor is saying.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { initials: "PM", name: "Gary T.",    role: "Plant Manager — Midwest Facility",      stars: 5, text: "\"It blamed the controls engineer before production even called.\"" },
              { initials: "CE", name: "Anonymous",  role: "Controls Engineer — Not Dave's Facility", stars: 5, text: "\"Operator Mode predicted Dave would press Reset six times. Dave pressed Reset seven times.\"" },
              { initials: "MT", name: "Mike R.",    role: "Maintenance Tech — 3rd Shift",           stars: 4, text: "\"Told me the E-Stop was physically damaged. Turned out it was just zip-tied shut. Four stars because it was technically correct.\"" },
            ].map((r) => (
              <div key={r.name + r.role} style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: "1.5rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "0.5rem", left: "1rem", fontSize: "4rem", lineHeight: 1, color: "#f0a500", opacity: 0.2, fontFamily: "Georgia, serif" }}>&ldquo;</div>
                <div style={{ display: "flex", gap: 3, marginBottom: "0.75rem" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < r.stars ? "#f0a500" : "#30363d", fontSize: "0.9rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem", fontStyle: "italic" }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1c2230", border: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#f0a500", flexShrink: 0 }}>{r.initials}</div>
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

      {/* ── FOOTER ── */}
      <footer style={{ padding: "2.5rem 2rem", textAlign: "center", borderTop: "1px solid #30363d" }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          <span style={{ color: "#f0a500" }}>Snap</span>PLC
        </div>
        <div style={{ fontSize: "0.8rem", color: "#8b949e", marginBottom: "1rem" }}>AI-powered diagnostics for the plant floor.</div>
        <div style={{ fontSize: "0.75rem", color: "#3a4560", fontStyle: "italic" }}>
          SnapPLC is not responsible for production downtime, finger-pointing, or the realization that Dave has been running the plant in Manual Mode since March.
          <br />© 2025 SnapPLC Inc. — &ldquo;If it blinks, we&apos;ll blame someone.&rdquo;
          <br /><br />
          <span style={{ color: "#2a3448" }}>
            Powered by 47 layers of neural network and one very tired controls engineer who keeps saying &ldquo;it worked in simulation.&rdquo;
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </main>
  );
}
