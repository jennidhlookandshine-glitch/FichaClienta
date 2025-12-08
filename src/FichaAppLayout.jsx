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

export default function FichaAppLayout({
  children,
  currentServicio,
  showServicios = true,
  modo = "servicio", // "servicio" -> Volver + Clientas, "clientas" -> Volver + Finalizar
}) {
  const navigate = useNavigate();

  function navBtnStyle(activo) {
    return {
      width: "100%",
      textAlign: "left",
      padding: "8px 14px",
      borderRadius: 999,
      fontWeight: 600,
      borderWidth: 1,
      borderStyle: "solid",
      cursor: "pointer",
      backgroundColor: activo ? "#e91e63" : "#ffe4f1",
      color: activo ? "#ffffff" : "#b30055",
      borderColor: activo ? "#e91e63" : "#f8bbd0",
      boxShadow: activo ? "0 4px 10px rgba(233,30,99,0.35)" : "none",
    };
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#ffe4f1,#ffc1dc,#ff9acb)",
        padding: 24,
        fontFamily: "Poppins, system-ui, -apple-system, BlinkMacSystemFont",
        color: "#333",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showServicios ? "230px 1fr" : "1fr",
            gap: 24,
            alignItems: "flex-start",
          }}
        >
          {/* Menú lateral (opcional) */}
          {showServicios && (
            <aside>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: 18,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  padding: "18px 16px 20px",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#e91e63",
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  Servicios
                </h3>

                <nav
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {SERVICIOS.map((s) => (
                    <button
                      key={s.path}
                      type="button"
                      onClick={() => navigate(`/ficha/${s.path}`)}
                      style={navBtnStyle(currentServicio === s.path)}
                    >
                      {s.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Contenido */}
          <section>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.96)",
                borderRadius: 18,
                boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
                padding: 24,
              }}
            >
              {children}

              {/* Acciones inferiores */}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/ficha/basicos")}
                  style={{
                    padding: "0 24px",
                    height: 44,
                    borderRadius: 999,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#e91e63",
                    color: "white",
                  }}
                >
                  Volver
                </button>

                {modo === "servicio" ? (
                  <button
                    type="button"
                    onClick={() => navigate("/ficha/final")}
                    style={{
                      padding: "0 24px",
                      height: 44,
                      borderRadius: 999,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: "#ad1457",
                      color: "white",
                    }}
                  >
                    Clientas
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                      padding: "0 24px",
                      height: 44,
                      borderRadius: 999,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: "#ad1457",
                      color: "white",
                    }}
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}




