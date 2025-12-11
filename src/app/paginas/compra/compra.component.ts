import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { CompraService } from '../../servicios/compra.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  productos: any[] = [];
  datos = { direccion: '', telefono: '' };
  subtotal = 0;
  envio = 10;
  total = 0;
  mensaje = '';
  cargando = false;

  formularioCompra!: FormGroup;
  facturaGenerada = false;
  factura: any;
  mostrarModal = false;
  pdfSrc: SafeResourceUrl | undefined;

  constructor(
    private carritoService: CarritoService,
    private compraService: CompraService,
    private router: Router,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.formularioCompra = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      metodoPago: ['', Validators.required]
    });

    this.carritoService.carrito$.subscribe(items => {
      this.productos = items;
      this.calcularTotales();
    });
  }

  calcularTotales(): void {
    this.subtotal = this.productos.reduce((acc, p) => {
      const precio = Number(p.precio_unitario) || Number(p.producto?.precio) || 0;
      const cantidad = Number(p.cantidad) || 1;
      return acc + precio * cantidad;
    }, 0);

    this.total = this.subtotal + this.envio;
  }

  // 💰 FINALIZAR COMPRA (CORREGIDO)
  finalizarCompra(): void {

    if (this.productos.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }

    if (!this.formularioCompra.valid) {
      this.mensaje = 'Completa los datos del formulario antes de continuar.';
      return;
    }

    const data = {
      direccion: this.datos.direccion,
      telefono: this.datos.telefono
    };

    this.cargando = true;

    this.compraService.finalizarCompra(data).subscribe({
      next: res => {
        this.mensaje = 'Compra realizada con éxito';

        this.carritoService.vaciarCarrito().subscribe();

        this.emitirFactura();
        this.generarPDFModal();

        setTimeout(() => {
          this.router.navigate(['/ticket', res.id_compra]);
        }, 1000);
      },

      error: err => {
        console.error(err);
        this.mensaje = 'Error al procesar compra.';
        this.cargando = false;
      }
    });
  }

  calcularTotalFactura(): number {
    return this.subtotal + this.envio;
  }

  emitirFactura(): void {
    const datosCliente = this.formularioCompra.value;

    this.factura = {
      cliente: datosCliente,
      productos: this.productos,
      envio: this.envio,
      total: this.calcularTotalFactura(),
      fecha: new Date()
    };

    this.facturaGenerada = true;
  }

  generarPDFModal(): void {
    if (!this.factura) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Factura de Compra', 14, 20);

    doc.setFontSize(12);
    doc.text(`Fecha: ${this.factura.fecha.toLocaleString()}`, 14, 30);

    const c = this.factura.cliente;

    doc.text('Datos del Cliente:', 14, 45);
    doc.text(`Nombre: ${c.nombre}`, 20, 55);
    doc.text(`Dirección: ${c.direccion}`, 20, 65);
    doc.text(`Correo: ${c.correo}`, 20, 75);
    doc.text(`Teléfono: ${c.telefono}`, 20, 85);
    doc.text(`Ciudad: ${c.ciudad}`, 20, 95);
    doc.text(`Provincia: ${c.provincia}`, 20, 105);
    doc.text(`Código Postal: ${c.codigoPostal}`, 20, 115);

    let y = 130;
    doc.text('Productos:', 14, y);

    this.factura.productos.forEach((item: any, i: number) => {
      y += 10;
      doc.text(
        `${i + 1}. ${item.producto.nombre} - Cant: ${item.cantidad} - $${item.producto.precio}`,
        20,
        y
      );
    });

    y += 15;
    doc.text(`Envío: $${this.factura.envio}`, 14, y);

    y += 10;
    doc.text(`TOTAL: $${this.factura.total}`, 14, y);

    const blob = doc.output('blob');
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    if (this.pdfSrc) {
      URL.revokeObjectURL((this.pdfSrc as any).changingThisBreaksApplicationSecurity);
      this.pdfSrc = undefined;
    }
  }

  imprimirPDF(): void {
    const iframe = document.getElementById('pdfFrame') as HTMLIFrameElement;
    iframe?.contentWindow?.print();
  }

  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto)
      .then(() => alert(`"${texto}" copiado al portapapeles`))
      .catch(() => alert('No se pudo copiar.'));
  }
}
