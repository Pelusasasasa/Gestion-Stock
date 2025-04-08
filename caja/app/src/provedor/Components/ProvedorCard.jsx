import React from 'react';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { useProvedorStore } from '../../hooks/useProvedorStore';
import Swal from 'sweetalert2';

export const ProvedorCard = ({ _id, nombre, domicilio, localidad, codPostal, telefono, mail, saldo, iva, modal }) => {


  const { startDeleteProvedor, startSetActive } = useProvedorStore();

  const handlePatchProvedor = () => {
    startSetActive(_id);
    modal(true);
  };

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      text: `Seguro quiere eliminar el provedor ${nombre}`,
      title: 'Eliminar Provedor',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      icon: 'info'
    });

    if (isConfirmed) {
      startDeleteProvedor(_id);
    }
  };

  return (
    <tr className='border-b border-gray-300 hover:bg-gray-100 hover:cursor-pointer'>
      <td className='font-bold py-5 pl-5'>{nombre}</td>
      <td className='text-sm p-1  w-auto max-w-full break-words whitespace-normal'>{domicilio} {localidad} {codPostal}</td>
      <td>{telefono}</td>
      <td>{mail}</td>
      <td className='font-bold'>${saldo.toFixed(2)}</td>
      <td>
        <p className='m-0 font-bold border rounded-3xl text-center text-sm p-1 inline-block w-auto max-w-full break-words whitespace-normal'>{iva === 'inscripto' ? 'Responsable Inscripto' : iva}</p>
      </td>

      <td className=''>
        <div className='flex justify-center items-center h-full spacce-x-4 gap-5'>
          <div className='border border-gray-300 hover:opacity-80 rounded-lg p-2'>
            <RiPencilFill className=' hover:cursor-pointer' size={20} onClick={handlePatchProvedor} />
          </div>
          <div className='border border-gray-300 hover:opacity-80 rounded-lg p-2'>
            <MdDelete size={20} className='text-red-400' onClick={handleDelete} />
          </div>
        </div>
      </td>
    </tr >
  )
}
