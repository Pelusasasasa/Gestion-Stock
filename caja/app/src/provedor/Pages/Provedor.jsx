import React, { useEffect } from 'react';
import { AiOutlineDownload } from "react-icons/ai";
import { IoIosAdd } from 'react-icons/io';

import { useProvedorStore } from '../../hooks/useProvedorStore';
import { ProvedorCard } from '../Components/ProvedorCard';
import { ProvedorModal } from '../Components/ProvedorModal';
import { useState } from 'react';


export const Provedor = () => {

    const { provedores, startGetAll } = useProvedorStore();

    const [modal, setModal] = useState(false);


    useEffect(() => {
        startGetAll();
    }, []);


    return (
        <div className='h-screen w-[calc(100vw-5rem)] bg-gray-200'>
            <div className='flex justify-between px-10 bg-white py-10 mt-0'>
                <h3 className='text-3xl font-bold'>Gestion de Provedores</h3>

                <div className='flex gap-5'>
                    <button className='flex gap-2 border border-gray-300 hover:opacity-80 p-2 rounded-lg font-bold'>
                        <AiOutlineDownload size={20} />
                        Descargar Saldos
                    </button>
                    <button className='flex gap-2 bg-black text-white p-2 rounded-lg font-bold hover:opacity-80' onClick={() => setModal(true)}>
                        <IoIosAdd size={20} />
                        Agregar Provedor
                    </button>
                </div>
            </div>


            {
                provedores.length > 0
                    ? <main className='bg-white mx-5 overflow-auto mt-10 border-b border-gray-300 rounded-lg'>

                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className=''>
                                    <th className='p-5 text-left'>Nombre</th>
                                    <th className='p-5 text-left'>Direccion</th>
                                    <th className='p-5 text-left'>Telefono</th>
                                    <th className='p-5 text-left'>Email</th>
                                    <th className='p-5 text-left'>Saldo</th>
                                    <th className='p-5 text-left'>IVA</th>
                                    <th className='p-5 text-left'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    provedores.map(elem => (
                                        <ProvedorCard key={elem._id} {...elem} modal={setModal} />
                                    ))
                                }
                            </tbody>
                        </table>

                    </main>
                    :
                    <div className='flex justify-center items-center mt-10'>
                        <p className='text-4xl'>Nada que mostrar</p>
                    </div>
            }
            {
                modal && <ProvedorModal cerrar={setModal} />
            }
        </div>
    )
}
