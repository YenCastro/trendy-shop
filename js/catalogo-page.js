import { CatalogoProductos } from "./catalogo.js";

export function initCatalogoPage() {
  const contenedorCatalogo = document.querySelector("#contenedor-productos");

  if (!contenedorCatalogo) {
    return;
  }

  const catalogo = new CatalogoProductos("#contenedor-productos");
  catalogo.cargarProductos();

  const botonesFiltro = document.querySelectorAll(".btn-filtro");

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;

      catalogo.filtrarProductos(filtro);

      botonesFiltro.forEach((btn) => {
        btn.classList.remove("activo");
      });

      boton.classList.add("activo");
    });
  });
}
