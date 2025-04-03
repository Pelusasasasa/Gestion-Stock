import React, { useState } from 'react';
import { VscGraph } from "react-icons/vsc";
import { CiCreditCard1 } from "react-icons/ci";
import { CiMoneyCheck1 } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { AsideCard } from './AsideCard';

const secciones = [
    {
        text: 'Resumen de valores',
        icon: VscGraph
    },
    {
        text: 'Cheques',
        icon: CiMoneyCheck1
    },
    {
        text: 'Tarjetas',
        icon: CiCreditCard1
    },
];


export const AsideBar = () => {

    const [asideView, setAsideView] = useState(false);

    return (
        <aside className='bg-gray-700 text-white max-w-fit'>

            {asideView ?
                <div className='flex justify-around items-center gap-10 p-5'>
                    <h3 className='text-xl whitespace-nowrap'>Gestion Caja</h3>
                    <IoIosClose className='cursor-pointer' size={52} onClick={() => setAsideView(false)} />
                </div>
                :
                <div className='w-full flex justify-center p-5'>
                    <FiMenu onClick={() => setAsideView(true)} size={30} className='p-1  flex justify-center cursor-pointer hover:bg-gray-600' />
                </div>
            }

            <hr className='text-gray-500' />
            <div className='mt-5'>
                {secciones.map(elem => (
                    <AsideCard elem={elem} key={elem.text} asideView={asideView} />
                ))}
            </div>
        </aside>
    )
}
