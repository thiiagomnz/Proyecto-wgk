import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Producto } from '../../model/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritosService } from '../../servicios/favoritos.service';

@Component({
  selector: 'app-productos',
  standalone:true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  Productos: Producto[] = [
    {
      id: 1,
      nombre:'Air Jordan 1 Retro High OG Stage Haze',
      precio:150,
      imagen:'https://wegotkickspr.com/cdn/shop/files/1f7d4890632fc62abee07c5d149bdc99.jpg?v=1737598814&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
      id: 2,
      nombre:'Air Jordan 1 Retro High OG Universidad Azul',
      precio:250,
      imagen:'https://wegotkickspr.com/cdn/shop/files/ddae492e7a59c4fa328c5fe893ea5eea.jpg?v=1737598790&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
      id: 3,
      nombre:'Wmns Air Jordan 1 Retro High OG Satin Bred 2023',
      precio:140,
      imagen:'https://wegotkickspr.com/cdn/shop/files/accbaa576e8d7ad06cafef175bb884ae.jpg?v=1737598807&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
       id: 4,
      nombre:'Air Jordan 1 Retro High OG GS True Blue',
      precio:100,
      imagen:'https://wegotkickspr.com/cdn/shop/files/915f2df7ed2afd2195700b16951e39c3.jpg?v=1745004449&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
       id: 5,
      nombre:'Air Jordan 1 Retro High OG BG Negro Gimnasio Rojo',
      precio:140,
      imagen:'https://wegotkickspr.com/cdn/shop/products/f8f4e8e73d5c2ab1acc2ebfa140c0862.jpg?v=1701839318&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
       id: 6,
      nombre:'Air Jordan 11 Retro Columbia/Azul Leyenda 2024',
      precio:200,
      imagen:'https://wegotkickspr.com/cdn/shop/files/30f7409d18b497615eb4c20f793f685c.jpg?v=1745004478&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
       id: 7,
      nombre:'Air Jordan 11 Retro Momentos decisivos de 2023',
      precio:250,
      imagen:'https://wegotkickspr.com/cdn/shop/products/80491b5a2f519a34cafef37ef9a73e19.jpg?v=1710181082&width=600',
      disponible:true,
      marca:"Jordan",
    },
    {
       id: 8,
      nombre:'Air Jordan 11 Retro Paquete de momentos decisivos',
      precio:265,
      imagen:'https://wegotkickspr.com/cdn/shop/files/416e488f69b9f42af52c5e138bd85b5c.jpg?v=1730153558&width=600',
      disponible:true,
      marca:"Jordan",
    },
  ]
  constructor(private carritoService: CarritoService, private favoritoService: FavoritosService){}
    //metodo para agregar un producto

    agregar(producto:Producto){
      this.carritoService.agregarAlCarrito(producto)
      alert('producto agregado al carrito')
    } 

    agregarFav(producto:Producto){
      this.favoritoService.agregarAFavoritos(producto)
      alert('producto agregado a favorito')
    }


    searchTerm: string = '';

    selectedCategory: string = '';
    selectedBrand: string = '';
    minPrecio: number | null = null;
    maxPrecio: number | null = null;

    get marca(): string[]{
      return[... new Set(this.Productos.map(p=>p.marca))]
    }

    onSearch(event:Event):void{
      event.preventDefault();
    }

    resetFilters():void{
      this.searchTerm='';
      this.selectedCategory='';
      this.selectedBrand='';
      this.minPrecio = null;
      this.maxPrecio = null;    
    }

    get filteredProducts():Producto[]{
      return this.Productos.filter(p =>
      (this.searchTerm === '' || p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedBrand === '' || p.marca === this.selectedBrand) &&
      (this.minPrecio === null || p.precio>=this.minPrecio) &&
      (this.maxPrecio === null || p.precio<=this.maxPrecio)
      )
    }

    mostrarSubmenu: boolean = false;

filtrarPorMarca(marca: string): void {
  this.selectedBrand = marca;
}
}