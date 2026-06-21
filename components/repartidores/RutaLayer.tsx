"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";

import { obtenerRutaORS } from "../../lib/rutas";

type PuntoRuta = {
    latitud: number;
    longitud: number;
};

type Props = {
    posicionActual: [number, number];
    puntosRuta: PuntoRuta[];
    repartidorId?: string; // 👈 importante para reset
};

export default function RutaLayer({
    posicionActual,
    puntosRuta,
    repartidorId,
}: Props) {
    const map = useMap();

    const polylineRef = useRef<L.Polyline | null>(null);

    const isUserInteracting = useRef(false);

    useEffect(() => {
        function handleDragStart() {
            isUserInteracting.current = true;
        }

        map.on("dragstart", handleDragStart);

        return () => {
            map.off("dragstart", handleDragStart);
        };
    }, [map]);

    useEffect(() => {
        let cancelled = false;

        async function cargarRuta() {
            if (puntosRuta.length === 0) return;

            const coords: [number, number][] = [
                posicionActual,
                ...puntosRuta.map(
                    (p): [number, number] => [
                        Number(p.latitud),
                        Number(p.longitud),
                    ]
                ),
            ];

            const geo = await obtenerRutaORS(coords);

            if (cancelled) return;

            const coordinates: number[][] =
                geo.features[0].geometry.coordinates;

            const route: LatLngTuple[] = coordinates.map(
                ([lng, lat]) => [lat, lng]
            );

            // 🧹 eliminar ruta anterior SIEMPRE
            if (polylineRef.current) {
                map.removeLayer(polylineRef.current);
                polylineRef.current = null;
            }

            // 🧵 crear nueva ruta
            const polyline = L.polyline(route, {
                color: "blue",
                weight: 4,
            }).addTo(map);

            polylineRef.current = polyline;

            // 📦 fitBounds solo si usuario no está interactuando
            if (!isUserInteracting.current) {
                map.fitBounds(polyline.getBounds(), {
                    padding: [30, 30],
                });
            }
        }

        cargarRuta();

        return () => {
            cancelled = true;

            if (polylineRef.current) {
                map.removeLayer(polylineRef.current);
                polylineRef.current = null;
            }
        };
    }, [map, puntosRuta, posicionActual, repartidorId]);

    return null;
}