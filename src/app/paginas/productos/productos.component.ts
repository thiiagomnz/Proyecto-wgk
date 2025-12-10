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
    public authService: AuthService            // 👈 agregado
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

  cargarProductos() {
    this.cargando = true;

    this.productService.obtenerProductos().subscribe({
      next: (res) => {
        console.log("Productos desde backend:", res);

        this.Productos = res.map((p: any) => ({

          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          marca: p.marca,

          imagen: p.imagen
            ? `http://localhost/api_proyecto/public/uploads/${p.imagen}`
            : '',

          tallesDisponibles: Array.isArray(p.tallesDisponibles)
            ? p.tallesDisponibles
            : JSON.parse(p.tallesDisponibles || "[]"),

          stock: p.stock ?? 0,
          cantidad: p.stock ?? 0,
          disponible: true,
        }));

        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al cargar productos:", err);
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

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

  toggleTalle(producto: Producto, talle: number) {
    if (!producto.tallesDisponibles.includes(talle)) return;

    if (!this.seleccionados[producto.id]) {
      this.seleccionados[producto.id] = [];
    }

    const idx = this.seleccionados[producto.id].indexOf(talle);

    if (idx > -1) this.seleccionados[producto.id].splice(idx, 1);
    else this.seleccionados[producto.id].push(talle);
  }

  esSeleccionado(producto: Producto, talle: number): boolean {
    return (this.seleccionados[producto.id] || []).includes(talle);
  }

  // 🔥🔥🔥 AGREGAR AL CARRITO — ahora protege si no inició sesión
  agregar(producto: Producto) {

    // 1️⃣ Verificar si está logueado
    if (!this.authService.isLoggedIn()) {
      alert("Debes iniciar sesión para agregar al carrito.");
      return; // ❌ corta todo
    }

    const tallesSeleccionados = this.seleccionados[producto.id] || [];

    if (tallesSeleccionados.length === 0) {
      alert("Selecciona al menos un talle");
      return;
    }

    // 2️⃣ Enviar al backend porque ya está logueado
    tallesSeleccionados.forEach(talle => {
      this.carritoService.agregarAlCarrito({ producto, talle }).subscribe({
        next: () => {
          this.carritoService.cargarCarrito();
        },
        error: err => console.error(err)
      });
    });

    alert("Agregado al carrito");
    this.seleccionados[producto.id] = [];
  }

 agregarFav(producto: Producto) {

  // 1️⃣ Verificar si el usuario NO inició sesión
  if (!this.authService.isLoggedIn()) {
    alert("Debes iniciar sesión para agregar a favoritos.");
    return;
  }

  // 2️⃣ Llamar al servicio y SUSCRIBIRSE
  this.favoritoService.agregarAFavoritos(producto).subscribe({
    next: (res) => {
      console.log("Favorito agregado:", res);
      alert("Producto agregado a favoritos");
    },
    error: (err) => {
      console.error("Error al agregar favorito:", err);
      alert("No se pudo agregar a favoritos");
    }
  });
}

}
