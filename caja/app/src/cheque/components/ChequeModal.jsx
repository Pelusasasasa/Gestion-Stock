import React from 'react';
import { useChequeStore, useForm } from '../../hooks';

export const ChequeModal = ({cerrar}) => {

    const {chequeActive, startPostOne } = useChequeStore();
    const { onInputChange, formState, f_recibido, numero, banco, importe, f_cheque, ent_por, ent_a, domicilio, telefono} = useForm(chequeActive);



    const handleSubmit = (e) => {
        e.preventDefault();
        startPostOne(formState);
        cerrar(false);
    };

    const handlePutCheque = () => {

    };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-md bg-white'>
                <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>{chequeActive._id ? 'Modificar Cheque' : 'Agregar Cheque'}</h2>

                <form onSubmit={handleSubmit}>
                    
                    <div className='mb-4'>
                        <label htmlFor="f_recibido" className='block text-sm font-medium text-gray-700'>Fecha</label>
                        <input onChange={onInputChange} name='f_recibido' type="date" value={f_recibido?.slice(0, 10)} id="f_recibido" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="numero" className='block text-sm font-medium text-gray-700'>Numero</label>
                        <input onChange={onInputChange} name='numero' type="text" value={numero} id="numero" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="banco" className='block text-sm font-medium text-gray-700'>Banco</label>
                        <input onChange={onInputChange} name='banco' type="text" value={banco} id="banco" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="importe" className='block text-sm font-medium text-gray-700'>Importe</label>
                        <input onChange={onInputChange} name='importe' type="number" value={importe} id="importe" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="f_cheque" className='block text-sm font-medium text-gray-700'>Fecha Cheque</label>
                        <input onChange={onInputChange} name='f_cheque' type="date" value={f_cheque?.slice(0, 10)} id="f_cheque" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="ent_por" className='block text-sm font-medium text-gray-700'>Entregado Por</label>
                        <input onChange={onInputChange} name='ent_por' type="text" value={ent_por} id="ent_por" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="ent_a" className='block text-sm font-medium text-gray-700'>Entregado A</label>
                        <input onChange={onInputChange} name='ent_a' type="text" value={ent_a} id="ent_a" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="domicilio" className='block text-sm font-medium text-gray-700'>Domicilio</label>
                        <input onChange={onInputChange} name='domicilio' type="text" value={domicilio} id="domicilio" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="telefono" className='block text-sm font-medium text-gray-700'>Telefono</label>
                        <input onChange={onInputChange} name='telefono' type="text" value={telefono} id="telefono" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Botones */}
                    <div className='flex justify-end gap-4'>
                        <button type='button' onClick={() => cerrar(false)} className='text-white cursor-pointer px-4 py-2  hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!chequeActive._id && <button type='submit' className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {chequeActive._id && <button type='button' onClick={handlePutCheque} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}
                    </div>
                </form>
            </div>
        </div>
  )
}
