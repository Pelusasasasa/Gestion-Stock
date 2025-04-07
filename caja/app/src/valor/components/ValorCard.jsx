import React from 'react';

import * as IconsFa from 'react-icons/fa';
import * as IconsMD from 'react-icons/md';
import * as IconsCI from 'react-icons/ci';
import { RiPencilFill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { useValoresStore } from '../../hooks/useValoresStore';


export const ValorCard = ({ _id, nombre, importe, icon, modal}) => {

    const { startActive, startDeleteOne } = useValoresStore();

    const iconName = icon?.text || 'FaMoneyBillAlt';
    const IconComponent = IconsMD[iconName] || IconsFa[iconName] || IconsCI[iconName] || IconsCI['FaQuestionCircle'];

    const handlePut = () => {
        startActive(_id);
        modal(true);
    };

    const handleDelete = async() => {
        const {isConfirmed} = await Swal.fire({
            title: 'Eliminar Valor',
            text: `Quiere eliminar el valor ${nombre}`,
            confirmButtonText: 'Eliminar',
            showCancelButton: true,
            icon: 'warning',
        });

        if (!isConfirmed) return;


        startDeleteOne(_id);
    };

    return (
        <div className='bg-white m-5 rounded-lg p-5 flex flex-col max-h-40'>
            <div className='flex justify-around items-center mb-5'>
                <div className='flex flex-col gap-2'>
                    <p className=''>Total {nombre}</p>
                    <p className='font-bold text-xl'>${importe.toFixed(2)}</p>
                </div>
                <div className='bg-gray-300 rounded-full p-2'>
                    <IconComponent size={40} className={`${icon.style}`} />
                </div>
            </div>
            <div className='flex justify-end gap-5'>
                <button className='border border-gray-400 flex gap-2 items-center rounded-sm p-1 hover:bg-gray-200' onClick={handlePut}>
                    <RiPencilFill size={20} className=''/>
                    Modificar
                </button>
                <button className='border border-gray-400 flex gap-2 items-center rounded-sm p-1 hover:bg-gray-200' onClick={handleDelete}>
                    <IconsMD.MdDelete size={20} className='text-red-500'/>
                    Eliminar
                </button>
            </div>
        </div>
    )
}
