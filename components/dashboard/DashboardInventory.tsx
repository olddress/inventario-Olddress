type Props = {
    porcentajeDisponibles: number;
    porcentajeAgotados: number;
};

export default function DashboardInventory({
    porcentajeDisponibles,
    porcentajeAgotados,
}: Props) {

    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mt-6 md:mt-8">

            <h2 className="text-xl font-bold text-black mb-4">
                Distribución del Inventario
            </h2>

            <div className="mb-4">

                <div className="flex justify-between mb-1">
                    <span className="text-black">
                        Disponibles
                    </span>

                    <span className="text-black">
                        {porcentajeDisponibles.toFixed(1)}%
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                            width:
                                `${porcentajeDisponibles}%`,
                        }}
                    />

                </div>

            </div>

            <div>

                <div className="flex justify-between mb-1">

                    <span className="text-black">
                        Agotados
                    </span>

                    <span className="text-black">
                        {porcentajeAgotados.toFixed(1)}%
                    </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                        className="bg-red-500 h-4 rounded-full"
                        style={{
                            width:
                                `${porcentajeAgotados}%`,
                        }}
                    />

                </div>

            </div>

        </div>
    );
}