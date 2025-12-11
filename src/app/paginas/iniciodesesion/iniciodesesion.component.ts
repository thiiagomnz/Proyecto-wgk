import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

import Swal from 'sweetalert2'; // ⭐ IMPORTANTE

@Component({
  selector: 'app-iniciodesesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './iniciodesesion.component.html',
  styleUrls: ['./iniciodesesion.component.css']
})
export class IniciodesesionComponent {

  usuario = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // 🔥 SWEETALERT GLOBAL PERSONALIZADO
  private alerta(titulo: string, texto: string, icono: any) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#b34700",
      iconColor: "#ff8c42"
    });
  }

  // =====================================================
  // 🔥 FUNCIÓN LOGIN
  // =====================================================
  onLogin(): void {

    if (!this.usuario.email || !this.usuario.password) {
      return this.alerta(
        "Campos incompletos",
        "Debes completar todos los campos.",
        "warning"
      );
    }

    this.authService.login(this.usuario).subscribe({
      next: (res) => {

        if (res?.token) {
          // 🔥 ALERTA DE ÉXITO
          Swal.fire({
            title: "Bienvenido",
            text: "Inicio de sesión exitoso",
            icon: "success",
            background: "#111",
            color: "#fff",
            confirmButtonColor: "#b34700",
            iconColor: "#ff8c42",
            timer: 1600,
            showConfirmButton: false
          });

          // 🔥 Redirección suave
          setTimeout(() => {
            this.router.navigate(['/productos']);
          }, 1500);

        } else {
          this.alerta(
            "Error inesperado",
            "No se recibió token desde el servidor.",
            "error"
          );
        }
      },

      error: (err) => {
        console.error("Error al iniciar sesión", err);

        this.alerta(
          "Credenciales incorrectas",
          "Email o contraseña inválidos.",
          "error"
        );
      }
    });
  }

}
