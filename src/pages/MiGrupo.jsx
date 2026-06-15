import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MiGrupo({ usuario }) {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario?.pais || usuario.pais === "Sin asignar") return;

    const cargar = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "fixture"));
      const todos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      const misPartidos = todos.filter(
        (p) =>
          p.local.nombre === usuario.pais ||
          p.visitante.nombre === usuario.pais,
      );

      // ✅ Deduplicación
      const vistos = new Set();
      const misPartidosSinDuplicados = misPartidos.filter((p) => {
        console.log(
          "Partidos encontrados:",
          misPartidos.map((p) => ({
            id: p.id,
            local: p.local.nombre,
            visitante: p.visitante.nombre,
            fecha: p.fecha,
          })),
        );
        const clave =
          [p.local.nombre, p.visitante.nombre].sort().join("_") + p.fecha;
        if (vistos.has(clave)) return false;
        vistos.add(clave);
        return true;
      });

      // ✅ Ordenar y guardar
      misPartidosSinDuplicados.sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha),
      );
      setPartidos(misPartidosSinDuplicados);
      setLoading(false);
    };

    cargar();
  }, [usuario]);

  // Sin usuario seleccionado
  if (!usuario) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        👆 Elegí tu nombre arriba para ver tu grupo
      </div>
    );
  }

  // Usuario sin equipo asignado
  if (!usuario.pais || usuario.pais === "Sin asignar") {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        ⏳ Todavía no tenés equipo asignado
      </div>
    );
  }

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

  return (
    <div style={{ padding: "16px" }}>
      {/* Cabecera del equipo */}
      <div
        style={{
          background: "#1a472a",
          color: "white",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {CODIGOS[usuario.pais] && (
            <img
              src={bandera(CODIGOS[usuario.pais])}
              alt={usuario.pais}
              style={{ width: "32px" }}
            />
          )}
          {usuario.pais}
        </h2>
        <small style={{ opacity: 0.8 }}>Tu equipo en el Mundial 2026</small>
      </div>

      {/* Lista de partidos */}
      <h3 style={{ color: "#444", fontSize: "13px", letterSpacing: "1px" }}>
        CALENDARIO
      </h3>

      {loading ? (
        <p>Cargando partidos...</p>
      ) : partidos.length === 0 ? (
        <p style={{ color: "#888" }}>No se encontraron partidos.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {partidos.map((p) => {
            const fecha = new Date(p.fecha);
            const esLocal = p.local.nombre === usuario.pais;
            const rival = esLocal ? p.visitante.nombre : p.local.nombre;
            const golesPropio = esLocal ? p.local.goles : p.visitante.goles;
            const golesRival = esLocal ? p.visitante.goles : p.local.goles;
            const jugado = golesPropio !== null && golesRival !== null;

            return (
              <div
                key={p.id}
                style={{
                  background: "white",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Fecha y jornada */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {CODIGOS[rival] && (
                      <img
                        src={bandera(CODIGOS[rival])}
                        alt={rival}
                        style={{ width: "24px" }}
                      />
                    )}
                    vs {rival}
                  </div>
                  <div style={{ color: "#888", fontSize: "12px" }}>
                    {fecha.toLocaleDateString("es-CL", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    ·{" "}
                    {fecha.toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div style={{ color: "#aaa", fontSize: "11px" }}>
                    {p.jornada} · {p.ciudad}
                  </div>
                </div>

                {/* Resultado o estado */}
                <div style={{ textAlign: "right" }}>
                  {jugado ? (
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color:
                          golesPropio > golesRival
                            ? "#1a8c3e"
                            : golesPropio < golesRival
                              ? "#c0392b"
                              : "#e67e22",
                      }}
                    >
                      {golesPropio} — {golesRival}
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "#f0f0f0",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
