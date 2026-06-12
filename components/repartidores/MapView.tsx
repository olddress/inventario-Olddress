"use client";

import { useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function RecenterMap({
    position,
}: {
    position: [number, number];
}) {

    const map = useMap();

    useEffect(() => {
        map.setView(position, 15);
    }, [position, map]);

    return null;
}

function FlyToLocation({
    position,
}: {
    position: [number, number];
}) {

    const map = useMap();

    return (
        <button
            onClick={() => {
                map.flyTo(
                    position,
                    18,
                    {
                        duration: 1.5,
                    }
                );
            }}
            className="
                absolute
                top-4
                right-4
                z-1000
                bg-green-600
                hover:bg-green-700
                text-white
                px-4
                py-2
                rounded-lg
                shadow-lg
            "
        >
            📍 Mi ubicación
        </button>
    );
}

export default function MapView() {

    const [modoMapa, setModoMapa] =
        useState<"mapa" | "satelite" | "trafico">(
            "mapa"
        );

    const [posicion, setPosicion] = useState<
        [number, number]
    >([4.6097, -74.0817]);

    useEffect(() => {

        if (!navigator.geolocation) {
            console.error(
                "Geolocalización no soportada"
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setPosicion([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);

                console.log(
                    "Precisión:",
                    position.coords.accuracy,
                    "metros"
                );

            },

            (error) => {
                console.error(
                    "Error obteniendo ubicación:",
                    error
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }

        );

    }, []);

    return (
        <div className="space-y-4">

            <div className="flex gap-2 flex-wrap">

                <button
                    onClick={() =>
                        setModoMapa("mapa")
                    }
                    className={`
                        px-4 py-2 rounded-lg
                        ${
                            modoMapa === "mapa"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-black border"
                        }
                    `}
                >
                    🗺️ Mapa
                </button>

                <button
                    onClick={() =>
                        setModoMapa("satelite")
                    }
                    className={`
                        px-4 py-2 rounded-lg
                        ${
                            modoMapa === "satelite"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-black border"
                        }
                    `}
                >
                    🛰️ Satélite
                </button>

                <button
                    onClick={() =>
                        setModoMapa("trafico")
                    }
                    className={`
                        px-4 py-2 rounded-lg
                        ${
                            modoMapa === "trafico"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-black border"
                        }
                    `}
                >
                    🚦 Tráfico
                </button>

            </div>

            {modoMapa === "trafico" && (
                <div
                    className="
                        bg-yellow-100
                        border
                        border-yellow-300
                        text-yellow-800
                        p-3
                        rounded-lg
                    "
                >
                    El modo tráfico estará disponible
                    próximamente.
                </div>
            )}

            <div className="relative">

                <MapContainer
                    center={posicion}
                    zoom={15}
                    style={{
                        height: "600px",
                        width: "100%",
                    }}
                    className="
                        rounded-xl
                        overflow-hidden
                        shadow
                    "
                >

                    <RecenterMap
                        position={posicion}
                    />

                    <FlyToLocation
                        position={posicion}
                    />

                    {modoMapa === "satelite" ? (

                        <TileLayer
                            key="satelite"
                            attribution="Esri"
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />

                    ) : (

                        <TileLayer
                            key="mapa"
                            attribution="OpenStreetMap"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                    )}

                    <Marker
                        position={posicion}
                    >
                        <Popup>
                            📍 Tu ubicación actual
                        </Popup>
                    </Marker>

                </MapContainer>

            </div>

        </div>
    );
}