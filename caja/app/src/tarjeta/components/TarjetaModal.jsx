import React, { useEffect } from 'react'
import { useForm } from '../../hooks/Useform';
import { useTiposTarjetasStore } from '../../hooks/UseTiposTarjetasStore';
import { useTarjetaStore } from '../../hooks/useTarjetaStore';
import { verificarDatosTarjeta } from '../../helpers/verificarDatos';


export const TarjetaModal = ({ cerrar }) => {


    const { tiposTarjetas, startGetTiposTarjetas } = useTiposTarjetasStore();
    const { tarjetaActive, startPostTarjeta, emptyActiveTarjeta, startUpdateTarjeta } = useTarjetaStore();
    const { nombre, importe, tipo, tarjeta, vendedor, fecha, onInputChange, formState } = useForm(tarjetaActive);

    useEffect(() => {
        startGetTiposTarjetas()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!verificarDatosTarjeta(formState)) return;

        formState.importe = parseFloat(formState.importe);

        startPostTarjeta(formState);
        cerrar(false);
    };

    const handlePutTarjeta = () => {
        if (!verificarDatosTarjeta(formState)) return;

        startUpdateTarjeta(formState)

        cerrar(false)
    };

    const cerrarModal = () => {
        if (tarjetaActive._id) {
            emptyActiveTarjeta()
        }
        cerrar(false);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-md bg-white'>
                <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>{tarjetaActive._id ? 'Modificar Tarjeta' : 'Agregar Tarjeta'}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Campo Titulo */}
                    <div className='mb-4'>
                        <label htmlFor="fecha" className='block text-sm font-medium text-gray-700'>Fecha</label>
                        <input onChange={onInputChange} name='fecha' type="date" value={fecha?.slice(0, 10)} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Campo Usuario */}
                    <div className='mb-4'>
                        <label htmlFor="nombre" className='block text-sm font-medium text-gray-700'>Nombre</label>
                        <input onChange={onInputChange} name='nombre' value={nombre} id="nombre" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Campo TipoTarjeta */}
                    <div className='mb-4'>
                        <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Tarjeta</label>
                        <select name="tarjeta" id="tarjeta" value={tarjeta?._id} onChange={onInputChange} className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                            <option value="">---Seleccionar Una Opcion---</option>
                            {tiposTarjetas.map((elem) => (
                                <option key={elem._id} value={elem._id}>{elem.nombre}</option>
                            ))}
                        </select>
                    </div>


                    <div className='mb-4'>
                        <label htmlFor="importe" className='block text-sm font-medium text-gray-700'>Importe</label>
                        <input type="number" name="importe" id="importe" onChange={onInputChange} value={importe} className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="tipo" className='block text-sm font-medium text-gray-700'>Tipo</label>
                        <input type="text" name="tipo" id="tipo" value={tipo} onChange={onInputChange} className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="vendedor" className='block text-sm font-medium text-gray-700'>Vendedor</label>
                        <input type="text" name="vendedor" id="vendedor" value={vendedor} onChange={onInputChange} className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Botones */}
                    <div className='flex justify-end gap-4'>
                        <button type='button' onClick={cerrarModal} className='text-white cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!tarjetaActive._id && <button type='submit' className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {tarjetaActive._id && <button type='button' onClick={handlePutTarjeta} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TarjetaModal