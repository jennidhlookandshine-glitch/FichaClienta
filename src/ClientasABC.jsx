import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  endAt,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ABC = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const LIMITE = 300;

const norm = (s = "") => String(s).trim().replace(/\s+/g, " ");

export default function ClientasABC({ coleccion = "clientas" }) {
  const [letra, setLetra] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function cargarPorLetra(l) {
    if (!l) return;

    try {
      setLoading(true);
      setLetra(l);
      setItems([]);

      const prefijo = l.toLowerCase();

      const qy = query(
        collection(db, coleccion),
        orderBy("clienteLower"),
        startAt(prefijo),
        endAt(prefijo + "\uf8ff"),
        limit(LIMITE)
      );

      const snap = await getDocs(qy);

      const dedup = new Map();

      snap.forEach((d) => {
        const data = d.data() || {};
        const nombre = norm(data.cliente);
        if (!nombre) return;

        if (nombre.toUpperCase().startsWith(l)) {
          if (!dedup.has(nombre)) {
            dedup.set(nombre, { id: d.id, nombre });
          }
        }
      });

      const arr = Array.from(dedup.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es")
      );

      setItems(arr);
    } catch (e) {
      console.error(e);
      alert("Error al cargar clientas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLetra("");
    setItems([]);
  }, [coleccion]);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#fde2e4",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          background: "linear-gradient(90deg, #f9a8d4, #f472b6)",
          color: "white",
          padding: "20px",
          textAlign: "center",
          borderRadius: "20px",
          marginBottom: "20px",
          fontSize: "26px",
        }}
      >
        Clientas 💕
      </h1>

      {/* BOTONES ABC */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ABC.map((L) => (
          <button
            key={L}
            onClick={() => cargarPorLetra(L)}
            className={`px-3 py-2 rounded-xl font-bold transition ${
              letra === L
                ? "bg-pink-500 text-white"
                : "bg-pink-100 text-pink-600"
            }`}
          >
            {L}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "10px", color: "#555" }}>
        {letra
          ? `Resultados con: ${letra} ${loading ? "(cargando...)" : ""}`
          : "Elige una letra para listar clientas."}
      </div>

      {/* LISTA DE CLIENTAS */}
      <ul style={{ marginTop: "10px", paddingLeft: "15px" }}>
        {items.map((it) => (
          <li key={it.id} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => navigate(`/clienta/${it.id}`)}
              style={{
                color: "#db2777",
                fontSize: "18px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {it.nombre}
            </button>
          </li>
        ))}
      </ul>

      {!loading && letra && items.length === 0 && (
        <div style={{ marginTop: "5px" }}>Sin clientas con {letra}.</div>
      )}
    </div>
  );
}


