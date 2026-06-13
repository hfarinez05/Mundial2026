import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function PartidoAdmin({ partido, onActualizar }) {
  const [gl, setGl] = useState(partido.local.goles ?? "");
  const [gv, setGv] = useState(partido.visitante.goles ?? "");

  const guardar = async () => {
    const golesLocal = parseInt(gl);
    const golesVisitante = parseInt(gv);
    if (isNaN(golesLocal) || isNaN(golesVisitante))
      return alert("Ingresá números válidos");

    await updateDoc(doc(db, "fixture", partido.id), {
      "local.goles": golesLocal,
      "visitante.goles": golesVisitante,
    });

    onActualizar(partido.id, golesLocal, golesVisitante);
    alert("✅ Resultado guardado");
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        border: "1px solid #eee",
      }}
    >
      <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
        {partido.jornada} ·{" "}
        {new Date(partido.fecha).toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ flex: 1, fontWeight: "bold", fontSize: "13px" }}>
          {partido.local.nombre}
        </span>
        <input
          type="number"
          min="0"
          value={gl}
          onChange={(e) => setGl(e.target.value)}
          style={{
            width: "40px",
            textAlign: "center",
            padding: "4px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />
        <span>—</span>
        <input
          type="number"
          min="0"
          value={gv}
          onChange={(e) => setGv(e.target.value)}
          style={{
            width: "40px",
            textAlign: "center",
            padding: "4px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />
        <span
          style={{
            flex: 1,
            fontWeight: "bold",
            fontSize: "13px",
            textAlign: "right",
          }}
        >
          {partido.visitante.nombre}
        </span>
        <button
          onClick={guardar}
          style={{
            background: "#1a472a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          💾
        </button>
      </div>
    </div>
  );
}
