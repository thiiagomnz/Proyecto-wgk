import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../model/producto.model';
import { BuscadorService } from '../../servicios/buscador.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  cantidadProductos: number = 0;
  busqueda: string = '';
  marcas: string[] = ['Todas', 'Jordan', 'Adidas', 'Nike'];

  // Usuario logueado
  usuario: any = null;

  constructor(
    private carritoService: CarritoService,
    public buscadorService: BuscadorService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    /** 1) Cargar usuario desde auth **/
    this.usuario = this.authService.getUsuario();

    /** 2) Si está logueado → cargar carrito **/
    if (this.authService.isLoggedIn()) {
      this.carritoService.cargarCarrito();
    }

    /** 3) Escuchar cambios del carrito **/
    this.carritoService.carrito$.subscribe(productos => {
      this.cantidadProductos = productos.reduce(
        (total, item) => total + Number(item.cantidad || 1),
        0
      );
    });

    /** 4) Si se loguea después → actualizar usuario + carrito **/
    if (this.authService.loginEvent) {
      this.authService.loginEvent.subscribe(() => {
        this.usuario = this.authService.getUsuario();
        this.carritoService.cargarCarrito();
      });
    }

    /** 5) Buscador sincronizado **/
    this.buscadorService.busqueda$.subscribe(texto => {
      this.busqueda = texto;
    });
  }

  /** Actualiza el buscador **/
  onBuscar() {
    this.buscadorService.setBusqueda(this.busqueda);
  }

  /** Evitar reload del dropdown **/
  toggleDropdown(event: Event) {
    event.preventDefault();
  }

  /** Logout **/
  logout() {
    this.authService.logout();
    this.usuario = null;
    this.cantidadProductos = 0;
  }
}
