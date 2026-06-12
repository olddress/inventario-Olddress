"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
    producto?: any;
    onClose: () => void;
    onSave: (producto: any) => Promise<void>;
};

export default function ProductModal({
    producto,
    onClose,
    onSave,
}: Props) {

    const [imagen, setImagen] = useState<File | null>(null);

    const [form, setForm] = useState({
        id: "",
        categoria: "",
        marca: "",
        talla: "",
        color: "",
        detalles: "",
        stock: "",
        precio: "",
        imagen_url: "",
    });

    // ✅ Reset correcto cuando cambia producto
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
                imagen_url: producto.imagen_url || "",
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
                imagen_url: "",
            });
        }

        setImagen(null);
    }, [producto]);

    async function guardar() {
        try {
            let imagenUrl = form.imagen_url;

            if (imagen) {
                const nombreArchivo = `${Date.now()}-${imagen.name}`;

                const { error: uploadError } = await supabase
                    .storage
                    .from("Productos")
                    .upload(nombreArchivo, imagen);

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    return;
                }

                const { data } = supabase
                    .storage
                    .from("Productos")
                    .getPublicUrl(nombreArchivo);

                imagenUrl = data.publicUrl;
            }

            await onSave({
                ...form,
                categoria: form.categoria
                    .trim()
                    .replaceAll("_", " ")
                    .toLowerCase(),
                imagen_url: imagenUrl,
            });

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
                            setForm({ ...form, stock:(e.target.value) })
                        }
                    />

                    <input
                        placeholder="Precio"
                        className="w-full border p-2 rounded text-black"
                        value={form.precio}
                        onChange={(e) =>
                            setForm({ ...form, precio:(e.target.value) })
                        }
                    />

                    <div>
                        <label className="block text-black mb-1">
                            Imagen
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImagen(e.target.files?.[0] || null)
                            }
                            className="w-full border p-2 rounded text-black"
                        />
                    </div>

                </div>

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        justify-end
                        gap-3
                        mt-5
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