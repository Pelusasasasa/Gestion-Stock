import React from 'react';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useCategoriaEventoStore } from '../../hooks/useCategoriaEventoStore';

export const CategoriaEventoCard = ({ _id, nombre, color }) => {

    const { startDeleteCategory, startPatchCategory } = useCategoriaEventoStore();

    const handleUpdate = async () => {
        const { value, isConfirmed } = await Swal.fire({
            title: 'Modificar Tipo Evento',
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            html: `
                <div class='flex flex-col justify-around px-5 pb-5 gap-2'>
                    <input type="text" value=${nombre} name="nombreUpdate" id="nombreUpdate" class='flex-1 bg-white pl-2 border  rounded-lg border-gray-300' />
                    <div class='flex justify-center gap-2 h-10'>
                        <label class='self-center' htmlFor="colorAux">Color: </label>
                        <input type="color" value=${color} class='h-auto w-20' id='colorAux' name='colorAux' />
                    </div>
                </div>
            `,
            preConfirm: () => {
                const nombre = document.getElementById('nombreUpdate').value;
                const color = document.getElementById('colorAux').value;

                // validaciones opcionales
                if (!nombre) {
                    Swal.showValidationMessage('El nombre es obligatorio');
                    return;
                }

                return { nombre, color };
            }
        });

        if (isConfirmed) {
            value._id = _id;
            startPatchCategory(value);
        }


    };

    const handleDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            title: 'Eliminar Tipo Evento',
            text: `¿Eliminar tipo de evento ${nombre}?`
        });
        if (isConfirmed) {
            startDeleteCategory(_id)
        };
    };

    return (

        <tr>
            <td className='px-2 py-2'>{nombre}</td>
            <td className='flex px-2 py-2 items-center gap-2'>
                <div
                    style={{ backgroundColor: color }}
                    className='rounded-full h-5 w-5'></div>
                {color}</td>
            <td>
                <div className='flex gap-5 justify-center'>
                    <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
                    <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
                </div>
            </td>
        </tr>
    )
}
