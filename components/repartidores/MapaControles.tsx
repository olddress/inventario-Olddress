// components/repartidores/MapaControles.tsx

"use client";

import { finalizarRuta } from "@/lib/entregas";
import DireccionSearch from "./DireccionSearch";

type Props = {
    modoMapa: string;

    setModoMapa: (
        modo: "mapa" | "satelite"
    ) => void;

    repartidores: any[];

    repartidorSeleccionado: string;

    setRepartidorSeleccionado: (
        id: string
    ) => void;

    geocodificarEntregas: () => void;

    onDireccionSeleccionada?: (
        direccion: string,
        lat: number,
        lng: number
    ) => void;
};

export default function MapaControles({
    modoMapa,
    setModoMapa,
    repartidores,
    repartidorSeleccionado,
    setRepartidorSeleccionado,
    onDireccionSeleccionada,
}: Props) {

    function manejarDireccionSeleccionada(
        direccion: string,
        lat: number,
        lng: number
    ) {

        console.log("Dirección:", direccion);
        console.log("Lat:", lat);
        console.log("Lng:", lng);

        onDireccionSeleccionada?.(
            direccion,
            lat,
            lng
        );

    }

    return (

        <div className="flex gap-2 flex-wrap relative z-9999">

            <DireccionSearch
                onSeleccionar={
                    manejarDireccionSeleccionada
                }
            />

            <button
                onClick={() =>
                    setModoMapa("mapa")
                }
                className={`px-4 py-2 rounded-lg ${
                    modoMapa === "mapa"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black border"
                }`}
            >
                🗺️ Mapa
            </button>

            <button
                onClick={() =>
                    setModoMapa("satelite")
                }
                className={`px-4 py-2 rounded-lg ${
                    modoMapa === "satelite"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black border"
                }`}
            >
                🛰️ Satélite
            </button>

            <select
                value={repartidorSeleccionado}
                onChange={(e) =>
                    setRepartidorSeleccionado(
                        e.target.value
                    )
                }
                className="
                    px-4 py-2
                    rounded-lg
                    border
                    bg-white
                    text-black
                "
            >
                <option value="todos">
                    Todos los repartidores
                </option>

                {repartidores.map((r) => (

                    <option
                        key={r.id}
                        value={r.id}
                    >
                        {r.nombre}
                    </option>

                ))}
            </select>

            <button
                onClick={() =>
                    finalizarRuta(
                        repartidorSeleccionado
                    )
                }
                className="
                    px-4 py-2
                    rounded-lg
                    bg-green-500
                    text-white
                "
            >
                ✅ Finalizar ruta
            </button>

        </div>

    );

}