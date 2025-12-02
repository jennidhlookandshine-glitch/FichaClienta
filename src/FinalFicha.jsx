import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClientaContext } from "./ClientaContext";


const FinalFicha = () => {
  const { nuevaFicha, guardarFicha, limpiarNuevaFicha } = useContext(ClientaContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay datos, volver al inicio
    if (!nuevaFicha || !nuevaFicha.nombre) {
      navigate("/clientas");
      return;
    }

    // Guardar la ficha automáticamente
    guardarFicha(nuevaFicha);

    // limpiar estado para que no quede información colgando
    limpiarNuevaFicha();

    // Redirigir luego de guardar
    const timer = setTimeout(() => {
      navigate("/clientas"); // o donde quieras volver
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ficha guardada correctamente 🎉</h2>
      <p>Redirigiendo...</p>
    </div>
  );
};

export default FinalFicha;





