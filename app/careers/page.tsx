"use client";

const ROLES = [
  {
    title: "Senior Ladder Logic Psychologist",
    desc: "Help interpret the intent behind ladder logic that no one can explain.",
    duties: [
      "Analyze emotional patterns in control logic",
      "Identify panic-written code",
      "Provide closure to confused engineers",
    ],
  },
  {
    title: "AI Wire Emotion Specialist",
    desc: "Train our models to understand how wires are feeling.",
    duties: [
      "Classify chaotic wiring patterns",
      "Predict intended connections",
      "Work closely with spaghetti",
    ],
  },
  {
    title: "Legacy Code Archaeologist",
    desc: "Dig through ancient PLC programs and determine what they were supposed to do.",
    duties: [
      "Interpret undocumented routines",
      'Identify historical "temporary fixes"',
      "Date code based on programming style",
    ],
  },
  {
    title: "Director of Blame Assignment",
    desc: "Ensure accurate and timely fault attribution.",
    duties: [
      "Assign responsibility across teams",
      "Prioritize operator vs engineer blame",
      "Maintain fairness (optional)",
    ],
  },
];

export default function Careers() {
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
          <a href="/pricing" style={{ color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" }}>Pricing</a>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ padding: "5rem 2rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>Careers</div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.75rem" }}>Join us in solving problems no one understands.</h1>
        <p style={{ color: "#8b949e", fontSize: "1rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          At SnapPLC™, we&apos;re redefining industrial automation using AI, machine learning, and educated guesses.
        </p>
      </section>

      {/* BELIEFS */}
      <section style={{ padding: "1rem 2rem 3rem", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>We believe</div>
          <div style={{ fontSize: "0.9rem", color: "#8b949e", lineHeight: 1.8 }}>
            <div>→ Every control panel tells a story</div>
            <div>→ Most of those stories are confusing</div>
            <div>→ Some should never be told</div>
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section style={{ padding: "2rem 2rem 4rem", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.5px" }}>Open Roles</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {ROLES.map((role) => (
            <div key={role.title} style={{ background: "#161b22", border: "1px solid #30363d", borderLeft: "3px solid rgba(0,212,255,0.4)", borderRadius: 12, padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{role.title}</h3>
              <p style={{ color: "#8b949e", fontSize: "0.9rem", marginBottom: "1rem" }}>{role.desc}</p>
              <div style={{ fontSize: "0.7rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Responsibilities</div>
              {role.duties.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", padding: "3px 0", color: "#e6edf3" }}>
                  <span style={{ color: "#00d4ff", flexShrink: 0 }}>•</span> {d}
                </div>
              ))}
              <button style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", border: "1px solid #30363d", background: "transparent", color: "#e6edf3" }}>
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* REQUIREMENTS + BENEFITS */}
      <section style={{ padding: "2rem 2rem 3rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Requirements</h3>
            {[
              '5+ years debugging things that "worked fine yesterday"',
              "Ability to stare at control panels silently for extended periods",
              "Experience with undocumented systems preferred",
              "Strong emotional resilience",
            ].map((r, i) => (
              <div key={i} style={{ fontSize: "0.85rem", color: "#8b949e", padding: "4px 0", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#d29922", flexShrink: 0 }}>→</span> {r}
              </div>
            ))}
          </div>

          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Benefits</h3>
            {[
              "Competitive salary (based on confidence level)",
              "Flexible hours (depending on machine uptime)",
              "Unlimited coffee during commissioning",
              "Exposure to problems you didn't know existed",
            ].map((b, i) => (
              <div key={i} style={{ fontSize: "0.85rem", color: "#8b949e", padding: "4px 0", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#3fb950", flexShrink: 0 }}>✓</span> {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION PROCESS */}
      <section style={{ padding: "2rem 2rem 3rem", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Application Process</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            "Submit your resume",
            "Explain a system you fixed that you didn't understand",
            "Pass a live debugging session",
            "Question your life choices",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "0.75rem 1rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontWeight: 700, fontSize: "0.75rem", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: "0.9rem", color: "#e6edf3" }}>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section style={{ padding: "2rem 2rem 5rem", textAlign: "center" }}>
        <p style={{ color: "#8b949e", fontSize: "1rem", fontStyle: "italic", maxWidth: 500, margin: "0 auto", marginBottom: "1.5rem" }}>
          If you&apos;ve ever opened a control panel and immediately sighed, you&apos;ll fit right in.
        </p>
        <div style={{ fontSize: "0.75rem", color: "#4a5568" }}>
          Headquarters: Somewhere between commissioning and panic
        </div>
        <div style={{ fontSize: "0.7rem", color: "#3a4560", marginTop: "0.75rem", fontStyle: "italic" }}>
          We move fast and document later.
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 2rem", borderTop: "1px solid #30363d", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Home</a>
          <a href="/pricing" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Pricing</a>
          <a href="/status" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>System Status</a>
        </div>
        <div style={{ fontSize: "0.72rem", color: "#3a4560" }}>© 2026 SnapPLC™ — Results may vary.</div>
      </footer>
    </main>
  );
}
