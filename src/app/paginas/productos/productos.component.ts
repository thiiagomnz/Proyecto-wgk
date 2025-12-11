import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Producto } from '../../model/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';
import { BuscadorService } from '../../servicios/buscador.service';
import { ProductService } from '../../servicios/productos.service';
import { AuthService } from '../../servicios/auth.service';

import Swal from 'sweetalert2';   // ⭐ SWEETALERT2

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  Productos: Producto[] = [];
  seleccionados: { [id: number]: number[] } = {};

  marcaSeleccionada: string = 'Todas';
  busqueda: string = '';

  cargando: boolean = false;
  error: string = '';

  constructor(
    private carritoService: CarritoService,
    private favoritoService: FavoritosService,
    private route: ActivatedRoute,
    public buscadorService: BuscadorService,
    private productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const marca = params.get('marca');
      this.marcaSeleccionada = marca
        ? marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase()
        : 'Todas';
    });

    this.buscadorService.busqueda$.subscribe(texto => {
      this.busqueda = texto;
    });

    this.cargarProductos();
  }

  // ========================================================
  // ⭐ SWEETALERT PERSONALIZADO
  // ========================================================
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

  // ========================================================
  // ⭐ CARGAR PRODUCTOS
  // ========================================================
  cargarProductos() {
    this.cargando = true;

    this.productService.obtenerProductos().subscribe({
      next: (res) => {
        this.Productos = res;
        this.cargando = false;
      },
      error: () => {
        this.mostrarAlerta("Error", "No se pudieron cargar los productos.", "error");
        this.cargando = false;
      }
    });
  }

  // ========================================================
  // ⭐ FILTRO DE PRODUCTOS
  // ========================================================
  get productosFiltrados(): Producto[] {
    return this.Productos.filter(p => {
      const coincideMarca =
        this.marcaSeleccionada === 'Todas' ||
        p.marca.toLowerCase() === this.marcaSeleccionada.toLowerCase();

      const coincideNombre =
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());

      return coincideMarca && coincideNombre;
    });
  }

  // ========================================================
  // ⭐ MANEJO DE TALLES
  // ========================================================
  toggleTalle(producto: Producto, talle: number) {
    if (!this.seleccionados[producto.id]) {
      this.seleccionados[producto.id] = [];
    }

    const idx = this.seleccionados[producto.id].indexOf(talle);

    if (idx >= 0) {
      this.seleccionados[producto.id].splice(idx, 1);
    } else {
      this.seleccionados[producto.id].push(talle);
    }
  }

  esSeleccionado(producto: Producto, talle: number): boolean {
    return (this.seleccionados[producto.id] || []).includes(talle);
  }

  // ========================================================
  // ⭐ AGREGAR AL CARRITO
  // ========================================================
  agregar(producto: Producto) {

    if (!this.authService.isLoggedIn()) {
      this.mostrarAlerta("Inicia sesión", "Debes iniciar sesión para agregar al carrito.", "warning");
      return;
    }

    const talles = this.seleccionados[producto.id] || [];

    if (talles.length === 0) {
      this.mostrarAlerta("Selecciona un talle", "Debes elegir al menos un talle.", "warning");
      return;
    }

    talles.forEach(talle => {
      this.carritoService.agregarAlCarrito({ producto, talle }).subscribe();
    });

    this.mostrarAlerta("Agregado", "Producto agregado al carrito correctamente.", "success");

    this.seleccionados[producto.id] = [];
  }

  // ========================================================
  // ⭐ AGREGAR A FAVORITOS
  // ========================================================
  agregarFav(producto: Producto) {

    if (!this.authService.isLoggedIn()) {
      this.mostrarAlerta("Inicia sesión", "Debes iniciar sesión para agregar a favoritos.", "warning");
      return;
    }

    this.favoritoService.agregarAFavoritos(producto).subscribe({
      next: () =>
        this.mostrarAlerta("Agregado", "Producto agregado a favoritos.", "success"),

      error: () =>
        this.mostrarAlerta("Error", "No se pudo agregar a favoritos.", "error")
    });
  }

}
