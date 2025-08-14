import React from 'react'
import { useDispatch } from 'react-redux';

import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { savingTipoCuenta } from '../../store/tipoCuenta/tipoCuentaSlice';
import { useTipoCuentaStore } from '../../hooks/useTipoCuentaStore';
import Swal from 'sweetalert2';

export const TipocuentaCard = ({ nombre, tipo, _id }) => {

  const { startDeleteTipoCuenta, startPatchTipoCuenta } = useTipoCuentaStore();
  const dispatch = useDispatch();

  const handleUpdate = async () => {

    const { value, isConfirmed } = await Swal.fire({
      title: 'Modificar Tipo Cuenta',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      html: `
                <div class='flex flex-col justify-around px-5 pb-5 gap-5'>
                    <input type="text" value=${nombre} name="nombreUpdate" id="nombreUpdate" class='flex-1 bg-white pl-2 border  rounded-lg border-gray-300' />
                        <select name="tipoAux" id="tipoAux" class='border rounded-lg border-gray-300'>
                          <option value="E">Egreso</option>
                          <option value="I">Ingreso</option>
                        </select>
                </div>
            `,
      preConfirm: () => {
        const nombre = document.getElementById('nombreUpdate').value;
        const tipo = document.getElementById('tipoAux').value;

        // validaciones opcionales
        if (!nombre) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return;
        }

        return { nombre, tipo };
      }
    });

    if (isConfirmed) {
      value._id = _id;
      startPatchTipoCuenta(value);
    };
  };

  const handleDelete = async () => {
    dispatch(savingTipoCuenta());

    const { isConfirmed } = await Swal.fire({
      title: `Eliminar el tipo de cuenta ${nombre}`,
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      icon: 'info'
    });

    if (isConfirmed) {
      startDeleteTipoCuenta(_id);
    };
  };

  return (

    <tr>
      <td className='px-2 py-2'>{nombre}</td>
      <td>
        <p className={`m-2 text-center font-normal py-1 px-2 border border-gray-500 w-fit rounded-4xl font-sm ${tipo === 'E' ? 'bg-red-500 text-white' : ''}`}>{tipo === 'E' ? 'Egreso' : 'Ingreso'}</p>
      </td>
      <td>
        <div className='flex gap-5 justify-center'>
          <RiPencilFill onClick={handleUpdate} size={30} className='cursor-pointer border border-gray-200 p-1 rounded-sm hover:bg-gray-300' />
          <MdDelete onClick={handleDelete} size={30} className='cursor-pointer text-red-600 p-1 border border-gray-200 rounded-sm hover:bg-red-100' />
        </div>
      </td>
    </tr>
  )
}
