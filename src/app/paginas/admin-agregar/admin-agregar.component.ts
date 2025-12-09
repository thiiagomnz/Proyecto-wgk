import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../servicios/productos.service';
import { Router } from '@angular/router';

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

  crearFormulario() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, Validators.required],
      marca: ['', Validators.required],
      tallesDisponibles: [[]],
      imagen: ['']
    });
  }

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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => this.imagenPrevia = reader.result as string;
    reader.readAsDataURL(file);
  }

  guardar() {
    const formData = new FormData();
    formData.append("nombre", this.formulario.value.nombre);
    formData.append("precio", this.formulario.value.precio);
    formData.append("stock", this.formulario.value.stock);
    formData.append("marca", this.formulario.value.marca);

    formData.append("tallesDisponibles", JSON.stringify(this.tallesSeleccionados));

    if (this.archivoImagen) {
      formData.append("imagen", this.archivoImagen);
    }

    this.productService.crearProducto(formData).subscribe({
      next: () => {
        alert("Producto creado con éxito");
        this.router.navigate(['/admin']); // Volver al panel o lista
      },
      error: (err) => console.error(err)
    });
  }
}
