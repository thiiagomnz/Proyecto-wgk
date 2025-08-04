import { Component } from '@angular/core';

@Component({
  selector: 'app-iniciodesesion',
  imports: [],
  templateUrl: './iniciodesesion.component.html',
  styleUrl: './iniciodesesion.component.css'
})
export class IniciodesesionComponent {
  // Este metodo se llama cuando se envia el formulario
  onLogin(): void {
    console.log('inicio de sesion enviado');
    //aqui podrias conectar con tu servicio de autenticacion
  }
}
