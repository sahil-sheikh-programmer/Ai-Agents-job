import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     🧠 GENERATE EMAIL
  ========================= */
  const handleGenerate = async () => {
    setLoading(true);

    const res = await fetch("https://ai-agents-job.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setGenerated(data);
    setLoading(false);
  };

  /* =========================
     📩 SEND EMAIL
  ========================= */
  const sendEmail = async () => {
    if (!generated) {
      alert("Generate email first!");
      return;
    }

    await fetch("https://ai-agents-job.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: generated.email.subject,
        body: generated.email.body,
      }),
    });

    alert("✅ Email Sent Successfully");
  };

  return (
    <div style={styles.container}>
      <h2>🚀 AI Email Agent</h2>

      {/* INPUT */}
      <input
        placeholder="e.g. Apply for frontend role"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Enter HR Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleGenerate} style={styles.button}>
        {loading ? "Generating..." : "Generate Email"}
      </button>

      {/* PREVIEW */}
      {generated && (
        <div style={styles.card}>
          <h3>📩 Email Preview</h3>

          <input
            value={generated.email.subject}
            onChange={(e) =>
              setGenerated({
                ...generated,
                email: {
                  ...generated.email,
                  subject: e.target.value,
                },
              })
            }
            style={styles.input}
          />

          <textarea
            value={generated.email.body}
            onChange={(e) =>
              setGenerated({
                ...generated,
                email: {
                  ...generated.email,
                  body: e.target.value,
                },
              })
            }
            rows={10}
            style={styles.textarea}
          />

          <button onClick={sendEmail} style={styles.sendBtn}>
            🚀 Send Email
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: 20,
    fontFamily: "Arial",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  sendBtn: {
    marginTop: 15,
    width: "100%",
    padding: 12,
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    background: "#f9f9f9",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default App;