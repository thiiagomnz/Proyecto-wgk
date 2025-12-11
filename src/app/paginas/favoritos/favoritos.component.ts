import { Component, OnInit } from '@angular/core';
import { FavoritosService, FavoritoItem } from '../../servicios/favoritos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2'; // ⭐ SweetAlert2

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
    this.favoritosService.favorito$.subscribe(items => {
      this.productosEnFavorito = items;
    });

    this.favoritosService.cargarFavoritos();
  }

  // ================================================
  // 🗑 ELIMINAR UN FAVORITO
  // ================================================
  eliminarProductoFav(idProducto: number): void {

    Swal.fire({
      icon: 'warning',
      title: 'Quitar de favoritos',
      text: '¿Seguro que deseas eliminar este producto?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#555'
    }).then(result => {

      if (result.isConfirmed) {
        this.favoritosService.eliminarDeFavoritos(idProducto).subscribe(() => {

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El producto fue quitado de tus favoritos.',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#ff8c42'
          });

          this.favoritosService.cargarFavoritos();
        });
      }
    });
  }

  // ================================================
  // ❌ VACIAR TODOS LOS FAVORITOS
  // ================================================
  vaciarFavoritos(): void {

    Swal.fire({
      icon: 'warning',
      title: 'Vaciar favoritos',
      text: '¿Seguro que quieres eliminar todos los productos?',
      showCancelButton: true,
      confirmButtonText: 'Vaciar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#555'
    }).then(result => {

      if (result.isConfirmed) {
        this.favoritosService.vaciarFavoritos().subscribe(() => {

          Swal.fire({
            icon: 'success',
            title: 'Favoritos vacíos',
            text: 'Todos los productos fueron eliminados.',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#ff8c42'
          });

          this.productosEnFavorito = [];
        });
      }
    });
  }

  // ================================================
  // 🛒 COMPRA DESDE FAVORITOS
  // ================================================
  realizarCompra(): void {

    if (this.productosEnFavorito.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No hay productos',
        text: 'Agrega favoritos antes de comprar.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#ff8c42'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Compra realizada',
      text: 'Gracias por tu compra.',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff8c42'
    }).then(() => {
      this.vaciarFavoritos();
    });
  }

}
