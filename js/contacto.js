export class ContactoForm {
  constructor(selector) {
    this.form = document.querySelector(selector);
  }

  init() {
    if (!this.form) {
      return;
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.limpiarErrores();

      const nombre = document.getElementById("contactName")?.value.trim() || "";
      const apellido = document.getElementById("contactLastName")?.value.trim() || "";
      const correo = document.getElementById("contactEmail")?.value.trim() || "";
      const telefono = document.getElementById("contactPhone")?.value.trim() || "";
      const mensaje = document.getElementById("contactMessage")?.value.trim() || "";

      let valido = true;

      if (nombre.length < 3) {
        this.mostrarError("contactName", "El nombre debe tener minimo 3 caracteres");
        valido = false;
      }

      if (apellido.length < 3) {
        this.mostrarError("contactLastName", "El apellido debe tener minimo 3 caracteres");
        valido = false;
      }

      if (!correo.includes("@")) {
        this.mostrarError("contactEmail", "Correo no valido");
        valido = false;
      }

      if (telefono.length < 7) {
        this.mostrarError("contactPhone", "Telefono no valido");
        valido = false;
      }

      if (mensaje.length < 10) {
        this.mostrarError("contactMessage", "El mensaje debe tener minimo 10 caracteres");
        valido = false;
      }

      if (valido) {
        window.alert("Formulario enviado correctamente");
        this.form.reset();
      }
    });
  }

  mostrarError(campo, mensaje) {
    const nodo = document.querySelector(`[data-error="${campo}"]`);
    if (nodo) {
      nodo.textContent = mensaje;
    }
  }

  limpiarErrores() {
    this.form.querySelectorAll(".field-error").forEach((campo) => {
      campo.textContent = "";
    });
  }
}
