"use client";

import { useState } from "react";
import Link from "next/link";
import SettingsModal from "../settings/SettingsModal";

export default function Sidebar() {

    const [showSettings, setShowSettings] =
        useState(false);

    const [collapsed, setCollapsed] =
        useState(true);

    return (

        <>
            <aside
                className={`
                    hidden md:flex
                    bg-slate-900
                    text-white
                    h-screen sticky top-0
                    p-4
                    flex-col
                    transition-all
                    duration-300
                    ${collapsed ? "w-20" : "w-64"}
                `}
            >

                {/* Encabezado */}
                <div
                    className={`
                        flex mb-8
                        ${
                            collapsed
                                ? "justify-center"
                                : "items-center justify-between"
                        }
                    `}
                >

                    {!collapsed && (
                        <h1 className="text-xl font-bold">
                            Inventario Pro
                        </h1>
                    )}

                    <button
                        onClick={() =>
                            setCollapsed(!collapsed)
                        }
                        className="
                            bg-slate-800
                            hover:bg-slate-700
                            px-2
                            py-1
                            rounded
                        "
                    >
                        {collapsed ? "▶" : "◀"}
                    </button>

                </div>

                {/* Menú */}
                <nav className="space-y-2">

                    <Link
                        href="/"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">📊</span>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>

                    <Link
                        href="/productos"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">📦</span>
                        {!collapsed && <span>Inventario</span>}
                    </Link>

                    <Link
                        href="/ventas"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">🛒</span>
                        {!collapsed && <span>Ventas</span>}
                    </Link>

                    <Link
                        href="/clientes"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">👥</span>
                        {!collapsed && <span>Clientes</span>}
                    </Link>

                    <Link
                        href="/repartidores"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">🚚</span>
                        {!collapsed && <span>Repartidores</span>}
                    </Link>

                    <Link
                        href="/finanzas"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">💰</span>
                        {!collapsed && <span>Finanzas</span>}
                    </Link>

                    <Link
                        href="/reportes"
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800"
                    >
                        <span className="text-2xl">📈</span>
                        {!collapsed && <span>Reportes</span>}
                    </Link>

                </nav>

                {/* Configuración */}
                <div className="mt-auto">

                    <button
                        onClick={() =>
                            setShowSettings(true)
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            p-2
                            rounded
                            hover:bg-slate-800
                            w-full
                            text-left
                        "
                    >
                        <span className="text-2xl">⚙️</span>

                        {!collapsed && (
                            <span>Configuración</span>
                        )}

                    </button>

                </div>

            </aside>

            {showSettings && (
                <SettingsModal
                    onClose={() =>
                        setShowSettings(false)
                    }
                />
            )}

        </>

    );

}