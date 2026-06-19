import { carrito } from "./carrito.js";
import { renderizarCarrito } from "./ui.js";

export function initCarritoPage() {
  document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito(carrito);
    configurarEventosCarrito();
  });
}

function configurarEventosCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  const btnVaciar = document.getElementById("btn-vaciar");

  if (contenedor) {
    contenedor.addEventListener("click", (event) => {
      const botonEliminar = event.target.closest(".btn-eliminar");

      if (!botonEliminar) {
        return;
      }

      const idProducto = Number(botonEliminar.getAttribute("data-id"));
      eliminarProductoLogica(idProducto);
    });
  }

  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (window.confirm("¿Deseas vaciar el carrito?")) {
        carrito.length = 0;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito(carrito);
      }
    });
  }
}

function eliminarProductoLogica(id) {
  const indice = carrito.findIndex((item) => item.id === id);

  if (indice !== -1) {
    carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito(carrito);
  }
}
