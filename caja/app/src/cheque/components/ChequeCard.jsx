import React from 'react';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { useChequeStore } from '../../hooks/useChequesStore';
import Swal from 'sweetalert2';

export const ChequeCard = ({ _id, f_recibido, numero, banco, f_cheque, importe, ent_por, ent_a, modal }) => {

    const { startDeleteCheque, startSetActiveCheque } = useChequeStore();

    const handleDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            title: 'Eliminar Cheque?',
            text: `Quiere Eliminar el cheque ${numero} de ${ent_por}`,
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            icon: 'info'
        });

        if (isConfirmed) {
            startDeleteCheque(_id);
        }
    };

    const handlePut = async () => {
        startSetActiveCheque(_id);
        modal(true)
    };

    return (
        <div className='mx-20 p-5 border border-gray-300 rounded-xl'>
            <div className='flex justify-between font-bold'>
                <p>Fecha: {f_recibido.slice(0, 10).split('-', 3).reverse().join('/')}</p>
                <p>Cliente: {ent_por}</p>
                <p>Numero: {numero}</p>
            </div>
            <div className='flex justify-between'>
                <p className='font-bold'>Cheque #{numero.slice(4, 8)}</p>
                <p className='font-bold'>${importe.toFixed(2)}</p>
            </div>
            <div className='flex justify-between font-extralight'>
                <p>{banco}</p>
                <p>{ent_a}</p>
            </div>
            <div className='flex justify-between font-extralight mt-2'>
                <p>Fecha Cheque: {f_cheque.slice(0, 10).split('-', 3).reverse().join('/')}</p>
                <div className='flex gap-5'>
                    <RiPencilFill onClick={handlePut} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                    <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                </div>
            </div>

        </div>
    )
}
