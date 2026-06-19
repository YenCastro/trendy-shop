import { Navbar } from "./navbar.js";
import { Footer } from "./footer.js";
import { SidebarMenu } from "./sidebar.js";
import { CatalogoProductos } from "./catalogo.js";


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
