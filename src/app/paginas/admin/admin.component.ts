import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../servicios/productos.service';
import Swal from 'sweetalert2';

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

  // ==========================================================
  // 🔥 ALERTA GLOBAL ESTILO WGK
  // ==========================================================
  showAlert(title: string, text: string, icon: any) {
    Swal.fire({
      title,
      text,
      icon,
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#b34700",
      iconColor: "#ff8c42"
    });
  }

  showToast(msg: string, icon: any = "success") {
    Swal.fire({
      toast: true,
      position: "bottom-right",
      icon: icon,
      title: msg,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
      background: "#111",
      color: "#fff"
    });
  }

  // ==========================================================
  // 🔥 OBTENER LISTA DE PRODUCTOS
  // ==========================================================
  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: (err) => {
        console.error("Error al obtener productos:", err);
        this.showAlert("Error", "No se pudieron cargar los productos.", "error");
      }
    });
  }

  // ==========================================================
  // ✏️ EDITAR PRODUCTO
  // ==========================================================
  editar(id: number) {
    this.router.navigate(['/admin/editar', id]);
  }

  // ==========================================================
  // ➕ AGREGAR NUEVO PRODUCTO
  // ==========================================================
  agregarNuevo() {
    this.router.navigate(['/admin/agregar']);
  }

  // ==========================================================
  // ❌ ELIMINAR PRODUCTO (SweetAlert Confirm)
  // ==========================================================
  eliminar(id: number) {

    Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      background: "#111",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#b34700",
      cancelButtonColor: "#444",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
      iconColor: "#ff8c42"
    }).then((result) => {
      if (result.isConfirmed) {

        this.productService.eliminarProducto(id).subscribe({
          next: () => {
            this.showToast("Producto eliminado");
            this.cargarProductos();
          },
          error: (err) => {
            console.error("Error al eliminar:", err);
            this.showAlert("Error", "No se pudo eliminar el producto.", "error");
          }
        });

      }
    });
  }

  // ==========================================================
  // ⭐ MARCAR / DESMARCAR COMO NOVEDAD
  // ==========================================================
  toggleNovedad(id: number) {
    this.productService.toggleNovedad(id).subscribe({
      next: () => {
        this.showToast("Novedad actualizada");
        this.cargarProductos();
      },
      error: (err) => {
        console.error("Error al actualizar novedad:", err);
        this.showAlert("Error", "No se pudo actualizar el producto.", "error");
      }
    });
  }

}
