"use client";

import { useEffect, useState } from "react";
import { actualizarUbicacion, obtenerRepartidores } from "../../lib/repartidores";
import RepartidorLogin from "./RepartidorLogin";
import {MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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


function FlyToLocation({
    position,
}: {
    position: [number, number];
}) {

    const map = useMap();

    return (
        <button
            onClick={() =>
                map.flyTo(
                    position,
                    18,
                    {
                        duration: 1.5,
                    }
                )
            }
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

    if (!repartidorId) {

        return (
            <RepartidorLogin
                onLogin={
                    setRepartidorId
                }
            />
        );

    }

    return (

        <div className="space-y-4 pb-24 md:pb-0">

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

            </div>

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

                    <Circle
                        center={posicion}
                        radius={20}
                        pathOptions={{
                            color: "#60a5fa",
                            fillColor: "#60a5fa",
                            fillOpacity: 0.15,
                        }}
                    />

                    <CircleMarker
                        center={posicion}
                        radius={8}
                        pathOptions={{
                            color: "#2563eb",
                            fillColor: "#3b82f6",
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    >
                        <Popup>
                            📍 Tu ubicación
                        </Popup>
                    </CircleMarker>

                    {repartidores
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
                </MapContainer>
            </div>
        </div>
    );
}