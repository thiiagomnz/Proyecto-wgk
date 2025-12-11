import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

import Swal from 'sweetalert2'; // ⭐ Importante

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  nuevoUsuario = {
    nombre: '',
    email: '',
    password: ''
  };

  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ⭐ Función global WGK para mostrar alertas
  showAlert(title: string, text: string, icon: any) {
    Swal.fire({
      title,
      text,
      icon,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#b34700',
      iconColor: '#ff8c42',
      confirmButtonText: 'Aceptar'
    });
  }

  onRegister(): void {

    // Validación campos
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.showAlert(
        "Campos incompletos",
        "Todos los campos son obligatorios.",
        "warning"
      );
      return;
    }

    // Petición al backend
    this.authService.register(this.nuevoUsuario).subscribe({

      next: () => {
        this.showAlert(
          "Registro exitoso",
          "Tu cuenta fue creada correctamente.",
          "success"
        );

        // Redirección
        this.router.navigate(['/inicio-sesion']);
      },

      error: (err) => {
        console.error("Error en registro:", err);

        // Detectamos error típico: email ya usado
        if (err?.error?.mensaje === 'email_exists') {
          this.showAlert(
            "Email en uso",
            "Ya existe una cuenta registrada con este email.",
            "error"
          );
          return;
        }

        this.showAlert(
          "Error",
          "Ocurrió un error al registrar el usuario.",
          "error"
        );
      }
    });
  }
}
