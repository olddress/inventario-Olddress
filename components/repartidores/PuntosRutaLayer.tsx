"use client";

import {
    CircleMarker,
    Popup,
} from "react-leaflet";

type PuntoRuta = {
    direccion: string;
    lat: number;
    lng: number;
};

type Props = {
    puntosRuta: PuntoRuta[];
};

export default function PuntosRutaLayer({
    puntosRuta,
}: Props) {

    return (

        <>

            {puntosRuta.map(

                (punto, index) => (

                    <CircleMarker
                        key={index}
                        center={[
                            punto.lat,
                            punto.lng,
                        ]}
                        radius={10}
                        pathOptions={{
                            color: "red",
                            fillColor: "red",
                            fillOpacity: 1,
                        }}
                    >

                        <Popup>

                            <strong>
                                Parada #{index + 1}
                            </strong>

                            <br />

                            {punto.direccion}

                        </Popup>

                    </CircleMarker>

                )

            )}

        </>

    );

}