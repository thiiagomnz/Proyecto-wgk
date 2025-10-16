import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-compra',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {
  // declaración del formulario reactivo para la compra
  formularioCompra!: FormGroup;

  // variable para almacenar el total de la compra (subtotal + envío)
  total!: number;

  // costo fijo de envío
  envio = 30;

  // indicador para saber si la factura ya fue generada 
  facturaGenerada = false;

  // objeto que contiene la información de la factura generada
  factura: any;

  // controla la visibilidad del modal que muestra el PDF
  mostrarModal = false;

  // fuente segura para mostrar el PDF generado en el iframe (URL sanitizada)
  pdfSrc: SafeResourceUrl | undefined;

  constructor(
    private fb: FormBuilder, // FormBuilder para crear el formulario reactivo
    private carritoService: CarritoService, // servicio para manejar el carrito y obtener productos y total
    private sanitizer: DomSanitizer, // para sanitizar la URL del PDF y que Angular lo permita mostrar
  ) {}

  // método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // formulario con los campos requeridos y validadores
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
  }

  // calcular el total de la compra sumando el subtotal y el costo de envío
  calcularTotal(): number {
    const subtotal = this.carritoService.obtenerTotal(); // obtiene subtotal del carrito
    this.total = subtotal + this.envio;
    return this.total;
  }

  // prepara los datos para la factura con cliente, productos, totales y fecha
  emitirFactura(): void {
    const datosCliente = this.formularioCompra.value; // datos ingresados en el formulario
    const productos = this.carritoService.obtenerProductos(); // productos del carrito
    const totalFinal = this.calcularTotal(); // total calculado con envío

    // construye el objeto factura con toda la info necesaria
    this.factura = {
      cliente: datosCliente,
      productos: productos,
      envio: this.envio,
      total: totalFinal,
      fecha: new Date()
    };
    // marca que la factura fue generada 
    this.facturaGenerada = true;
  }

  // método que se ejecuta al finalizar la compra (click en botón)
  finalizarCompra(): void {
    if (this.formularioCompra.valid) {
      this.emitirFactura(); // crea la factura
      this.generarPDFModal(); // genera y muestra el PDF en modal
    } else {
      this.formularioCompra.markAllAsTouched(); // marca todos los campos como tocados para mostrar errores
    }
  }

  // genera el PDF con jsPDF y crea la URL para mostrar en iframe dentro del modal
  generarPDFModal(): void {
    if (!this.factura) return; // si no hay factura, no hacer nada

    const doc = new jsPDF(); // crea instancia de jsPDF

    // agrega título y fecha al PDF
    doc.setFontSize(18);
    doc.text('Factura de compra', 14, 20);

    doc.setFontSize(12);
    doc.text(`Fecha: ${this.factura.fecha.toLocaleString()}`, 14, 30);

    // información del cliente
    doc.text('Cliente:', 14, 40);
    const c = this.factura.cliente;
    doc.text(`Nombre: ${c.nombre}`, 20, 50);
    doc.text(`Dirección: ${c.direccion}`, 20, 60);
    doc.text(`Correo: ${c.correo}`, 20, 70);
    doc.text(`Teléfono: ${c.telefono}`, 20, 80);
    doc.text(`Ciudad: ${c.ciudad}`, 20, 90);
    doc.text(`Provincia: ${c.provincia}`, 20, 100);
    doc.text(`Código Postal: ${c.codigoPostal}`, 20, 110);

    // listado de productos con cantidad, precio y subtotal
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

    // costos finales
    y += 10;
    doc.text(`Costo de Envío: $${this.factura.envio.toFixed(2)}`, 14, y);
    y += 10;
    doc.text(`Total a Pagar: $${this.factura.total.toFixed(2)}`, 14, y);

    const pdfBlob = doc.output('blob');
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob));

    // abre el modal que contiene el PDF
    this.mostrarModal = true;
  }

  // método para cerrar el modal y liberar la URL del PDF
  cerrarModal(): void {
    this.mostrarModal = false;
    if (this.pdfSrc) {
      URL.revokeObjectURL((this.pdfSrc as any).changingThisBreaksApplicationSecurity);
      this.pdfSrc = undefined;
    }
  }

  // método para imprimir el PDF que está cargado dentro del iframe
  imprimirPDF(): void {
    const iframe: HTMLIFrameElement | null = document.getElementById('pdfFrame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  }

  // 🟩 NUEVO MÉTODO: copiar alias o número al portapapeles
  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      alert(`"${texto}" copiado al portapapeles`);
    }).catch(() => {
      alert('No se pudo copiar el texto.');
    });
  }
}
