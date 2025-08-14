import React from 'react'
import { useProvedorStore } from '../../hooks/useProvedorStore'
import { useForm } from '../../hooks/Useform';
import { vefiricarDatosProvedor } from '../../helpers/verificarDatos';

export const ProvedorModal = ({ cerrar }) => {

    const { provedorActive, startPostOne, startPatchOne } = useProvedorStore();
    const { domicilio, cuit, iva, nombre, localidad, codPostal, provincia, telefono, mail, onInputChange, formState } = useForm(provedorActive);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!await vefiricarDatosProvedor(formState)) return;

        startPostOne(formState);
        cerrar(false);

    };

    const handlePatchProvedor = async () => {
        if (!await vefiricarDatosProvedor(formState)) return;

        startPatchOne(formState);
        cerrar(false);
    };

    const cerrarModal = () => {
        cerrar(false)
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-3xl bg-gray-500'>
                <h2 className='text-center text-2xl font-bold text-gray-100 mb-6'>{provedorActive._id ? 'Modificar Provedor' : 'Agregar Provedor'}</h2>

                <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-10'>

                    {/* Campo Nombre */}
                    <div className='mb-1'>
                        <label htmlFor="nombre" className='block text-sm font-medium text-gray-100'>Nombre*</label>
                        <input onChange={onInputChange} name='nombre' type="text" value={nombre} id="nombre" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="cuit" className='block text-sm font-medium text-gray-100'>Cuit*</label>
                        <input onChange={onInputChange} name='cuit' type="text" value={cuit} id="cuit" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="iva" className='block text-sm font-medium text-gray-100'>Condicion Iva*</label>
                        <select onChange={onInputChange} name='iva' type="text" value={iva} id="iva" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                            <option value="">---Seleccionar---</option>
                            <option value="Consumidor Final">Consumidor Final</option>
                            <option value="Monotributo">Monotributo</option>
                            <option value="Responsable inscripto">Responsable inscripto</option>
                            <option value="Exento">Exento</option>
                        </select>
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="domicilio" className='block text-sm font-medium text-gray-100'>Domicilio*</label>
                        <input onChange={onInputChange} name='domicilio' type="text" value={domicilio} id="domicilio" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="localidad" className='block text-sm font-medium text-gray-100'>Localidad*</label>
                        <input onChange={onInputChange} name='localidad' type="text" value={localidad} id="localidad" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="codPostal" className='block text-sm font-medium text-gray-100'>Codigo Postal*</label>
                        <input onChange={onInputChange} name='codPostal' type="text" value={codPostal} id="codPostal" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="provincia" className='block text-sm font-medium text-gray-100'>Provincia</label>
                        <input onChange={onInputChange} name='provincia' type="text" value={provincia} id="provincia" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="telefono" className='block text-sm font-medium text-gray-100'>Telefono</label>
                        <input onChange={onInputChange} name='telefono' type="text" value={telefono} id="telefono" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="mail" className='block text-sm font-medium text-gray-100'>E-Mail</label>
                        <input onChange={onInputChange} name='mail' type="email" value={mail} id="mail" className='bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Botones */}
                    <div className='flex items-end justify-end gap-4'>
                        <button type='button' onClick={cerrarModal} className='text-white border border-gray-300 rounded-lg cursor-pointer px-4 py-2 hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!provedorActive._id && <button type='submit' className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {provedorActive._id && <button type='button' onClick={handlePatchProvedor} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}
