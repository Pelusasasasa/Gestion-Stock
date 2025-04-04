import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import { IoIosAdd } from "react-icons/io";

import { useChequeStore } from '../../hooks'
import { ChequeCard } from '../components/ChequeCard';
import { useForm } from '../../hooks/Useform';
import { ChequeModal } from '../components/ChequeModal';

const initialState = {
    buscador: '',
    buscado: 'numero'
};


export const Cheques = () => {

    const { cheques, startGetAllCheques } = useChequeStore();

    const [chequesFiltrados, setChequesFiltrados] = useState(cheques);

    const { onInputChange, buscador, buscado, formState } = useForm(initialState);
    const [modal, setModal] = useState(false);


    useEffect(() => {
        startGetAllCheques();
    }, []);

    // cada vez que se busca en el input o se toca un radio los cheques filtrados se muestran segun ese buscador
    useEffect(() => {
        setChequesFiltrados(cheques.filter(elem => elem[buscado].toString().toUpperCase().startsWith(buscador.toUpperCase())));
    }, [formState])

    //Cada vez que cambia el state de cheques se reinicia el buscador
    useEffect(() => {
        setChequesFiltrados(cheques);
    }, [cheques]);



    return (

        <section className=' w-screen h-screen'>
            <h3 className='text-3xl'>Gestion De Cheques</h3>

            <div className='bg-gray-300 flex-col flex'>

                {/* Buscador y Agregar nuevo */}
                <div className='bg-white mt-5 pt-5 mx-5 rounded-t-xl'>
                    <form action="" className='flex justify-around'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="buscador">Buscador</label>
                            <input type="text" name="buscador" id="buscador" className='border border-gray-400 rounded-sm' onChange={onInputChange} value={buscador} />
                        </div>

                        <div className='flex justify-around gap-5'>
                            <div className='flex-col flex'>
                                <label htmlFor="numero">Por Numero</label>
                                <input type="radio" name="buscado" id="numero" checked={buscado === 'numero'} onChange={onInputChange} className='scale-150 mt-2' />
                            </div>
                            <div className='flex-col flex'>
                                <label htmlFor="ent_por">Razon</label>
                                <input type="radio" name="buscado" id="ent_por" onChange={onInputChange} className='scale-150 mt-2' />
                            </div>
                            <div className='flex-col flex'>
                                <label htmlFor="importe">Importe</label>
                                <input type="radio" name="buscado" id="importe" onChange={onInputChange} className='scale-150 mt-2' />
                            </div>
                        </div>


                        <button type='button' className='flex gap-2 bg-black items-center hover:opacity-80 text-white' onClick={() => setModal(true)}>
                            <IoIosAdd size={20} />
                            Nuevo Cheque
                        </button>

                    </form>
                </div>

                {/* Listado */}
                <div className='gap-2 flex flex-col py-5 mb-5 mx-5 bg-white rounded-b-xl'>
                    {
                        chequesFiltrados.map(elem => (
                            <ChequeCard {...elem} key={elem._id} />
                        ))
                    }
                </div>
            </div>

                    {modal && <ChequeModal cerrar={setModal}/>}

        </section>

    )
}
