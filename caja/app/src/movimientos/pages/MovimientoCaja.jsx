import React, { useState } from 'react';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline, IoSearchOutline } from "react-icons/io5";
import { IngresoPage } from './IngresoPage';
import { useForm } from '../../hooks/Useform';
import MovCajaModal from '../components/MovCajaModal';
const date = new Date();

const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();


const initialState = {
    desde: `${year}-${month > 10 ? month : `0${month}`}-${day > 0 ? day : `0${day}`}`,
    hasta: `${year}-${month > 10 ? month : `0${month}`}-${day > 0 ? day : `0${day}`}`,
}

export const MovimientoCaja = () => {

    const [sectionMov, setSectionMov] = useState('Ingreso');
    const { desde, hasta, onInputChange } = useForm(initialState);
    const [modal, setModal] = useState(false);

    return (
        <section className='w-screen ml-8 h-screen bg-gray-100'>

            <div className='flex bg-white'>
                <h3 className='text-3xl font-bold pl-10 my-5 text-gray-600'>Registro de Ingresos y Egresos</h3>
            </div>

            <div className='bg-white ml-15 mr-5 mt-5'>

                <div className='flex border-b border-gray-400 gap-4'>
                    <button
                        onClick={() => setSectionMov('Ingreso')}
                        className={`flex gap-2 p-2 justify-center items-center cursor-pointer ${sectionMov === 'Ingreso' ? 'text-green-500 border-b-green-500 border-b' : 'hover:opacity-50'}`}>
                        <IoArrowUpCircleOutline size={20} />
                        Ingresos
                    </button>

                    <button
                        onClick={() => setSectionMov('Egreso')}
                        className={`flex gap-2 p-2 justify-center items-center cursor-pointer ${sectionMov === 'Egreso' ? 'text-red-500 border-b-red-500 border-b' : 'hover:opacity-50'}`}>
                        <IoArrowDownCircleOutline />
                        Egresos
                    </button>

                </div>

                <div className='grid grid-cols-[4fr_4fr_1fr] w-full gap-2 px-2 py-4 bg-gray-50'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-600 text-md' htmlFor="desde">Fecha Desde</label>
                        <input type="date" name="desde" value={desde} onChange={onInputChange} id="desde" className='border bg-white rounded-lg p-2 text-lg border-gray-300 w-full' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-600 text-lg' htmlFor="hasta">Fecha Hasta</label>
                        <input type="date" name="hasta" id="hasta" value={hasta} onChange={onInputChange} className='border bg-white rounded-lg p-2 text-lg border-gray-300 w-full' />
                    </div>

                    <button
                        className='bg-gray-700 self-end text-white flex 
                                    gap-5 items-center justify-around px-5 py-2 rounded-lg  cursor-pointer hover:opacity-80'
                    >
                        <IoSearchOutline />
                        Buscar
                    </button>
                </div>

                {
                    sectionMov === 'Ingreso' && <IngresoPage setModal={setModal} section={sectionMov} desde={desde} hasta={hasta} />
                }

                {
                    sectionMov === 'Egreso' && <IngresoPage section={sectionMov} setModal={setModal} desde={desde} hasta={hasta} />
                }

            </div>

            {modal && <MovCajaModal cerrar={setModal} />}

        </section>

    )
}
