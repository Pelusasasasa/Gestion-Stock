import React from 'react'
import { useEventoStore } from '../../hooks'

export const EventCard = ({ _id, title, category, openModal }) => {

    const { activeEvento } = useEventoStore();

    const handleActive = () => {
        activeEvento(_id)
        openModal(true);
    }
    return (
        <p style={{
            background: category.color
        }}
            onClick={handleActive}
            className={`text-gray-700 border-b-2 border-gray-200 font-bold text-sm whitespace-nowrap px-2 truncate cursor-pointer `}>
            {title}
        </p>
    )
}
