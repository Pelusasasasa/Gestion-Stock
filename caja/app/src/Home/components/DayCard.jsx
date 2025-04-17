import React from 'react';
import { useEventoStore } from '../../hooks';
import { EventCard } from './EventCard';


export const DayCard = ({ day, currentMonth, openModal }) => {
    const { eventos } = useEventoStore();
    const eventosFilter = eventos.filter(evento => (evento.start_date.slice(8, 10) == day && evento.start_date.slice(5, 7) == currentMonth.getMonth() + 1));

    const habilityDay = new Date();

    return (
        <div className={`border border-gray-300 rounded-sm h-30 mb-5 ${(!day || currentMonth.getMonth() < habilityDay.getMonth() || (currentMonth.getMonth() === habilityDay.getMonth() && habilityDay.getDate() > day)) && 'bg-gray-200 '}`}>
            <div className={`justify-end pr-5 font-bold text-xl flex `}>
                <p>{day ? day : ''}</p>
            </div>

            <div className='flex-1'>
                {eventosFilter.map((elem) => (
                    <EventCard key={elem._id} openModal={openModal} {...elem} />
                ))}
            </div>
        </div >
    )
}
