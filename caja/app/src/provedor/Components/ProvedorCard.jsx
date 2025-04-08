import React from 'react';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

export const ProvedorCard = ({nombre, direccion, telefono, email, saldo, iva}) => {
  return (
    <tr className='border-b border-gray-300 hover:bg-gray-100 hover:cursor-pointer'>
      <td className='font-bold py-5 pl-5'>{nombre}</td>
      <td>{direccion}</td>
      <td>{telefono}</td>
      <td>{email}</td>
      <td>${saldo.toFixed(2)}</td>
      <td>
        <p className='m-0 font-bold border rounded-3xl text-wrap w-1/2 text-center text-sm'>{iva}</p>
      </td>

      <td className='flex gap-5'>
        <div className='border border-gray-300 hover:opacity-80 rounded-lg p-2 mt-2'>
          <RiPencilFill className=' hover:cursor-pointer' size={20}/>
        </div>
        <div className='border border-gray-300 hover:opacity-80 rounded-lg p-2 mt-2'>
          <MdDelete size={20} className='text-red-400'/>
        </div>
      </td>
    </tr>
  )
}
