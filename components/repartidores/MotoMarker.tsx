// components/repartidores/MotoMarker.tsx

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

export default function MotoMarker({
    repartidor,
}: {
    repartidor: any;
}) {

    return (

        <Marker
            position={[
                repartidor.latitud,
                repartidor.longitud,
            ]}
            icon={motoIcon}
        >
            <Popup>
                🛵 {repartidor.nombre}
            </Popup>
        </Marker>

    );

}