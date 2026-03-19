"use client";

const SERVICES = [
  { name: "Panel Scan Engine", status: "Operational" },
  { name: "Ladder Logic Reconstruction", status: "Operational" },
  { name: "Temporary Fix Detection", status: "Operational" },
  { name: "Panic Logic Analysis", status: "Operational" },
  { name: "Operator Mode", status: "Degraded Performance", note: 'Repeatedly predicts "Reset" in situations where no button should be pressed.' },
  { name: "Blame Assignment Engine", status: "Operational" },
  { name: "Legacy Code Archaeology", status: "Operational" },
];

const INCIDENTS = [
  { time: "09:14 AM", event: 'Operator Mode falsely predicted "read manual"' },
  { time: "10:32 AM", event: 'Panic Logic Analysis flagged entire panel as "emotional"' },
  { time: "11:48 AM", event: "Blame Assignment Engine escalated issue before production called" },
  { time: "01:06 PM", event: "Legacy Code Archaeology discovered undocumented timer chain from 2009" },
  { time: "02:41 PM", event: "Temporary Fix Detection identified 17 permanent temporary fixes" },
  { time: "03:55 PM", event: "Panel Scan Engine classified cable management as \"abstract art\"" },
];

export default function Status() {
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
        <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#00d4ff", fontWeight: 600, marginBottom: "0.5rem" }}>System Status</div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.75rem" }}>Current status of SnapPLC™ services.</h1>
        <p style={{ color: "#8b949e", fontSize: "0.9rem" }}>Including operator prediction systems and blame infrastructure.</p>
      </section>

      {/* OVERALL STATUS */}
      <section style={{ padding: "1rem 2rem 3rem", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ background: "rgba(63,185,80,0.06)", border: "1px solid rgba(63,185,80,0.25)", borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3fb950", boxShadow: "0 0 8px #3fb950" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#3fb950" }}>All systems operational</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8b949e" }}>
            Known issue: Operator Mode may overestimate Dave.
          </div>
        </div>
      </section>

      {/* SERVICE LIST */}
      <section style={{ padding: "0 2rem 4rem", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Services</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {SERVICES.map((svc) => {
            const isOk = svc.status === "Operational";
            return (
              <div key={svc.name}>
                <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.9rem" }}>{svc.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: isOk ? "#3fb950" : "#d29922", boxShadow: isOk ? "0 0 4px #3fb950" : "0 0 4px #d29922" }} />
                    <span style={{ fontSize: "0.8rem", color: isOk ? "#3fb950" : "#d29922", fontWeight: 600 }}>{svc.status}</span>
                  </div>
                </div>
                {svc.note && (
                  <div style={{ marginTop: "0.25rem", marginLeft: "1rem", fontSize: "0.75rem", color: "#d29922", fontStyle: "italic", padding: "0.25rem 0" }}>
                    Current anomaly: {svc.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#4a5568", fontFamily: "monospace" }}>
          System confidence: 62% (feels right)
        </div>
      </section>

      {/* INCIDENT LOG */}
      <section style={{ padding: "2rem 2rem 4rem", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Recent Incident Log</h2>
        <div style={{ background: "#0a0e14", border: "1px solid #30363d", borderRadius: 12, padding: "1.5rem", fontFamily: "monospace", fontSize: "0.8rem" }}>
          {INCIDENTS.map((inc, i) => (
            <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.5rem 0", borderBottom: i < INCIDENTS.length - 1 ? "1px solid #1c2230" : "none" }}>
              <span style={{ color: "#4a5568", flexShrink: 0, minWidth: 75 }}>{inc.time}</span>
              <span style={{ color: "#8b949e" }}>{inc.event}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section style={{ padding: "2rem 2rem 5rem", textAlign: "center" }}>
        <p style={{ color: "#8b949e", fontSize: "0.9rem", marginBottom: "1rem" }}>
          For urgent issues, please contact support or stare silently at the control panel for several minutes.
        </p>
        <a href="/support" style={{ display: "inline-block", padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", border: "1px solid #30363d", background: "transparent", color: "#e6edf3", textDecoration: "none" }}>
          Contact Support
        </a>
        <div style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "#4a5568", fontStyle: "italic" }}>
          Average response time: &ldquo;we&apos;re looking into it&rdquo;
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 2rem", borderTop: "1px solid #30363d", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Home</a>
          <a href="/pricing" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Pricing</a>
          <a href="/careers" style={{ color: "#4a5568", textDecoration: "none", fontSize: "0.85rem" }}>Careers</a>
        </div>
        <div style={{ fontSize: "0.72rem", color: "#3a4560" }}>© 2026 SnapPLC™ — Results may vary.</div>
      </footer>
    </main>
  );
}
