import React from 'react';
import { MdDelete } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { savingMovimiento } from '../../store/movimientos/movimientoSlice';
import { useMovimientoStore } from '../../hooks/useMovimientoStore';
import Swal from 'sweetalert2';



export const IngresoCard = ({ _id, descripcion, fecha, tipo, puntoVenta, numero, importe, setModal }) => {
    const dispatch = useDispatch();
    const { startActiveMovCaja, startDeleteOneMov } = useMovimientoStore();

    const handleUpdate = () => {
        startActiveMovCaja(_id);
        setModal(true);
    };

    const handleDelete = async() => {
        const { isConfirmed } = await Swal.fire({
            title: `Eliminar ${tipo.tipo === 'I' ? 'Ingreso' : 'Egreso'}`,
            text: `Quiere eliminar ${descripcion}`,
            confirmButtonText: 'Aceptar',
            showCancelButton: true
        });

        if( isConfirmed ){
            dispatch(savingMovimiento());

            startDeleteOneMov(_id);
        }

        
    };

    return (

        <tr className='text-center hover:bg-gray-100 cursor-pointer'>
            <td>{fecha.slice(0, 10).split('-', 3).reverse().join('/')}</td>
            <td>{descripcion}</td>
            <td>{puntoVenta}-{numero}</td>
            <td>{tipo.nombre}</td>
            <td>{importe.toFixed(2)}</td>
            <td>
                <div className='flex gap-5 justify-center py-2'>
                    <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                    <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                </div>
            </td>
        </tr>
    )
}
