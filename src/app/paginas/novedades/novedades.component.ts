import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servicios/productos.service';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';
import { AuthService } from '../../servicios/auth.service';
import { Producto } from '../../model/producto.model';

import Swal from 'sweetalert2'; // ⭐ IMPORTANTE

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {

  productos: Producto[] = [];
  novedades: Producto[] = [];
  tallesSeleccionados: { [id: number]: number[] } = {};

  private imagenBaseUrl = "http://localhost/api_proyecto/public/uploads/";

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private favoritosService: FavoritosService,
    public authService: AuthService
  ) {}

  // ==========================================================
  // 🔥 INICIO
  // ==========================================================
  ngOnInit() {
    this.cargarProductos();
  }

  // ==========================================================
  // 🔥 CARGAR PRODUCTOS
  // ==========================================================
  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (res: Producto[]) => {
        this.productos = res.map(p => ({
          ...p,
          imagen: this.formatearImagen(p.imagen)
        }));

        this.novedades = this.productos.filter(p => p.es_novedad == 1);
      },
      error: err => console.log(err)
    });
  }

  formatearImagen(imagen: string): string {
    if (!imagen) return "assets/no-image.png";
    if (imagen.startsWith("http")) return imagen;
    return this.imagenBaseUrl + imagen;
  }

  // ==========================================================
  // 🔥 SELECCIÓN DE TALLES
  // ==========================================================
  seleccionarTalle(idProducto: number, talle: number) {
    if (!this.tallesSeleccionados[idProducto]) {
      this.tallesSeleccionados[idProducto] = [];
    }

    const index = this.tallesSeleccionados[idProducto].indexOf(talle);

    index === -1
      ? this.tallesSeleccionados[idProducto].push(talle)
      : this.tallesSeleccionados[idProducto].splice(index, 1);
  }

  // ==========================================================
  // 🔥 SWEET ALERT GLOBAL
  // ==========================================================
  mostrarAlerta(titulo: string, texto: string, icono: any) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#b34700',
      iconColor: '#ff8c42',
      confirmButtonText: 'Aceptar'
    });
  }

  // ==========================================================
  // 🔥 AGREGAR AL CARRITO
  // ==========================================================
  agregar(producto: Producto) {

    if (!this.authService.isLoggedIn()) {
      return this.mostrarAlerta(
        "Inicia sesión",
        "Debes iniciar sesión para agregar al carrito.",
        "warning"
      );
    }

    const talleSeleccionado = this.tallesSeleccionados[producto.id]?.[0] || null;

    if (!talleSeleccionado) {
      return this.mostrarAlerta(
        "Selecciona un talle",
        "Debes elegir un talle antes de agregar.",
        "warning"
      );
    }

    this.carritoService.agregarAlCarrito({
      producto: producto,
      talle: talleSeleccionado
    }).subscribe({
      next: () => this.mostrarAlerta(
        "Producto agregado",
        "Se agregó correctamente al carrito.",
        "success"
      ),
      error: err => console.log(err)
    });
  }

  // ==========================================================
  // ❤️ AGREGAR A FAVORITOS
  // ==========================================================
  agregarFav(producto: Producto) {

    if (!this.authService.isLoggedIn()) {
      return this.mostrarAlerta(
        "Inicia sesión",
        "Debes iniciar sesión para agregar a favoritos.",
        "warning"
      );
    }

    this.favoritosService.agregarAFavoritos(producto).subscribe({
      next: () => this.mostrarAlerta(
        "Agregado a favoritos",
        "El producto fue añadido correctamente.",
        "success"
      ),
      error: () => this.mostrarAlerta(
        "Error",
        "No se pudo agregar a favoritos.",
        "error"
      )
    });
  }
}
