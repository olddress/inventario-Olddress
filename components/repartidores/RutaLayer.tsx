"use client";

import { useEffect } from "react";

import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet-routing-machine";

type Props = {
    puntos: {
        latitud: number;
        longitud: number;
    }[];
};

export default function RutaLayer({
    puntos,
}: Props) {

    const map = useMap();

    useEffect(() => {

        if (puntos.length < 2)
            return;

        const routing =
            (L as any).Routing.control({

                waypoints:
                    puntos.map(
                        (p) =>
                            L.latLng(
                                p.latitud,
                                p.longitud
                            )
                    ),

                routeWhileDragging:
                    false,

                addWaypoints:
                    false,

                draggableWaypoints:
                    false,

                fitSelectedRoutes:
                    true,

                show:
                    false,

            }).addTo(map);

        return () => {

            map.removeControl(
                routing
            );

        };

    }, [map, puntos]);

    return null;

}