import { Navbar } from "./navbar.js";
import { Footer } from "./footer.js";
import { SidebarMenu } from "./sidebar.js";
import { ContactoForm } from "./contacto.js";
import { initCatalogoPage } from "./catalogo-page.js";
import { initCarritoPage } from "./carrito-page.js";

const navbar = new Navbar();
navbar.render();

const footer = new Footer();
footer.render();

const sideBarMenu = new SidebarMenu();
sideBarMenu.render();

const formularioContacto = new ContactoForm("#contactForm");
formularioContacto.init();

initCatalogoPage();
initCarritoPage();
