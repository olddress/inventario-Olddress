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

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error) {
            console.error("ERROR:", error);
            setLoading(false);
            return;
        }

        setProductos(data || []);
        setLoading(false);
    }

    console.log("ProductosPage renderizado");

    useEffect(() => {
        console.log("useEffect ejecutado");
        cargarProductos();
    }, []);

    async function guardarProducto(producto: any) {

        if (producto.id) {

            const { error } = await supabase
                .from("Productos")
                .update(producto)
                .eq("id", producto.id);

            if (error) {
                console.error("UPDATE ERROR:", error);
                return;
            }

        } else {

            const nuevoProducto = { ...producto };

            delete nuevoProducto.id;

            console.log("INSERTANDO:", nuevoProducto);

            const { data, error } = await supabase
                .from("Productos")
                .insert([nuevoProducto])
                .select();

            console.log("INSERT DATA:", data);
            console.log("INSERT ERROR:", error);

            if (error) {
                console.error("INSERT ERROR:", error);
                return;
            }
        }

        await cargarProductos();

        setShowModal(false);
        setProductoEditando(null);
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

        return palabras.every(
            palabra =>
                textoCompleto.includes(palabra)
        );
    });

    return (
        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar />

            <main className="flex-1 p-3 md:p-6 pb-24 md:pb-6 overflow-x-hidden">

            <Header
                search={search}
                onSearch={setSearch}
            />

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:justify-between
                    md:items-center
                    gap-4
                    mt-4
                    mb-6
                ">

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
                    <p className="text-black">
                        Cargando productos...
                    </p>
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