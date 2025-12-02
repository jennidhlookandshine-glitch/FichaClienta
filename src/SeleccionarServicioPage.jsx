import FichaAppLayout from "./FichaAppLayout";

export default function SeleccionarServicioPage() {
return (
<FichaAppLayout currentServicio="">
<div className="bg-white rounded-xl shadow p-6">
<h2 className="text-2xl font-bold text-pink-600 mb-2">
Selecciona un servicio
</h2>
<p className="text-gray-600">
Usa el menú de la izquierda para elegir el servicio que quieres registrar.
</p>
</div>
</FichaAppLayout>
);
}

