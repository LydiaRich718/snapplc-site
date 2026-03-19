export default function NotFound() {
  return (
    <main style={{ background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 500, padding: "2rem" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "#f85149", fontWeight: 600, marginBottom: "1rem" }}>Error 404</div>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.75rem" }}>Page not found.</h1>

        <p style={{ fontSize: "1.2rem", color: "#8b949e", marginBottom: "2rem" }}>It worked fine yesterday.</p>

        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "1.25rem", marginBottom: "2.5rem", textAlign: "left" }}>
          <div style={{ fontSize: "0.75rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>The page you&apos;re looking for may have been</div>
          {["moved", "renamed", "temporarily bypassed", "left undocumented for future generations"].map((reason) => (
            <div key={reason} style={{ fontSize: "0.85rem", color: "#8b949e", padding: "3px 0", display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#d29922", flexShrink: 0 }}>→</span> {reason}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", padding: "0.75rem 1.5rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, background: "#00d4ff", color: "#000", textDecoration: "none" }}>
            Return Home
          </a>
          <a href="/status" style={{ display: "inline-flex", alignItems: "center", padding: "0.75rem 1.5rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, background: "transparent", color: "#e6edf3", border: "1px solid #30363d", textDecoration: "none" }}>
            Check System Status
          </a>
        </div>

        <div style={{ marginTop: "2.5rem", fontSize: "0.7rem", color: "#3a4560", fontFamily: "monospace" }}>
          Incident classification: unexpected but not uncommon
        </div>
      </div>
    </main>
  );
}
