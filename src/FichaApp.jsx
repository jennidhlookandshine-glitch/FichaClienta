import { useState, useMemo } from "react";
import FormularioDatosBasicos from "./FormularioDatosBasicos.jsx";
import LiftingForm from "./LiftingForm.jsx";
import ExtensionesPestanasForm from "./ExtensionesPestanasForm.jsx";
import LimpiezaFacialForm from "./LimpiezaFacialForm.jsx";
import DepilacionFacialForm from "./DepilacionFacialForm.jsx";
import HydroglossForm from "./HydroglossForm.jsx";
import MasajeReductivoForm from "./MasajeReductivoForm.jsx";
import MasajeRelajanteForm from "./MasajeRelajanteForm.jsx";
import LaminadoCejasForm from "./LaminadoCejasForm.jsx";
import ClientasABC from "./ClientasABC.jsx";

const SERVICIOS = [
  { key: "lifting", label: "Lifting", component: LiftingForm },
  { key: "extensiones", label: "Extensiones", component: ExtensionesPestanasForm },
  { key: "laminado", label: "Laminado cejas", component: LaminadoCejasForm },
  { key: "limpieza", label: "Limpieza facial", component: LimpiezaFacialForm },
  { key: "depilacion", label: "Depilación facial", component: DepilacionFacialForm },
  { key: "hydrogloss", label: "Hydrogloss", component: HydroglossForm },
  { key: "masajeReductivo", label: "Masaje reductivo", component: MasajeReductivoForm },
  { key: "masajeRelajante", label: "Masaje relajante", component: MasajeRelajanteForm },
];

export default function FichaApp({ onVolver }) {
  const [vista, setVista] = useState("datos"); // datos | servicio | clientas
  const [servicioActual, setServicioActual] = useState(SERVICIOS[0].key);
  const [seleccionCliente, setSeleccionCliente] = useState("");
  const [datosBasicos, setDatosBasicos] = useState(null);

  const bloquearCliente = useMemo(() => !!seleccionCliente, [seleccionCliente]);
  const FormularioServicio = SERVICIOS.find((s) => s.key === servicioActual)?.component;

  const navBtn = (activo) => `
    w-full text-left px-4 py-2 rounded-lg font-semibold border transition active:translate-y-[1px]
    ${activo ? "bg-pink600 text-white border-pink600 shadow" : "bg-pink-50 text-pink-700 border-pink-300 hover:bg-pink-100"}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-400 flex flex-col items-center p-6 font-[Poppins] text-gray-800">

      {/* ==================== DATOS BÁSICOS ==================== */}
      {vista === "datos" && (
        <>
          <div className="w-full max-w-[980px] mt-6 bg-white p-6 rounded-xl shadow">
            <FormularioDatosBasicos onChange={setDatosBasicos} />
          </div>

          <div className="w-full max-w-[980px] flex gap-3 justify-end mt-3">
            <button
              type="button"
              className="h-12 min-w-44 px-7 rounded-full font-bold text-white shadow-md active:translate-y-[1px] transition"
              style={{ background: "linear-gradient(90deg,#f472b6,#db2777)" }}
              onClick={onVolver}
            >
              Volver
            </button>
            <button
              type="button"
              className="h-12 min-w-44 px-7 rounded-full font-bold text-white shadow-md active:translate-y-[1px] transition"
              style={{ background: "linear-gradient(90deg,#f472b6,#db2777)" }}
              onClick={() => {
                if (!datosBasicos) {
                  alert("Primero completa y guarda los datos básicos de la clienta.");
                  return;
                }
                setVista("servicio");
              }}
            >
              Guardar y continuar
            </button>
          </div>
        </>
      )}

      {/* ==================== PANEL DE SERVICIOS ==================== */}
      {vista === "servicio" && (
        <div className="w-full max-w-[980px] mt-6 flex gap-6">
          {/* Menú lateral: columna izquierda */}
          <aside className="flex flex-col gap-2 w-56 flex-shrink-0">
            {SERVICIOS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={navBtn(servicioActual === s.key)}
                onClick={() => setServicioActual(s.key)}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              className={navBtn(vista === "clientas")}
              onClick={() => setVista("clientas")}
            >
              Clientas
            </button>
          </aside>

          {/* Card blanco del formulario: columna derecha */}
          <section className="flex-1 bg-white p-6 rounded-xl shadow">
            {bloquearCliente && (
              <div className="mb-4 p-3 bg-pink-50 text-pink-600 rounded-xl font-bold">
                Cliente seleccionado: {seleccionCliente}
              </div>
            )}
            {FormularioServicio && (
              <FormularioServicio
                clienteInicial={seleccionCliente || datosBasicos?.nombreCompleto || ""}
                bloquearCliente={bloquearCliente}
                fechaInicial={datosBasicos?.fechaAtencion}
              />
            )}
          </section>
        </div>
      )}

      {/* ==================== BOTONERA FINAL ==================== */}
      {vista === "servicio" && (
        <div className="w-full max-w-[980px] flex gap-3 justify-end mt-3">
          <button
            type="button"
            className="h-11 px-5 rounded-full font-bold text-white shadow-md active:translate-y-[1px] transition"
            style={{ background: "linear-gradient(90deg,#f472b6,#db2777)" }}
            onClick={() => setVista("datos")}
          >
            Volver
          </button>
          <button
            type="button"
            className="h-11 px-5 rounded-full font-bold text-white shadow-md active:translate-y-[1px] transition"
            style={{ background: "linear-gradient(90deg,#f472b6,#db2777)" }}
            onClick={() => {
              setSeleccionCliente("");
              setServicioActual(SERVICIOS[0].key);
              setVista("datos");
            }}
          >
            Seleccionar otra ficha
          </button>
          <button
            type="button"
            className="h-11 px-5 rounded-full font-bold text-white shadow-md active:translate-y-[1px] transition"
            style={{ background: "linear-gradient(90deg,#ec4899,#be185d)" }}
            onClick={onVolver}
          >
            Finalizar
          </button>
        </div>
      )}

      {/* ==================== CLIENTAS ==================== */}
      {vista === "clientas" && (
        <>
          <div className="w-full max-w-[980px] mt-6">
            <ClientasABC
              coleccion="extensiones"
              onSeleccionarCliente={(nombre) => {
                setSeleccionCliente(nombre);
                setServicioActual("extensiones");
                setVista("servicio");
              }}
            />
          </div>

          <div className="w-full max-w-[980px] flex justify-end mt-3">
            <button
              type="button"
              className="h-11 px-5 rounded-full font-bold text-white shadow-md active:translate-y-[1px] transition"
              style={{ background: "linear-gradient(90deg,#f472b6,#db2777)" }}
              onClick={onVolver}
            >
              Volver
            </button>
          </div>
        </>
      )}
    </div>
  );
}






