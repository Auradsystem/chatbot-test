"use client";
import { useState } from 'react';

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    setAnswer("Chargement...");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.answer) {
        setAnswer(data.answer);
      } else if (data.error) {
        setAnswer("Erreur API : " + data.error);
      } else {
        setAnswer("Réponse invalide ou vide.");
      }
    } catch (err) {
      setAnswer("Erreur : " + err.message);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Test Chatbot</h1>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Pose une question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: 300, marginRight: 10 }}
        />
        <button onClick={handleAsk}>Envoyer</button>
      </div>
      <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
    </main>
  );
}
