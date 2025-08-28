import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Producto } from '../../model/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent {

  novedades: Producto[] = [
    {
      id: 10,
      nombre: 'Air Jordan 4 Retro White Thunder',
      precio: 300,
      imagen: 'https://wegotkickspr.com/cdn/shop/files/1_e56c737f-c496-4a06-9a0c-b3d42824c7d7.jpg?v=1721769906&width=600',
      disponible: true,
      marca: 'Jordan 4',
      tallesDisponibles: [38, 39, 40, 41]
    },
    {
      id: 11,
      nombre: 'Air Jordan 1 Retro High OG Stage Haze',
      precio: 150,
      imagen: 'https://wegotkickspr.com/cdn/shop/files/1f7d4890632fc62abee07c5d149bdc99.jpg?v=1737598814&width=1100',
      disponible: true,
      marca: 'Jordan 1',
      tallesDisponibles: [38, 39, 40, 41]
    },
    {
      id: 12,
      nombre: 'Air Jordan 4 Retro Military Blue 2024',
      precio: 250,
      imagen: 'https://wegotkickspr.com/cdn/shop/files/Military.jpg?v=1715050398&width=600',
      disponible: true,
      marca: 'Jordan 4',
      tallesDisponibles: [38, 39, 40, 41]
    }
  ];

  // Guardar talles seleccionados por producto
  tallesSeleccionados: { [key: number]: number[] } = {};

  constructor(private carritoService: CarritoService, private favoritoService: FavoritosService) {}

  // Seleccionar / deseleccionar talle
  seleccionarTalle(productoId: number, talle: number) {
    if (!this.tallesSeleccionados[productoId]) {
      this.tallesSeleccionados[productoId] = [];
    }
    const index = this.tallesSeleccionados[productoId].indexOf(talle);
    if (index > -1) {
      this.tallesSeleccionados[productoId].splice(index, 1);
    } else {
      this.tallesSeleccionados[productoId].push(talle);
    }
  }

  // Agregar al carrito por talle
  agregar(producto: Producto) {
    const talles = this.tallesSeleccionados[producto.id] || [];
    if (talles.length === 0) {
      alert('Selecciona al menos un talle');
      return;
    }

    for (let talle of talles) {
      this.carritoService.agregarAlCarrito({ producto, talle });
    }

    alert('Producto agregado al carrito');
  }

  agregarFav(producto: Producto) {
    this.favoritoService.agregarAFavoritos(producto);
    alert('Producto agregado a favoritos');
  }

}
