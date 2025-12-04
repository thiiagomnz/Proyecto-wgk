import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Producto } from '../../model/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';
import { BuscadorService } from '../../servicios/buscador.service';
import { ProductService } from '../../servicios/productos.service';

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
    private productService: ProductService
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

          // 🚀 ESTA ES LA LÍNEA CORRECTA
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

 agregar(producto: Producto) {
  const tallesSeleccionados = this.seleccionados[producto.id] || [];

  if (tallesSeleccionados.length === 0) {
    alert("Selecciona al menos un talle");
    return;
  }

  tallesSeleccionados.forEach(talle => {
    this.carritoService.agregarAlCarrito({ producto, talle }).subscribe({
      next: () => {
        this.carritoService.cargarCarrito(); // 🔥 ACTUALIZA EL CARRITO GLOBAL
      },
      error: err => console.error(err)
    });
  });

  alert("Agregado al carrito");
  this.seleccionados[producto.id] = [];
}

  agregarFav(producto: Producto) {
    this.favoritoService.agregarAFavoritos(producto);
    alert('Producto agregado a favoritos');
  }
}
