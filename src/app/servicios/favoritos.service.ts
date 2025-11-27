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

  // URL BASE de tu API
  private apiUrl = 'http://localhost/api_proyecto/public/favoritos';

  // Estado interno con BehaviorSubject
  private favoritoSubject = new BehaviorSubject<FavoritoItem[]>([]);
  favorito$ = this.favoritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------
  // Headers con token del usuario
  // ---------------------------------------------------------
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
  // GET /favoritos
  // =============================================================
  obtenerFavoritos(): Observable<any> {
    return this.http.get(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  // Cargar favoritos al iniciar la app
  cargarFavoritos() {
    this.obtenerFavoritos().subscribe({
      next: (items: any[]) => {
        this.favoritoSubject.next(items);
      },
      error: () => {
        this.favoritoSubject.next([]);
      }
    });
  }

  // =============================================================
  // AGREGAR FAVORITO
  // POST /favoritos/agregar
  // Body: { id_producto }
  // =============================================================
  agregarAFavoritos(producto: Producto): Observable<any> {
    const body = { id_producto: producto.id };

    return this.http.post(
      `${this.apiUrl}/agregar`,
      body,
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
  // ELIMINAR FAVORITO
  // DELETE /favoritos/eliminar/:idProducto
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
  // DELETE /favoritos/vaciar
  // (si tu backend no lo tiene, decímelo y lo creo)
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
