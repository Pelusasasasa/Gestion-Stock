import React from 'react'
import { MdDelete } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';

export const LibroCard = ({fecha, descripcion, puntoVenta, numero, tipo, importe, total}) => {

    const handleDelete = () => {

    };

    const handleUpdate = () => {

    }

  return (
    <tr className='text-center hover:bg-gray-100 cursor-pointer'>
                <td>{fecha.slice(0, 10).split('-', 3).reverse().join('/')}</td>
                <td>{descripcion}</td>
                <td>{puntoVenta}-{numero}</td>
                <td>{tipo.nombre}</td>
                <td>
                    <p className='text-green-600'>{tipo.tipo === 'I' ? importe.toFixed(2) : '-'}</p>
                </td>
                <td>
                    <p className='text-red-600'>{tipo.tipo === 'E' ? importe.toFixed(2) : '-'}</p>
                </td>
                <td>
                    {total.toFixed(2)}
                </td>
                <td>
                    <div className='flex gap-5 justify-center py-2'>
                        <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                        <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                    </div>
                </td>
            </tr>
  )
}
