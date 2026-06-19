"use client";

import { useEffect, useState } from "react";

import {
    Marker,
    Popup,
} from "react-leaflet";

import {
    obtenerEntregas,
} from "../../lib/entregas";
import L from "leaflet";

export default function RutaRepartidor({
    repartidorId,
}: {
    repartidorId: string;
}) {

    const [entregas, setEntregas] =
        useState<any[]>([]);

    useEffect(() => {

        async function cargar() {

            const data =
                await obtenerEntregas(
                    repartidorId
                );

            setEntregas(
                data || []
            );

        }

        cargar();

    }, [repartidorId]);

    console.log(entregas);
    console.log(
    typeof entregas[0]?.latitud,
    typeof entregas[0]?.longitud
);

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


    return (
        <>
            {entregas.map((e) => (

                e.latitud &&
                e.longitud && (

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

                )

            ))}
        </>
    );

}