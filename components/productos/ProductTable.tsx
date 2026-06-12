"use client";

import { useState } from "react";

type Producto = {
    id: string;
    categoria: string;
    marca: string;
    talla: string;
    imagen_url: string;
    precio: number;
    color: string;
    detalles: string;
    stock: number;
    hora_entrada?: string;
    hora_salida?: string;
};

type Props = {
    productos: Producto[];
    onEdit: (producto: Producto) => void;
};

export default function ProductTable({
    productos,
    onEdit,
}: Props) {

    const [imagenGrande, setImagenGrande] =
        useState<string | null>(null);

    return (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

            <table className="w-full text-black">

                <thead>

                    <tr className="border-b">

                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Imagen</th>
                        <th className="p-3 text-left">Categoría</th>
                        <th className="p-3 text-left">Marca</th>
                        <th className="p-3 text-center">Talla</th>
                        <th className="p-3 text-left">Color</th>
                        <th className="p-3 text-center">Stock</th>
                        <th className="p-3 text-left">Precio</th>
                        <th className="p-3 text-left">Detalles</th>
                        <th className="p-3 text-left">Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {productos.map((p) => (

                        <tr
                            key={p.id}
                            className={`
                                bg-gray-100
                                border-b
                                transition
                                hover:bg-gray-300
                                ${
                                    p.stock === 0
                                        ? "opacity-20 grayscale"
                                        : ""
                                }
                            `}
                        >

                            <td className="p-3">
                                {p.id}
                            </td>

                            <td className="p-3">

                                <img
                                    src={
                                        p.imagen_url ||
                                        "/placeholder.jpg"
                                    }
                                    alt="Producto"
                                    onClick={() =>
                                        setImagenGrande(
                                            p.imagen_url ||
                                            "/placeholder.jpg"
                                        )
                                    }
                                    className="
                                        w-16
                                        h-16
                                        rounded-lg
                                        object-cover
                                        border
                                        cursor-pointer
                                        hover:scale-110
                                        transition
                                    "
                                />

                            </td>

                            <td className="p-3">
                                {p.categoria}
                            </td>

                            <td className="p-3">
                                {p.marca}
                            </td>

                            <td className="p-3 text-center">
                                {p.talla}
                            </td>

                            <td className="p-3">
                                {p.color}
                            </td>

                            <td className="p-3 text-center">

                                {p.stock === 0
                                    ? "AGOTADO"
                                    : p.stock}

                            </td>

                            <td className="p-3">

                                {new Intl.NumberFormat(
                                    "es-CO",
                                    {
                                        style: "currency",
                                        currency: "COP",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }
                                ).format(p.precio)}

                            </td>

                            <td className="p-3">
                                {p.detalles}
                            </td>

                            <td className="p-3">

                                <button
                                    onClick={() =>
                                        onEdit(p)
                                    }
                                    className="
                                        bg-blue-600
                                        text-white
                                        px-3
                                        py-1
                                        rounded
                                        hover:bg-blue-300
                                    "
                                >
                                    Editar
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {/* Visor de imagen */}

            {imagenGrande && (

                <div
                    onClick={() =>
                        setImagenGrande(null)
                    }
                    className="
                        fixed
                        inset-0
                        bg-black/80
                        flex
                        items-center
                        justify-center
                        z-50
                        p-4
                    "
                >

                    <img
                        src={imagenGrande}
                        alt="Vista previa"
                        className="
                            max-w-full
                            max-h-full
                            rounded-xl
                            shadow-2xl
                        "
                    />

                </div>

            )}

        </div>
    );
}