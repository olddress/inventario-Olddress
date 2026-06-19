"use client";

import {
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";

type PuntoRuta = {
    direccion: string;
    latitud: number;
    longitud: number;
};

type Props = {
    puntosRuta: PuntoRuta[];
};

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

export default function PuntosRutaLayer({
    puntosRuta,
}: Props) {

    console.log(
        "PUNTOS RUTA:",
        puntosRuta
    );

    return (

        <>
            {puntosRuta.map(

                (punto, index) => (

                    punto.latitud &&
                    punto.longitud && (

                        <Marker
                            key={index}
                            position={[
                                Number(
                                    punto.latitud
                                ),
                                Number(
                                    punto.longitud
                                ),
                            ]}
                            icon={
                                entregaIcon
                            }
                        >

                            <Popup>

                                <strong>
                                    Parada #{index + 1}
                                </strong>

                                <br />

                                {punto.direccion}

                            </Popup>

                        </Marker>

                    )

                )

            )}
        </>

    );

}