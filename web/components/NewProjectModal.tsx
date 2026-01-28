"use client";
import React, { useState } from "react";

type NewProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function NewProjectModal({ open, onClose }: NewProjectModalProps): JSX.Element | null {
  const [projectName, setProjectName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Placeholder submission endpoint. This can be wired to API Gateway/StepFunctions later.
      await fetch("/api/new-project", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectName, address, email }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" style={styles.backdrop}>
      <div style={styles.modal}>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <h2 style={styles.title}>New Project</h2>
            <label style={styles.label}>
              Project name
              <input
                style={styles.input}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </label>
            <label style={styles.label}>
              Address or location
              <input
                style={styles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <label style={styles.label}>
              Contact email
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <div style={styles.actions}>
              <button type="button" onClick={onClose} className="cta-button2-fixed" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="cta-button" disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 style={styles.title}>Project created</h2>
            <p>We have received your project details. You will receive an email shortly.</p>
            <div style={styles.actions}>
              <button type="button" onClick={onClose} className="cta-button">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    width: "min(560px, 92vw)",
    background: "#0f0f10",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 24,
    color: "#fff",
    boxShadow: "0 10px 32px rgba(0,0,0,0.4)",
  },
  title: { margin: "0 0 16px 0" },
  label: { display: "block", fontSize: 14, margin: "12px 0 6px 0" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "#121214",
    color: "#fff",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 },
};


