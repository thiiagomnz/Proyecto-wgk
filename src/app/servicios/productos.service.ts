import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost/api_proyecto/public/products';

  constructor(private http: HttpClient) {}

  // ============================================================
  // ✔ OBTENER TODOS LOS PRODUCTOS
  // ============================================================
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ============================================================
  // ✔ OBTENER PRODUCTO POR ID
  // ============================================================
  obtenerProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ============================================================
  // ✔ CREAR PRODUCTO
  // ============================================================
  crearProducto(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.post(this.apiUrl, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  // ============================================================
  // ✔ ACTUALIZAR PRODUCTO
  // ============================================================
  actualizarProducto(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';

    formData.append('_method', 'PUT');

    return this.http.post(`${this.apiUrl}/${id}`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  // ============================================================
  // ⭐ NUEVO MÉTODO: TOGGLE NOVEDAD
  // ============================================================
  toggleNovedad(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.put(
      `${this.apiUrl}/toggle-novedad/${id}`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  // ============================================================
  // ✔ ELIMINAR PRODUCTO
  // ============================================================
  eliminarProducto(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }
}
