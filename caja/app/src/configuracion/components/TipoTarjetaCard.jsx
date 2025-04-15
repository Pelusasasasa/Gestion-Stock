import React from 'react'
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

import { useTiposTarjetasStore } from '../../hooks/UseTiposTarjetasStore';
import Swal from 'sweetalert2';

export const TipoTarjetaCard = ({ _id, nombre, }) => {
    const { startDeleteTipoTarjetas, startPutTiposTarjetas } = useTiposTarjetasStore();

    const handleDelete = () => {
        startDeleteTipoTarjetas(_id)
    };

    const handleUpdate = async () => {
        const { isConfirmed, value } = await Swal.fire({
            title: 'Cambio nombre tarjeta',
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            input: 'text'
        });

        if (isConfirmed) {
            startPutTiposTarjetas({ _id, nombre: value });
        }
    };

    return (
        <tr key={nombre} className=''>
            <td className='px-2 py-5'>{nombre}</td>

            <td>
                <div className='flex gap-5 justify-center'>
                    <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                    <MdDelete onClick={handleDelete} id={_id} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                </div>
            </td>

        </tr>
    )
}
