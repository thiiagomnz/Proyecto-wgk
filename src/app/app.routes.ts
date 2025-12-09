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

// ADMIN COMPONENTES
import { AdminComponent } from './paginas/admin/admin.component';
import { AgregarProductoComponent } from './paginas/admin-agregar/admin-agregar.component';
import { EditarProductoComponent } from './paginas/admin-editar/admin-editar.component';
export const routes: Routes = [

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

  {
  path: 'admin',
  canActivate: [AdminGuard],
  children: [
    { path: '', component: AdminComponent },             // LISTA
    { path: 'agregar', component: AgregarProductoComponent },
    { path: 'editar/:id', component: EditarProductoComponent }
  ]
},

  // Ticket dinámico
{
    path: 'ticket/:id',
    loadComponent: () =>
      import('./paginas/ticket/ticket.component')
        .then(m => m.TicketComponent)
},

  // Wildcard
  { path: '**', redirectTo: 'inicio' }

];
