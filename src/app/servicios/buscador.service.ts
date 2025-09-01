import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  private busquedaSource = new BehaviorSubject<string>('');  // Texto buscado
  busqueda$ = this.busquedaSource.asObservable();           // Observable público

  setBusqueda(texto: string) {
    this.busquedaSource.next(texto);
  }
}
