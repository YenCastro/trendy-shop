export class Navbar {
  constructor() {
    this.isInHtmlFolder = window.location.pathname.includes('/html/');
    this.basePath = this.isInHtmlFolder ? '../' : '';
    this.htmlPath = this.isInHtmlFolder ? '' : 'html/';
    this.currentPage = window.location.pathname.split('/').pop() || 'index.html';

    this.links = [
      { name: 'Inicio', href: `${this.basePath}index.html`, page: 'index.html' },
      { name: 'Catalogo', href: `${this.htmlPath}catalogo.html`, page: 'catalogo.html' },
      { name: 'Contacto', href: `${this.htmlPath}contacto.html`, page: 'contacto.html' },
      { name: 'Carrito', href: `${this.htmlPath}carrito.html`, page: 'carrito.html' },

    ];
  }

  getLinksHTML() {
    return this.links
      .map((link) => {
        const isActive = this.currentPage === link.page ? 'is-active' : '';
        return `<a class="nav-link ${isActive}" href="${link.href}">${link.name}</a>`;
      })
      .join('');
  }

  getTemplate() {
    return `
      <header class="glass-navbar">
        <a href="#inicio" class="brand">
          <span class="brand__mark">TS</span>
          <span class="brand__text">TrendyShop</span>
        </a>
        <nav class="navbar-links" aria-label="Navegacion principal">
          ${this.getLinksHTML()}
        </nav>
        <div class="navbar-actions">
          <button class="icon-button icon-button--label js-cart-trigger" type="button"><i class="bi bi-cart3"></i></button>
        
        </div>
      </header>
    `;
  }

  render() {
    document.body.insertAdjacentHTML('afterbegin', this.getTemplate());
    this.attachListeners();
  }

  attachListeners() {
    const renderedLinks = document.querySelectorAll('.glass-navbar .nav-link');
    renderedLinks.forEach((link) => {
      link.addEventListener('click', () => {
        renderedLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    });

    const cartTrigger = document.querySelector('.glass-navbar .js-cart-trigger');
    if (!cartTrigger) {
      return;
    }

    cartTrigger.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('cart:open'));
    });
  }
}
