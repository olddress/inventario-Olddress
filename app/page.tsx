export const dynamic = "force-dynamic";

import Sidebar from "../components/layout/Sidebar";
import MobileNavbar from "../components/layout/MobileNavbar";

import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardInventory from "../components/dashboard/DashboardInventory";
import DashboardCategories from "../components/dashboard/DashboardCategories";

import { supabase } from "../lib/supabase";
import {procesarDashboard} from "../lib/dashboardData";

export default async function Home() {

    const { data: productos, error } =
        await supabase
            .from("Productos")
            .select("*");

    if (error) {
        console.error(error);
    }

    const {
        totalProductos,
        productosDisponibles,
        productosAgotados,
        valorInventario,
        porcentajeDisponibles,
        porcentajeAgotados,
        categorias,
    } = procesarDashboard(
        productos || []
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar />

            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">

                <h1 className="text-2xl md:text-3xl font-bold text-black mt-4 md:mt-6">
                    Dashboard
                </h1>

                <DashboardCards
                    totalProductos={totalProductos}
                    productosDisponibles={productosDisponibles}
                    productosAgotados={productosAgotados}
                    valorInventario={valorInventario}
                />

                <DashboardInventory
                    porcentajeDisponibles={porcentajeDisponibles}
                    porcentajeAgotados={porcentajeAgotados}
                />

                <DashboardCategories
                    categorias={categorias}
                />

            </main>

            <MobileNavbar />

        </div>
    );
}