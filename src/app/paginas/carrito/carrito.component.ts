import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../model/producto.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  // Lista de productos en el carrito (producto + talle + cantidad)
  productosEnCarrito: { producto: Producto; talle: number; cantidad: number }[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  // Se ejecuta al cargar el componente
  ngOnInit(): void {
    // Nos suscribimos al observable del carrito para mantener los datos actualizados
    this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos || [];
    });
  }

  // Incrementa la cantidad de un producto
  agregarCantidad(index: number): void {
    this.productosEnCarrito[index].cantidad++;
  }

  // Disminuye la cantidad sin dejar bajar de 1
  quitarCantidad(index: number): void {
    if (this.productosEnCarrito[index].cantidad > 1) {
      this.productosEnCarrito[index].cantidad--;
    }
  }

  // Elimina un producto completo del carrito según su id y talle
eliminarProducto(productoId: number, talle: number) {
  this.carritoService.eliminarProducto(productoId, talle).subscribe({
    next: () => {
      console.log(`Producto con talle ${talle} eliminado`);
    },
    error: err => console.error(err)
  });
}

  // Vacía completamente el carrito
  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
  }

  // Navega al formulario de compra
  irAFormularioCompra(): void {
    this.router.navigate(['/compra']);
  }

  // Calcula el total sumando precio*cantidad de cada ítem
  calcularTotal(): number {
    return this.productosEnCarrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }
}
