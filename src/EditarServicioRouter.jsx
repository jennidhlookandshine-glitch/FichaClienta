import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function EditarServicioRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { servicio, clienta, index } = location.state || {};

  useEffect(() => {
    if (servicio?.servicio && clienta?.id) {
      // Mapear nombre del servicio a ruta del formulario
      const servicioMap = {
        "Lifting de pestañas": "/ficha/lifting",
        "Extensiones de pestañas": "/ficha/extensiones",
        "Laminado de Cejas": "/ficha/laminado",
        "Limpieza Facial": "/ficha/limpieza",
        "Depilación facial": "/ficha/depilacion",
        "Hydrogloss": "/ficha/hydrogloss",
        "Masaje Reductivo": "/ficha/masaje-reductivo",
        "Masaje Relajante": "/ficha/masaje-relajante",
      };

      const ruta = servicioMap[servicio.servicio] || "/clientas";

      navigate(ruta, {
        state: {
          clienta,
          servicio,
          index,
          modo: "editar", // Para que los formularios sepan que es edición
        },
        replace: true,
      });
    } else {
      navigate("/clientas", { replace: true });
    }
  }, []); // Dependencias vacías para ejecutar solo una vez

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins",
        color: "#e91e63",
        fontWeight: 600,
        padding: 24,
        textAlign: "center",
      }}
    >
      Redirigiendo al formulario de edición...
    </div>
  );
}
