"use client";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself, where
 * the normal error page can't render. It has to supply its own <html>/<body>,
 * and can't rely on the app's fonts or theme tokens being mounted.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "system-ui, sans-serif",
          color: "#171717",
          background: "#ffffff",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>
          The app failed to load
        </h1>
        <p style={{ fontSize: 14, color: "#737373", maxWidth: 420, margin: 0 }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 6,
            border: "none",
            background: "#171717",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
