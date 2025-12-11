import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost/api_proyecto/public';

  constructor(private http: HttpClient) {}

  // -----------------------------
  // TOKEN PARA LAS PETICIONES
  // -----------------------------
  private getHeaders() {
    const token = localStorage.getItem('token') || '';

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // -----------------------------
  // OBTENER TICKET POR ID COMPRA
  // GET /tickets/compra/:id
  // -----------------------------
  obtenerPorCompra(idCompra: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/tickets/compra/${idCompra}`,
      this.getHeaders()
    );
  }

  // -----------------------------
  // DESCARGAR PDF DEL TICKET
  // GET /tickets/descargar/:numeroTicket
  // -----------------------------
  descargar(numeroTicket: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/tickets/descargar/${numeroTicket}`,
      {
        responseType: 'blob'
      }
    );
  }
}
