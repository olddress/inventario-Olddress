"use client";

import dynamic from "next/dynamic";

import Sidebar from "../../components/layout/Sidebar";
import MobileNavbar from "../../components/layout/MobileNavbar";

const MapView = dynamic(
    () =>
        import(
            "../../components/repartidores/MapView"
        ),
    {
        ssr: false,
    }
);

export default function RepartidoresPage() {

    return (
        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar />

            <main className="flex-1 p-4 md:p-6 pb-20">

                <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">
                    Repartidores
                </h1>

                <MapView />

            </main>

            <MobileNavbar />

        </div>
    );
}