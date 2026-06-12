"use client";

import { useState } from "react";
import Link from "next/link";

import SettingsModal from "../settings/SettingsModal";

export default function MobileNavbar() {

    const [showSettings, setShowSettings] =
        useState(false);

    return (
        <>
            <nav
                className="
                    md:hidden
                    fixed
                    bottom-0
                    left-0
                    right-0
                    bg-slate-900
                    text-white
                    flex
                    justify-around
                    items-center
                    h-16
                    z-50
                "
            >
                <Link href="/">📊</Link>

                <Link href="/productos">📦</Link>

                <Link href="/ventas">🛒</Link>

                <Link href="/clientes">👥</Link>

                <Link href="/repartidores">🚚</Link>

                <Link href="/finanzas">💰</Link>

                <Link href="/reportes">📈</Link>

                <button
                    onClick={() =>
                        setShowSettings(true)
                    }
                >
                    ⚙️
                </button>

            </nav>

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