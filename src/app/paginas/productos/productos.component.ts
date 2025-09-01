import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Producto } from '../../model/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';
import { BuscadorService } from '../../servicios/buscador.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Productos: Producto[] = [
    { id: 1, nombre: 'Air Jordan 1 Retro High OG GS Patent Bred', precio: 260, imagen: 'https://wegotkickspr.com/cdn/shop/products/cd31c8f79b89e01ae8f171d2bef75071.jpg?v=1704754148&width=600', disponible: true, marca: "Jordan 1", tallesDisponibles: [39, 40, 43, 44] },
    { id: 2, nombre: 'Wmns Air Jordan 1 Retro High OG Satin Bred 2023', precio: 140, imagen: 'https://wegotkickspr.com/cdn/shop/files/accbaa576e8d7ad06cafef175bb884ae.jpg?v=1737598807&width=600', disponible: true, marca: "Jordan 1", tallesDisponibles: [40.5, 41, 41.5, 42,] },
    { id: 3, nombre: 'Air Jordan 1 Low Bred Toe 2.0', precio: 150, imagen: 'https://wegotkickspr.com/cdn/shop/products/87af1f1e7f156f9ff3c4d4c891f44ade.jpg?v=1710181084&width=600', disponible: true, marca: "Jordan 1", tallesDisponibles: [38, 41, 42, 43] },
    { id: 8, nombre: 'Air Jordan 1 Retro High OG University Blue', precio: 250, imagen: 'https://wegotkickspr.com/cdn/shop/files/ddae492e7a59c4fa328c5fe893ea5eea.jpg?v=1737598790&width=600', disponible: true, marca: "Jordan 1", tallesDisponibles: [42.5, 43, 44, 44.5] },
    { id: 9, nombre: 'Air Jordan 1 Retro High OG GS True Blue', precio: 100, imagen: 'https://wegotkickspr.com/cdn/shop/files/915f2df7ed2afd2195700b16951e39c3.jpg?v=1745004449&width=600', disponible: true, marca: "Jordan 1", tallesDisponibles: [40, 40.5, 41, 42] },
    { id: 13, nombre: 'Wmns Air Jordan 1 Low White Wolf Grey', precio: 155, imagen: 'https://wegotkickspr.com/cdn/shop/products/a97b2aa7d31a15814685a846d71444a7.jpg?v=1700419999&width=600', disponible: true, marca: "Jordan 1", tallesDisponibles: [38, 39, 40, 41] },
    { id: 4, nombre: 'Bad Bunny x Forum Buckle Low Last Forum', precio: 280, imagen: 'https://wegotkickspr.com/cdn/shop/products/19ae08105d61f8c8aa41a80fe028c6a6.jpg?v=1701203008&width=600', disponible: true, marca: "Adidas", tallesDisponibles: [42, 44, 44.5, 45] },
    { id: 14, nombre: 'Bad Bunny x Campus Moon Cloud White', precio: 230, imagen: 'https://wegotkickspr.com/cdn/shop/products/51d8692114a3d592c7d6f3334a21fec2.jpg?v=1702591604&width=600', disponible: true, marca: "Adidas", tallesDisponibles: [43, 44, 44.5, 45] },
    { id: 15, nombre: 'Bad Bunny x Campus Chalky Brown', precio: 235, imagen: 'https://wegotkickspr.com/cdn/shop/products/e6929256b04fcefff2a2fd2a79090adf.jpg?v=1700183583&width=600', disponible: true, marca: "Adidas", tallesDisponibles: [41, 42, 43, 44] },
    { id: 16, nombre: 'Bad Bunny X Gazelle Indoor San Juan', precio: 300, imagen: 'https://wegotkickspr.com/cdn/shop/files/1_27c19591-8a80-456e-ac83-a8ff5fe9ccab.jpg?v=1718999769&width=600s', disponible: true, marca: "Adidas", tallesDisponibles: [39, 40, 41, 42] },
    { id: 17, nombre: 'Bad Bunny x Forum Buckle Low Blue Tint', precio: 300, imagen: 'https://wegotkickspr.com/cdn/shop/products/f0288a63bf34f8ad9e823bf86c8a5582.jpg?v=1704754153&width=600', disponible: true, marca: "Adidas", tallesDisponibles: [38, 39, 40, 41] },
    { id: 18, nombre: 'Bad Bunny x Response CL Cream White', precio: 300, imagen: 'https://wegotkickspr.com/cdn/shop/files/79a5b8415780c277b62928e820efae9c.jpg?v=1730153569&width=600', disponible: true, marca: "Adidas", tallesDisponibles: [42, 43, 44, 45] },
    { id: 5, nombre: 'Air Jordan 11 Retro Defining Moments 2023', precio: 250, imagen: 'https://wegotkickspr.com/cdn/shop/products/80491b5a2f519a34cafef37ef9a73e19.jpg?v=1710181082&width=600', disponible: true, marca: "Jordan Retro 11", tallesDisponibles: [40.5, 44, 44.5, 42.5] },
    { id: 6, nombre: 'Air Jordan 11 Retro Columbia / Legend Blue 2024', precio: 200, imagen: 'https://wegotkickspr.com/cdn/shop/files/30f7409d18b497615eb4c20f793f685c.jpg?v=1745004478&width=600', disponible: true, marca: "Jordan Retro 11", tallesDisponibles: [40, 40.5, 41, 42] },
    { id: 7, nombre: 'Air Jordan 6/11 Retro LE DMP Defining Moments Pack', precio: 265, imagen: 'https://wegotkickspr.com/cdn/shop/files/416e488f69b9f42af52c5e138bd85b5c.jpg?v=1730153558&width=600', disponible: true, marca: "Jordan Retro 11", tallesDisponibles: [42, 42.5, 43, 44] },
    { id: 19, nombre: 'Air Jordan 11 Retro GS Gratitude / Defining Moments', precio: 180, imagen: 'https://wegotkickspr.com/cdn/shop/products/534d4d44ccff33561f7da22f5055b98f.jpg?v=1710303879&width=600', disponible: true, marca: "Jordan Retro 11", tallesDisponibles: [40, 41, 42, 43] },
    { id: 20, nombre: 'Wmns Air Jordan 11 Retro Neapolitan', precio: 255, imagen: 'https://wegotkickspr.com/cdn/shop/products/5dd43c1f540228ed4c9901f98df57591.jpg?v=1700419993&width=600', disponible: true, marca: "Jordan Retro 11", tallesDisponibles: [40, 41, 42, 43] },
    { id: 21, nombre: 'Air Jordan 11 Retro Cherry', precio: 250, imagen: 'https://wegotkickspr.com/cdn/shop/files/85561dcbd33a0033e76c0290e62f171e.jpg?v=1730153528&width=600', disponible: true, marca: "Jordan Retro 11", tallesDisponibles: [42, 43, 44, 45] },
    { id: 22, nombre: 'Air Jordan 4 Retro White Thunder', precio: 300, imagen: 'https://wegotkickspr.com/cdn/shop/files/1_e56c737f-c496-4a06-9a0c-b3d42824c7d7.jpg?v=1721769906&width=600', disponible: true, marca: 'Jordan Retro 4', tallesDisponibles: [38, 39, 40, 41] },
    { id: 23, nombre: 'Air Jordan 4 Retro Fear 2024', precio: 320, imagen: 'https://wegotkickspr.com/cdn/shop/files/1-4.jpg?v=1730302595&width=713', disponible: true, marca: 'Jordan Retro 4', tallesDisponibles: [42, 43, 44, 45] },
    { id: 24, nombre: 'Air Jordan 4 Retro GS Bred Reimagined', precio: 220, imagen: 'https://wegotkickspr.com/cdn/shop/products/75ee82fbe0773a6fca2a9ff86138104a.jpg?v=1710181078&width=713', disponible: true, marca: 'Jordan Retro 4', tallesDisponibles: [37, 38, 39, 40] },
    { id: 25, nombre: 'Air Jordan 4 Retro Military Blue 2024', precio: 250, imagen: 'https://wegotkickspr.com/cdn/shop/files/Military.jpg?v=1715050398&width=600', disponible: true, marca: 'Jordan Retro 4', tallesDisponibles: [38, 39, 40, 41] },
    { id: 26, nombre: 'Air Jordan 4 Retro Lightning 2021', precio: 300, imagen: 'https://wegotkickspr.com/cdn/shop/products/ac727216876ab952a2be19bf9bbe4028.jpg?v=1701124946&width=713', disponible: true, marca: 'Jordan Retro 4', tallesDisponibles: [42, 43, 44] },
    { id: 27, nombre: 'Air Jordan 4 Retro Red Thunder', precio: 400, imagen: 'https://wegotkickspr.com/cdn/shop/products/b3496591de6964b82e6ed7672d773e49.jpg?v=1701124962&width=713', disponible: true, marca: 'Jordan Retro 4', tallesDisponibles: [42, 43, 44, 45] },
    { id: 28, nombre: 'J. Balvin x Air Jordan 3 Retro Medellin Sunset', precio: 470, imagen: 'https://wegotkickspr.com/cdn/shop/files/7c68c7f9345dcf248e2e0e81e3d123b1.jpg?v=1712016115&width=713', disponible: true, marca: 'Jordan Retro 3', tallesDisponibles: [42,43,44,44.5] },
    { id: 29, nombre: 'J. Balvin x Air Jordan 3 Retro Rio', precio: 340, imagen: 'https://wegotkickspr.com/cdn/shop/files/05c36c3e0ae3e8cc25d3625850aba2bf.jpg?v=1730153459&width=713', disponible: true, marca: 'Jordan Retro 3', tallesDisponibles: [41,42,43,44] },
    { id: 30, nombre: 'Air Jordan 3 Retro Fire Red 2022', precio: 270, imagen: 'https://wegotkickspr.com/cdn/shop/products/c43820fee9eaded3690bad02292d574b.jpg?v=1700082055&width=713', disponible: true, marca: 'Jordan Retro 3', tallesDisponibles: [40,41,42,43] },
    { id: 31, nombre: 'A Ma Maniere x Wmns Air Jordan 3 Retro Black Violet Ore', precio: 230, imagen: 'https://wegotkickspr.com/cdn/shop/files/1-6.jpg?v=1730302957&width=713', disponible: true, marca: 'Jordan Retro 3', tallesDisponibles: [42,43,44,45] },
    { id: 32, nombre: 'Air Jordan 3 Retro Black Cat 2025', precio: 220, imagen: 'https://wegotkickspr.com/cdn/shop/files/a58b3a909b657cac8f1f354ed9cc9eb7.jpg?v=1745004458&width=713', disponible: true, marca: 'Jordan Retro 3', tallesDisponibles: [43,44,45,46] },
    { id: 33, nombre: 'Air Jordan 3 Retro GS Dark Iris', precio: 160, imagen: 'https://wegotkickspr.com/cdn/shop/files/e26d56f561ef3667e692bccb5affc0d7.jpg?v=1737598810&width=713', disponible: true, marca: 'Jordan Retro 3', tallesDisponibles: [37,38,39,40] },
    { id: 34, nombre: 'Travis Scott x Air Jordan 1 Low Mocha', precio: 1800, imagen: 'https://wegotkickspr.com/cdn/shop/files/218a407634f29bd2269c6e71d48c9204.jpg?v=1718654798&width=713', disponible: true, marca: 'Artistas', tallesDisponibles: [43,44,45,46] },
    { id: 35, nombre: 'Travis Scott x Dunk Low Premium QS SB Cactus Jack', precio: 1250, imagen: 'https://wegotkickspr.com/cdn/shop/products/379b70171ebc5dd77dc2b6097af169a7.jpg?v=1700888655&width=713', disponible: true, marca: 'Artistas', tallesDisponibles: [40,41,42,43] },
    { id: 36, nombre: 'Bad Bunny x Response CL Yellow', precio: 800, imagen: 'https://wegotkickspr.com/cdn/shop/files/aab366554eca0adab46c13c888a3fe61.jpg?v=1756229247&width=713', disponible: true, marca: 'Artistas', tallesDisponibles: [41,42,43,44] },
    { id: 37, nombre: 'Anuel AA x Classic Leather The Sky Above The Street', precio: 150, imagen: 'https://wegotkickspr.com/cdn/shop/products/b8b6f1d10c4a55af695a76e461108990.jpg?v=1701730877&width=713', disponible: true, marca: 'Artistas', tallesDisponibles: [42,43,44,45] },
    { id: 38, nombre: 'Bad Bunny x Forum Buckle Low Cangrejeros', precio: 600, imagen: 'https://wegotkickspr.com/cdn/shop/files/a8d5bfed60ed0779a26cb302871e38f1.jpg?v=1718654804&width=1100', disponible: true, marca: 'Artistas', tallesDisponibles: [43,44,45,46] },
    { id: 39, nombre: 'Travis Scott x Air Force 1 Utopia', precio: 180, imagen: 'https://wegotkickspr.com/cdn/shop/files/46496a46178c7bf2fc029918e7eb25a7.jpg?v=1721185631&width=713', disponible: true, marca: 'Artistas', tallesDisponibles: [39,40,41,42] },
  ];

  seleccionados: { [id: number]: number[] } = {};
  marcaSeleccionada: string = 'Todas';
  busqueda: string = '';

  constructor(
    private carritoService: CarritoService,
    private favoritoService: FavoritosService,
    private route: ActivatedRoute,
    public buscadorService: BuscadorService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const marca = params.get('marca');
      this.marcaSeleccionada = marca ? marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase() : 'Todas';
    });

    this.buscadorService.busqueda$.subscribe(texto => {
      this.busqueda = texto;
    });
  }

  get productosFiltrados(): Producto[] {
    return this.Productos.filter(p => {
      const coincideMarca = this.marcaSeleccionada === 'Todas' || p.marca.toLowerCase() === this.marcaSeleccionada.toLowerCase();
      const coincideNombre = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideMarca && coincideNombre;
    });
  }

  toggleTalle(producto: Producto, talle: number) {
    if (!producto.tallesDisponibles.includes(talle)) return;
    if (!this.seleccionados[producto.id]) this.seleccionados[producto.id] = [];
    const idx = this.seleccionados[producto.id].indexOf(talle);
    if (idx > -1) this.seleccionados[producto.id].splice(idx, 1);
    else this.seleccionados[producto.id].push(talle);
  }

  esSeleccionado(producto: Producto, talle: number): boolean {
    return (this.seleccionados[producto.id] || []).includes(talle);
  }

  agregar(producto: Producto) {
    const tallesSeleccionados = this.seleccionados[producto.id] || [];
    if (tallesSeleccionados.length === 0) {
      alert("Selecciona al menos un talle");
      return;
    }
    tallesSeleccionados.forEach(talle => this.carritoService.agregarAlCarrito({ producto, talle }));
    alert(`Agregado al carrito: ${tallesSeleccionados.length} unidad(es)`);
    this.seleccionados[producto.id] = [];
  }

  agregarFav(producto: Producto) {
    this.favoritoService.agregarAFavoritos(producto);
    alert('Producto agregado a favoritos');
  }
}
