import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../model/producto.model';

export interface ItemCarrito {
  producto: Producto;
  talle: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: ItemCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>(this.carrito);
  carrito$ = this.carritoSubject.asObservable();

  // Agregar producto + talle al carrito
  agregarAlCarrito(item: { producto: Producto; talle: number }) {
    const index = this.carrito.findIndex(
      p => p.producto.id === item.producto.id && p.talle === item.talle
    );

    if (index > -1) {
      this.carrito[index].cantidad++;
    } else {
      this.carrito.push({ ...item, cantidad: 1 });
    }

    this.actualizarCarrito();
  }

  // Aumentar cantidad
  aumentarCantidad(productoId: number, talle: number) {
    const index = this.carrito.findIndex(
      p => p.producto.id === productoId && p.talle === talle
    );
    if (index > -1) {
      this.carrito[index].cantidad++;
      this.actualizarCarrito();
    }
  }

  // Disminuir cantidad
  disminuirCantidad(productoId: number, talle: number) {
    const index = this.carrito.findIndex(
      p => p.producto.id === productoId && p.talle === talle
    );
    if (index > -1 && this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
    } else {
      this.eliminarDelCarrito(productoId, talle);
      return;
    }
    this.actualizarCarrito();
  }

  // Eliminar producto + talle específico
  eliminarDelCarrito(productoId: number, talle: number) {
    this.carrito = this.carrito.filter(
      p => !(p.producto.id === productoId && p.talle === talle)
    );
    this.actualizarCarrito();
  }

  // Vaciar carrito
  vaciarCarrito() {
    this.carrito = [];
    this.actualizarCarrito();
  }

  // Obtener subtotal de todos los productos
  obtenerTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }

  // Obtener copia de productos en el carrito
  obtenerProductos(): ItemCarrito[] {
    return [...this.carrito];
  }

  // 🔹 Mantener subject actualizado
  private actualizarCarrito() {
    this.carritoSubject.next([...this.carrito]);
  }
}
