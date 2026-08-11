"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/header";
import ProductTable from "../../components/productos/ProductTable";
import ProductModal from "../../components/productos/ProductModal";
import MobileNavbar from "../../components/layout/MobileNavbar";

import { supabase } from "../../lib/supabase";

export default function ProductosPage() {
    const [showModal, setShowModal] = useState(false);
    const [productos, setProductos] = useState<any[]>([]);
    const [productoEditando, setProductoEditando] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function cargarProductos() {
        setLoading(true);

        const { data, error } = await supabase
        .from("Productos")
        .select("*")
        .order("id", { ascending: true });

        if (error) {
        console.error(error);
        setLoading(false);
        return;
        }

        setProductos(data || []);
        setLoading(false);
    }

    useEffect(() => {
        cargarProductos();
    }, []);

    async function guardarProducto(producto: any, imagenes: File[]) {
        try {
        if (producto.id) {
            // Edición del producto (por ahora no cambia la galería)
            const { error } = await supabase
            .from("Productos")
            .update({
                categoria: producto.categoria,
                marca: producto.marca,
                talla: producto.talla,
                color: producto.color,
                detalles: producto.detalles,
                stock: Number(producto.stock),
                precio: Number(producto.precio),
            })
            .eq("id", producto.id);

            if (error) throw error;
        } else {
            // Crear producto nuevo
            const { data: nuevoProducto, error } = await supabase
            .from("Productos")
            .insert([
                {
                categoria: producto.categoria,
                marca: producto.marca,
                talla: producto.talla,
                color: producto.color,
                detalles: producto.detalles,
                stock: Number(producto.stock),
                precio: Number(producto.precio),
                },
            ])
            .select()
            .single();

            if (error) throw error;

            const productoId = nuevoProducto.id;
            let imagenPrincipal = "";

            for (let i = 0; i < imagenes.length; i++) {
            const archivo = imagenes[i];

            const nombreArchivo = `${productoId}/${Date.now()}_${i}_${archivo.name}`;

            const { error: uploadError } = await supabase.storage
                .from("Productos")
                .upload(nombreArchivo, archivo);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("Productos")
                .getPublicUrl(nombreArchivo);

            const url = urlData.publicUrl;

            if (i === 0) {
                imagenPrincipal = url;
            }

            const { error: imgError } = await supabase
                .from("ProductoImagenes")
                .insert({
                producto_id: productoId,
                imagen_url: url,
                orden: i,
                });

            if (imgError) throw imgError;
            }

            if (imagenPrincipal) {
            const { error: principalError } = await supabase
                .from("Productos")
                .update({ imagen_principal_url: imagenPrincipal })
                .eq("id", productoId);

            if (principalError) throw principalError;
            }
        }

        await cargarProductos();

        setShowModal(false);
        setProductoEditando(null);
        } catch (err) {
        console.error("Error guardando producto:", err);
        }
    }

    const productosFiltrados = productos.filter((producto) => {
        const textoCompleto = `
        ${producto.id ?? ""}
        ${producto.categoria ?? ""}
        ${producto.marca ?? ""}
        ${producto.color ?? ""}
        ${producto.talla ?? ""}
        ${producto.detalles ?? ""}
        `.toLowerCase();

        const palabras = search
        .toLowerCase()
        .trim()
        .split(" ")
        .filter(Boolean);

        return palabras.every((palabra) => textoCompleto.includes(palabra));
    });

    return (
        <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />

        <main className="flex-1 p-3 md:p-6 pb-24 md:pb-6 overflow-x-hidden">
            <Header search={search} onSearch={setSearch} />

            <div
            className="
                flex
                flex-col
                md:flex-row
                md:justify-between
                md:items-center
                gap-4
                mt-4
                mb-6
            "
            >
            <h1 className="text-2xl md:text-3xl font-bold text-black">
                Productos
            </h1>

            <button
                onClick={() => {
                setProductoEditando(null);
                setShowModal(true);
                }}
                className="
                w-full
                md:w-auto
                bg-blue-600
                text-white
                px-4
                py-3
                rounded-lg
                "
            >
                + Nuevo Producto
            </button>
            </div>

            {loading ? (
            <p className="text-black">Cargando productos...</p>
            ) : (
            <div className="overflow-x-auto">
                <ProductTable
                productos={productosFiltrados}
                onEdit={(producto) => {
                    setProductoEditando(producto);
                    setShowModal(true);
                }}
                />
            </div>
            )}

            {showModal && (
            <ProductModal
                producto={productoEditando}
                onClose={() => {
                setShowModal(false);
                setProductoEditando(null);
                }}
                onSave={guardarProducto}
            />
            )}
        </main>

        <MobileNavbar />
        </div>
    );
    }