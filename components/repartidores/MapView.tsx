"use client";

import { useEffect, useState } from "react";
import { actualizarUbicacion, obtenerRepartidores } from "../../lib/repartidores";
import RepartidorLogin from "./RepartidorLogin";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { obtenerEntregas, actualizarCoordenadasEntrega } from "../../lib/entregas";
import { geocodificarDireccion } from "../../lib/geocoding";
import RutaRepartidor from "./RutaRepartidor";
import FlyToLocation from "./FlyToLocation";
import MiUbicacionLayer from "./MiUbicacionLayer";


    const motoIcon = L.divIcon({
        html: `
            <div style="
                font-size:32px;
                transform:translate(-50%,-50%);
            ">
                🛵
            </div>
        `,
        className: "",
        iconSize: [32, 32],
    });

export default function MapView() {

    const [repartidorId, setRepartidorId] =
        useState<string | null>(null);

    const [modoMapa, setModoMapa] =
        useState<
            "mapa" |
            "satelite" |
            "trafico"
        >("mapa");

    const [posicion, setPosicion] =
        useState<[number, number]>([
            4.6097,
            -74.0817,
        ]);

    const [repartidores, setRepartidores] =
        useState<any[]>([]);

        const [
            repartidorSeleccionado,
            setRepartidorSeleccionado,
        ] = useState("todos");

    useEffect(() => {

        const id =
            localStorage.getItem(
                "repartidorId"
            );

        setRepartidorId(id);

    }, []);

    useEffect(() => {

        if (!repartidorId) return;

        const watchId =
            navigator.geolocation.watchPosition(

                async ({ coords }) => {

                    const lat =
                        coords.latitude;

                    const lng =
                        coords.longitude;

                    setPosicion([
                        lat,
                        lng,
                    ]);

                    console.log(
                        "ID actual:",
                        repartidorId
                    );

                    await actualizarUbicacion(
                        repartidorId,
                        lat,
                        lng
                    );

                },

                console.error,

                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                }
                

            );

        return () =>
            navigator.geolocation.clearWatch(
                watchId
            );

    }, [repartidorId]);

    useEffect(() => {

        async function cargar() {

            const data =
                await obtenerRepartidores();

            setRepartidores(
                data || []
            );

        }

        cargar();

        const interval =
            setInterval(
                cargar,
                5000
            );

        return () =>
            clearInterval(interval);

    }, []);

    async function geocodificarEntregas() {

            if (!repartidorSeleccionado ||
                repartidorSeleccionado === "todos")
                return;

            const entregas =
                await obtenerEntregas(
                    repartidorSeleccionado
                );

            for (const entrega of entregas) {

                if (
                    entrega.latitud &&
                    entrega.longitud
                ) {
                    continue;
                }

                const coords =
                    await geocodificarDireccion(
                        entrega.direccion
                    );

                if (!coords) continue;

                await actualizarCoordenadasEntrega(
                    entrega.id,
                    coords.latitud,
                    coords.longitud
                );

                console.log(
                    "Geocodificada:",
                    entrega.direccion
                );

            }

        }

    if (!repartidorId) {

        return (
            <RepartidorLogin
                onLogin={
                    setRepartidorId
                }
            />
        );

    }

    const repartidoresFiltrados =
    repartidorSeleccionado === "todos"

        ? repartidores

        : repartidores.filter(
            (r) =>
                r.id ===
                repartidorSeleccionado
        );

    return (

        <div className="space-y-4">

            <div className="flex gap-2 flex-wrap">

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
                    onClick={geocodificarEntregas}
                    className="
                        px-4 py-2
                        rounded-lg
                        bg-purple-600
                        text-white
                    "
                >
                    📍 Geocodificar entregas
                </button>

            </div>

            <div className="relative">

                <MapContainer
                    center={posicion}
                    zoom={15}
                    style={{
                        height: "calc(100vh - 220px)",
                        width: "100%",
                    }}
                    className="
                        rounded-xl
                        overflow-hidden
                        shadow
                    "
                >

                    <FlyToLocation
                        position={posicion}
                    />

                    <TileLayer
                        key={modoMapa}
                        attribution={
                            modoMapa === "satelite"
                                ? "Esri"
                                : "OpenStreetMap"
                        }
                        url={
                            modoMapa === "satelite"
                                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        }
                    />

                    {repartidorSeleccionado !==
                        "todos" && (

                        <RutaRepartidor
                            repartidorId={
                                repartidorSeleccionado
                            }
                        />

                    )}

                    {repartidoresFiltrados
                        .filter(
                            (r) =>
                                r.id !== repartidorId
                        )
                        .map((r) => (

                            r.latitud &&
                            r.longitud && (

                                <Marker
                                    key={r.id}
                                    position={[
                                        r.latitud,
                                        r.longitud,
                                    ]}
                                    icon={motoIcon}
                                >
                                    <Popup>
                                        🛵 {r.nombre}
                                    </Popup>
                                </Marker>
                            )
                    ))}
                    <MiUbicacionLayer
                        posicion={posicion}
                    />
                </MapContainer>
            </div>
        </div>
    );
}