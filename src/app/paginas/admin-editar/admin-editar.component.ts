import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../servicios/productos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-editar.component.html',
  styleUrls: ['./admin-editar.component.css']
})
export class EditarProductoComponent implements OnInit {

  formulario!: FormGroup;
  producto: any = null;

  imagenActual: string | null = null; 
  imagenNueva: string | null = null;  
  archivoImagen: File | null = null;

  tallesLista = [35, 36, 37, 38, 39, 40, 41, 42, 43];
  tallesSeleccionados: number[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.cargarProducto(id);
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, Validators.required],
      marca: ['', Validators.required],
      tallesDisponibles: [[]]
    });
  }

  cargarProducto(id: number): void {
    this.productService.obtenerProducto(id).subscribe({

      next: (data: any) => {
        this.producto = data;

        this.tallesSeleccionados = Array.isArray(data.tallesDisponibles)
          ? data.tallesDisponibles
          : JSON.parse(data.tallesDisponibles || '[]');

        this.formulario.patchValue({
          nombre: data.nombre,
          precio: data.precio,
          stock: data.stock,
          marca: data.marca,
          tallesDisponibles: this.tallesSeleccionados
        });

        this.imagenActual = data.imagen;
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el producto.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#b34700'
        });
      }
    });
  }

  toggleTalle(talle: number, event: any): void {
    if (event.target.checked) {
      if (!this.tallesSeleccionados.includes(talle)) {
        this.tallesSeleccionados.push(talle);
      }
    } else {
      this.tallesSeleccionados = this.tallesSeleccionados.filter(t => t !== talle);
    }

    this.formulario.patchValue({
      tallesDisponibles: this.tallesSeleccionados
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => this.imagenNueva = reader.result as string;
    reader.readAsDataURL(file);
  }

  // ⭐⭐ AHORA LA FUNCIÓN ES VOID → TS7030 RESUELTO ⭐⭐
  guardarCambios(): void {

    if (!this.formulario.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos correctamente.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#ff8c42'
      });
      return;
    }

    if (!this.producto) return; // válido porque el método ahora es void

    const formData = new FormData();

    formData.append("nombre", this.formulario.value.nombre);
    formData.append("precio", this.formulario.value.precio);
    formData.append("stock", this.formulario.value.stock);
    formData.append("marca", this.formulario.value.marca);
    formData.append("tallesDisponibles", JSON.stringify(this.tallesSeleccionados));

    if (this.archivoImagen) {
      formData.append("imagen", this.archivoImagen);
    }

    this.productService.actualizarProducto(this.producto.id, formData).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Producto actualizado correctamente.',
          background: '#111',
          color: '#fff',
          iconColor: '#ff8c42',
          confirmButtonColor: '#b34700'
        }).then(() => {
          this.router.navigate(['/admin']);
        });
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el producto.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#b34700'
        });
      }
    });
  }
}
