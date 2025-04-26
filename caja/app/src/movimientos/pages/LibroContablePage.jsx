import React, { useEffect, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';


import { useMovimientoStore } from '../../hooks/useMovimientoStore';
import { LibroCard } from '../components/LibroCard';
let saldo = 8000;

export const LibroContablePage = ({ section, desde, hasta, setModal }) => {

    const { movimientos, startGetallMov } = useMovimientoStore();
    const [total, setTotal] = useState(0);
    const [movsAux, setMovsAux] = useState([]);

    useEffect(() => {
        startGetallMov(desde, hasta, 'all');
    }, []);

    useEffect(() => {
        const sum = movimientos.reduce((acc, elem) => acc + elem.importe, 0);
        setTotal(sum);
        // setMovs(movimientos);
    }, [movimientos]);

    useEffect(() => {
       const nuevosMovimientos = movimientos.reduce((acumulador, mov, index) => {
        const movCalculado = {...mov};

        if(index === 0) {
            movCalculado.total = mov.tipo.tipo === 'I'
            ? mov.importe + saldo
            : saldo - mov.importe;
        }else{
            movCalculado.total = mov.tipo.tipo === 'I'
            ? mov.importe + acumulador[index - 1].total
            : acumulador[index - 1].total - mov.importe;
        };

        return [...acumulador, movCalculado];
       }, []);
       setMovsAux(nuevosMovimientos);

        // console.log(movsAux);
    }, [movimientos])

    return (
        <main className='py-2'>
            <div className='flex py-3 justify-between mx-5'>
                <h3 className='text-gray-700 text-xl '>Registro de {section}</h3>
                <button onClick={() => setModal(true)} className='flex gap-2 bg-gray-700 text-white p-2 rounded-lg items-center cursor-pointer hover:opacity-80'>
                    <IoIosAdd size={20} />
                    Nuevo Ingreso / Egreso
                </button>
            </div>

            <div className='mx-5 h-[calc(45vh)] overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='border-b border-b-gray-400 bg-gray-100'>
                        <tr>
                            <th className='text-gray-600'>Fecha</th>
                            <th className='text-gray-600'>Descripcion</th>
                            <th className='text-gray-600'>Nro_Comp.</th>
                            <th className='text-gray-600'>Tipo</th>
                            <th className='text-gray-600'>Debe</th>
                            <th className='text-gray-600'>Haber</th>
                            <th className='text-gray-600'>Total</th>
                            <th className='text-gray-600'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movsAux.map(elem => (
                                <LibroCard {...elem} key={elem._id} setModal={setModal} />
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className='flex justify-center gap-20'>
                <p className='text-2xl text-gray-600'>Total: </p>
                <p className='text-2xl text-gray-600'>{total.toFixed(2)}</p>
            </div>
        </main>
    )
}
