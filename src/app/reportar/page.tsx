"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShieldAlert, MapPin, FileText } from "lucide-react";
import Link from "next/link";

export default function ReportarPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [code, setCode] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);

    const titulosRapidos = [
        "Bache en calle principal",
        "Luminaria apagada",
        "Basura acumulada",
        "Fuga de agua",
        "Calle sin asfaltar",
        "Poste de luz dañado"
    ];

    const sectoresRapidos = [
        "Parroquia El Carmen",
        "Sector La Paz",
        "Sector San Juan",
        "Av. Cruz Paredes",
        "Parque Bolívar",
        "Barrio San Juan"
    ];

    const descripcionesRapidas = [
        "Bache profundo en la vía",
        "Luminaria apagada",
        "Acumulación de basura",
        "Fuga de agua",
        "Calle sin asfaltar",
        "Poste de luz inclinado"
    ];

    const sectores = [
        "Parroquia El Carmen",
        "Parroquia San Silvestre",
        "Parroquia Ramón Ignacio Méndez",
        "Parroquia Manuel Palacio Fajardo",
        "Parroquia Juan Antonio Rodríguez Domínguez",
        "Parroquia José Félix Ribas",
        "Sector La Paz",
        "Sector San Juan",
        "Sector El Centro",
        "Sector La Pedregosa",
        "Sector Barrio Obrero",
        "Sector 23 de Enero",
        "Sector Los Mangos",
        "Sector El Rincón",
        "Sector La Floresta",
        "Av. Cruz Paredes",
        "Av. 23 de Enero",
        "Av. Los Llanos",
        "Av. Universidad",
        "Calle 2",
        "Calle 3",
        "Calle 4",
        "Calle 5",
        "Calle Bolívar",
        "Calle Miranda",
        "Calle Sucre",
        "Parque Bolívar",
        "Plaza Bolívar",
        "Barrio San Juan",
        "El Carmen"
    ];

    const descriptionTemplates = [
        "Bache profundo en la vía principal que representa riesgo para los vehículos",
        "Luminaria apagada en la esquina, genera inseguridad en la noche",
        "Acumulación de basura en la vía pública, necesita recolección urgente",
        "Fuga de agua en tubería principal, desperdicio de recurso vital",
        "Calle sin asfaltar, se vuelve intransitable en días de lluvia",
        "Poste de luz inclinado, riesgo de caída",
        "Desagüe tapado, provoca inundaciones en la zona",
        "Árbol caído bloqueando la vía pública",
        "Señal de tránsito dañada o ausente",
        "Parque sin mantenimiento, equipo de juegos dañado",
        "Acera rota o inexistente, peligro para peatones",
        "Contenedor de basura dañado o desbordado",
        "Alcantarilla sin tapa, riesgo de accidentes",
        "Cable eléctrico bajo o caído, peligro inminente",
        "Zona verde sin mantenimiento, maleza alta"
    ];

    const filteredLocationSuggestions = sectores.filter(sector =>
        sector.toLowerCase().includes(locationInput.toLowerCase())
    );

    const filteredDescriptionSuggestions = descriptionTemplates.filter(template =>
        template.toLowerCase().includes(descriptionInput.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/incidents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                setCode(result.trackerCode);
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-100"
                >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Reporte Enviado!</h2>
                    <p className="text-slate-600 mb-8">Tu solicitud ha sido registrada correctamente en el sistema de la Alcaldía.</p>

                    <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tu Código de Seguimiento</p>
                        <p className="text-4xl font-black text-blue-600 tracking-widest">{code}</p>
                    </div>

                    <p className="text-sm text-slate-500 mb-8">Por favor, guarda o captura este código. Lo necesitarás para consultar el estado de tu requerimiento.</p>

                    <Link href="/">
                        <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors">
                            Volver al Inicio
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-100"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <ShieldAlert className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-black">Reportar Incidencia</h1>
                            <p className="text-slate-500">Completa el formulario para notificar a la Alcaldía.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">1. Detalles de la Novedad</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Título Breve</label>
                                <div className="mb-3">
                                    <p className="text-xs text-slate-500 mb-2">Títulos más comunes:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {titulosRapidos.map((titulo, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setTitleInput(titulo)}
                                                className="px-3 py-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors border border-purple-200"
                                            >
                                                {titulo}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <input 
                                    required 
                                    type="text" 
                                    name="title" 
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                                    placeholder="Ej: Bote de aguas blancas en Av. Cruz Paredes..." 
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación / Sector</label>
                                <div className="mb-3">
                                    <p className="text-xs text-slate-500 mb-2">Ubicaciones más comunes:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {sectoresRapidos.map((sector, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    setLocationInput(sector);
                                                    setShowLocationSuggestions(false);
                                                }}
                                                className="px-3 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors border border-blue-200"
                                            >
                                                {sector}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <input 
                                        required 
                                        type="text" 
                                        name="location" 
                                        value={locationInput}
                                        onChange={(e) => {
                                            setLocationInput(e.target.value);
                                            setShowLocationSuggestions(e.target.value.length > 0);
                                        }}
                                        onFocus={() => setShowLocationSuggestions(locationInput.length > 0)}
                                        onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                                        className="text-black w-full px-4 py-3 pr-10 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                                        placeholder="Ej: Parroquia El Carmen, Calle 2" 
                                    />
                                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                                {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                        {filteredLocationSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    setLocationInput(suggestion);
                                                    setShowLocationSuggestions(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 text-sm text-slate-700"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                                    <select required name="category" className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                                        <option value="">Selecciona...</option>
                                        <option value="VIALIDAD">Vialidad y Asfaltado</option>
                                        <option value="AGUA">Servicio de Agua</option>
                                        <option value="ALUMBRADO">Alumbrado Eléctrico</option>
                                        <option value="ASEO">Aseo Urbano</option>
                                        <option value="SEGURIDAD">Seguridad Pública</option>
                                        <option value="OTRO">Otro Requerimiento</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción Detallada</label>
                                <div className="mb-3">
                                    <p className="text-xs text-slate-500 mb-2">Descripciones más comunes:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {descripcionesRapidas.map((desc, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    const fullDescription = descriptionTemplates.find(template => 
                                                        template.toLowerCase().includes(desc.toLowerCase())
                                                    ) || desc;
                                                    setDescriptionInput(fullDescription);
                                                    setShowDescriptionSuggestions(false);
                                                }}
                                                className="px-3 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-full transition-colors border border-green-200"
                                            >
                                                {desc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        required 
                                        name="description" 
                                        rows={4} 
                                        value={descriptionInput}
                                        onChange={(e) => {
                                            setDescriptionInput(e.target.value);
                                            setShowDescriptionSuggestions(e.target.value.length > 0);
                                        }}
                                        onFocus={() => setShowDescriptionSuggestions(descriptionInput.length > 0)}
                                        onBlur={() => setTimeout(() => setShowDescriptionSuggestions(false), 200)}
                                        className="text-black w-full px-4 py-3 pr-10 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" 
                                        placeholder="Describe la situación para que nuestros equipos acudan debidamente preparados..."
                                    ></textarea>
                                    <FileText className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                                </div>
                                {showDescriptionSuggestions && filteredDescriptionSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                        {filteredDescriptionSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    setDescriptionInput(suggestion);
                                                    setShowDescriptionSuggestions(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 text-sm text-slate-700"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 pt-4 border-t">
                            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">2. Tus Datos (Opcional)</h3>
                            <p className="text-sm text-slate-500 -mt-4">Si deseas que te contactemos, proporciona tus datos.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
                                    <input type="text" name="citizenName" className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Juan Pérez" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Cédula de Identidad</label>
                                    <input type="text" name="citizenDni" className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="V-12345678" />
                                </div>
                            </div>
                        </div>

                        {status === "error" && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5" />
                                Ocurrió un error al enviar el reporte. Por favor, inténtalo de nuevo.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === "loading" ? "Procesando..." : "Enviar Reporte Oficial al Sistema"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
