"use client";

import { useEffect, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Apply theme to <html> and persist preference.
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "Request failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setMessages((prev) => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>Mental Coach</h1>
        <button
          style={styles.themeBtn}
          onClick={() =>
            setTheme((t) => (t === "light" ? "dark" : "light"))
          }
          aria-label="Toggle theme"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </header>

      <div style={styles.messages}>
        {messages.length === 0 && (
          <p style={styles.placeholder}>Ask me anything…</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "var(--button-bg)" : "var(--input-bg)",
              color: m.role === "user" ? "var(--button-text)" : "var(--text)",
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && <p style={styles.placeholder}>Thinking…</p>}
      </div>

      <form
        style={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={loading}
        />
        <button style={styles.sendBtn} type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: 640,
    margin: "0 auto",
    padding: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "1rem",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
  },
  themeBtn: {
    padding: "0.4rem 0.8rem",
    border: "1px solid var(--border)",
    borderRadius: 4,
    background: "var(--input-bg)",
    color: "var(--text)",
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    overflowY: "auto",
    padding: "1rem 0",
  },
  placeholder: {
    opacity: 0.5,
    textAlign: "center",
  },
  bubble: {
    maxWidth: "85%",
    padding: "0.6rem 0.9rem",
    borderRadius: 8,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    borderTop: "1px solid var(--border)",
    paddingTop: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem 0.8rem",
    border: "1px solid var(--border)",
    borderRadius: 4,
    background: "var(--input-bg)",
    color: "var(--text)",
    fontSize: "1rem",
  },
  sendBtn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: 4,
    background: "var(--button-bg)",
    color: "var(--button-text)",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
