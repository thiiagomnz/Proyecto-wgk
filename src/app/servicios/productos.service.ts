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
  // OBTENER TODOS LOS PRODUCTOS
  // ============================================================
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ============================================================
  // CREAR PRODUCTO
  // ============================================================
  crearProducto(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.post(
      this.apiUrl,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  // ============================================================
  // ACTUALIZAR PRODUCTO
  // ============================================================
  actualizarProducto(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.post(
      `${this.apiUrl}/${id}?_method=PUT`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  // ============================================================
  // ELIMINAR PRODUCTO
  // ============================================================
  eliminarProducto(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
  }
}
