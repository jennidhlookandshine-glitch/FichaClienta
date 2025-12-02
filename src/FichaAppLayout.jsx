import { useNavigate } from "react-router-dom";

const SERVICIOS = [
  { path: "lifting", label: "Lifting" },
  { path: "extensiones", label: "Extensiones" },
  { path: "laminado", label: "Laminado cejas" },
  { path: "limpieza", label: "Limpieza facial" },
  { path: "depilacion", label: "Depilación facial" },
  { path: "hydrogloss", label: "Hydrogloss" },
  { path: "masaje-reductivo", label: "Masaje reductivo" },
  { path: "masaje-relajante", label: "Masaje relajante" },
];

export default function FichaAppLayout({ children, currentServicio }) {
  const navigate = useNavigate();

  const navBtn = (activo) => 
    `w-full text-left px-4 py-2 rounded-full font-semibold border transition ${
      activo
        ? "bg-pink-600 text-white border-pink-600 shadow"
        : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-400 p-6 font-[Poppins] text-gray-800">
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Menú lateral */}
          <aside className="col-span-12 md:col-span-3">
            <nav className="flex flex-col gap-4">
              {SERVICIOS.map((s) => (
                <button
                  key={s.path}
                  type="button"
                  onClick={() => navigate(`/ficha/${s.path}`)}
                  className={navBtn(currentServicio === s.path)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Contenido */}
          <section className="col-span-12 md:col-span-9">
            <div className="bg-white/95 rounded-xl shadow p-6">
              {children}

              {/* Acciones inferiores */}
              <div className="mt-6 flex gap-3 justify-center md:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/ficha/basicos")}
                  className="px-6 h-11 rounded-full font-bold text-white bg-pink-600 hover:bg-pink-700 transition"
                >
                  Volver
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/final-ficha")}
                  className="px-6 h-11 rounded-full font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
                >
                  Finalizar
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/clientas")}
                  className="px-6 h-11 rounded-full font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 transition"
                >
                  Clientas
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
