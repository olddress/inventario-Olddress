"use client";

import { useEffect } from "react";

import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet-routing-machine";

type PuntoRuta = {
    latitud: number;
    longitud: number;
};

type Props = {

    posicionActual: [
        number,
        number
    ];

    puntosRuta: PuntoRuta[];

};

export default function RutaLayer({
    posicionActual,
    puntosRuta,
}: Props) {

    const map = useMap();

    useEffect(() => {

        if (
            puntosRuta.length < 1
        ) {
            return;
        }

        const waypoints = [

            L.latLng(
                posicionActual[0],
                posicionActual[1]
            ),

            ...puntosRuta.map(
                (p) =>
                    L.latLng(
                        Number(
                            p.latitud
                        ),
                        Number(
                            p.longitud
                        )
                    )
            ),

        ];

        const routing =
            (L as any)
                .Routing
                .control({

                    waypoints,

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

                    createMarker:
                        () => null,

                })

                .addTo(map);

        setTimeout(() => {

            const panel =
                document.querySelector(
                    ".leaflet-routing-container"
                );

            if (panel) {

                (
                    panel as HTMLElement
                ).style.display =
                    "none";

            }

        }, 100);

        return () => {

            map.removeControl(
                routing
            );

        };

    }, [
        map,
        puntosRuta,
        posicionActual,
    ]);

    return null;

}