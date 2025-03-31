import React from 'react'

export const ChequeCard = ({ f_recibido, numero, banco, f_cheque, importe, ent_por, ent_a, telefono, domicilio }) => {
    return (
        <tr className='hover:cursor-pointer hover:bg-gray-300'>
            <td className='border'>{f_recibido.slice(0, 10).split('-', 3).reverse().join('/')}</td>
            <td className='border'>{numero}</td>
            <td className='border'>{banco}</td>
            <td className='border'>{f_cheque.slice(0, 10).split('-', 3).reverse().join('/')}</td>
            <td className='border'>{importe}</td>
            <td className='border'>{ent_por.slice(0, 30)}</td>
            <td className='border'>{ent_a.slice(0, 30)}</td>
            <td className='border'>{domicilio}</td>
            <td className='border'>{telefono}</td>
            <td className='border'>M</td>
            <td className='border'></td>
        </tr>
    )
}
