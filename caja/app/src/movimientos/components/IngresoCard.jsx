import React from 'react';
import { MdDelete } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';

const handleUpdate = () => {

};

const handleDelete = () => {

};

export const IngresoCard = ({ descripcion, fecha, tipo, importe }) => {
    return (

        <tr className='text-center hover:bg-gray-100 cursor-pointer'>
            <td>{fecha.slice(0, 10).split('-', 3).reverse().join('/')}</td>
            <td>{descripcion}</td>
            <td>{tipo.nombre}</td>
            <td>{importe.toFixed(2)}</td>
            <td>
                <div className='flex gap-5 justify-center'>
                    <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                    <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                </div>
            </td>
        </tr>
    )
}
