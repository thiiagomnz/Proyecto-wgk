import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../model/producto.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritoSubject = new BehaviorSubject<{producto:Producto}[]>([])
  favorito$=this.favoritoSubject.asObservable()

    agregarAFavoritos(producto:Producto){
      const productos = this.favoritoSubject.getValue();
      const encontrado = productos.find(p => p.producto.id === producto.id)

      if (encontrado){
      encontrado
    }else{
      this.favoritoSubject.next ([...productos, {producto}])
    }
    }

    eliminarDeFavoritos(productoId: number){
      const productos = this.favoritoSubject.getValue().filter(p => p.producto.id !== productoId)
      this.favoritoSubject.next(productos)
    }

    vaciarCarrito(){
      this.favoritoSubject.next([])
    }
  constructor() { }
}
