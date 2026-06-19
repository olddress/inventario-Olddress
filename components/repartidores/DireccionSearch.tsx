"use client";

import { useState } from "react";

import {
    buscarDirecciones,
    obtenerDetalleLugar,
}
from "../../lib/googlePlaces";

type Props = {

    onSeleccionar: (
        direccion: string,
        lat: number,
        lng: number
    ) => void;

};

export default function DireccionSearch({
    onSeleccionar,
}: Props) {

    const [search, setSearch] =
        useState("");

    const [resultados, setResultados] =
        useState<any[]>([]);

    async function buscar(
        texto: string
    ) {

        setSearch(texto);

        if (texto.length < 3) {

            setResultados([]);

            return;

        }

        const data =
            await buscarDirecciones(
                texto
            );

        console.log(data);

        setResultados(data);

    }

    async function seleccionar(
        placeId: string
    ) {

        const lugar =
            await obtenerDetalleLugar(
                placeId
            );

        console.log(lugar);

        if (!lugar) return;

        const lat =
            lugar.location.latitude;

        const lng =
            lugar.location.longitude;

        const direccion =
            lugar.formattedAddress;

        onSeleccionar(
            direccion,
            lat,
            lng
        );

        setSearch(
            direccion
        );

        setResultados([]);

    }

    return (

        <div
            className="
                relative
                w-full
                z-9999
            "
        >

            <input
                value={search}
                onChange={(e) =>
                    buscar(
                        e.target.value
                    )
                }
                placeholder="
                    Buscar dirección...
                "
                className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-2
                    text-black
                "
            />

            {resultados.length > 0 && (

                <div
                    className="
                        absolute
                        top-full
                        left-0
                        right-0
                        bg-white
                        border
                        rounded-lg
                        shadow-xl
                        max-h-60
                        overflow-y-auto
                        z-9999
                    "
                >

                    {resultados.map(
                        (r: any) => (

                            <button
                                key={
                                    r.placePrediction.placeId
                                }
                                onClick={() =>
                                    seleccionar(
                                        r.placePrediction.placeId
                                    )
                                }
                                className="
                                    block
                                    w-full
                                    text-left
                                    px-4
                                    py-2
                                    hover:bg-gray-100
                                "
                            >
                                {
                                    r.placePrediction
                                        .text
                                        .text
                                }
                            </button>

                        )
                    )}

                </div>

            )}

        </div>

    );

}