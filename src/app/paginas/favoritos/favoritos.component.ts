import { Component, OnInit} from '@angular/core';
import { FavoritosService } from '../../servicios/favoritos.service';
import { Producto } from '../../model/producto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-favoritos',
  imports: [CommonModule,FormsModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit{
  productosEnFavorito: {producto:Producto}[] = []
  constructor(private favoritosService: FavoritosService){}

  ngOnInit(): void {
    this.favoritosService.favorito$.subscribe((productos)=>{
      this.productosEnFavorito = productos;
    })
  }

  eliminarProductoFav(productoId:number){
    this.favoritosService.eliminarDeFavoritos(productoId)
  }

  vaciarFavoritos(){
    this.favoritosService.vaciarCarrito()
  }

   realizarCompra(){
    alert('compra Realizada')
    this.vaciarFavoritos()
  }
}
