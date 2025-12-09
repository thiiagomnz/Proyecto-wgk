import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../servicios/productos.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  productos: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error("Error", err)
    });
  }

  editar(id: number) {
    this.router.navigate(['/admin/editar', id]);
  }

  agregarNuevo() {
    this.router.navigate(['/admin/agregar']);
  }

  eliminar(id: number) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    this.productService.eliminarProducto(id).subscribe({
      next: () => {
        alert("Producto eliminado");
        this.cargarProductos();
      }
    });
  }

}
