import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { CompraService } from '../../servicios/compra.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  envio = 1000; 
  total = 0;
  mensaje = '';
  cargando = false;

  // Para factura/PDF
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
    // Formulario reactivo para datos de la compra
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

    // Suscripción al carrito
    this.carritoService.carrito$.subscribe(items => {
      this.productos = items;
      this.calcularTotales();
    });
  }

  // Calcula subtotal y total
  calcularTotales() {
    this.subtotal = this.productos.reduce((acc, p) => {
      const precio = Number(p.precio_unitario) || p.producto?.precio || 0;
      const cantidad = Number(p.cantidad) || 1;
      return acc + (precio * cantidad);
    }, 0);

    this.total = this.subtotal + this.envio;
  }

  // Finalizar compra estilo "ellos"
  finalizarCompra() {
    if (this.productos.length === 0) {
      this.mensaje = 'El carrito está vacío';
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
        // Vaciar carrito
        this.carritoService.vaciarCarrito().subscribe();

        // Generar factura PDF opcional
        if (this.formularioCompra.valid) {
          this.emitirFactura();
          this.generarPDFModal();
        }

        // Redirigir al ticket
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

  // ----------------- FUNCIONES DE FACTURA / PDF -----------------
  calcularTotalFactura(): number {
    return this.subtotal + this.envio;
  }

  emitirFactura(): void {
    const datosCliente = this.formularioCompra.value;
    const totalFinal = this.calcularTotalFactura();
    this.factura = {
      cliente: datosCliente,
      productos: this.productos,
      envio: this.envio,
      total: totalFinal,
      fecha: new Date()
    };
    this.facturaGenerada = true;
  }

  generarPDFModal(): void {
    if (!this.factura) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Factura de compra', 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${this.factura.fecha.toLocaleString()}`, 14, 30);

    const c = this.factura.cliente;
    doc.text('Cliente:', 14, 40);
    doc.text(`Nombre: ${c.nombre}`, 20, 50);
    doc.text(`Dirección: ${c.direccion}`, 20, 60);
    doc.text(`Correo: ${c.correo}`, 20, 70);
    doc.text(`Teléfono: ${c.telefono}`, 20, 80);
    doc.text(`Ciudad: ${c.ciudad}`, 20, 90);
    doc.text(`Provincia: ${c.provincia}`, 20, 100);
    doc.text(`Código Postal: ${c.codigoPostal}`, 20, 110);

    let y = 120;
    doc.text('Productos', 14, y);
    this.factura.productos.forEach((item: any, index: number) => {
      y += 10;
      doc.text(
        `${index + 1}. ${item.producto.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.producto.precio.toFixed(2)} - Subtotal: $${(item.producto.precio * item.cantidad).toFixed(2)}`,
        20,
        y
      );
    });

    y += 10;
    doc.text(`Costo de Envío: $${this.factura.envio.toFixed(2)}`, 14, y);
    y += 10;
    doc.text(`Total a Pagar: $${this.factura.total.toFixed(2)}`, 14, y);

    const pdfBlob = doc.output('blob');
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob));
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
    const iframe: HTMLIFrameElement | null = document.getElementById('pdfFrame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  }

  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      alert(`"${texto}" copiado al portapapeles`);
    }).catch(() => alert('No se pudo copiar el texto.'));
  }
}
