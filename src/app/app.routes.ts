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
  { path: '**', redirectTo: '/inicio' }
];
