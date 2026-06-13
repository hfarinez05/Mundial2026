import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const bandera = (codigo) => `https://flagcdn.com/24x18/${codigo}.png`;

const CODIGOS = {
  México: "mx",
  "Corea del Sur": "kr",
  Sudáfrica: "za",
  Chequia: "cz",
  Canadá: "ca",
  Suiza: "ch",
  Qatar: "qa",
  "Bosnia Herzegovina": "ba",
  Brasil: "br",
  Marruecos: "ma",
  Haití: "ht",
  Escocia: "gb-sct",
  "Estados Unidos": "us",
  Australia: "au",
  Türkiye: "tr",
  Paraguay: "py",
  Alemania: "de",
  "Costa de Marfil": "ci",
  Ecuador: "ec",
  Curaçao: "cw",
  "Países Bajos": "nl",
  Japón: "jp",
  Suecia: "se",
  Túnez: "tn",
  Bélgica: "be",
  Irán: "ir",
  "Nueva Zelanda": "nz",
  Egipto: "eg",
  España: "es",
  "Arabia Saudita": "sa",
  Uruguay: "uy",
  "Cabo Verde": "cv",
  Francia: "fr",
  Senegal: "sn",
  Irak: "iq",
  Noruega: "no",
  Argentina: "ar",
  Austria: "at",
  Argelia: "dz",
  Jordania: "jo",
  Portugal: "pt",
  Uzbekistán: "uz",
  "R. D. Congo": "cd",
  Colombia: "co",
  Inglaterra: "gb-eng",
  Croacia: "hr",
  Ghana: "gh",
  Panamá: "pa",
};

export default function Ranking() {
  const [usuarios, setUsuarios] = useState([]);
  const [partidosHoy, setPartidosHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      // Usuarios (no cambian seguido, getDocs está bien)
      const snapUsuarios = await getDocs(collection(db, "usuarios"));
      setUsuarios(snapUsuarios.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    cargar();

    // Fixture en tiempo real
    const unsub = onSnapshot(collection(db, "fixture"), (snap) => {
      const todos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const hoy = new Date();
      const hoyStr = hoy
        .toLocaleDateString("es-CL", {
          timeZone: "America/Santiago",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("-")
        .reverse()
        .join("-");

      const filtrados = todos
        .filter((p) => {
          const fechaLocal = new Date(p.fecha)
            .toLocaleDateString("es-CL", {
              timeZone: "America/Santiago",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split("-")
            .reverse()
            .join("-");
          return fechaLocal === hoyStr;
        })
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      setPartidosHoy(filtrados);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Cargando...</p>;

  return (
    <div style={{ padding: "16px" }}>
      {/* Partidos de hoy */}
      {partidosHoy.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: "#999",
              marginBottom: "12px",
            }}
          >
            ⚽ PARTIDOS DE HOY
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {partidosHoy.map((p) => {
              const jugado =
                p.local.goles !== null && p.visitante.goles !== null;
              return (
                <div
                  key={p.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    {p.jornada} · {p.ciudad} ·{" "}
                    {new Date(p.fecha).toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Local */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                      }}
                    >
                      {CODIGOS[p.local.nombre] && (
                        <img
                          src={bandera(CODIGOS[p.local.nombre])}
                          alt=""
                          style={{ width: "24px" }}
                        />
                      )}
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {p.local.nombre}
                      </span>
                    </div>

                    {/* Marcador */}
                    <div style={{ padding: "4px 12px", textAlign: "center" }}>
                      {jugado ? (
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "#1a472a",
                          }}
                        >
                          {p.local.goles} — {p.visitante.goles}
                        </span>
                      ) : (
                        <span style={{ fontSize: "13px", color: "#aaa" }}>
                          vs
                        </span>
                      )}
                    </div>

                    {/* Visitante */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {p.visitante.nombre}
                      </span>
                      {CODIGOS[p.visitante.nombre] && (
                        <img
                          src={bandera(CODIGOS[p.visitante.nombre])}
                          alt=""
                          style={{ width: "24px" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista participantes */}
      <h3
        style={{
          fontSize: "12px",
          letterSpacing: "1.5px",
          color: "#999",
          marginBottom: "12px",
        }}
      >
        PARTICIPANTES
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {usuarios.map((u, i) => (
          <div
            key={u.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              borderLeft: "5px solid #ffd700",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#ccc",
                minWidth: "24px",
              }}
            >
              {i + 1}
            </span>
            {CODIGOS[u.pais] ? (
              <img
                src={bandera(CODIGOS[u.pais])}
                alt={u.pais}
                style={{ width: "28px" }}
              />
            ) : (
              <span style={{ fontSize: "20px" }}>🏳️</span>
            )}
            <div>
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                {u.nombre}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>{u.pais}</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              {u.pagado ? (
                <span style={{ color: "#1a8c3e", fontSize: "12px" }}>
                  ✅ Pagado
                </span>
              ) : (
                <span style={{ color: "#c0392b", fontSize: "12px" }}>
                  ❌ Pendiente
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
