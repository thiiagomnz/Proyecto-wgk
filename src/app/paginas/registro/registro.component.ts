import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  // metodo que se llama al enviar el formulario
  onRegister():void {
    console.log('Formulario de registro enviado');
    //aqui puedes agregar logica para enviar datos al servidor, validar, etc.
  }
}
