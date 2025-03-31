import React, { useEffect } from 'react'
import { useChequeStore } from '../hooks/useChequesStore'
import { ChequeCard } from './components/ChequeCard';
import { Link } from 'react-router-dom';
import { useForm } from '../hooks/Useform';

const initialState = {
    buscador: '',
    buscado: 'numero'
};

let chequesFiltrados = [];

export const Cheques = () => {

    const { cheques, startEmptyCheques, startGetAllCheques } = useChequeStore();

    const { onInputChange, buscador, buscado, formState } = useForm(initialState);


    useEffect(() => {
        startGetAllCheques();
    }, []);

    // cada vez que se busca en el input o se toca un radio los cheques filtrados se muestran segun ese buscador
    useEffect(() => {
        chequesFiltrados = cheques.filter(elem => elem[buscado].toString().toUpperCase().startsWith(buscador.toUpperCase()));
    }, [formState])

    //Cada vez que cambia el state de cheques se reinicia el buscador
    useEffect(() => {
        chequesFiltrados = cheques;
    }, [cheques])

    const salir = () => {
        startEmptyCheques();
    };

    return (

        <div className=' bg-amber-700 w-screen h-screen'>

            {/* Buscador */}
            <section className='flex gap-2 justify-around items-center'>
                <div className='flex p-2 flex-col gap-2 w-xl'>
                    <label htmlFor="buscador" className='text-white text-2xl text-center'>Buscador</label>
                    <input className='bg-white border p-2' type="text" onChange={onInputChange} placeholder='Buscador...' name="buscador" id="buscador" />
                </div>
                <div className='flex gap-5'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="numero" className='text-xl text-white'>Por Numero</label>
                        <input className='scale-150' type="radio" onChange={onInputChange} name="buscado" id="numero" checked={buscado === 'numero'} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="razonSocial" className='text-xl text-white'>Por Razon Social</label>
                        <input className='scale-150' type="radio" onChange={onInputChange} name="buscado" id="ent_por" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="importe" className='text-xl text-white'>Por Importe</label>
                        <input className='scale-150' type="radio" onChange={onInputChange} name="buscado" id="importe" />
                    </div>
                </div>
            </section>

            {/* Listado de Cheques */}
            <section className='bg-white h-96 overflow-scroll'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='border'>F_Entrega</th>
                            <th className='border'>Numero</th>
                            <th className='border'>Banco</th>
                            <th className='border'>F_Cheque</th>
                            <th className='border'>Importe</th>
                            <th className='border'>Entr. Por</th>
                            <th className='border'>Entr. A</th>
                            <th className='border'>Domicilio</th>
                            <th className='border'>Telefono</th>
                            <th className='border'>Modificar</th>
                            <th className='border'>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chequesFiltrados.map(elem => (
                            <ChequeCard {...elem} key={elem._id} />
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Botones */}
            <section className='mt-5 flex justify-around'>
                <button className='bg-green-400'>Agregar</button>
                <Link to='/' >
                    <button type='button' className='text-black' onClick={salir}>
                        Salir
                    </button>
                </Link>
            </section>
        </div>

    )
}
