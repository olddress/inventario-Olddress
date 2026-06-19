"use client";

import { useEffect, useState } from "react";

import { Marker, Popup, Polyline } from "react-leaflet";
import { obtenerEntregasPendientes } from "../../lib/entregas";

import L from "leaflet";
import type { LatLngTuple } from "leaflet";

type Entrega = {
    id: string;
    orden: number;
    direccion: string;
    latitud: number | string;
    longitud: number | string;
};

export default function RutaRepartidor({
    repartidorId,
}: {
    repartidorId: string;
}) {
    const [entregas, setEntregas] = useState<Entrega[]>([]);

    useEffect(() => {
        async function cargar() {
            const data = await obtenerEntregasPendientes(repartidorId);
            setEntregas(data || []);
        }

        cargar();
    }, [repartidorId]);

    const entregaIcon = L.divIcon({
        html: `
            <div style="
                font-size:28px;
                transform:translate(-50%,-50%);
            ">
                📦
            </div>
        `,
        className: "",
        iconSize: [28, 28],
    });

    // 🔥 FIX CLAVE: tipado correcto para Leaflet
    const posiciones: LatLngTuple[] = entregas
        .filter((e) => e.latitud && e.longitud)
        .map((e) => [
            Number(e.latitud),
            Number(e.longitud),
        ]);

    return (
        <>
            {posiciones.length > 1 && (
                <Polyline
                    positions={posiciones}
                    pathOptions={{
                        color: "blue",
                        weight: 4,
                    }}
                />
            )}

            {entregas.map((e) =>
                e.latitud && e.longitud ? (
                    <Marker
                        key={e.id}
                        position={[
                            Number(e.latitud),
                            Number(e.longitud),
                        ]}
                        icon={entregaIcon}
                    >
                        <Popup>
                            <div>
                                <strong>
                                    Entrega #{e.orden}
                                </strong>
                                <br />
                                {e.direccion}
                            </div>
                        </Popup>
                    </Marker>
                ) : null
            )}
        </>
    );
}