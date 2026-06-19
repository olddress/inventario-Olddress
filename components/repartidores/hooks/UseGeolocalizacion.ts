// hooks/useGeolocalizacion.ts

import {
    useEffect,
    useState,
} from "react";

import {
    actualizarUbicacion,
} from "../../../lib/repartidores";

export default function useGeolocalizacion(
    repartidorId: string | null
) {

    const [posicion, setPosicion] =
        useState<[number, number]>([
            4.6097,
            -74.0817,
        ]);

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

    return posicion;

}