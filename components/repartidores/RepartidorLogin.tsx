"use client";

import { useState } from "react";
import { crearRepartidor } from "../../lib/repartidores";

type Props = {
    onLogin: (id: string) => void;
};

export default function RepartidorLogin({
    onLogin,
}: Props) {

    const [nombre, setNombre] =
        useState("");

    async function handleSubmit() {

        if (!nombre.trim()) return;

        const id =
            await crearRepartidor(nombre);

        if (!id) return;

        localStorage.setItem(
            "repartidorId",
            id
        );

        localStorage.setItem(
            "repartidorNombre",
            nombre
        );

        onLogin(id);

    }

    return (

        <div
            className="
                max-w-md
                mx-auto
                bg-white
                p-6
                rounded-xl
                shadow
            "
        >

            <h2
                className="
                    text-2xl
                    font-bold
                    text-black
                    mb-4
                "
            >
                ¿Cómo te llamas?
            </h2>

            <input
                type="text"
                value={nombre}
                onChange={(e) =>
                    setNombre(
                        e.target.value
                    )
                }
                placeholder="Nombre del repartidor"
                className="
                    w-full
                    border
                    rounded-lg
                    p-3
                    text-black
                    mb-4
                "
            />

            <button
                onClick={handleSubmit}
                className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-3
                    rounded-lg
                "
            >
                Continuar
            </button>

        </div>

    );

}