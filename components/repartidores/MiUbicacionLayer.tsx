"use client";

import {
    Circle,
    CircleMarker,
    Popup,
} from "react-leaflet";

export default function MiUbicacionLayer({
    posicion,
}: {
    posicion: [number, number];
}) {

            return (
                <>
                    <Circle
                        center={posicion}
                        radius={20}
                        pathOptions={{
                            color: "#60a5fa",
                            fillColor: "#60a5fa",
                            fillOpacity: 0.15,
                        }}
                    />

                    <CircleMarker
                        center={posicion}
                        radius={8}
                        pathOptions={{
                            color: "#2563eb",
                            fillColor: "#3b82f6",
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    >
                        <Popup>
                            📍 Tu ubicación
                        </Popup>
                    </CircleMarker>
        </>
    );

}