import React from 'react';

import * as IconsMD from 'react-icons/md';
import * as IconsCI from 'react-icons/ci';


export const ValorCard = ({ nombre, importe, icon }) => {
    const iconName = icon?.text || 'FaMoneyBillAlt';
    const IconComponent = IconsMD[iconName] || IconsCI[iconName] || IconsCI['FaQuestionCircle'];

    return (
        <div className='bg-white m-5 rounded-lg p-5 flex flex-col max-h-30'>
            <div className='flex justify-around items-center mb-5'>
                <div className='flex flex-col gap-2'>
                    <p className=''>Total {nombre}</p>
                    <p className='font-bold text-xl'>${importe.toFixed(2)}</p>
                </div>
                <div className='bg-gray-300 rounded-full p-2'>
                    <IconComponent size={40} className={`${icon.style}`} />
                </div>
            </div>
        </div>
    )
}
