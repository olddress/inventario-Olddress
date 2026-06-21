// lib/rutas.ts
export async function obtenerRutaORS(puntos: [number, number][]) {
    const apiKey = process.env.NEXT_PUBLIC_ORS_KEY;

    const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
            method: "POST",
            headers: {
                "Authorization": apiKey!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                coordinates: puntos.map(([lat, lng]) => [lng, lat]), // 👈 OJO: ORS usa [lng, lat]
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Error obteniendo ruta ORS");
    }

    return response.json();
}