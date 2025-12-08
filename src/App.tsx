// @ts-nocheck
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientaProvider } from "./ClientaContext";
import { Toaster } from "react-hot-toast";

import Home from "./Home";
import BasicosPage from "./BasicosPage";
import FinalFicha from "./FinalFicha";
import FichaClientaPage from "./FichaClientaPage";
import NuevaClientaPage from "./NuevaClientaPage";
import ClientasABC from "./ClientasABC";
import EditarClientaPage from "./EditarClientaPage";

import FichaAppLayout from "./FichaAppLayout";

import LiftingForm from "./LiftingForm";
import ExtensionesPestanasForm from "./ExtensionesPestanasForm";
import LaminadoCejasForm from "./LaminadoCejasForm";
import LimpiezaFacialForm from "./LimpiezaFacialForm";
import DepilacionFacialForm from "./DepilacionFacialForm";
import HydroglossForm from "./HydroglossForm";
import MasajeReductivoForm from "./MasajeReductivoForm";
import MasajeRelajanteForm from "./MasajeRelajanteForm";

import SeleccionarServicioPage from "./SeleccionarServicioPage";
import EditarServicioRouter from "./EditarServicioRouter";

export default function App() {
  return (
    <ClientaProvider>
      <BrowserRouter>
        {/* Contenedor global de toasts */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "999px",
              background: "#f472b6",
              color: "#fff",
              fontFamily: "Poppins, system-ui, sans-serif",
            },
          }}
        />

        <Routes>
          {/* Portada */}
          <Route path="/" element={<Home />} />

          {/* Atajo opcional para iniciar ficha */}
          <Route
            path="/iniciar"
            element={<Navigate to="/ficha/basicos" replace />}
          />

          {/* Paso 1: datos básicos y médicos (clienta nueva) */}
          <Route path="/ficha/basicos" element={<BasicosPage />} />

          {/* Paso 2: seleccionar servicio – pantalla con botones */}
          <Route
            path="/seleccionar-servicio"
            element={<SeleccionarServicioPage />}
          />

          {/* Nueva clienta */}
          <Route path="/nueva-clienta" element={<NuevaClientaPage />} />

          {/* Edición de clienta */}
          <Route path="/editar-clienta" element={<EditarClientaPage />} />

          {/* Paso 3: fichas por servicio con layout */}
          <Route
            path="/ficha/lifting"
            element={
              <FichaAppLayout currentServicio="lifting">
                <LiftingForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/extensiones"
            element={
              <FichaAppLayout currentServicio="extensiones">
                <ExtensionesPestanasForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/laminado"
            element={
              <FichaAppLayout currentServicio="laminado">
                <LaminadoCejasForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/limpieza"
            element={
              <FichaAppLayout currentServicio="limpieza">
                <LimpiezaFacialForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/depilacion"
            element={
              <FichaAppLayout currentServicio="depilacion">
                <DepilacionFacialForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/hydrogloss"
            element={
              <FichaAppLayout currentServicio="hydrogloss">
                <HydroglossForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/masaje-reductivo"
            element={
              <FichaAppLayout currentServicio="masaje-reductivo">
                <MasajeReductivoForm />
              </FichaAppLayout>
            }
          />

          <Route
            path="/ficha/masaje-relajante"
            element={
              <FichaAppLayout currentServicio="masaje-relajante">
                <MasajeRelajanteForm />
              </FichaAppLayout>
            }
          />

          {/* Listado de clientas y ficha individual */}
          <Route path="/clientas" element={<ClientasABC />} />
          <Route path="/ficha/:id" element={<FichaClientaPage />} />

          {/* Edición de servicios (redirige al formulario correcto) */}
          <Route path="/editar-servicio" element={<EditarServicioRouter />} />

          {/* Paso final */}
          <Route path="/ficha/final" element={<FinalFicha />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClientaProvider>
  );
}

