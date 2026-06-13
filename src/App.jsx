import { useState, useEffect } from "react";
import "./App.css";
import Ranking from "./pages/Ranking";
import MiGrupo from "./pages/MiGrupo";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [tab, setTab] = useState("participantes");
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);

  // Cargar usuarios de Firestore
  useEffect(() => {
    const cargar = async () => {
      const snapshot = await getDocs(collection(db, "usuarios"));
      setUsuarios(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    cargar();
  }, [tab]);

  const seleccionar = (u) => {
    setUsuarioActual(u);
    setMostrarLista(false);
  };
  const pagados = usuarios.filter((u) => u.pagado).length;
  const pote = pagados * 5000;
  const selectorBloqueado = tab === "chat";

  // Compañeros con el mismo equipo
  const companeros = usuarioActual
    ? usuarios.filter(
        (u) => u.pais === usuarioActual.pais && u.id !== usuarioActual.id,
      )
    : [];

  const totalMismoEquipo = usuarioActual
    ? usuarios.filter((u) => u.pais === usuarioActual.pais).length
    : 1;

  const premioPotencial =
    totalMismoEquipo > 1 ? Math.floor(pote / totalMismoEquipo) : pote;

  return (
    <div className="app-container">
      <header
        style={{ backgroundColor: "green", color: "yellow", padding: "10px" }}
      >
        💰 ${pote.toLocaleString("es-CL")} — El ganador se lleva todo
        <br />
        <small>
          {pagados} de {usuarios.length} han pagado
        </small>
        {usuarioActual && (
          <div style={{ marginTop: "6px", fontSize: "12px", color: "#ffe080" }}>
            {companeros.length > 0 ? (
              <>
                ⚠️ Compartes equipo con:{" "}
                {companeros.map((c) => c.nombre).join(", ")}
                <br />
                Tu premio potencial: ${premioPotencial.toLocaleString(
                  "es-CL",
                )}{" "}
                (dividido entre {totalMismoEquipo})
              </>
            ) : (
              <>
                🏆 Tu premio potencial: $
                {premioPotencial.toLocaleString("es-CL")}
              </>
            )}
          </div>
        )}
      </header>

      {/* Selector de usuario */}
      {/* Selector de usuario */}
      <div className="user-select" style={{ position: "relative" }}>
        <label htmlFor="nombre">Soy:</label>
        <div
          onClick={() => !selectorBloqueado && setMostrarLista(!mostrarLista)}
          style={{
            padding: "8px 14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: selectorBloqueado ? "#f0f0f0" : "white",
            cursor: selectorBloqueado ? "not-allowed" : "pointer",
            minWidth: "180px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>
            {usuarioActual ? usuarioActual.nombre : "Elegí tu nombre..."}
          </span>
          {selectorBloqueado ? (
            <span>🔒</span>
          ) : (
            <span>{mostrarLista ? "▲" : "▼"}</span>
          )}
        </div>

        {mostrarLista && !selectorBloqueado && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              margin: 0,
              padding: 0,
              listStyle: "none",
              zIndex: 100,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {usuarios.map((u) => (
              <li
                key={u.id}
                onMouseDown={() => seleccionar(u)}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: usuarioActual?.id === u.id ? "#f0f8f0" : "white",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    usuarioActual?.id === u.id ? "#f0f8f0" : "white")
                }
              >
                <span>{u.nombre}</span>
                <small style={{ color: "#888" }}>{u.pais}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav>
        <button onClick={() => setTab("participantes")}>
          👥 Participantes
        </button>
        <button onClick={() => setTab("grupo")}>👥 Mi grupo</button>
        <button onClick={() => setTab("chat")}>💬 Chat</button>
        <button onClick={() => setTab("admin")}>⚙️ Admin</button>
      </nav>

      <main>
        {tab === "participantes" && <Ranking />}
        {tab === "grupo" && <MiGrupo usuario={usuarioActual} />}
        {tab === "chat" && <Chat usuario={usuarioActual} />}
        {tab === "admin" && (
          <Admin usuarios={usuarios} setUsuarios={setUsuarios} />
        )}
      </main>
    </div>
  );
}
