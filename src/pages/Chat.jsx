import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export default function Chat({ usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);

  const [desbloqueado, setDesbloqueado] = useState(false);
  const [clave, setClave] = useState("");

  const verificar = () => {
    if (clave === "1234") {
      setDesbloqueado(true);
    } else {
      alert("Clave incorrecta");
      setClave("");
    }
  };

  useEffect(() => {
    const q = query(collection(db, "chat"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMensajes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviar = async () => {
    if (!texto.trim()) return;
    if (!usuario) return alert("Elegí tu nombre primero");

    await addDoc(collection(db, "chat"), {
      texto,
      nombre: usuario.nombre,
      pais: usuario.pais,
      fecha: serverTimestamp(),
    });
    setTexto("");
  };
  if (!desbloqueado) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h3>🔒 Chat grupal</h3>
        <p style={{ color: "#888", fontSize: "13px" }}>
          Ingresá la clave para acceder
        </p>
        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verificar()}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            display: "block",
            margin: "10px auto",
          }}
        />
        <button
          onClick={verificar}
          style={{
            background: "#1a472a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {mensajes.map((m) => {
          const esMio = m.nombre === usuario?.nombre;
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: esMio ? "flex-end" : "flex-start",
              }}
            >
              {!esMio && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    marginBottom: "2px",
                  }}
                >
                  {m.nombre} · {m.pais}
                </span>
              )}
              <div
                style={{
                  background: esMio ? "#1a472a" : "white",
                  color: esMio ? "white" : "#222",
                  padding: "10px 14px",
                  borderRadius: esMio
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  maxWidth: "75%",
                  fontSize: "14px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                {m.texto}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px 16px",
          borderTop: "1px solid #eee",
          background: "white",
        }}
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder={usuario ? "Escribí algo..." : "Elegí tu nombre primero"}
          disabled={!usuario}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={enviar}
          disabled={!usuario}
          style={{
            background: "#1a472a",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
