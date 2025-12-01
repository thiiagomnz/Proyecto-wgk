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
