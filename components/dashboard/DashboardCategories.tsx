type Props = {
    categorias: Record<
        string,
        {
            cantidad: number;
            valor: number;
        }
    >;
};

export default function DashboardCategories({
    categorias,
}: Props) {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                    {/* Productos por categoría */}
                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-bold text-black mb-4">
                            Productos por Categoría
                        </h2>

                        <div className="overflow-x-auto">
                        <table className="w-full min-w-75">

                            <thead>

                                <tr className="border-b">

                                    <th className="text-left p-2 text-black">
                                        Categoría
                                    </th>

                                    <th className="text-right p-2 text-black">
                                        Cantidad
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {Object.entries(categorias)
                                    .map(
                                        ([categoria, datos]) => (
                                            <tr
                                                key={categoria}
                                                className="border-b"
                                            >

                                                <td className="p-2 text-black">
                                                    {categoria}
                                                </td>

                                                <td className="p-2 text-right text-black">
                                                    {datos.cantidad}
                                                </td>

                                            </tr>
                                        )
                                    )}

                            </tbody>

                            </table>
                        </div>

                    </div>

                    {/* Valor por categoría */}
                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-bold text-black mb-4">
                            Valor por Categoría
                        </h2>

                        <table className="w-full">

                            <thead>

                                <tr className="border-b">

                                    <th className="text-left p-2 text-black">
                                        Categoría
                                    </th>

                                    <th className="text-right p-2 text-black">
                                        Valor
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {Object.entries(categorias)
                                    .map(
                                        ([categoria, datos]) => (
                                            <tr
                                                key={categoria}
                                                className="border-b"
                                            >

                                                <td className="p-2 text-black">
                                                    {categoria}
                                                </td>

                                                <td className="p-2 text-right text-black">
                                                    {
                                                        new Intl.NumberFormat(
                                                            "es-CO",
                                                            {
                                                                style: "currency",
                                                                currency: "COP",
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0,
                                                            }
                                                        ).format(
                                                            datos.valor
                                                        )
                                                    }
                                                </td>

                                            </tr>
                                        )
                                    )}

                            </tbody>

                        </table>

                    </div>

        </div>
    );
}