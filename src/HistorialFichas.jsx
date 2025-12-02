import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function HistorialFichas() {
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarFichas() {
      try {
        const tipos = ["limpieza", "masaje_reductivo", "masaje_relajante"];
        const promesas = tipos.map(tipo => getDocs(query(collection(db, tipo), orderBy("creadoEn", "desc"))));
        const snapshots = await Promise.all(promesas);

        // Combinar todas las fichas y añadir campo tipo
        const todasFichas = snapshots.flatMap((snap, i) =>
          snap.docs.map(doc => ({ id: doc.id, tipo: tipos[i], ...doc.data() }))
        );

        // Ordenar por fecha descendente
        todasFichas.sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0));

        setFichas(todasFichas);
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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Historial de Fichas 💆‍♀️</h1>
      {fichas.map(ficha => (
        <div key={ficha.id} style={{
          border: "1px solid #f9a8d4",
          borderRadius: "12px",
          padding: "15px",
          marginBottom: "15px",
          backgroundColor: "#fff5f8"
        }}>
          <p><strong>Tipo de ficha:</strong> {ficha.tipo}</p>
          <p><strong>ID:</strong> {ficha.id}</p>
          
          {/* Mostrar datos según tipo */}
          {ficha.tipo === "limpieza" && (
            <>
              <p><strong>Tipo de piel:</strong> {ficha.tipoPiel}</p>
              <p><strong>Tiempo total:</strong> {ficha.tiempoTotal} min</p>
            </>
          )}
          {(ficha.tipo === "masaje_reductivo" || ficha.tipo === "masaje_relajante") && (
            <>
              <p><strong>Técnica:</strong> {ficha.tecnica}</p>
              {ficha.zonas && <p><strong>Zonas:</strong> {Array.isArray(ficha.zonas) ? ficha.zonas.join(", ") : ficha.zonas}</p>}
              {ficha.tiempoTotal && <p><strong>Tiempo total:</strong> {ficha.tiempoTotal} min</p>}
              {ficha.escalaMolestiaAntes !== undefined && <p><strong>Molestia antes:</strong> {ficha.escalaMolestiaAntes}</p>}
              {ficha.escalaMolestiaDespues !== undefined && <p><strong>Molestia después:</strong> {ficha.escalaMolestiaDespues}</p>}
            </>
          )}

          {ficha.observaciones && <p><strong>Observaciones:</strong> {ficha.observaciones}</p>}
          
          {/* Mostrar fotos si existen */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {ficha.fotoAntesURL && <img src={ficha.fotoAntesURL} alt="Antes" style={{ width: "150px", borderRadius: "8px" }} />}
            {ficha.fotoDespuesURL && <img src={ficha.fotoDespuesURL} alt="Después" style={{ width: "150px", borderRadius: "8px" }} />}
          </div>
        </div>
      ))}
    </div>
  );
}
