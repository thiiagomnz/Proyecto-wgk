import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../model/producto.model';

export interface ItemCarrito {
  id_detalle?: number;
  producto: Producto;
  talle: number;
  cantidad: number;
  precio_unitario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = 'http://localhost/api_proyecto/public/carrito';

  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  obtenerCarrito(): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(this.apiUrl, this.getHeaders()).pipe(
      tap((carrito) => this.carritoSubject.next(carrito))
    );
  }

  cargarCarrito() {
    this.obtenerCarrito().subscribe();
  }

  agregarAlCarrito(item: { producto: Producto; talle: number }): Observable<any> {
    const body = {
      id_producto: item.producto.id,
      talle: item.talle,
      cantidad: 1,
      precio_unitario: item.producto.precio
    };

    return this.http.post<any>(
      `${this.apiUrl}/agregar`,
      body,
      this.getHeaders()
    ).pipe(
      tap((r) => {
        if (r?.carrito) this.carritoSubject.next(r.carrito);
      })
    );
  }

  actualizarCantidad(idDetalle: number, cantidad: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/actualizar/${idDetalle}`,
      { cantidad },
      this.getHeaders()
    ).pipe(
      tap(r => {
        if (r?.carrito) this.carritoSubject.next(r.carrito);
      })
    );
  }

  aumentarCantidad(item: ItemCarrito) {
    return this.actualizarCantidad(item.id_detalle!, item.cantidad + 1);
  }

  disminuirCantidad(item: ItemCarrito) {
    if (item.cantidad <= 1) {
      return this.eliminarProducto(item.id_detalle!);
    }
    return this.actualizarCantidad(item.id_detalle!, item.cantidad - 1);
  }

  eliminarProducto(idDetalle: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/eliminar/${idDetalle}`,
      this.getHeaders()
    ).pipe(
      tap((r) => {
        if (r?.carrito) this.carritoSubject.next(r.carrito);
      })
    );
  }

  vaciarCarrito(): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/vaciar`,
      this.getHeaders()
    ).pipe(
      tap(() => this.carritoSubject.next([]))
    );
  }

  obtenerTotal(): number {
    const carrito = this.carritoSubject.value;
    return carrito.reduce(
      (t, item) =>
        t + (item.precio_unitario ?? item.producto.precio) * item.cantidad,
      0
    );
  }
}
