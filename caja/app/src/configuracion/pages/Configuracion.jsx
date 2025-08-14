import React, { useState } from 'react'
import { TipoTarjetas } from '../components/TipoTarjetas';
import { TipoEvento } from '../components/TipoEvento';
import { TipoCuenta } from './TipoCuenta';

export const Configuracion = () => {

    const [sectionConfiguration, setSectionConfiguration] = useState('Cuentas');

    return (
        <section className='h-screen w-screen ml-8 bg-gray-100'>
            <div className='flex bg-white'>
                <h3 className='text-3xl font-bold pl-10 my-5 text-gray-600'>Configuracion</h3>
            </div>

            <div className='bg-white ml-15 mt-5'>
                <div className='flex border-b'>
                    <button onClick={() => setSectionConfiguration('Tarjetas')}
                        className={`${sectionConfiguration === 'Tarjetas' ? 'border-b-3 border-gray-600' : 'hover:bg-gray-300'} p-5 cursor-pointer`}
                    >Tipos de Tarjetas</button>
                    <button onClick={() => setSectionConfiguration('Eventos')}
                        className={`${sectionConfiguration === 'Eventos' ? 'border-b-3 border-gray-600' : 'hover:bg-gray-300'} p-5 cursor-pointer`}
                    >Categoria de Eventos</button>
                    <button onClick={() => setSectionConfiguration('Cuentas')}
                        className={`${sectionConfiguration === 'Cuentas' ? 'border-b-3 border-gray-600' : 'hover:bg-gray-300'} p-5 cursor-pointer`}
                    >Tipos de Cuentas</button>
                </div>
            </div>

            <main className='ml-15 bg-white'>
                {sectionConfiguration === "Tarjetas" && <TipoTarjetas />}
                {sectionConfiguration === "Eventos" && <TipoEvento />}
                {sectionConfiguration === "Cuentas" && <TipoCuenta />}
            </main>
        </section >
    )
}
