"use client";

import { useState } from 'react';

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
import { Minus, Plus, Trash2, Ticket, X, Check, Loader2, AlertCircle } from 'lucide-react';

interface FieldError {
  field: string;
  message: string;
}

const REQUIRED_FIELDS: { field: keyof import('@/types').PedidoForm; label: string }[] = [
  { field: 'nombre', label: 'Nombre completo' },
  { field: 'telefono', label: 'Teléfono / WhatsApp' },
  { field: 'email', label: 'Correo electrónico' },
  { field: 'cedula', label: 'Cédula / Documento' },
  { field: 'departamento', label: 'Departamento' },
  { field: 'municipio', label: 'Municipio' },
  { field: 'direccion', label: 'Dirección de entrega' },
];
import { departamentosMunicipios } from '@/constants';
import { ModalExito } from './ModalExito';
import type { ProductoCarrito, PedidoForm, PedidoConfirmado, CuponValidacion } from '@/types';

interface CheckoutViewProps {
  carrito: ProductoCarrito[];
  totalCarrito: number;
  formData: PedidoForm;
  enviandoEmail: boolean;
  mostrarModalExito: boolean;
  pedidoConfirmado: PedidoConfirmado | null;
  // Cupones
  cuponCodigo?: string;
  cuponAplicado?: CuponValidacion | null;
  totalConDescuento?: number;
  onValidarCupon?: (codigo: string, subtotal: number) => Promise<CuponValidacion>;
  onAplicarCupon?: (codigo: string, descuento: CuponValidacion) => void;
  onRemoverCupon?: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onActualizarCantidad: (id: number, cambio: number, tempId?: string) => void;
  onRemoverProducto: (producto: ProductoCarrito) => void;
  onConfirmar: () => void;
  onCerrarModal: () => void;
  onVolver: () => void;
}

