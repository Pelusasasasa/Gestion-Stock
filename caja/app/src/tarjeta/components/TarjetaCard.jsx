import React from 'react';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { useTarjetaStore } from '../../hooks/useTarjetaStore';

import Swal from 'sweetalert2';


export const TarjetaCard = ({ _id, fecha, nombre, tarjeta, importe, tipo, vendedor, modal }) => {

    const { startDeleteTarjeta, startSetActiveTarjeta } = useTarjetaStore();

    const handleDelete = async () => {

        const { isConfirmed } = await Swal.fire({
            title: 'Eliminar Una tarjeta',
            text: `Eliminar Tarjeta de ${nombre} con el importe $${importe}`,
            showCancelButton: true,
            confirmButtonText: 'Eliminar'
        });

        if (isConfirmed) {
            // console.log({ _id, nombre });
            startDeleteTarjeta(_id);
        };
    };

    const handleUpdate = async () => {
        startSetActiveTarjeta(_id);
        modal(true);
    };


    return (
        <div className='mx-20 p-5 border border-gray-300 rounded-xl'>
                    <div className='flex justify-between'>
                        <p className='font-bold'>Cliente: {nombre}</p>
                        <p className='font-bold'>${importe.toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between font-extralight'>
                        <p>Tarjeta: {tarjeta.nombre}</p>
                        <p>{tipo}</p>
                    </div>
                    <div className='flex justify-between font-extralight mt-2'>
                        <div>
                            <p>{fecha.slice(0, 10).split('-', 3).reverse().join('/')}</p>
                            <p>Vendedor: {vendedor}</p>
                        </div>
                        <div className='flex gap-5'>
                            <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                            <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                        </div>
                    </div>
        
                </div>
    )
}
