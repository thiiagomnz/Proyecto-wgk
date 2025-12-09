import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../servicios/productos.service';

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

  imagenPrevia: string | null = null;
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

  crearFormulario() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, Validators.required],
      stock: [0, Validators.required],
      marca: ['', Validators.required],
      tallesDisponibles: [[]],
      imagen: ['']
    });
  }

  cargarProducto(id: number) {
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

        if (data.imagen) {
          this.imagenPrevia =
            `http://localhost/api_proyecto/public/uploads/${data.imagen}`;
        }
      },
      error: () => alert("Error cargando producto")
    });
  }

  toggleTalle(talle: number, event: any) {
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => this.imagenPrevia = reader.result as string;
    reader.readAsDataURL(file);
  }

  guardarCambios() {
    if (!this.producto) return;

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
        alert("Producto actualizado correctamente");
        this.router.navigate(['/admin']);
      },
      error: () => alert("Error al actualizar producto")
    });
  }
}
