import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  // Datos del usuario enlazados al formulario
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: ''
  };

  // Mensaje de error para mostrar en la vista
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método llamado cuando el usuario envía el formulario
  onRegister(): void {

    // Validar campos vacíos
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    // Llamada al backend usando AuthService
    this.authService.register(this.nuevoUsuario).subscribe({

      next: () => {
        alert('Registro exitoso. Ahora puede iniciar sesión.');
        this.router.navigate(['/inicio-sesion']);
      },

      error: (err) => {
        console.error('Error al registrar el usuario', err);
        this.error = 'Error al registrar el usuario.';
      }
    });
  }
}
