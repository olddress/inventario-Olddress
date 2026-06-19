import { supabase } from "./supabase";

export async function obtenerEntregas(
    repartidorId: string
) {

    const { data, error } =
        await supabase

            .from("entregas")

            .select("*")

            .eq(
                "repartidor_id",
                repartidorId
            )

            .order(
                "orden",
                {
                    ascending: true,
                }
            );

    if (error) {
        console.error(error);
    }

    return data || [];

}

export async function actualizarCoordenadasEntrega(
    id: string,
    latitud: number,
    longitud: number
) {

    const { error } =
        await supabase
            .from("entregas")
            .update({
                latitud,
                longitud,
            })
            .eq("id", id);

    if (error) {
        console.error(error);
    }

}