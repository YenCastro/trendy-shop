export class SidebarMenu {
  constructor() {
    this.isInHtmlFolder = window.location.pathname.includes('/html/');
    this.basePath = this.isInHtmlFolder ? '../' : '';
    this.htmlPath = this.isInHtmlFolder ? '' : 'html/';
    this.sidebar = null;
    this.overlay = null;
    this.closeBtn = null;
  }

  getLink(page) {
    if (page === 'index.html') {
      return `${this.basePath}index.html`;
    }

    return `${this.htmlPath}${page}`;
  }

  getTemplate() {
    return `
      <aside class="sidebar" id="sidebar" aria-hidden="true">
        <div class="sidebar__header">
          <strong>🛒 Mi carrito</strong>
          <button id="closeSidebar" class="sidebar__close" type="button" aria-label="Cerrar menu"><i class="bi bi-x-lg"></i></button>
        </div>
<div class="sidebar__content">
  <div class="sidebar__items"></div>  
  <div class="sidebar__empty">
    <div class="sidebar__empty-icon"><i class="bi bi-bag-heart"></i></div>

    <h3>Tu carrito te está esperando</h3>

    <p>
      Explora nuestra colección y encuentra algo especial.
    </p>
  </div>
</div>
      </aside>
      <div class="overlay" id="overlay"></div>
    `;
  }



  ensureMarkup() {
    const hasSidebar = document.getElementById('sidebar');
    const hasOverlay = document.getElementById('overlay');

    if (!hasSidebar || !hasOverlay) {
      document.body.insertAdjacentHTML('afterbegin', this.getTemplate());
    }

    this.sidebar = document.getElementById('sidebar');
    this.overlay = document.getElementById('overlay');
    this.closeBtn = document.getElementById('closeSidebar');
    this.itemsContainer = document.querySelector('.sidebar__items');
    this.emptyState = document.querySelector(".sidebar__empty");
  }

  ensureStyles() {
    if (document.getElementById('sidebarMenuStyles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'sidebarMenuStyles';
    style.textContent = `
      .sidebar {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 30;
        width: min(320px, 82vw);
        height: 100vh;
        padding: 24px 20px;
        background:
          radial-gradient(circle at top left, rgba(233, 221, 207, 0.9), transparent 32%),
          linear-gradient(180deg, rgba(250, 249, 246, 0.98), rgba(245, 238, 229, 0.98));
        color: #1e1e1e;
        transform: translateX(105%);
        transition: transform 0.3s ease;
        border-left: 1px solid rgba(102, 102, 102, 0.35);
        box-shadow: 0 24px 50px rgba(209, 122, 91, 0.22);
      }

      .sidebar.is-open {
        transform: translateX(0);
      }

      .sidebar__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 14px;
        border-bottom: 1px solid rgba(209, 122, 91, 0.2);
      }

      .sidebar__content {
        display: grid;
        gap: 12px;
        margin-top: 20px;
      }

      .overlay {
        position: fixed;
        inset: 0;
        z-index: 20;
        background: rgba(102, 84, 73, 0.24);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }

      .overlay.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      @keyframes float {
        0% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-8px);
        }

        100% {
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(8px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
      }
          .sidebar__empty-icon {
            font-size: 3rem;
            text-align: center;
            animation: float 3s ease-in-out infinite;
            filter: drop-shadow(0 8px 16px rgba(209, 122, 91, 0.15));
    }
        .sidebar__empty {
          text-align: center;
          animation: fadeIn 0.4s ease;
    }

        .sidebar__empty h3 {
          margin-top: 1rem;
          font-size: 1.2rem;
          font-weight: 600;
    }
        .sidebar__empty p {
          opacity: 0.75;
          line-height: 1.6;
    }
        .sidebar__close{
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: all 0.25s ease;
    }
      .sidebar__close {
        font-size: 1.1rem;
        font-weight: 300;
    }
        .sidebar__close:hover {
          transform: rotate(90deg);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 6px 16px rgba(209, 122, 91, 0.15);
    }
    .sidebar__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 12px;
      background: rgba(255,255,255,0.7);
    }

      .sidebar__item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 10px;
      }

      .sidebar__item h4 {
        margin: 0;
        font-size: 0.9rem;
      }

      .sidebar__item p {
        margin: 4px 0 0;
        font-weight: 600;
        color: #e4764e;
      }
      .sidebar__info {
    flex: 1;
  }

  .sidebar__remove {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all .25s ease;
}

  .sidebar__remove:hover {
  transform: scale(1.1);
  color: #e4764e;
  background: white;
}
    `;

    document.head.appendChild(style);
  }

  render() {
    this.ensureMarkup();
    this.ensureStyles();

    if (!this.sidebar || !this.overlay || !this.closeBtn) {
      return;
    }

    this.init();
  }

  init() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    window.addEventListener('cart:open', () => this.open());
  }

  open() {
    this.renderCart();

    this.sidebar.classList.add('is-open');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.overlay.classList.add('is-active');
  }

renderCart() {
  const carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

  console.log(carrito);

  const emptyState =
    document.querySelector(".sidebar__empty");

  if (carrito.length === 0) {
    emptyState.style.display = "block";
    this.itemsContainer.innerHTML = "";
    return;
  }

  emptyState.style.display = "none";

    this.itemsContainer.innerHTML = carrito
    .map((producto) => `
      <div class="sidebar__item">
        <img
          src="${producto.thumbnail}"
          alt="${producto.title}"
        >

        <div class="sidebar__info">
          <h4>${producto.title}</h4>
          <p>$${producto.price}</p>
        </div>

        <button
          class="sidebar__remove"
          data-id="${producto.id}"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `)
    .join("");
    const botonesEliminar =
  document.querySelectorAll(".sidebar__remove");

botonesEliminar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const id = Number(boton.dataset.id);

    const nuevoCarrito = carrito.filter(
      (producto) => producto.id !== id
    );

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevoCarrito)
    );

    this.renderCart();
  });
});
}



  close() {
    this.sidebar.classList.remove('is-open');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.overlay.classList.remove('is-active');
  }
}