import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../servicios/productos.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-agregar.component.html',
  styleUrls: ['./admin-agregar.component.css']
})
export class AgregarProductoComponent {

  formulario!: FormGroup;
  tallesLista = [35, 36, 37, 38, 39, 40, 41, 42, 43];
  tallesSeleccionados: number[] = [];
  imagenPrevia: string | null = null;
  archivoImagen: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  // =========================================================
  // 🔥 SWEETALERT GLOBAL
  // =========================================================
  alerta(titulo: string, texto: string, icono: any) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#b34700",
      iconColor: "#ff8c42",
      confirmButtonText: "Aceptar"
    });
  }

  // =========================================================
  // 🔥 CREAR FORMULARIO
  // =========================================================
  crearFormulario() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      marca: ['', Validators.required],
      tallesDisponibles: [[]],
      imagen: [''],
      es_novedad: [false]
    });
  }

  // =========================================================
  // 🔥 MANEJO DE TALLES
  // =========================================================
  toggleTalle(talle: number, event: any) {
    if (event.target.checked) {
      this.tallesSeleccionados.push(talle);
    } else {
      this.tallesSeleccionados = this.tallesSeleccionados.filter(t => t !== talle);
    }

    this.formulario.patchValue({
      tallesDisponibles: this.tallesSeleccionados
    });
  }

  // =========================================================
  // 🔥 PREVISUALIZACIÓN DE IMAGEN
  // =========================================================
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => this.imagenPrevia = reader.result as string;
    reader.readAsDataURL(file);
  }

  // =========================================================
  // 🔥 GUARDAR PRODUCTO
  // =========================================================
  guardar() {

    // 🔥 VALIDACIÓN COMPLETA
    if (this.formulario.invalid) {
      return this.alerta(
        "Campos incompletos",
        "Debes completar todos los campos obligatorios.",
        "warning"
      );
    }

    if (this.tallesSeleccionados.length === 0) {
      return this.alerta(
        "Faltan talles",
        "Selecciona al menos un talle para el producto.",
        "warning"
      );
    }

    if (!this.archivoImagen) {
      return this.alerta(
        "Falta imagen",
        "Debes subir una imagen para el producto.",
        "warning"
      );
    }

    // 🔥 ARMADO DE FORM DATA
    const formData = new FormData();
    formData.append("nombre", this.formulario.value.nombre);
    formData.append("precio", this.formulario.value.precio);
    formData.append("stock", this.formulario.value.stock);
    formData.append("marca", this.formulario.value.marca);
    formData.append("tallesDisponibles", JSON.stringify(this.tallesSeleccionados));
    formData.append("es_novedad", this.formulario.value.es_novedad ? "1" : "0");

    if (this.archivoImagen) {
      formData.append("imagen", this.archivoImagen);
    }

    // 🔥 GUARDAR EN BACKEND
    this.productService.crearProducto(formData).subscribe({
      next: () => {
        Swal.fire({
          title: "Producto creado",
          text: "El producto fue agregado exitosamente.",
          icon: "success",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#b34700",
          iconColor: "#ff8c42"
        });

        this.router.navigate(['/admin']);
      },
      error: err => {
        console.error(err);
        this.alerta("Error", "Ocurrió un problema al crear el producto.", "error");
      }
    });
  }

}
