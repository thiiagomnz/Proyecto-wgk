import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, ItemCarrito } from '../../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  productosEnCarrito: ItemCarrito[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe((items) => {
      this.productosEnCarrito = items ?? [];
    });

    // Cargar desde la BD al entrar
    this.carritoService.cargarCarrito();
  }

  agregarCantidad(i: number) {
    this.carritoService.aumentarCantidad(this.productosEnCarrito[i]).subscribe();
  }

  quitarCantidad(i: number) {
    this.carritoService.disminuirCantidad(this.productosEnCarrito[i]).subscribe();
  }

  eliminarProducto(idDetalle: number) {
    this.carritoService.eliminarProducto(idDetalle).subscribe();
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito().subscribe();
  }

  calcularTotal(): number {
    return this.carritoService.obtenerTotal();
  }

  irAFormularioCompra() {
    this.router.navigate(['/compra']);
  }
}
