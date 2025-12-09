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
  // ✔ OBTENER SOLO 1 PRODUCTO POR ID
  // ============================================================
  obtenerProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ============================================================
  // ✔ CREAR PRODUCTO
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
actualizarProducto(id: number, formData: FormData): Observable<any> {
  const token = localStorage.getItem('token') || '';

  // 👉 AGREGAR _method DENTRO DEL FORMDATA (PHP LO LEE)
  formData.append('_method', 'PUT');

  return this.http.post(
    `${this.apiUrl}/${id}`,
    formData,
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
