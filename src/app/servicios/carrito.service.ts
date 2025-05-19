import { Injectable } from '@angular/core';
import { Producto } from '../model/producto.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<{producto:Producto; cantidad:number}[]>([])
  carrito$=this.carritoSubject.asObservable()

  agregarAlCarrito(producto:Producto){
    const productos = this.carritoSubject.getValue();
    const encontrado = productos.find(p => p.producto.id === producto.id)

    if(encontrado){
      encontrado.cantidad++
    }else{
      this.carritoSubject.next ([...productos, {producto,cantidad :1}])
    }
  }

  eliminarDelCarrito(productoId: number){
    const productos = this.carritoSubject.getValue().filter(p => p.producto.id !== productoId)
    this.carritoSubject.next(productos)
  }

  vaciarCarrito(){
    this.carritoSubject.next([])
  }

  constructor() { }
}