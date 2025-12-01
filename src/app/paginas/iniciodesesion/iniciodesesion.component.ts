import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-iniciodesesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './iniciodesesion.component.html',
  styleUrls: ['./iniciodesesion.component.css']
})
export class IniciodesesionComponent {

  // Datos del usuario para el formulario
  usuario = {
    email: '',
    password: ''
  };

  // Mensaje de error para mostrar en pantalla
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método que se ejecuta al enviar el formulario
  onLogin(): void {

    // Validación básica
    if (!this.usuario.email || !this.usuario.password) {
      this.error = 'Complete todos los campos.';
      return;
    }

    // Llamo al servicio de login
    this.authService.login(this.usuario).subscribe({
      next: (res) => {
        this.error = '';
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/productos']); // Redirección post login
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.error = 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }
}
