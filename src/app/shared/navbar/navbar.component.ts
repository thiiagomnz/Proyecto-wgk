import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../model/producto.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cantidadProductos: number = 0;
  marcas: string[] = ['Todas', 'Jordan', 'Adidas', 'Nike'];

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe((productos: {producto: Producto, cantidad: number}[]) => {
      this.cantidadProductos = productos.reduce((total, item) => total + item.cantidad, 0);
    });
  }

  // Esta función evita que al hacer click en "Producto" el navegador intente ir a otro lado y en cambio abre el dropdown
  toggleDropdown(event: Event) {
    event.preventDefault();
  }
}
