import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  // URL REAL para productos
  private apiURL = 'http://localhost/api_proyecto/public/products';

  constructor(private http: HttpClient) {}

  // ============================================================
  // HEADERS
  // ============================================================
  private getHeaders(json: boolean = true): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    let headers: any = {
      'authorization': `Bearer ${token}`
    };

    // solo agregamos JSON cuando NO usamos FormData
    if (json) {
      headers['Content-Type'] = 'application/json';
    }

    return new HttpHeaders(headers);
  }

  // ============================================================
  // 1) OBTENER TODOS LOS PRODUCTOS (GET)
  // ============================================================
  obtenerProductos() {
    return this.http.get(this.apiURL);
  }

  // ============================================================
  // 2) CREAR PRODUCTO (POST con FormData)
  // ============================================================
  crearProducto(formData: FormData) {
    return this.http.post(
      this.apiURL,
      formData,
      { headers: this.getHeaders(false) }   // sin JSON
    );
  }

  // ============================================================
  // 3) ACTUALIZAR PRODUCTO (PUT usando _method=PUT)
  // ============================================================
  actualizarProducto(id: number, formData: FormData) {
    return this.http.post(
      `${this.apiURL}/${id}?_method=PUT`,
      formData,
      { headers: this.getHeaders(false) }
    );
  }

  // ============================================================
  // 4) ELIMINAR PRODUCTO (DELETE)
  // ============================================================
  eliminarProducto(id: number) {
    return this.http.delete(
      `${this.apiURL}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
