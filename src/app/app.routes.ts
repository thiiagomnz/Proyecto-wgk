import { Routes } from '@angular/router';
import { ProductosComponent } from './paginas/productos/productos.component';
import { NovedadesComponent } from './paginas/novedades/novedades.component';
import { FavoritosComponent } from './paginas/favoritos/favoritos.component';
import { QuienesSomosComponent } from './paginas/quienes-somos/quienes-somos.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { IniciodesesionComponent } from './paginas/iniciodesesion/iniciodesesion.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { CompraComponent } from './paginas/compra/compra.component';
import { AdminGuard } from './paginas/guards/admin.guard';// importa el guard
import { AdminComponent } from './paginas/admin/admin.component';
import { TicketComponent } from './paginas/ticket/ticket.component';


export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'producto', component: ProductosComponent },
  { path: 'producto/marca/:marca', component: ProductosComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'quienesomos', component: QuienesSomosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'iniciodesesion', component: IniciodesesionComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'compra', component: CompraComponent },
  { path: '**', redirectTo: '/inicio' },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
   // Auth: inicio de sesión
  // -----------------------------------------------------------
  { path: 'login', component: IniciodesesionComponent },

  // -----------------------------------------------------------
  // Auth: registro de usuario
  // -----------------------------------------------------------
  { path: 'register', component: RegistroComponent },
   // -----------------------------------------------------------
  // Página del ticket generado tras comprar
  // Se usa loadComponent() → lazy loading del componente
  // Esto evita cargar el componente hasta que alguien acceda.
  // Se obtiene el :id de la compra (id_compra)
  // -----------------------------------------------------------
  {
    path: 'ticket/:id',
    loadComponent: () =>
      import('./paginas/ticket/ticket.component')
      .then(m => m.TicketComponent)
  },

];
