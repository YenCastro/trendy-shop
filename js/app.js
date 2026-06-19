import { Navbar } from "./navbar.js";
import { Footer } from "./footer.js";
import { SidebarMenu } from "./sidebar.js";
import { CatalogoProductos } from "./catalogo.js";
import { carrito, calcularTotal } from './carrito.js';
import { renderizarCarrito } from './ui.js';

const navbar = new Navbar();
navbar.render();

const footer = new Footer();
footer.render();

const sideBarMenu = new SidebarMenu();
sideBarMenu.render();

const catalogo = new CatalogoProductos("#contenedor-productos");
catalogo.cargarProductos();


const botonesFiltro = document.querySelectorAll(".btn-filtro");

botonesFiltro.forEach(boton => {
  boton.addEventListener("click", () => {
    const filtro = boton.dataset.filtro;

    catalogo.filtrarProductos(filtro);

    botonesFiltro.forEach(btn => {
      btn.classList.remove("activo");
    });

    boton.classList.add("activo");
  });
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito(carrito);
    configurarEventosCarrito();
});
 function configurarEventosCarrito(){
    const contenedor = document.getElementById(`contenedor-carrito`);
    const btnVaciar = document.getElementById(`btn-vaciar`);
    const btnComprar = document.getElementById(`btn-comprar`);

    if(contenedor){
        contenedor.addEventListener(`click`, (e) => {
            if (e.target.classList.contains(`btn-eliminar`)){
                const idProducto = parseInt(e.target.getAttribute(`data-id`));
                eliminarProductoLogica(idProducto);
            }
        });
    }
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (confirm('¿Deseas vaciar el carrito?')) {
                carrito.length = 0;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderizarCarrito(carrito);
            }
        });
    }
}

function eliminarProductoLogica(id) {
    const indice = carrito.findIndex(item => item.id === id);
    if (indice !== -1) {
        carrito.splice(indice, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito(carrito); 
    }
}
 