const API_KEY =
    process.env
        .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function buscarDirecciones(
    texto: string
) {

    const response =
        await fetch(

            `/api/places/autocomplete?input=${encodeURIComponent(
                texto
            )}`

        );

    return response.json();

}

export async function obtenerDetalleLugar(
    placeId: string
) {

    const response =
        await fetch(

            `/api/places/details?placeId=${placeId}`

        );

    return response.json();

}