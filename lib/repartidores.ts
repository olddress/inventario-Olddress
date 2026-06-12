import { supabase } from "./supabase";

export async function actualizarUbicacion(
    id: string,
    latitud: number,
    longitud: number
) {

    const { error } = await supabase
        .from("repartidores")
        .update({
            latitud,
            longitud,
            updated_at: new Date(),
        })
        .eq("id", id);

    if (error) {
        console.error(error);
    }
}

export async function obtenerRepartidores() {

    const { data, error } = await supabase
        .from("repartidores")
        .select("*");

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}