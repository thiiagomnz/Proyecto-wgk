import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../model/producto.model';
import { BuscadorService } from '../../servicios/buscador.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cantidadProductos: number = 0;
  busqueda: string = ''; // Texto del buscador
  marcas: string[] = ['Todas', 'Jordan', 'Adidas', 'Nike'];

  constructor(
    private carritoService: CarritoService,
    public buscadorService: BuscadorService
  ) {}

  ngOnInit(): void {
    // Contar cantidad de productos en el carrito
    this.carritoService.carrito$.subscribe((productos: { producto: Producto; cantidad: number }[]) => {
      this.cantidadProductos = productos.reduce((total, item) => total + item.cantidad, 0);
    });

    // Mantener sincronizado el buscador si cambia desde otro componente
    this.buscadorService.busqueda$.subscribe(texto => {
      this.busqueda = texto;
    });
  }

  // Evita que el dropdown de "Producto" recargue la página
  toggleDropdown(event: Event) {
    event.preventDefault();
  }

  // Actualiza la búsqueda en el servicio cada vez que el usuario escribe
  onBuscar() {
    this.buscadorService.setBusqueda(this.busqueda);
  }
}
