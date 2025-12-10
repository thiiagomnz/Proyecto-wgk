import { Component, OnInit } from '@angular/core';
import { FavoritosService, FavoritoItem } from '../../servicios/favoritos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {

  productosEnFavorito: FavoritoItem[] = [];

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit(): void {

    // 🔥 Escucha permanente de cambios en favoritos
    this.favoritosService.favorito$.subscribe((items) => {
      console.log("👉 FAVORITOS RECIBIDOS:", items);
      this.productosEnFavorito = items;
    });

    // 🔥 Cargar favoritos apenas se abre la página
    this.favoritosService.cargarFavoritos();
  }

  // ---------------------------------------------------------
  // 🗑 ELIMINAR UN FAVORITO
  // ---------------------------------------------------------
  eliminarProductoFav(idProducto: number) {
    this.favoritosService.eliminarDeFavoritos(idProducto).subscribe(() => {
      console.log("Producto eliminado, recargando favoritos...");
      this.favoritosService.cargarFavoritos();
    });
  }

  // ---------------------------------------------------------
  // ❌ VACIAR TODOS LOS FAVORITOS
  // ---------------------------------------------------------
  vaciarFavoritos() {
    this.favoritosService.vaciarFavoritos().subscribe(() => {
      console.log("Favoritos vaciados.");
      this.productosEnFavorito = [];
    });
  }

  // ---------------------------------------------------------
  // 🛒 Simular compra
  // ---------------------------------------------------------
  realizarCompra() {
    alert('Compra realizada');
    this.vaciarFavoritos();
  }
}
