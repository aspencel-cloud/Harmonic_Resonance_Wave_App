import React from "react";

interface TermsOfUseModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsOfUseModal({ open, onClose }: TermsOfUseModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 50 }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 720,
          margin: "8vh auto",
          borderRadius: 16,
          border: "1px solid var(--rs-border)",
          background: "var(--rs-surface)",
          color: "var(--rs-text)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ padding: 20, maxHeight: "70vh", overflow: "auto" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600 }}>
            Terms of Use
          </h2>
          <p style={{ margin: "0 0 12px 0", opacity: 0.8, fontSize: 13 }}>
            © 2025 Angela Spenceley. All rights reserved.
          </p>

          <p>
            These materials — including text, graphics, symbols, glossaries,
            frameworks, and tools — form part of the Soul Resonance Cosmology™
            system (also known as Soul Resonance Astrology™). By accessing,
            downloading, or using these materials, you agree to the following:
          </p>

          <ol style={{ paddingLeft: 18 }}>
            <li>
              <strong>Personal Use Only.</strong> All materials are provided for
              personal study, learning, and inspiration. You may use them to
              deepen your own understanding, reflection, and practice.
            </li>
            <li>
              <strong>No Redistribution.</strong> You may not copy, share, or
              redistribute these materials (in part or whole) without prior
              written permission from the author. This includes sharing PDFs,
              spreadsheets, software, or extracts in any digital or printed
              form.
            </li>
            <li>
              <strong>No Commercial Use.</strong> You may not use these
              materials commercially. This includes selling, licensing,
              teaching, publishing, or incorporating them into paid services,
              courses, or apps without express written agreement.
            </li>
            <li>
              <strong>Respect for Original Work.</strong> Soul Resonance
              Cosmology™ and Soul Resonance Astrology™ are trademarks in use
              and protected intellectual property. Please respect the integrity
              of the system by acknowledging the source when referencing or
              quoting.
            </li>
            <li>
              <strong>Limited License.</strong> You are granted a non-exclusive,
              revocable license to use these materials for your personal
              development only. All rights not expressly granted remain
              reserved.
            </li>
            <li>
              <strong>Disclaimer.</strong> These materials are offered for
              educational and spiritual purposes. They are not medical,
              psychological, or financial advice. Use your own discernment when
              applying the ideas.
            </li>
          </ol>

          <p style={{ marginTop: 12, fontStyle: "italic", opacity: 0.9 }}>
            “Thank you for honoring the boundaries of this work. By doing so,
            you help protect its integrity and allow it to grow in the spirit it
            was created.”
          </p>
        </div>

        <div
          style={{
            padding: 12,
            borderTop: "1px solid var(--rs-border)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              border: "1px solid var(--rs-border)",
              background: "transparent",
              color: "var(--rs-text)",
              borderRadius: 8,
              padding: "6px 10px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Optional: keep a default too
export default TermsOfUseModal;
