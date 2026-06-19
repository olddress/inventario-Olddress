"use client";

import {
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";

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

export default function RepartidoresLayer({
    repartidores,
    repartidorActual,
}: {
    repartidores: any[];
    repartidorActual: string | null;
}) {

    return (
        <>
            {repartidores
                .filter(
                    (r) =>
                        r.id !== repartidorActual
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
        </>
    );

}