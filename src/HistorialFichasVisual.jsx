import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function HistorialFichasVisual() {
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarFichas() {
      try {
        const tipos = ["limpieza", "masaje_reductivo", "masaje_relajante"];
        const promesas = tipos.map(tipo =>
          getDocs(query(collection(db, tipo), orderBy("creadoEn", "desc")))
        );
        const snapshots = await Promise.all(promesas);

        const todasFichas = snapshots.flatMap((snap, i) =>
          snap.docs.map(doc => ({ id: doc.id, tipo: tipos[i], ...doc.data() }))
        );

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
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Historial de Fichas 💆‍♀️</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        {fichas.map(ficha => (
          <div key={ficha.id} style={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            backgroundColor: ficha.tipo === "limpieza" ? "#fff0f7" :
                             ficha.tipo === "masaje_reductivo" ? "#e0f7fa" :
                             "#f3e5f5"
          }}>
            {/* Fotos */}
            <div style={{ display: "flex", gap: "5px", padding: "10px" }}>
              {ficha.fotoAntesURL && <img src={ficha.fotoAntesURL} alt="Antes" style={{ width: "50%", borderRadius: "8px" }} />}
              {ficha.fotoDespuesURL && <img src={ficha.fotoDespuesURL} alt="Después" style={{ width: "50%", borderRadius: "8px" }} />}
            </div>

            <div style={{ padding: "15px" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{ficha.tipo.replace("_", " ").toUpperCase()}</h3>
              {ficha.tipo === "limpieza" && (
                <>
                  <p><strong>Piel:</strong> {ficha.tipoPiel}</p>
                  <p><strong>Tiempo:</strong> {ficha.tiempoTotal} min</p>
                </>
              )}
              {(ficha.tipo === "masaje_reductivo" || ficha.tipo === "masaje_relajante") && (
                <>
                  <p><strong>Técnica:</strong> {ficha.tecnica}</p>
                  {ficha.zonas && <p><strong>Zonas:</strong> {Array.isArray(ficha.zonas) ? ficha.zonas.join(", ") : ficha.zonas}</p>}
                  {ficha.tiempoTotal && <p><strong>Tiempo:</strong> {ficha.tiempoTotal} min</p>}
                  {ficha.escalaMolestiaAntes !== undefined && <p><strong>Molestia antes:</strong> {ficha.escalaMolestiaAntes}</p>}
                  {ficha.escalaMolestiaDespues !== undefined && <p><strong>Molestia después:</strong> {ficha.escalaMolestiaDespues}</p>}
                </>
              )}
              {ficha.observaciones && <p><strong>Obs:</strong> {ficha.observaciones}</p>}
            </div>

            <div style={{
              backgroundColor: "#00000020",
              padding: "6px 10px",
              fontSize: "12px",
              textAlign: "right"
            }}>
              {ficha.creadoEn?.toDate().toLocaleString() || "Fecha desconocida"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
