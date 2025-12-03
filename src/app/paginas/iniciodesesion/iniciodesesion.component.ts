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

  usuario = {
    email: '',
    password: ''
  };

  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    console.log('onLogin ejecutado'); // ✅ Verifica que se dispare

    if (!this.usuario.email || !this.usuario.password) {
      this.error = 'Complete todos los campos.';
      return;
    }

    this.authService.login(this.usuario).subscribe({
      next: (res) => {
        console.log('Respuesta backend:', res); // ✅ Verifica que llega JSON
        this.error = '';

        if (res?.token) {
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/productos']);
        } else {
          this.error = 'No se recibió token del servidor.';
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.error = 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }
}
