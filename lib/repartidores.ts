import { supabase } from "./supabase";

export async function crearRepartidor(
    nombre: string
) {

    const id = crypto.randomUUID();

    const { error } =
        await supabase
            .from("repartidores")
            .insert({
                id,
                nombre,
            });

    if (error) {
        console.error(error);
        return null;
    }

    return id;

}

export async function actualizarUbicacion(
    id: string,
    latitud: number,
    longitud: number
) {

    const { error } =
        await supabase
            .from("repartidores")
            .update({
                latitud,
                longitud,
                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", id);

    if (error) {
        console.log(
            JSON.stringify(
                error,
                null,
                2
            )
        );
    }

}

export async function obtenerRepartidores() {

    const { data, error } =
        await supabase
            .from("repartidores")
            .select("*");

    if (error) {
        console.error(error);
        return [];
    }

    return data;

}