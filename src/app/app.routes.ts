import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ProductosComponent } from './paginas/productos/productos.component';
import { QuienesSomosComponent } from './paginas/quienes-somos/quienes-somos.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { FavoritosComponent } from './paginas/favoritos/favoritos.component';
import { ContactosComponent } from './paginas/contactos/contactos.component';
import { CompraComponent } from './paginas/compra/compra.component';
import { IniciodesesionComponent } from './paginas/iniciodesesion/iniciodesesion.component';
import { RegistroComponent } from './paginas/registro/registro.component';

export const routes: Routes = [
    { path: "", redirectTo: "/inicio", pathMatch: "full" },

    { path: "inicio", component: InicioComponent },

    { path: "contacto", component: ContactosComponent },

    { path: "producto", component: ProductosComponent },

    { path: "quienesomos", component: QuienesSomosComponent },

    { path: "carrito", component: CarritoComponent },

    { path: "favoritos", component: FavoritosComponent },

    { path: "compra", component: CompraComponent },

    { path: "iniciodesesion", component: IniciodesesionComponent },

    { path: "registro", component: RegistroComponent },

    { path: "producto", component: ProductosComponent },

    { path: "producto/:marca", component: ProductosComponent },
];
