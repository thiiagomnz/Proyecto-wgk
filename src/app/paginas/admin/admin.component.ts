import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../servicios/productos.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  productos: any[] = [];
  formulario!: FormGroup;

  editando = false;
  productoActual: any = null;

  imagenPrevia: string | null = null;
  archivoImagen: File | null = null;

  tallesLista: number[] = [35, 36, 37, 38, 39, 40, 41, 42, 43];

  /** donde guardo los talles seleccionados */
  tallesSeleccionados: number[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarProductos();
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

  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error('Error', err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagenPrevia = reader.result as string);
    reader.readAsDataURL(file);
  }

  /** 👉 Marca / desmarca talles */
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

  guardar() {
    const formData = new FormData();

    formData.append("nombre", this.formulario.value.nombre);
    formData.append("precio", this.formulario.value.precio);
    formData.append("stock", this.formulario.value.stock);
    formData.append("marca", this.formulario.value.marca);

    // 🔥 GUARDA ARRAY JSON CORRECTAMENTE
    formData.append("tallesDisponibles", JSON.stringify(this.tallesSeleccionados));

    if (this.archivoImagen) {
      formData.append("imagen", this.archivoImagen);
    }

    if (this.editando) {
      this.productService.actualizarProducto(this.productoActual.id, formData).subscribe({
        next: () => {
          alert("Producto actualizado");
          this.reset();
          this.cargarProductos();
        }
      });

    } else {
      this.productService.crearProducto(formData).subscribe({
        next: () => {
          alert("Producto creado");
          this.reset();
          this.cargarProductos();
        }
      });
    }
  }

  editar(producto: any) {
    this.editando = true;
    this.productoActual = producto;

    // 🔥 Asegura que tallesDisponibles sea un array real
    this.tallesSeleccionados = Array.isArray(producto.tallesDisponibles)
      ? producto.tallesDisponibles
      : JSON.parse(producto.tallesDisponibles || "[]");

    this.formulario.patchValue({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      marca: producto.marca,
      tallesDisponibles: this.tallesSeleccionados
    });

    this.imagenPrevia = producto.imagen
      ? `http://localhost/api_proyecto/public/uploads/${producto.imagen}`
      : null;
  }

  eliminar(id: number) {
    if (!confirm("¿Seguro?")) return;

    this.productService.eliminarProducto(id).subscribe({
      next: () => {
        alert("Producto eliminado");
        this.cargarProductos();
      }
    });
  }

  reset() {
    this.formulario.reset();
    this.editando = false;
    this.productoActual = null;
    this.archivoImagen = null;
    this.imagenPrevia = null;
    this.tallesSeleccionados = [];
  }
}
