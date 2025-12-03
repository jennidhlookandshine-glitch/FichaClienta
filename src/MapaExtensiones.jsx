import React, { useRef, useState, useEffect } from "react";

export default function MapaExtensiones({ onGuardar }) {
  const canvasRef = useRef(null);
  const [dibujando, setDibujando] = useState(false);
  const [imagenCargada, setImagenCargada] = useState(false);

  const [color, setColor] = useState("#db2777"); // rosado
  const [grosor, setGrosor] = useState(2);
  const [modoBorrador, setModoBorrador] = useState(false);

  const historialRef = useRef([]);

  // ✅ Cargar imagen fondo (compatible con GitHub Pages)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = import.meta.env.BASE_URL + "parche-ojo-ejemplo.png";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setImagenCargada(true);

      historialRef.current = [canvas.toDataURL()];
    };
  }, []);

  // ✅ Evita scroll en celular
  const prevenirScroll = (e) => {
    e.preventDefault();
  };

  const obtenerPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const comenzarDibujo = (e) => {
    if (!imagenCargada) return;

    const canvas = canvasRef.current;
    historialRef.current.push(canvas.toDataURL());

    const pos = obtenerPos(e);
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDibujando(true);
  };

  const dibujar = (e) => {
    if (!dibujando || !imagenCargada) return;

    const pos = obtenerPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = modoBorrador ? grosor + 8 : grosor;
    ctx.strokeStyle = modoBorrador ? "white" : color;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const terminarDibujo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setDibujando(false);
  };

  // ✅ DESHACER
  const deshacer = () => {
    if (historialRef.current.length <= 1) return;

    historialRef.current.pop();
    const ultimoEstado = historialRef.current[historialRef.current.length - 1];

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = ultimoEstado;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // ✅ LIMPIAR COMPLETO
  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = import.meta.env.BASE_URL + "parche-ojo-ejemplo.png";

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      historialRef.current = [canvas.toDataURL()];
    };
  };

  const handleGuardar = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    if (onGuardar) onGuardar(dataUrl);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Personaliza tu mapa de extensiones ✨
      </p>

      {/* Controles */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Color */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-full border"
        />

        {/* Grosor */}
        <div>
          <label className="text-xs text-gray-600">Grosor</label>
          <input
            type="range"
            min="1"
            max="10"
            value={grosor}
            onChange={(e) => setGrosor(Number(e.target.value))}
          />
        </div>

        {/* Borrador */}
        <button
          onClick={() => setModoBorrador(!modoBorrador)}
          className={`px-3 py-1 rounded-full text-sm ${
            modoBorrador ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {modoBorrador ? "Borrando…" : "Borrador"}
        </button>

        {/* Deshacer */}
        <button
          onClick={deshacer}
          className="px-3 py-1 rounded-full bg-yellow-500 text-white text-sm"
        >
          Deshacer
        </button>

        {/* Limpiar completo */}
        <button
          onClick={limpiarCanvas}
          className="px-3 py-1 rounded-full bg-red-500 text-white text-sm"
        >
          Limpiar todo
        </button>
      </div>

      {/* Canvas */}
      <div
        style={{
          border: "1px solid #fecdd3",
          borderRadius: "12px",
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={comenzarDibujo}
          onMouseMove={dibujar}
          onMouseUp={terminarDibujo}
          onMouseLeave={terminarDibujo}
          onTouchStart={(e) => {
            prevenirScroll(e);
            comenzarDibujo(e);
          }}
          onTouchMove={(e) => {
            prevenirScroll(e);
            dibujar(e);
          }}
          onTouchEnd={terminarDibujo}
          style={{ cursor: "crosshair", display: "block", maxWidth: "100%" }}
        />
      </div>

      {/* Guardar */}
      <button
        onClick={handleGuardar}
        className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-semibold"
      >
        Guardar mapa
      </button>
    </div>
  );
}
