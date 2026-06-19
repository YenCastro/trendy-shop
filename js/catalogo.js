export class CatalogoProductos {
  constructor(selectorContenedor) {
    this.contenedor = document.querySelector(selectorContenedor);

    this.estado = document.querySelector("#catalogoEstado");
    this.botonAnterior = document.querySelector("#paginaAnterior");
    this.botonSiguiente = document.querySelector("#paginaSiguiente");
    this.indicadorPagina = document.querySelector("#paginaActual");

    this.productos = [];
    this.productosFiltrados = [];
    this.listenersAttached = false;

    this.paginaActual = 1;
    this.productosPorPagina = 9;
    this.filtroActual = new URLSearchParams(window.location.search).get("categoria") || "todos";

    this.categorias = {
      "ropa-hombre": [
        "mens-shirts"
      ],

      "ropa-mujer": [
        "tops",
        "womens-dresses"
      ],

      "zapatos-hombre": [
        "mens-shoes"
      ],

      "zapatos-mujer": [
        "womens-shoes"
      ],

      accesorios: [
        "womens-bags",
        "womens-jewellery",
        "mens-watches",
        "womens-watches",
        "sunglasses"
      ]
    };

    this.nombresCategorias = {
      "mens-shirts": "Ropa hombre",
      "tops": "Ropa mujer",
      "womens-dresses": "Vestidos",
      "mens-shoes": "Zapatos hombre",
      "womens-shoes": "Zapatos mujer",
      "womens-bags": "Bolsos",
      "womens-jewellery": "Joyería",
      "mens-watches": "Relojes hombre",
      "womens-watches": "Relojes mujer",
      "sunglasses": "Gafas"
    };
  }

  async obtenerProductosPorCategoria(categoria) {
    try {
      const respuesta = await fetch(`https://dummyjson.com/products/category/${categoria}`);

      if (!respuesta.ok) {
        throw new Error("Error al obtener productos");
      }

      const data = await respuesta.json();

      return data.products;

    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  }

  async cargarProductos() {
    this.estado.textContent = "Cargando productos...";

    const todasLasCategorias = [
      ...this.categorias["ropa-hombre"],
      ...this.categorias["ropa-mujer"],
      ...this.categorias["zapatos-hombre"],
      ...this.categorias["zapatos-mujer"],
      ...this.categorias.accesorios
    ];

    const peticiones = todasLasCategorias.map(categoria => {
      return this.obtenerProductosPorCategoria(categoria);
    });

    const respuestas = await Promise.all(peticiones);

      this.productos = this.deduplicateById(respuestas.flat());

      this.productosFiltrados = [...this.productos];

      this.paginaActual = 1;
      this.configurarPaginacion();
      this.filtrarProductos(this.filtroActual);
  }

  filtrarProductos(tipoFiltro) {
    this.paginaActual = 1;
    this.filtroActual = tipoFiltro;

    if (tipoFiltro === "todos") {
      this.productosFiltrados = [...this.productos];
      this.renderizarPagina();
      return;
    }

    const categoriasPermitidas = this.categorias[tipoFiltro];

    if (!categoriasPermitidas) {
      console.error("Filtro no válido:", tipoFiltro);
      return;
    }

    this.productosFiltrados = this.productos.filter(producto => {
      return categoriasPermitidas.includes(producto.category);
    });

    this.renderizarPagina();
  }

  renderizarPagina() {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;

    const productosPagina = this.productosFiltrados.slice(inicio, fin);

    if (productosPagina.length === 0) {
      this.contenedor.innerHTML = `
        <p>No hay productos para mostrar.</p>
      `;

      this.estado.textContent = "No hay productos disponibles.";
      this.actualizarPaginacion();
      return;
    }

    this.contenedor.innerHTML = productosPagina
      .map((producto) => this.getCardTemplate(producto))
      .join("");

    this.estado.textContent = `Mostrando ${productosPagina.length} productos de ${this.productosFiltrados.length}.`;

    this.actualizarPaginacion();
    this.attachCartEvents();
  }
  attachCartEvents() {
    const botones = document.querySelectorAll(".add-to-cart");

    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        const id = Number(boton.dataset.id);

        const producto = this.productos.find(
          (item) => item.id === id
);

        const carrito =
          JSON.parse(localStorage.getItem("carrito")) || [];

        carrito.push({
          id: producto.id,
          title: producto.title,
          price: producto.price,
          thumbnail: producto.thumbnail,
          quantity: 1
        });

        localStorage.setItem(
          "carrito",
          JSON.stringify(carrito)
        );

        console.log("Producto agregado");
            });
          });
}

  getCardTemplate(producto) {
    const categoriaMostrar = this.getCategoriaMostrar(producto.category);

    return `
      <article class="pricing-lab__card">
        <img 
          src="${producto.thumbnail}" 
          class="card-img-top imagen-producto pricing-lab__imagen" 
          alt="${producto.title}"
        >

        <div class="pricing-lab__cuerpo">
          <span class="pricing-lab__badge">
            ${categoriaMostrar}
          </span>

          <h4>${producto.title}</h4>

          <p>
            ${this.truncate(producto.description, 120)}
          </p>

          <p class="pricing-lab__meta">
            <strong>Categoría:</strong> ${categoriaMostrar}
          </p>

          <p class="pricing-lab__meta">
            <strong>Precio:</strong> $${producto.price}
          </p>

          <p class="pricing-lab__meta">
            <strong>Stock:</strong> ${producto.stock}
          </p>

          <button type="button" 
          class="primary-button add-to-cart"
          data-id="${producto.id}"
          >
            Agregar al carrito
          </button>
        </div>
      </article>
    `;
  }

  configurarPaginacion() {
    if (this.listenersAttached) {
      return;
    }

    this.botonAnterior.addEventListener("click", () => {
      if (this.paginaActual > 1) {
        this.paginaActual--;
        this.renderizarPagina();
      }
    });

    this.botonSiguiente.addEventListener("click", () => {
      if (this.paginaActual < this.getTotalPaginas()) {
        this.paginaActual++;
        this.renderizarPagina();
      }
    });

    this.listenersAttached = true;
  }

  actualizarPaginacion() {
    this.indicadorPagina.textContent = `Página ${this.paginaActual} de ${this.getTotalPaginas()}`;

    this.botonAnterior.disabled = this.paginaActual === 1;
    this.botonSiguiente.disabled = this.paginaActual >= this.getTotalPaginas();
  }

  getTotalPaginas() {
    return Math.max(1, Math.ceil(this.productosFiltrados.length / this.productosPorPagina));
  }

  getCategoriaMostrar(categoria) {
    return this.nombresCategorias[categoria] || "Catálogo";
  }

  deduplicateById(productos) {
    const mapa = new Map();

    productos.forEach(producto => {
      if (!mapa.has(producto.id)) {
        mapa.set(producto.id, producto);
      }
    });

    return Array.from(mapa.values());
  }

  truncate(texto, maxLength) {
    if (!texto || texto.length <= maxLength) {
      return texto || "";
    }

    return `${texto.slice(0, maxLength).trim()}...`;
  }
}
