import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function MisFichas() {
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarFichas() {
      try {
        const q = query(collection(db, "fichas"), orderBy("creadoEn", "desc"));
        const snapshot = await getDocs(q);
        const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFichas(datos);
      } catch (e) {
        console.error("Error cargando fichas:", e);
      } finally {
        setCargando(false);
      }
    }

    cargarFichas();
  }, []);

  if (cargando) return <p style={{ textAlign: "center" }}>Cargando fichas...</p>;

  if (fichas.length === 0) return <p style={{ textAlign: "center" }}>No hay fichas guardadas.</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Mis Fichas 💆‍♀️</h1>
      {fichas.map(ficha => (
        <div key={ficha.id} style={{
          border: "1px solid #f9a8d4",
          borderRadius: "12px",
          padding: "15px",
          marginBottom: "15px",
          backgroundColor: "#fff5f8"
        }}>
          <p><strong>ID:</strong> {ficha.id}</p>
          <p><strong>Técnica:</strong> {ficha.tecnica || ficha.limpieza?.tipoPiel}</p>
          {ficha.zonas && <p><strong>Zonas:</strong> {Array.isArray(ficha.zonas) ? ficha.zonas.join(", ") : ficha.zonas}</p>}
          {ficha.tiempoTotal && <p><strong>Tiempo total:</strong> {ficha.tiempoTotal} min</p>}
          {ficha.observaciones && <p><strong>Observaciones:</strong> {ficha.observaciones}</p>}
          {ficha.fotoAntesURL && <img src={ficha.fotoAntesURL} alt="Antes" style={{ width: "150px", marginRight: "10px" }} />}
          {ficha.fotoDespuesURL && <img src={ficha.fotoDespuesURL} alt="Después" style={{ width: "150px" }} />}
        </div>
      ))}
    </div>
  );
}
