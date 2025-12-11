import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, ItemCarrito } from '../../servicios/carrito.service';

import Swal from 'sweetalert2';  // ⭐ SweetAlert2

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
    this.carritoService.carrito$.subscribe(items => {
      this.productosEnCarrito = items ?? [];
    });

    this.carritoService.cargarCarrito();
  }

  // ================================
  //  AGREGAR CANTIDAD
  // ================================
  agregarCantidad(i: number): void {
    this.carritoService.aumentarCantidad(this.productosEnCarrito[i]).subscribe({
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo aumentar la cantidad.',
          background: '#111',
          color: '#fff'
        });
      }
    });
  }

  // ================================
  //  QUITAR CANTIDAD
  // ================================
  quitarCantidad(i: number): void {
    this.carritoService.disminuirCantidad(this.productosEnCarrito[i]).subscribe({
      error: () => {
        Swal.fire({
          icon: 'warning',
          title: 'Cantidad mínima',
          text: 'No puedes reducir más la cantidad.',
          background: '#111',
          color: '#fff'
        });
      }
    });
  }

  // ================================
  //  ELIMINAR PRODUCTO
  // ================================
  eliminarProducto(idDetalle: number): void {

    Swal.fire({
      icon: 'warning',
      title: 'Eliminar producto',
      text: '¿Estás seguro de eliminar este producto del carrito?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#555'
    }).then(result => {

      if (result.isConfirmed) {
        this.carritoService.eliminarProducto(idDetalle).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Producto eliminado del carrito.',
              background: '#111',
              color: '#fff',
              confirmButtonColor: '#ff8c42'
            });
          }
        });
      }
    });
  }

  // ================================
  //  VACIAR CARRITO COMPLETO
  // ================================
  vaciarCarrito(): void {

    Swal.fire({
      icon: 'warning',
      title: 'Vaciar carrito',
      text: '¿Seguro deseas vaciar tu carrito completo?',
      showCancelButton: true,
      confirmButtonText: 'Vaciar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#555'
    }).then(res => {

      if (res.isConfirmed) {
        this.carritoService.vaciarCarrito().subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Carrito vacío',
              text: 'El carrito se vació correctamente.',
              background: '#111',
              color: '#fff',
              confirmButtonColor: '#ff8c42'
            });
          }
        });
      }

    });
  }

  // ================================
  //  TOTAL
  // ================================
  calcularTotal(): number {
    return this.carritoService.obtenerTotal();
  }

  // ================================
  //  PASAR A COMPRA
  // ================================
  irAFormularioCompra(): void {

    if (this.productosEnCarrito.length === 0) {

      Swal.fire({
        icon: 'info',
        title: 'Carrito vacío',
        text: 'No tienes productos para comprar.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#ff8c42'
      });

      return; // <- Correcto en una función void
    }

    Swal.fire({
      icon: 'question',
      title: '¿Deseas continuar?',
      text: 'Serás dirigido al formulario de compra.',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff8c42',
      cancelButtonColor: '#555'
    }).then(res => {
      if (res.isConfirmed) {
        this.router.navigate(['/compra']);
      }
    });
  }

}
