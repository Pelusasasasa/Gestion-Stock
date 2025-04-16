import React, { useEffect } from 'react';
import { useForm } from "../../hooks/Useform";
import { useMovimientoStore } from "../../hooks/useMovimientoStore";
import { useTipoCuentaStore } from "../../hooks/useTipoCuentaStore";



const MovCajaModal = ({ cerrar }) => {

    const { movimientoActive, startPostOneMov } = useMovimientoStore();
    const { tipoCuentas, startGetsTiposCuentas, startGetsTiposCuentasFilter } = useTipoCuentaStore();

    const { onInputChange, fecha, descripcion, condicion, tipo, puntoVenta, numero, importe, vendedor, formState } = useForm(movimientoActive);

    useEffect(() => {
        startGetsTiposCuentas();
        startGetsTiposCuentasFilter(tipo);
    }, []);

    useEffect(() => {
        startGetsTiposCuentasFilter(condicion);
    }, [condicion])

    const handleSubmit = (e) => {
        e.preventDefault();
        startPostOneMov(formState);
    };

    const handlePutEvento = () => {

    }

    const cerrarModal = () => {
        //TODO DE EMPTYMOVIMIENTOS

        cerrar(false);
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-md bg-white'>
                <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>{movimientoActive._id ? 'Modificar Movimiento Caja' : 'Agregar Movimiento Caja'}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Campo Titulo */}
                    <div className='mb-4'>
                        <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Fecha*</label>
                        <input onChange={onInputChange} name='fecha' type="date" value={fecha || ''} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="descripcion" className='block text-sm font-medium text-gray-700'>Descripcion</label>
                        <input onChange={onInputChange} name='descripcion' type="text" value={descripcion || ''} id="descripcion" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="puntoVenta" className='block text-sm font-medium text-gray-700'>Numero Comprobante</label>
                        <div className='grid grid-cols-[1fr_2fr] gap-2'>
                            <input onChange={onInputChange} name='puntoVenta' type="text" value={puntoVenta || ''} id="puntoVenta" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                            <input onChange={onInputChange} name='numero' type="text" value={numero || ''} id="numero" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="condicion" className='block text-sm font-medium text-gray-700'>Condicion</label>
                        <select onChange={onInputChange} name='condicion' type="text" value={condicion || ''} id="condicion" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                            <option value="">---Seleccionar---</option>
                            <option value="E">Egreso</option>
                            <option value="I">Ingreso</option>
                        </select>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="tipo" className='block text-sm font-medium text-gray-700'>Cuenta*</label>
                        <select name="tipo" id="tipo" value={tipo || ''} onChange={onInputChange} className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                            <option value=" ">---Seleccionar---</option>
                            {
                                tipoCuentas.map((elem) => (
                                    <option key={elem._id} value={elem._id}>
                                        {elem.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="importe" className='block text-sm font-medium text-gray-700'>Importe</label>
                        <input onChange={onInputChange} name='importe' type="number" value={importe || ''} id="importe" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="vendedor" className='block text-sm font-medium text-gray-700'>Vendedor</label>
                        <input onChange={onInputChange} name='vendedor' type="text" value={vendedor || ''} id="vendedor" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>


                    {/* Botones */}
                    <div className='flex justify-end gap-4'>
                        <button type='button' onClick={cerrarModal} className='text-black border-gray-400 border rounded-lg cursor-pointer px-4 py-2 hover:bg-gray-200 hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!movimientoActive._id && <button type='submit' className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {movimientoActive._id && <button type='button' onClick={handlePutEvento} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MovCajaModal