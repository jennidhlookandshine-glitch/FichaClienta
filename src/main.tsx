import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // antes import Home from "./Home.jsx"
import "./index.css"; // o "./App.css" según uses

const el = document.getElementById("root");
if (!el) {
throw new Error("No se encontró un elemento con id 'root' en index.html");
}

createRoot(el).render(
<StrictMode>
<App /> {/* antes <Home /> */}
</StrictMode>
);
