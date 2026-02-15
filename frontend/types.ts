// Tipos para el checkout público (landing page)

export interface ProductoCarrito {
  id: number;
  tempId?: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  tallaSeleccionada?: string;
  colorSeleccionado?: string;
  perfumeSeleccionado?: string;
}

export interface PedidoForm {
  nombre: string;
  telefono: string;
  email: string;
  cedula: string;
  departamento: string;
  municipio: string;
  direccion: string;
  barrio: string;
  notas: string;
}

export interface PedidoConfirmado {
  numeroPedido: string;
  email: string;
  productos: ProductoCarrito[];
  total: number;
  fecha: string;
}

export interface CuponValidacion {
  valido: boolean;
  mensaje?: string;
  descuento?: number;
  tipo?: 'porcentaje' | 'fijo';
}
