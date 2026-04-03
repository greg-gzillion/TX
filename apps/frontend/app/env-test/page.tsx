"use client";

export default function EnvTest() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🔧 Environment Variable Test</h1>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <p>
          <strong>NEXT_PUBLIC_PINATA_JWT exists:</strong>{" "}
          {!!process.env.NEXT_PUBLIC_PINATA_JWT ? "✅ YES" : "❌ NO"}
        </p>
        <p>
          <strong>Length:</strong>{" "}
          {process.env.NEXT_PUBLIC_PINATA_JWT?.length || 0}
        </p>
        <p>
          <strong>First 10 chars:</strong>{" "}
          {process.env.NEXT_PUBLIC_PINATA_JWT?.substring(0, 10) || "N/A"}...
        </p>
      </div>
      <p style={{ marginTop: "20px", color: "#666" }}>
        This page tests if environment variables are loaded correctly.
      </p>
    </div>
  );
}
