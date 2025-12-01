import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Producto } from '../../model/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';
import { BuscadorService } from '../../servicios/buscador.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  Productos: Producto[] = [
    // Aquí van tus productos iniciales
    // Ejemplo:
    // { id: 1, nombre: 'Jordan 1', precio: 250, imagen: 'ruta.jpg', descripcion: 'Descripción', marca: 'Jordan', cantidad: 10, tallesDisponibles: [40,41,42,43] }
  ];

  seleccionados: { [id: number]: number[] } = {};
  marcaSeleccionada: string = 'Todas';
  busqueda: string = '';

  cargando: boolean = false;
  error: string = '';

  constructor(
    private carritoService: CarritoService,
    private favoritoService: FavoritosService,
    private route: ActivatedRoute,
    public buscadorService: BuscadorService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const marca = params.get('marca');
      this.marcaSeleccionada = marca ? marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase() : 'Todas';
    });

    this.buscadorService.busqueda$.subscribe(texto => {
      this.busqueda = texto;
    });

    // Si quieres simular carga de productos:
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    try {
      // Aquí podrías traerlos desde un servicio si lo tuvieras
      // Por ahora solo simulamos
      setTimeout(() => {
        this.cargando = false;
      }, 500); // simulación de carga
    } catch (err) {
      this.error = 'No se pudieron cargar los productos.';
      this.cargando = false;
      console.error(err);
    }
  }

  get productosFiltrados(): Producto[] {
    return this.Productos.filter(p => {
      const coincideMarca = this.marcaSeleccionada === 'Todas' || p.marca.toLowerCase() === this.marcaSeleccionada.toLowerCase();
      const coincideNombre = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideMarca && coincideNombre;
    });
  }

  toggleTalle(producto: Producto, talle: number) {
    if (!producto.tallesDisponibles.includes(talle)) return;
    if (!this.seleccionados[producto.id]) this.seleccionados[producto.id] = [];
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
    if (!producto.cantidad || producto.cantidad <= 0) {
      alert("Sin stock disponible");
      return;
    }
    if (producto.cantidad < tallesSeleccionados.length) {
      alert(`Solo hay ${producto.cantidad} unidad(es) disponibles`);
      return;
    }

    tallesSeleccionados.forEach(talle => {
      this.carritoService.agregarAlCarrito({ producto, talle });
    });

    producto.cantidad -= tallesSeleccionados.length;
    alert(`Agregado al carrito: ${tallesSeleccionados.length} unidad(es)`);
    this.seleccionados[producto.id] = [];
  }

  agregarFav(producto: Producto) {
    this.favoritoService.agregarAFavoritos(producto);
    alert('Producto agregado a favoritos');
  }
}
