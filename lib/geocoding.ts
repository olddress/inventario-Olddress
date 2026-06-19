export async function geocodificarDireccion(
    direccion: string
) {

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            direccion
        )}`
    );

    const data = await response.json();

    if (!data.length) {
        return null;
    }

    return {
        latitud: Number(data[0].lat),
        longitud: Number(data[0].lon),
    };

}

export async function buscarDirecciones(
    texto: string
) {

    const response =
        await fetch(

            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                texto + ", Colombia"
            )}&limit=5`

        );

    return await response.json();

}