"use client";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    desc: "For light confusion and small regrets.",
    features: [
      "Up to 3 panel scans per day",
      "Basic wire interpretation",
      "Identifies obvious mistakes",
      'Confidence level: "should work"',
      "Limited panic detection",
    ],
    limitations: [
      "May ignore undocumented logic",
      "Occasional hallucinations",
      "Does not support night shift environments",
    ],
    cta: "Try It Anyway",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49/mo",
    desc: "For engineers who are already in too deep.",
    features: [
      "Unlimited panel scans",
      "Advanced guesswork engine",
      "Reconstructs undocumented ladder logic",
      'Identifies "temporary fixes" from 5+ years ago',
      "Blames operator before blaming engineer",
      'Confidence level: "feels right"',
    ],
    bonus: '// don\'t touch this',
    cta: "Fix My Program",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    desc: "For facilities running entirely on hope.",
    features: [
      'On-site AI "vibe analysis"',
      "Dedicated Panic Support Engineer",
      "Real-time blame assignment dashboard",
      "Predictive operator behavior modeling",
      "Legacy system archaeology (pre-2010)",
    ],
    extras: [
      "Works on cabinets with no drawings",
      "Works on cabinets with incorrect drawings",
      "Works on cabinets wired during commissioning",
    ],
    sla: '"we\'re looking into it"',
    cta: "We Need Help",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <main style={{ background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 60, background: "rgba(13,17,23,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid #30363d" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.5px", textDecoration: "none", color: "#e6edf3" }}>
          <span style={{ color: "#00d4ff" }}>Snap</span>
          <span>PLC</span>
          <span style={{ fontSize: "0.65rem", background: "#0077b6", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Beta</span>
        </a>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="/" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Home</a>
          <a href="/careers" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Careers</a>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ padding: "5rem 2rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>Pricing</div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.75rem" }}>Plans for every level of chaos.</h1>
        <p style={{ color: "#8b949e", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>Whether you&apos;re debugging one panel or an entire facility, SnapPLC™ scales with your confusion.</p>
      </section>

      {/* PRICING CARDS */}
      <section style={{ padding: "2rem 2rem 4rem", maxWidth: 1100, margin: "0 auto" }}>
        <div data-grid="pricing" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", alignItems: "start" }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: "#161b22",
              border: plan.highlight ? "2px solid rgba(0,212,255,0.5)" : "1px solid #30363d",
              borderRadius: 16,
              padding: "2rem",
              position: "relative",
              boxShadow: plan.highlight ? "0 0 40px rgba(0,212,255,0.08)" : "none",
            }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#00d4ff", color: "#000", fontSize: "0.7rem", fontWeight: 700, padding: "3px 12px", borderRadius: 999, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  Most Popular
                </div>
              )}

              <div style={{ fontSize: "0.8rem", color: "#8b949e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>{plan.name}</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", color: plan.highlight ? "#00d4ff" : "#e6edf3" }}>{plan.price}</div>
              <p style={{ color: "#8b949e", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>{plan.desc}</p>

              <div style={{ marginBottom: "1.5rem" }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", padding: "4px 0", color: "#e6edf3" }}>
                    <span style={{ color: "#3fb950", flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>

              {plan.bonus && (
                <div style={{ background: "#0a0e14", border: "1px solid #30363d", borderRadius: 8, padding: "0.6rem 0.8rem", marginBottom: "1.5rem", fontFamily: "monospace", fontSize: "0.75rem", color: "#4a5568" }}>
                  Auto-adds comments like:<br />
                  <span style={{ color: "#3fb950" }}>{plan.bonus}</span>
                </div>
              )}

              {plan.limitations && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.4rem" }}>Limitations</div>
                  {plan.limitations.map((l, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", padding: "3px 0", color: "#8b949e" }}>
                      <span style={{ color: "#d29922", flexShrink: 0 }}>⚠</span> {l}
                    </div>
                  ))}
                </div>
              )}

              {plan.extras && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.4rem" }}>Custom Capabilities</div>
                  {plan.extras.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", padding: "3px 0", color: "#8b949e" }}>
                      <span style={{ color: "#00d4ff", flexShrink: 0 }}>→</span> {e}
                    </div>
                  ))}
                </div>
              )}

              {plan.sla && (
                <div style={{ fontSize: "0.8rem", color: "#8b949e", marginBottom: "1.5rem" }}>
                  Response time: <span style={{ fontStyle: "italic" }}>{plan.sla}</span>
                </div>
              )}

              <button style={{ width: "100%", padding: "0.75rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", border: plan.highlight ? "none" : "1px solid #30363d", background: plan.highlight ? "#00d4ff" : "transparent", color: plan.highlight ? "#000" : "#e6edf3" }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FINE PRINT */}
      <section style={{ padding: "2rem 2rem 4rem", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "0.72rem", color: "#3a4560", lineHeight: 1.8, fontStyle: "italic" }}>
          SnapPLC™ is not responsible for unexpected machine behavior, incorrect logic reconstruction, or emotional distress caused by reviewing legacy code.
          <br /><br />
          Performance may vary depending on wiring quality, documentation accuracy, and how chaotic the original system is.
          <br /><br />
          Does not guarantee success in environments labeled &ldquo;temporary fix.&rdquo;
        </div>
      </section>

      {/* REAL PRODUCT REVEAL */}
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

      {/* FOOTER */}
      <footer style={{ padding: "2rem 2rem", borderTop: "1px solid #30363d", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Home</a>
          <a href="/careers" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Careers</a>
          <a href="/status" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>System Status</a>
        </div>
        <div style={{ fontSize: "0.72rem", color: "#3a4560" }}>© 2026 SnapPLC™ — Results may vary.</div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          nav > div:last-child { display: none !important; }
          [data-grid="pricing"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
