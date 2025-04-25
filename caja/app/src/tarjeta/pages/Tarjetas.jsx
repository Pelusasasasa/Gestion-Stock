import React, { useEffect, useState } from 'react'
import { useForm } from '../../hooks'

import { TarjetaCard } from '../components/TarjetaCard';
import { TarjetaModal } from '../components/TarjetaModal';
import { useTarjetaStore } from '../../hooks';
import { IoIosAdd } from 'react-icons/io';


let initialState = {
    buscador: ''
}

export const Tarjetas = () => {
    const { startGetTarjetas, tarjetas } = useTarjetaStore();
    const { onInputChange, buscador, formState } = useForm(initialState);

    const [modal, setModal] = useState(false);
    const [tarjetasFiltradas, setTarjetasFiltradas] = useState(tarjetas);
    const [total, setTotal] = useState(0);

    const handleModal = () => {
        setModal(true)
    };

    useEffect(() => {
        startGetTarjetas()
    }, []);

    useEffect(() => {
        setTarjetasFiltradas(tarjetas);
        
        const sum = tarjetasFiltradas.reduce((acc, elem) => acc + elem.importe, 0);
        console.log(sum);
        setTotal(sum);
    }, [tarjetas]);

    useEffect(() => {
        setTarjetasFiltradas(tarjetas.filter(elem => elem?.tarjeta?.nombre.startsWith(buscador.toUpperCase())));
    }, [formState])

    return (
        <section className='w-screen ml-8 h-screen bg-gray-100'>
            <div className='flex bg-white'>
                <h3 className='text-3xl font-bold pl-10 my-5 text-gray-600'>Gestion De Tajetas</h3>
            </div>

            <div className='bg-gray-100 h-[calc(100vh-5rem)] flex-col flex'>

                {/* Buscador y Agregar nuevo */}
                <div className='bg-white mt-5 pt-5 mx-5 rounded-t-xl'>
                    <form action="" className='flex justify-around'>
                        <div className='flex flex-col gap-2 w-80'>
                            <label htmlFor="buscador">Buscador</label>
                            <input type="text" name="buscador" id="buscador" className='border p-1 border-gray-400 rounded-sm' onChange={onInputChange} value={buscador} />
                        </div>


                        <button type='button' className='self-end flex gap-2 rounded-lg p-2 bg-black items-center hover:opacity-80 text-white' onClick={handleModal}>
                            <IoIosAdd size={20} />
                            Nuevo Tarjeta
                        </button>

                    </form>
                </div>

                {/* Listado */}
                <div className='gap-2 flex flex-col pt-5  mx-5 bg-white rounded-b-xl overflow-y-scroll h-[calc(70vh)]'>
                    {
                        tarjetasFiltradas.map(elem => (
                            <TarjetaCard {...elem} key={elem._id} modal={handleModal} />
                        ))
                    }
                </div>

                <div className='flex justify-center bg-white pb-5'>
                    <p className='text-2xl text-gray-600'>Total: $<span>{total.toFixed(2)}</span></p>
                </div>
            </div>

            

            {modal && <TarjetaModal cerrar={setModal} />}

        </section>

    )
}
