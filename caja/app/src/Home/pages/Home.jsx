import React, { useEffect, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEventoStore } from '../../hooks';
import { DayCard } from '../components/dayCard';
import EventoModal from '../components/EventoModal';



const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
}


export const Home = () => {

    const { startGetEventos } = useEventoStore();

    const daysNames = [
        "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"
    ];
    const [days, setDays] = useState([]);
    const [modal, setModal] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        let daysAux = [];

        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysAux.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            daysAux.push(i);
        }
        setDays([...daysAux]);
        console.log(days);
    };

    useEffect(() => {
        renderCalendar()
        startGetEventos()
    }, [])

    return (
        <div className='h-[calc(100vw-150rem] w-[calc(100vw-5rem)] bg-gray-100'>
            <div className='flex bg-white '>
                <h3 className='text-3xl text-gray-600 pl-10 font-bold text-left my-5 '>Calendario de Eventos</h3>
            </div>

            <main className='bg-white mt-5 flex flex-col mx-5'>
                <div className='flex justify-between'>
                    <div className='flex gap-5 text-3xl items-center ml-10 font-bold text-gray-600'>
                        <p>Abril</p>
                        <p>2025</p>
                    </div>
                    <div className='flex gap-10 items-center my-5'>
                        <IoIosArrowBack size={50} className='border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-200' />
                        <IoIosArrowForward size={50} className='border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-200' />
                        <button className='flex  bg-black text-white rounded-md py-2 px-5 mr-5 justify-center items-center hover:opacity-80 cursor-pointer'>
                            <IoIosAdd size={30} />
                            Nuevo Evento
                        </button>
                    </div>

                </div>

                <div className='grid grid-cols-7 gap-1 mb-2'>
                    {
                        daysNames.map((day) => (
                            <div key={day} className='text-center font-medium text-sm py-2'>
                                {day}
                            </div>
                        ))
                    }
                </div>

                <div className='grid grid-cols-7 gap-1 mx-5'>
                    {
                        days.map((day, index) => (
                            <DayCard key={index} day={day} />
                        ))
                    }
                </div>
            </main>
            {
                modal && <EventoModal cerrarModal={setModal} />
            }
        </div>
    )
}
