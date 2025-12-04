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
import { AdminGuard } from './paginas/guards/admin.guard';
import { AdminComponent } from './paginas/admin/admin.component';

export const routes: Routes = [

  // Redirect principal
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Páginas principales
  { path: 'inicio', component: InicioComponent },
  { path: 'producto', component: ProductosComponent },
  { path: 'producto/marca/:marca', component: ProductosComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'quienesomos', component: QuienesSomosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent },

  // Auth
  { path: 'iniciodesesion', component: IniciodesesionComponent },
  { path: 'registro', component: RegistroComponent },

  // Admin protegido con guard
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },

  // Ticket dinámico (lazy loading)
  {
    path: 'ticket/:id',
    loadComponent: () =>
      import('./paginas/ticket/ticket.component')
        .then(m => m.TicketComponent)
  },

  // Wildcard (siempre último)
  { path: '**', redirectTo: 'inicio' }

];
