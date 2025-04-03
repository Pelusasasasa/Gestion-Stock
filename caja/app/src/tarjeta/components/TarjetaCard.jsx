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
        modal(true)
    };


    return (
        <tr className='hover:bg-gray-400 hover:cursor-pointer' id={_id}>
            <td className='border'>{fecha.slice(0, 10).split('-', 3).reverse().join('/')}</td>
            <td className='border'>{nombre}</td>
            <td className='border'>{tarjeta.nombre}</td>
            <td className='border text-right'>{importe.toFixed(2)}</td>
            <td className='border'>{tipo}</td>
            <td className='border'>{vendedor}</td>
            <td className='border'>
                <div className='flex gap-2 justify-around'>
                    <RiPencilFill size={25} onClick={handleUpdate} />
                    <MdDelete size={25} onClick={handleDelete} />
                </div>
            </td>
        </tr>
    )
}
