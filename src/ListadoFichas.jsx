import React, { useEffect, useMemo, useRef, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  endAt,
} from "firebase/firestore";

const COLECCIONES = [
  { key: "fichas", label: "Lifting" },
  { key: "extensiones", label: "Extensiones" },
  { key: "limpieza_facial", label: "Limpieza facial" },
  { key: "depilacion_facial", label: "Depilación facial" },
  { key: "hydrogloss", label: "Hydrogloss" },
  { key: "masaje_reductivo", label: "Masaje reductivo" },
  { key: "masaje_relajante", label: "Masaje relajante" },
];

const PAGE_SIZE = 10;

export default function Listado() {
  const [coleccion, setColeccion] = useState("extensiones");
  const [cliente, setCliente] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Pila de cursores para poder ir atrás (guardamos el último doc de cada página)
  const cursorsRef = useRef([]);         // array de QueryDocumentSnapshot (último de cada página)
  const lastDocRef = useRef(null);       // último doc de la página actual
  const currentPageRef = useRef(0);      // 0-based

  const coleccionLabel = useMemo(
    () => COLECCIONES.find((c) => c.key === coleccion)?.label || "",
    [coleccion]
  );

  const clienteQueryText = cliente.trim().toLowerCase();
  const isSearching = clienteQueryText.length > 0;

  function resetPaging() {
    setItems([]);
    lastDocRef.current = null;
    cursorsRef.current = [];
    currentPageRef.current = 0;
    setHasMore(false);
  }

  async function fetchFirstPage() {
    setLoading(true);
    try {
      const baseRef = collection(db, coleccion);

      let qy;
      if (isSearching) {
        // búsqueda por prefijo: requiere clienteLower en los documentos
        qy = query(
          baseRef,
          orderBy("clienteLower", "asc"),
          startAt(clienteQueryText),
          endAt(clienteQueryText + "\uf8ff"),
          limit(PAGE_SIZE)
        );
      } else {
        // listado por fecha de creación descendente
        qy = query(baseRef, orderBy("creadoEn", "desc"), limit(PAGE_SIZE));
      }

      const snap = await getDocs(qy);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(docs);
      lastDocRef.current = snap.docs[snap.docs.length - 1] || null;
      cursorsRef.current = snap.empty ? [] : [lastDocRef.current];
      currentPageRef.current = 0;
      setHasMore(!snap.empty && snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
      alert("Error al cargar listado");
    } finally {
      setLoading(false);
    }
  }

  async function fetchNextPage() {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const baseRef = collection(db, coleccion);
      let qy;
      if (isSearching) {
        qy = query(
          baseRef,
          orderBy("clienteLower", "asc"),
          startAt(clienteQueryText),
          endAt(clienteQueryText + "\uf8ff"),
          startAfter(lastDocRef.current),
          limit(PAGE_SIZE)
        );
      } else {
        qy = query(
          baseRef,
          orderBy("creadoEn", "desc"),
          startAfter(lastDocRef.current),
          limit(PAGE_SIZE)
        );
      }
      const snap = await getDocs(qy);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(docs);
      lastDocRef.current = snap.docs[snap.docs.length - 1] || null;
      if (lastDocRef.current) cursorsRef.current.push(lastDocRef.current);
      currentPageRef.current += 1;
      setHasMore(!snap.empty && snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
      alert("Error al avanzar de página");
    } finally {
      setLoading(false);
    }
  }

  // Reconstruye la página anterior reconsultando con el cursor de la página previa
  async function fetchPrevPage() {
    if (currentPageRef.current <= 0 || loading) return;
    setLoading(true);
    try {
      const baseRef = collection(db, coleccion);

      // Cursor de la página anterior: quitar el último (actual) y usar el nuevo último como referencia previa
      cursorsRef.current.pop(); // elimina cursor actual
      const prevCursor = cursorsRef.current[cursorsRef.current.length - 1] || null;

      let qy;
      if (isSearching) {
        if (prevCursor) {
          qy = query(
            baseRef,
            orderBy("clienteLower", "asc"),
            startAt(clienteQueryText),
            endAt(clienteQueryText + "\uf8ff"),
            startAfter(prevCursor),
            limit(PAGE_SIZE)
          );
        } else {
          qy = query(
            baseRef,
            orderBy("clienteLower", "asc"),
            startAt(clienteQueryText),
            endAt(clienteQueryText + "\uf8ff"),
            limit(PAGE_SIZE)
          );
        }
      } else {
        if (prevCursor) {
          qy = query(
            baseRef,
            orderBy("creadoEn", "desc"),
            startAfter(prevCursor),
            limit(PAGE_SIZE)
          );
        } else {
          qy = query(baseRef, orderBy("creadoEn", "desc"), limit(PAGE_SIZE));
        }
      }

      const snap = await getDocs(qy);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(docs);
      lastDocRef.current = snap.docs[snap.docs.length - 1] || null;
      currentPageRef.current -= 1;
      setHasMore(!snap.empty && snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
      alert("Error al retroceder");
    } finally {
      setLoading(false);
    }
  }

  // Cambiar colección
  useEffect(() => {
    resetPaging();
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coleccion]);

  // Buscar
  function onBuscar() {
    resetPaging();
    fetchFirstPage();
  }

  return (
    <div style={{ maxWidth: 1100, margin: "auto", padding: 16 }}>
      <h2>Listado de fichas</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <label>
          Servicio:
          <select
            value={coleccion}
            onChange={(e) => setColeccion(e.target.value)}
            style={{ marginLeft: 8 }}
            disabled={loading}
          >
            {COLECCIONES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Cliente:
          <input
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Buscar por nombre (parcial)"
          />
        </label>

        <button onClick={onBuscar} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <p style={{ color: "#666", marginTop: 8 }}>Mostrando: {coleccionLabel}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {items.map((it) => (
          <article
            key={it.id}
            style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, background: "#fff" }}
          >
            <header style={{ marginBottom: 8, fontWeight: "bold" }}>
              {it.cliente || "Sin cliente"}
            </header>

            {it.fotoAntesURL || it.fotoDespuesURL ? (
              <div style={{ display: "flex", gap: 8 }}>
                {it.fotoAntesURL && (
                  <img
                    src={it.fotoAntesURL}
                    alt="Antes"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 6 }}
                  />
                )}
                {it.fotoDespuesURL && (
                  <img
                    src={it.fotoDespuesURL}
                    alt="Después"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 6 }}
                  />
                )}
              </div>
            ) : (
              <div style={{ color: "#888", fontSize: 12 }}>Sin fotos</div>
            )}

            <ul style={{ marginTop: 8, paddingLeft: 16 }}>
              {it.tecnica && <li>Técnica: {it.tecnica}</li>}
              {it.efecto && <li>Efecto: {it.efecto}</li>}
              {it.curvatura && <li>Curvatura: {it.curvatura}</li>}
              {it.longitudes && <li>Longitudes: {String(it.longitudes)}</li>}
              {it.tipoPiel && <li>Tipo de piel: {it.tipoPiel}</li>}
              {it.zonas && <li>Zonas: {String(it.zonas)}</li>}
              {it.tiempoTotal && <li>Tiempo total: {it.tiempoTotal} min</li>}
              {it.observaciones && <li>Obs: {it.observaciones}</li>}
            </ul>
          </article>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={fetchPrevPage} disabled={loading || currentPageRef.current <= 0}>
          Anterior
        </button>
        <button onClick={fetchNextPage} disabled={loading || !hasMore}>
          {loading ? "Cargando..." : "Siguiente"}
        </button>
      </div>

      <small style={{ display: "block", marginTop: 8, color: "#666" }}>
        Sugerencia: guarda clienteLower y un timestamp creadoEn en cada ficha para búsquedas y orden estables.
      </small>
    </div>
  );
}
