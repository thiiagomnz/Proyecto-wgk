export interface Producto{
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    disponible: boolean;
    cantidad?: number;
}