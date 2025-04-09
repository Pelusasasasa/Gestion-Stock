import React, { useEffect, useState } from 'react';
import { ValorCard } from '../components/ValorCard';
import { CiCreditCard1, CiMoneyCheck1 } from 'react-icons/ci';
import { MdAttachMoney } from 'react-icons/md';
import { useValoresStore } from '../../hooks/useValoresStore';
import { IoIosAdd } from 'react-icons/io';
import { ValorModal } from '../components/ValorModal';
import Swal from 'sweetalert2';
import { useVendedorStore } from '../../hooks/useVendedorStore';


export const Valores = () => {

    const { permiso, startSetValores } = useVendedorStore()
    const { startGetAll, valores } = useValoresStore();
    const [modal, setModal] = useState(false);
    const [total, setTotal] = useState('$0.00');

    const verPermiso = async () => {

        const { isConfirmed, value } = await Swal.fire({
            title: 'Ingresar Contraseña',
            input: 'password',
            showCancelButton: true,
            confirmButtonText: 'Aceptar'
        });

        if (isConfirmed) {
            startSetValores(value)
        };
    };

    useEffect(() => {
        verPermiso()
    }, []);

    useEffect(() => {
        if (permiso === 0) {
            startGetAll()
        }
    }, [permiso])

    useEffect(() => {
        let totalAux = 0;

        valores.forEach((elem) => {
            totalAux += elem.importe;
        });

        setTotal(`$${totalAux.toFixed(2)}`);
    }, [valores]);

    return (
        <div className='h-screen w-[calc(100vw-5rem)]'>
            <div className='flex justify-around my-5'>
                <h3 className='text-3xl p-5'>Resumen de Valores</h3>
                <div className='self-end flex gap-5'>
                    <div>
                        <label htmlFor="total">Total: </label>
                        <input type="text" disabled value={total} name="total" id="total" className='border p-2 w-3/4 rounded-lg border-gray-300 text-right font-bold' />
                    </div>
                    <button className='flex border p-2 rounded-lg bg-black text-white justify-center gap-2 items-center hover:opacity-80' onClick={() => setModal(true)}>
                        <IoIosAdd size={30} />
                        Agregar Nuevo
                    </button>
                </div>
            </div>


            {valores.length === 0 ?
                <div className='h-screen w-[calc(100vw-5rem)] flex justify-center items-center'><p className='text-2xl font-bold'>Nada que mostrar</p></div>
                :
                <div className='p-5 bg-gray-200 h-screen grid grid-cols-2 md:grid-cols-3'>
                    {
                        // console.log(valores)
                        valores.map((elem) => (
                            <ValorCard key={elem._id} {...elem} modal={setModal} />
                        ))
                    }
                </div>

            }
            {
                modal && <ValorModal cerrar={setModal} />
            }
        </div>
    )
}
