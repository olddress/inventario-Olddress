import StatsCard from "./statsCard";

type Props = {
    totalProductos: number;
    productosDisponibles: number;
    productosAgotados: number;
    valorInventario: number;
};

export default function DashboardCards({
    totalProductos,
    productosDisponibles,
    productosAgotados,
    valorInventario,
}: Props) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

            <StatsCard
                title="Productos"
                value={totalProductos.toString()}
            />

            <StatsCard
                title="Disponibles"
                value={productosDisponibles.toString()}
            />

            <StatsCard
                title="Agotados"
                value={productosAgotados.toString()}
            />

            <StatsCard
                title="Valor Inventario"
                value={
                    new Intl.NumberFormat(
                        "es-CO",
                        {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }
                    ).format(valorInventario)
                }
            />

        </div>
    );
}