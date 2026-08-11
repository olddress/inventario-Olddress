"use client";

import { useState, useEffect } from "react";

    type Props = {
    producto?: any;
    onClose: () => void;
    onSave: (producto: any, imagenes: File[], indicePrincipal: number) => Promise<void>
    };

    export default function ProductModal({
    producto,
    onClose,
    onSave,
    }: Props) {
    const [imagenes, setImagenes] = useState<File[]>([]);

    const [form, setForm] = useState({
        id: "",
        categoria: "",
        marca: "",
        talla: "",
        color: "",
        detalles: "",
        stock: "",
        precio: "",
        imagen_principal_url: "",
    });

    const [indicePrincipal, setIndicePrincipal] = useState(0);

    useEffect(() => {
        if (producto) {
        setForm({
            id: producto.id || "",
            categoria: producto.categoria || "",
            marca: producto.marca || "",
            talla: producto.talla || "",
            color: producto.color || "",
            detalles: producto.detalles || "",
            stock: producto.stock || 1,
            precio: producto.precio || 0,
            imagen_principal_url: producto.imagen_principal_url || "",
        });
        } else {
        setForm({
            id: "",
            categoria: "",
            marca: "",
            talla: "",
            color: "",
            detalles: "",
            stock: "",
            precio: "",
            imagen_principal_url: "",
        });
        }

        setImagenes([]);
    }, [producto]);

    async function guardar() {
        try {
        await onSave(
            {
            ...form,
            categoria: form.categoria
                .trim()
                .replaceAll("_", " ")
                .toLowerCase(),
            },
            imagenes,
            indicePrincipal
        );
        } catch (err) {
        console.error("Unexpected error:", err);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div
            className="
            bg-white
            p-4
            md:p-6
            rounded-xl
            w-[95%]
            md:w-125
            max-h-[90vh]
            overflow-y-auto
            "
        >
            <h2 className="text-2xl font-bold text-black mb-4">
            {producto ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <div className="space-y-3">
            <input
                placeholder="Categoría"
                className="w-full border p-2 rounded text-black"
                value={form.categoria}
                onChange={(e) =>
                setForm({ ...form, categoria: e.target.value })
                }
            />

            <input
                placeholder="Marca"
                className="w-full border p-2 rounded text-black"
                value={form.marca}
                onChange={(e) =>
                setForm({ ...form, marca: e.target.value })
                }
            />

            <input
                placeholder="Talla"
                className="w-full border p-2 rounded text-black"
                value={form.talla}
                onChange={(e) =>
                setForm({ ...form, talla: e.target.value })
                }
            />

            <input
                placeholder="Color"
                className="w-full border p-2 rounded text-black"
                value={form.color}
                onChange={(e) =>
                setForm({ ...form, color: e.target.value })
                }
            />

            <textarea
                placeholder="Detalles"
                className="w-full border p-2 rounded text-black"
                value={form.detalles}
                onChange={(e) =>
                setForm({ ...form, detalles: e.target.value })
                }
            />

            <input
                type="number"
                placeholder="Stock"
                className="w-full border p-2 rounded text-black"
                value={form.stock}
                onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
                }
            />

            <input
                placeholder="Precio"
                className="w-full border p-2 rounded text-black"
                value={form.precio}
                onChange={(e) =>
                setForm({ ...form, precio: e.target.value })
                }
            />

            <div>
                <label className="block text-black mb-2 font-medium">
                Imágenes del producto
                </label>

                <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files) {
                        setImagenes(Array.from(e.target.files));
                        setIndicePrincipal(0);
                    }
                    }}
                className="w-full border p-2 rounded text-black"
                />

                <p className="text-sm text-gray-500 mt-1">
                La primera imagen será la imagen principal del inventario.
                </p>
            </div>

            {imagenes.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                {imagenes.map((img, index) => (
                    <div
                        key={index}
                        className="relative cursor-pointer"
                        onClick={() => setIndicePrincipal(index)}
                    >
                        <img
                        src={URL.createObjectURL(img)}
                        className={`
                            w-full h-24 object-cover rounded-lg border-2
                            ${index === indicePrincipal ? "border-blue-600" : "border-gray-300"}
                        `}
                        />

                        {index === indicePrincipal && (
                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                            Principal
                        </span>
                        )}
                    </div>
                    ))}
                </div>
            )}
            </div>

            <div
            className="
                flex
                flex-col
                md:flex-row
                justify-end
                gap-3
                mt-6
            "
            >
            <button
                onClick={onClose}
                className="
                w-full
                md:w-auto
                px-4
                py-2
                border
                rounded
                text-black
                "
            >
                Cancelar
            </button>

            <button
                onClick={guardar}
                className="
                w-full
                md:w-auto
                px-4
                py-2
                bg-blue-600
                text-white
                rounded
                "
            >
                Guardar
            </button>
            </div>
        </div>
        </div>
    );
    }