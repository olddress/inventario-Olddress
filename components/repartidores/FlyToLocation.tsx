"use client";

import { useMap } from "react-leaflet";

export default function FlyToLocation({
    position,
}: {
    position: [number, number];
}) {

    const map = useMap();
    

    return (
        <button
            onClick={() =>
                map.flyTo(
                    position,
                    18,
                    {
                        duration: 1.5,
                    }
                )
            }
            className="
                absolute
                top-4
                right-4
                z-1000
                bg-green-600
                hover:bg-green-700
                text-white
                px-4
                py-2
                rounded-lg
                shadow-lg
            "
        >
            📍 Mi ubicación
        </button>
    );
}