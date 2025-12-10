import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../model/producto.model';

export interface FavoritoItem {
  id_producto: number;      // ID en BD
  producto: Producto;       // Producto completo
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private apiUrl = 'http://localhost/api_proyecto/public/favoritos';

  private favoritoSubject = new BehaviorSubject<FavoritoItem[]>([]);
  favorito$ = this.favoritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = (typeof localStorage !== 'undefined')
      ? localStorage.getItem('token') || ''
      : '';

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // =============================================================
  // OBTENER FAVORITOS DEL BACKEND
  // =============================================================
  obtenerFavoritos(): Observable<any> {
    return this.http.get(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  cargarFavoritos() {
    this.obtenerFavoritos().subscribe({
      next: (items: any[]) => {

        // 🚀 TIPADO EXPLÍCITO EN .map()
        const formateados: FavoritoItem[] = items.map((i: any) => ({
          id_producto: i.id_producto,
          producto: {
            id: i.id_producto,
            nombre: i.nombre,
            precio: Number(i.precio),
            marca: i.marca,
            imagen: i.imagen
              ? `http://localhost/api_proyecto/public/uploads/${i.imagen}`
              : '',
            tallesDisponibles: [],
            stock: 0,
            cantidad: 1,
            disponible: true
          }
        }));

        this.favoritoSubject.next(formateados);
      },
      error: () => this.favoritoSubject.next([])
    });
  }

  // =============================================================
  // AGREGAR A FAVORITOS
  // =============================================================
  agregarAFavoritos(producto: Producto): Observable<any> {
    const body = { id_producto: producto.id };

    return this.http.post(`${this.apiUrl}/agregar`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((response: any) => {
        if (response?.favoritos) {

          // 🚀 TIPADO EXPLÍCITO EN .map()
          const formateados: FavoritoItem[] = response.favoritos.map((i: any) => ({
            id_producto: i.id_producto,
            producto: {
              id: i.id_producto,
              nombre: i.nombre,
              precio: Number(i.precio),
              marca: i.marca,
              imagen: i.imagen
                ? `http://localhost/api_proyecto/public/uploads/${i.imagen}`
                : '',
              tallesDisponibles: [],
              stock: 0,
              cantidad: 1,
              disponible: true
            }
          }));

          this.favoritoSubject.next(formateados);
        }
      })
    );
  }

  // =============================================================
  // ELIMINAR FAVORITO
  // =============================================================
  eliminarDeFavoritos(idProducto: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/eliminar/${idProducto}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap((response: any) => {
        if (response?.favoritos) {
          this.favoritoSubject.next(response.favoritos);
        }
      })
    );
  }

  // =============================================================
  // VACIAR FAVORITOS
  // =============================================================
  vaciarFavoritos(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/vaciar`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        this.favoritoSubject.next([]);
      })
    );
  }
}
