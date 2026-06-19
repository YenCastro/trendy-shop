export let carrito = JSON.parse(localStorage.getItem(`carrito`)) || [];

function guardarCarrito() {
    localStorage.setItem(`carrito`, JSON.stringify(carrito))
}

export function agregarProductoAlCarrito(producto){
    const existe = carrito.find(item => item.id === producto.id);

    if (existe){
        existe.cantidad += 1;
    }
    else {
     carrito.push({...producto, cantidad: 1 })   
    }

    guardarCarrito ();
}

export function calcularTotal(){
    return carrito.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);
}