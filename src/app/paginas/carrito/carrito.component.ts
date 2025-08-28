import { Component, OnInit } from '@angular/core';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../servicios/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  productosEnCarrito: { producto: Producto; talle: number; cantidad: number }[] = [];

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos;
    });
  }

  agregarCantidad(index: number) {
    this.productosEnCarrito[index].cantidad++;
  }

  quitarCantidad(index: number) {
    if (this.productosEnCarrito[index].cantidad > 1) {
      this.productosEnCarrito[index].cantidad--;
    }
  }

  eliminarProducto(productoId: number, talle: number) {
    this.carritoService.eliminarDelCarrito(productoId, talle);
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }

  irAFormularioCompra() {
    this.router.navigate(['/compra']);
  }

  calcularTotal(): number {
    return this.productosEnCarrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }
}
