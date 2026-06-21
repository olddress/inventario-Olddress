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

export async function crearEntrega(
    entrega: {
        repartidor_id: string;
        direccion: string;
        latitud: number;
        longitud: number;
        orden: number;
    }
) {

    const { error } =
        await supabase

            .from("entregas")

            .insert(entrega);

    if (error) {
        console.error(error);
    }

}

export async function obtenerEntregasPendientes(
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
            .eq(
                "estado",
                "pendiente"
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

export async function finalizarRuta(
    repartidorId: string
) {

    const { error } =
        await supabase

            .from("entregas")

            .update({
                estado:
                    "completada",
            })

            .eq(
                "repartidor_id",
                repartidorId
            )

            .eq(
                "estado",
                "pendiente"
            );

    if (error) {
        console.error(error);
    }

}

export async function finalizarEntrega(
    entregaId: string
) {
    const { error } =
        await supabase
            .from("entregas")
            .update({
                estado: "completada",
            })
            .eq("id", entregaId);

    if (error) {
        console.error(error);
        throw error;
    }
}