"use client";

import { useEffect, useState } from "react";

type Props = {
    onClose: () => void;
};

export default function SettingsModal({
    onClose,
}: Props) {

    const [theme, setTheme] =
        useState("light");

    useEffect(() => {

        const temaGuardado =
            localStorage.getItem("theme")
            || "light";

        setTheme(temaGuardado);

        document.documentElement.classList.remove(
            "light",
            "dark"
        );

        document.documentElement.classList.add(
            temaGuardado
        );

    }, []);

    function cambiarTema(
        nuevoTema: string
    ) {

        setTheme(nuevoTema);

        localStorage.setItem(
            "theme",
            nuevoTema
        );

        document.documentElement.classList.remove(
            "light",
            "dark"
        );

        document.documentElement.classList.add(
            nuevoTema
        );

    }

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/50
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                    bg-white
                    rounded-xl
                    p-6
                    w-[90%]
                    max-w-md
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
                    Configuración
                </h2>

                <div className="space-y-3">

                    <button
                        onClick={() =>
                            cambiarTema("light")
                        }
                        className={`
                            w-full
                            border
                            p-3
                            rounded-lg
                            text-black
                            ${
                                theme === "light"
                                    ? "bg-blue-100 border-blue-500"
                                    : ""
                            }
                        `}
                    >
                        ☀️ Tema Claro
                    </button>

                    <button
                        onClick={() =>
                            cambiarTema("dark")
                        }
                        className={`
                            w-full
                            border
                            p-3
                            rounded-lg
                            text-black
                            ${
                                theme === "dark"
                                    ? "bg-blue-100 border-blue-500"
                                    : ""
                            }
                        `}
                    >
                        🌙 Tema Oscuro
                    </button>

                </div>

                <button
                    onClick={onClose}
                    className="
                        mt-5
                        w-full
                        bg-red-500
                        text-white
                        py-2
                        rounded-lg
                    "
                >
                    Cerrar
                </button>

            </div>

        </div>

    );

}