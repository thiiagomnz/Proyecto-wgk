import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../model/producto.model';

export interface ItemCarrito {
  id_detalle?: number;      // ID en la BD
  producto: Producto;
  talle: number;
  cantidad: number;
  precio_unitario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // ✔ URL de tu backend
  private apiUrl = 'http://localhost/api_proyecto/public/carrito';

  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ------------------------------------------
  // Headers con token
  // ------------------------------------------
  private getHeaders() {
    const token = localStorage.getItem('token') ?? '';

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ================================================================
  // OBTENER CARRITO DESDE EL BACKEND
  // ================================================================
  obtenerCarrito(): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(this.apiUrl, this.getHeaders());
  }

  cargarCarrito() {
    this.obtenerCarrito().subscribe({
      next: (items) => this.carritoSubject.next(items),
      error: () => this.carritoSubject.next([])
    });
  }

  setCarrito(items: ItemCarrito[]) {
    this.carritoSubject.next(items);
  }

  // ================================================================
  // AGREGAR AL CARRITO (con talle)
  // ================================================================
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
      tap((r: any) => {
        if (r?.carrito) this.carritoSubject.next(r.carrito);
      })
    );
  }

  // ================================================================
  // AUMENTAR / DISMINUIR CANTIDAD
  // ================================================================
  actualizarCantidad(idDetalleCarrito: number, cantidad: number): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/actualizar/${idDetalleCarrito}`,
      { cantidad },
      this.getHeaders()
    ).pipe(
      tap((r: any) => {
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

  // ================================================================
  // ELIMINAR UN ITEM DEL CARRITO
  // ================================================================
 eliminarProducto(idDetalleCarrito: number, talle?: number): Observable<any> {
  // Si tu API no acepta talle, puedes enviarlo como query
  const url = `${this.apiUrl}/eliminar/${idDetalleCarrito}?talle=${talle}`;

  return this.http.delete<any>(url, this.getHeaders()).pipe(
    tap((r: any) => {
      if (r?.carrito) this.carritoSubject.next(r.carrito);
    })
  );
}


  // ================================================================
  // VACIAR TODO EL CARRITO
  // ================================================================
  vaciarCarrito(): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/vaciar`,
      this.getHeaders()
    ).pipe(
      tap(() => this.carritoSubject.next([]))
    );
  }

  // ================================================================
  // TOTAL DEL CARRITO
  // ================================================================
  obtenerTotal(): number {
    const carrito = this.carritoSubject.value;
    return carrito.reduce(
      (total, item) => total + (item.precio_unitario ?? item.producto.precio) * item.cantidad,
      0
    );
  }
}
