import React from 'react';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

export const ChequeCard = ({ f_recibido, numero, banco, f_cheque, importe, ent_por, ent_a, telefono, domicilio }) => {

    return (
        <div className='mx-20 p-5 border border-gray-300 rounded-xl'>
            <div className='flex justify-between'>
                <p className='font-bold'>Cheque #{numero.slice(4, 8)}</p>
                <p className='font-bold'>${importe.toFixed(2)}</p>
            </div>
            <div className='flex justify-between font-extralight'>
                <p>{banco}</p>
                <p>{ent_por}</p>
            </div>
            <div className='flex justify-between font-extralight mt-2'>
                <p>{f_cheque.slice(0, 10).split('-', 3).reverse().join('/')}</p>
                <div className='flex gap-5'>
                    <RiPencilFill size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                    <MdDelete size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                </div>
            </div>

        </div>
    )
}
