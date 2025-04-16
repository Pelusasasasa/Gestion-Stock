import React from 'react'

import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

export const TipocuentaCard = ({nombre, tipo, _id}) => {

    const handleUpdate = () => {
        console.log(_id)
    };

    const handleDelete = () => {

    };

  return (
    
    <tr>
        <td>{nombre}</td>
        <td>{tipo}</td>
        <td>
            <div className='flex gap-5 justify-center'>
                                <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                                <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                            </div>
        </td>
    </tr>
  )
}
