import React from 'react';
import { useEventoStore } from '../../hooks';


export const DayCard = ({ day }) => {

    const { eventos } = useEventoStore();
    const eventosFilter = eventos.filter(evento => evento.start_date.slice(8, 10) == day);

    return (
        <div className='border border-gray-200 rounded-sm h-30 mb-5'>
            <div className={`justify-end pr-5 font-bold text-xl flex ${!day && 'bg-gray-200 w-full h-full'}`}>
                <p>{day ? day : ''}</p>
            </div>

            <div className='flex-1'>
                {eventosFilter.map((elem) => (
                    <p key={elem._id} className={`bg-yellow-100 text-yellow-800 text-sm whitespace-nowrap px-2 `}>
                        {elem.title}
                    </p>
                ))}
            </div>
        </div >
    )
}
