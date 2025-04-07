import React, { useEffect, useState } from 'react';
import { ValorCard } from '../components/ValorCard';
import { CiCreditCard1, CiMoneyCheck1 } from 'react-icons/ci';
import { MdAttachMoney } from 'react-icons/md';
import { useValoresStore } from '../../hooks/useValoresStore';
import { IoIosAdd } from 'react-icons/io';
import { ValorModal } from '../components/ValorModal';


export const Valores = () => {

    const { startGetAll, valores } = useValoresStore();
    const [modal, setModal] = useState(true);

    useEffect(() => {
        startGetAll()
    }, []);

    if (valores.length === 0) return (<div className='h-screen w-[calc(100vw-5rem)] flex justify-center items-center'><p className='text-2xl font-bold'>Nada que mostrar</p></div>)

    return (
        <div className='h-screen w-[calc(100vw-5rem)]'>
            <div className='flex justify-around my-5'>
                <h3 className='text-3xl p-5'>Resumen de Valores</h3>
                <button className='flex border border-gray-200 justify-center gap-2 items-center hover:bg-gray-200'>
                    <IoIosAdd size={30} />
                    Agregar Nuevo
                </button>
            </div>


            <div className='p-5 bg-gray-200 h-screen grid grid-cols-2 md:grid-cols-3'>
                {
                    valores.map((elem) => (
                        <ValorCard key={elem._id} {...elem} />
                    ))
                }
            </div>
            {
                modal && <ValorModal cerrar={setModal} />
            }
        </div>
    )
}