export function CheckoutView({
  carrito,
  totalCarrito,
  formData,
  enviandoEmail,
  mostrarModalExito,
  pedidoConfirmado,
  cuponCodigo = '',
  cuponAplicado,
  totalConDescuento,
  onValidarCupon,
  onAplicarCupon,
  onRemoverCupon,
  onInputChange,
  onActualizarCantidad,
  onRemoverProducto,
  onConfirmar,
  onCerrarModal,
  onVolver
}: CheckoutViewProps) {
  const [inputCupon, setInputCupon] = useState(cuponCodigo);
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [errorCupon, setErrorCupon] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const validateForm = (): boolean => {
    const errors: FieldError[] = [];
    for (const { field, label } of REQUIRED_FIELDS) {
      if (!formData[field] || !formData[field].trim()) {
        errors.push({ field, message: `${label} es obligatorio` });
      }
    }
    // Validate email format
    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      const existing = errors.find(e => e.field === 'email');
      if (!existing) errors.push({ field: 'email', message: 'Correo electrónico no válido' });
    }
    // Validate phone (at least 7 digits)
    if (formData.telefono && formData.telefono.trim() && !/^\d{7,}$/.test(formData.telefono.trim().replace(/[\s\-\+]/g, ''))) {
      const existing = errors.find(e => e.field === 'telefono');
      if (!existing) errors.push({ field: 'telefono', message: 'Teléfono no válido (mínimo 7 dígitos)' });
    }
    setFieldErrors(errors);
    if (errors.length > 0) {
      // Scroll to the first error field
      const firstErrorField = document.querySelector(`[name="${errors[0].field}"]`);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return errors.length === 0;
  };

  const handleConfirmar = () => {
    if (validateForm()) {
      onConfirmar();
    }
  };

  const getFieldError = (field: string) => fieldErrors.find(e => e.field === field);
  const hasFieldError = (field: string) => fieldErrors.some(e => e.field === field);

  // Clear field error when user types
  const handleInputChangeWithClear = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    if (hasFieldError(name)) {
      setFieldErrors(prev => prev.filter(err => err.field !== name));
    }
    onInputChange(e);
  };

  const handleValidarCupon = async () => {
    if (!inputCupon.trim() || !onValidarCupon) return;

    setValidandoCupon(true);
    setErrorCupon('');

    try {
      const resultado = await onValidarCupon(inputCupon.trim().toUpperCase(), totalCarrito);
      if (resultado.valido && onAplicarCupon) {
        onAplicarCupon(inputCupon.trim().toUpperCase(), resultado);
        setErrorCupon('');
      } else {
        setErrorCupon(resultado.mensaje || 'Cupón no válido');
      }
    } catch (error) {
      setErrorCupon('Error al validar cupón');
    } finally {
      setValidandoCupon(false);
    }
  };

  const handleRemoverCupon = () => {
    setInputCupon('');
    setErrorCupon('');
    if (onRemoverCupon) onRemoverCupon();
  };

  const totalFinal = totalConDescuento ?? totalCarrito;
  const descuentoAplicado = cuponAplicado?.valido ? cuponAplicado.descuento || 0 : 0;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onVolver}
          className="mb-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-light text-sm tracking-wide"
        >
          ← VOLVER
        </button>

        <div className="border border-gray-200 p-6 sm:p-10 light-form">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-500 mb-10 font-light text-sm">Completa tus datos para procesar tu pedido</p>

          {/* Error summary */}
          {fieldErrors.length > 0 && (
            <div className="mb-8 p-4 border border-red-300 bg-red-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm font-medium text-red-700">Por favor completa los siguientes campos:</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {fieldErrors.map(err => (
                  <li key={err.field} className="text-sm text-red-600">{err.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Columna izquierda - Datos */}
            <div className="space-y-8">
              {/* Datos del Comprador */}
              <div>
                <h2 className="text-lg font-light tracking-wide text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Datos del Comprador
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      NOMBRE COMPLETO *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none placeholder-gray-400 ${hasFieldError('nombre') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                    {getFieldError('nombre') && <p className="text-xs text-red-500 mt-1">{getFieldError('nombre')!.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      TELÉFONO / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none placeholder-gray-400 ${hasFieldError('telefono') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      placeholder="Ej: 3001234567"
                      required
                    />
                    {getFieldError('telefono') && <p className="text-xs text-red-500 mt-1">{getFieldError('telefono')!.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      CORREO ELECTRÓNICO *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none placeholder-gray-400 ${hasFieldError('email') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                    {getFieldError('email') && <p className="text-xs text-red-500 mt-1">{getFieldError('email')!.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      CÉDULA / DOCUMENTO *
                    </label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none placeholder-gray-400 ${hasFieldError('cedula') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      placeholder="Número de documento"
                      required
                    />
                    {getFieldError('cedula') && <p className="text-xs text-red-500 mt-1">{getFieldError('cedula')!.message}</p>}
                  </div>
                </div>
              </div>

              {/* Datos de Envío */}
              <div>
                <h2 className="text-lg font-light tracking-wide text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Datos de Envío
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      DEPARTAMENTO *
                    </label>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none ${hasFieldError('departamento') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      required
                    >
                      <option value="">Selecciona departamento</option>
                      {Object.keys(departamentosMunicipios).map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    {getFieldError('departamento') && <p className="text-xs text-red-500 mt-1">{getFieldError('departamento')!.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      MUNICIPIO *
                    </label>
                    <select
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none disabled:bg-gray-100 disabled:text-gray-500 ${hasFieldError('municipio') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      required
                      disabled={!formData.departamento}
                    >
                      <option value="">
                        {formData.departamento ? 'Selecciona municipio' : 'Primero selecciona departamento'}
                      </option>
                      {formData.departamento && departamentosMunicipios[formData.departamento].map(mun => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                    {getFieldError('municipio') && <p className="text-xs text-red-500 mt-1">{getFieldError('municipio')!.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      DIRECCIÓN DE ENTREGA *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChangeWithClear}
                      className={`w-full px-4 py-3 border bg-white text-gray-900 focus:ring-1 font-light rounded-none placeholder-gray-400 ${hasFieldError('direccion') ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'}`}
                      placeholder="Calle, carrera, número..."
                      required
                    />
                    {getFieldError('direccion') && <p className="text-xs text-red-500 mt-1">{getFieldError('direccion')!.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      BARRIO
                    </label>
                    <input
                      type="text"
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleInputChangeWithClear}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="Nombre del barrio"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Resumen */}
            <div>
              <h2 className="text-lg font-light tracking-wide text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Resumen del Pedido
              </h2>
              <div className="space-y-6">
                {carrito.map((item, index) => (
                  <div key={`${item.id}-${item.tallaSeleccionada || ''}-${item.colorSeleccionado || ''}-${index}`} className="pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-light text-gray-900 text-sm">{item.nombre}</div>
                        {(item.tallaSeleccionada || item.colorSeleccionado) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.tallaSeleccionada && <span>Talla: {item.tallaSeleccionada}</span>}
                            {item.tallaSeleccionada && item.colorSeleccionado && <span> / </span>}
                            {item.colorSeleccionado && <span>Color: {item.colorSeleccionado}</span>}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoverProducto(item)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onActualizarCantidad(item.id, -1, item.tempId)}
                          className="w-8 h-8 border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-900 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium text-sm w-8 text-center text-gray-900">{item.cantidad}</span>
                        <button
                          onClick={() => onActualizarCantidad(item.id, 1, item.tempId)}
                          className="w-8 h-8 border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-900 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-light mb-1">
                          {formatCOP(item.precio)} c/u
                        </div>
                        <div className="font-light text-gray-900">
                          {formatCOP(item.precio * item.cantidad)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cupón de descuento */}
                {onValidarCupon && (
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      CUPÓN DE DESCUENTO
                    </label>
                    {cuponAplicado?.valido ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">{cuponCodigo}</span>
                          <span className="text-xs text-green-600">-{formatCOP(descuentoAplicado)}</span>
                        </div>
                        <button
                          onClick={handleRemoverCupon}
                          className="p-1 text-green-600 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={inputCupon}
                            onChange={(e) => {
                              setInputCupon(e.target.value.toUpperCase());
                              setErrorCupon('');
                            }}
                            placeholder="Código de cupón"
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light text-sm rounded-none"
                          />
                        </div>
                        <button
                          onClick={handleValidarCupon}
                          disabled={validandoCupon || !inputCupon.trim()}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {validandoCupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APLICAR'}
                        </button>
                      </div>
                    )}
                    {errorCupon && (
                      <p className="text-xs text-red-500 mt-1">{errorCupon}</p>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-gray-300">
                  {descuentoAplicado > 0 && (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-light text-gray-600">Subtotal</span>
                        <span className="text-sm font-light text-gray-600">{formatCOP(totalCarrito)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-light text-green-600">Descuento</span>
                        <span className="text-sm font-light text-green-600">-{formatCOP(descuentoAplicado)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-light tracking-wide text-gray-600">TOTAL</span>
                    <span className="text-xl font-light text-gray-900">{formatCOP(totalFinal)}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                    NOTAS ADICIONALES
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChangeWithClear}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light text-sm resize-none rounded-none placeholder-gray-400"
                    placeholder="Instrucciones especiales, preferencias de entrega..."
                  />
                </div>

                <button
                  onClick={handleConfirmar}
                  disabled={enviandoEmail}
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-4 transition-colors tracking-widest text-sm mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {enviandoEmail ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pedido Exitoso */}
      {mostrarModalExito && pedidoConfirmado && (
        <ModalExito pedido={pedidoConfirmado} onCerrar={onCerrarModal} />
      )}
    </div>
  );
}
