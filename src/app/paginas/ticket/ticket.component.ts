import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../servicios/ticket.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  ticket: any = null;        // Datos completos del ticket
  idCompra!: number;         // ID recibido por URL
  pdfUrl!: SafeResourceUrl;  // URL segura para iframe

  cargando: boolean = true;  // Para mostrar spinner si querés
  errorMsg: string = '';     // Error en caso de 404 o fallo

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    // Leer ID de compra desde la URL
    this.idCompra = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idCompra) {
      this.errorMsg = "ID de compra inválido.";
      this.cargando = false;
      return;
    }

    // Llamada al backend para obtener ticket
    this.ticketService.obtenerPorCompra(this.idCompra).subscribe({

      next: (res) => {
        this.ticket = res;

        // Construir la ruta real del PDF
        const url = `http://localhost/api_proyecto/public/tickets/ticket_${this.ticket.numero_ticket}.pdf`;

        // Habilitar URL en iframe
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        this.cargando = false;
      },

      error: (err) => {
        this.ticket = null;
        this.errorMsg = "No se encontró ticket para esta compra.";
        this.cargando = false;
      }
    });
  }

  // Descargar PDF en nueva pestaña
  descargarPDF(): void {
    if (!this.ticket) return;

    this.ticketService.descargar(this.ticket.numero_ticket).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => {
        alert("No se pudo descargar el PDF.");
      }
    });
  }

}
