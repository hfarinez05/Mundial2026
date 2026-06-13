import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const snapshot = await getDocs(collection(db, "usuarios"));
      setUsuarios(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    cargar();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Cargando...</p>;

  return (
    <div style={{ padding: "16px" }}>
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
            {/* Número */}
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

            {/* Bandera */}
            {CODIGOS[u.pais] ? (
              <img
                src={bandera(CODIGOS[u.pais])}
                alt={u.pais}
                style={{ width: "28px" }}
              />
            ) : (
              <span style={{ fontSize: "20px" }}>🏳️</span>
            )}

            {/* Nombre y equipo */}
            <div>
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                {u.nombre}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>{u.pais}</div>
            </div>

            {/* Pagado */}
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
