import { calcularTotal } from "./carrito.js";

const contenedor = document.getElementById('contenedor-carrito');
const totalElemento = document.getElementById('total-compra');

export function renderizarCarrito(listaCarrito) {
    if (!contenedor || !totalElemento) {
        return;
    }

    contenedor.innerHTML = ``;

    if (listaCarrito.length === 0) {
        contenedor.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <div class="d-flex flex-column align-items-center justify-content-center my-4">
                    <div class="mb-3 p-4 bg-light rounded-circle shadow-sm" style="width: 80px; height: 80px; display: grid; place-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#d17a5b" class="bi bi-bag" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                        </svg>
                    </div>
                    <h5 class="fw-bold m-0 text-dark" style="font-family: var(--font-heading);">Tu carrito está vacío</h5>
                    <p class="text-muted small mt-1">Agrega productos para verlos aquí.</p>
                </div>
            </td>
        </tr>
        `;
        totalElemento.textContent = `$0`;
        return;
    }

    listaCarrito.forEach(item => {
        const imagen = item.imagen ?? item.thumbnail ?? "";
        const nombre = item.nombre ?? item.title ?? "Producto";
        const precio = item.precio ?? item.price ?? 0;
        const cantidad = item.cantidad ?? item.quantity ?? 1;

        const fila = document.createElement(`tr`);
    
        fila.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img src="${imagen}" alt="${nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <span class="fw-medium">${nombre}</span>
                </div>
            </td>
            <td>$${precio.toLocaleString()}</td>
            <td class="text-center">${cantidad}</td>
            <td class="fw-bold">$${(precio * cantidad).toLocaleString()}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}" style="border-radius: 999px;">
                    Eliminar
                </button>
            </td>
        `;
        contenedor.appendChild(fila);
    });
    totalElemento.textContent = `$${calcularTotal().toLocaleString()}`;
}
