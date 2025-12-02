import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientaProvider } from "./ClientaContext";

import Home from "./Home";
import BasicosPage from "./BasicosPage";
import FinalFicha from "./FinalFicha";
import ListadoClientas from "./ListadoClientas";
import FichaClientaPage from "./FichaClientaPage";

import FichaAppLayout from "./FichaAppLayout";

import LiftingForm from "./LiftingForm";
import ExtensionesPestanasForm from "./ExtensionesPestanasForm";
import LaminadoCejasForm from "./LaminadoCejasForm";
import LimpiezaFacialForm from "./LimpiezaFacialForm";
import DepilacionFacialForm from "./DepilacionFacialForm";
import HydroglossForm from "./HydroglossForm";
import MasajeReductivoForm from "./MasajeReductivoForm";
import MasajeRelajanteForm from "./MasajeRelajanteForm";

export default function App() {
  return (
    <ClientaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iniciar" element={<Navigate to="/ficha/basicos" replace />} />
          <Route path="/ficha/basicos" element={<BasicosPage />} />

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

          <Route path="/clientas" element={<ListadoClientas />} />
          <Route path="/clienta/:id" element={<FichaClientaPage />} />
          <Route path="/final-ficha" element={<FinalFicha />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClientaProvider>
  );
}

