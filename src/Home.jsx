import { Link } from "react-router-dom";
import logo from "./logo.png";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#ffd1e1,#ffc1dc,#ffb3d7)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: 24,
          textAlign: "center",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 24,
            paddingBottom: 28,
          }}
        >
          <img
            src={logo}
            alt="Jenni HD Look and Shine"
            style={{ maxWidth: 300, height: "auto", marginBottom: 50 }}
          />

          <h1
            style={{
              fontFamily: "'Marcellus', serif",
              fontWeight: 600,
              fontSize: "clamp(34px, 6.4vw, 56px)",
              letterSpacing: ".3px",
              marginTop: 4,
              marginBottom: 20,
            }}
          >
            Ficha Clientas
          </h1>

          <p
            style={{
              fontFamily: "'Poppins', ui-sans-serif, system-ui",
              fontSize: "clamp(15px, 2.4vw, 20px)",
              color: "#6b214a",
              marginBottom: 50,
            }}
          >
            Belleza, confianza y cuidado personal 💖
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            {/* INICIAR FICHA → datos básicos */}
            <Link
              to="/ficha/basicos"
              style={{
                width: 300,
                height: 60,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                background: "linear-gradient(90deg,#f472b6,#db2777)",
                boxShadow: "0 6px 16px rgba(219,39,119,.35)",
              }}
            >
              INICIAR FICHA
            </Link>

            {/* VER CLIENTAS → listado ABC */}
            <Link
              to="/clientas"
              style={{
                width: 300,
                height: 60,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                background: "linear-gradient(90deg,#f472b6,#db2777)",
                boxShadow: "0 6px 16px rgba(219,39,119,.35)",
              }}
            >
              VER CLIENTAS
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
}
