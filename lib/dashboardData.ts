type Producto = {
    categoria: string;
    stock: number;
    precio: number;
};

export function procesarDashboard(
    productos: Producto[]
) {

    const totalProductos =
        productos.length;

    const productosDisponibles =
        productos.filter(
            p => p.stock > 0
        ).length;

    const productosAgotados =
        productos.filter(
            p => p.stock === 0
        ).length;

    const valorInventario =
        productos.reduce(
            (total, p) =>
                total + (p.precio * p.stock),
            0
        );

    const porcentajeDisponibles =
        totalProductos > 0
            ? (
                productosDisponibles /
                totalProductos
            ) * 100
            : 0;

    const porcentajeAgotados =
        totalProductos > 0
            ? (
                productosAgotados /
                totalProductos
            ) * 100
            : 0;

    const categorias: Record<
        string,
        {
            cantidad: number;
            valor: number;
        }
    > = {};

    productos.forEach((p) => {

        const categoria =
            (p.categoria || "Sin categoría")
                .trim()
                .replaceAll("_", " ")
                .toLowerCase();

        if (!categorias[categoria]) {

            categorias[categoria] = {
                cantidad: 0,
                valor: 0,
            };

        }

        categorias[categoria].cantidad += 1;

        categorias[categoria].valor +=
            p.precio * p.stock;

    });

    return {
        totalProductos,
        productosDisponibles,
        productosAgotados,
        valorInventario,
        porcentajeDisponibles,
        porcentajeAgotados,
        categorias,
    };
}