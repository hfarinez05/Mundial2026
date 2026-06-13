//import { importarFixture } from "../scripts/importFixture";
import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../styles/admin.css";

const EQUIPOS = [
  "Sin asignar",
  "México",
  "Corea del Sur",
  "Sudáfrica",
  "Chequia",
  "Canadá",
  "Suiza",
  "Qatar",
  "Bosnia Herzegovina",
  "Brasil",
  "Marruecos",
  "Haití",
  "Escocia",
  "Estados Unidos",
  "Australia",
  "Türkiye",
  "Paraguay",
  "Alemania",
  "Costa de Marfil",
  "Ecuador",
  "Curaçao",
  "Países Bajos",
  "Japón",
  "Suecia",
  "Túnez",
  "Bélgica",
  "Irán",
  "Nueva Zelanda",
  "Egipto",
  "España",
  "Arabia Saudita",
  "Uruguay",
  "Cabo Verde",
  "Francia",
  "Senegal",
  "Irak",
  "Noruega",
  "Argentina",
  "Austria",
  "Argelia",
  "Jordania",
  "Portugal",
  "Uzbekistán",
  "R. D. Congo",
  "Colombia",
  "Inglaterra",
  "Croacia",
  "Ghana",
  "Panamá",
];

export default function Admin({ usuarios, setUsuarios }) {
  const [nombre, setNombre] = useState("");
  const [loading] = useState(false);
  const [error, setError] = useState(null);

  const agregarUsuario = async () => {
    if (!nombre.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        nombre,
        pais: "Sin asignar",
        pagado: false,
      });
      setUsuarios((prev) => [
        ...prev,
        { id: docRef.id, nombre, pais: "Sin asignar", pagado: false },
      ]);
      setNombre("");
    } catch {
      setError("Error al agregar participante.");
    }
  };

  const asignarEquipo = async (id, pais) => {
    try {
      await updateDoc(doc(db, "usuarios", id), { pais });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, pais } : u)),
      );
    } catch {
      setError("Error al asignar equipo.");
    }
  };

  const togglePagado = async (id, estadoActual) => {
    try {
      await updateDoc(doc(db, "usuarios", id), { pagado: !estadoActual });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, pagado: !estadoActual } : u)),
      );
    } catch {
      setError("Error al actualizar pago.");
    }
  };

  const borrarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Error al borrar participante.");
    }
  };

  return (
    <div className="admin-container">
      {/* <button className="btn-importar" onClick={importarFixture}>
        ⬇️ Importar Fixture del Mundial
      </button> */}

      <div className="admin-form">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del compañero"
          onKeyDown={(e) => e.key === "Enter" && agregarUsuario()}
        />
        <button onClick={agregarUsuario}>+ Agregar</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>PARTICIPANTES</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul className="admin-list">
          {usuarios.map((u) => (
            <li key={u.id} className="admin-item">
              <div className="admin-item-top">
                <strong className="admin-nombre">{u.nombre}</strong>
                <div className="admin-actions">
                  <button
                    className="btn-pago"
                    onClick={() => togglePagado(u.id, u.pagado)}
                    style={{ background: u.pagado ? "#c0392b" : "#1a8c3e" }}
                  >
                    {u.pagado ? "❌ Desmarcar" : "✅ Marcar pagado"}
                  </button>
                  <button
                    className="btn-borrar"
                    onClick={() => borrarUsuario(u.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="admin-item-bottom">
                <span className="label-equipo">Equipo</span>
                <select
                  value={u.pais}
                  onChange={(e) => asignarEquipo(u.id, e.target.value)}
                  className="select-equipo"
                >
                  {EQUIPOS.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
