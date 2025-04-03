import React from 'react'
import { Link } from 'react-router-dom'

export const AsideCard = ({ elem, asideView }) => {
    return (
        <Link to={`/${elem.text}`} >
            <div className='flex gap-2 text-white items-center pl-3 cursor-pointer hover:bg-gray-600 py-2'>
                <elem.icon />
                {
                    asideView && <p>{elem.text}</p>
                }
            </div>
        </Link >
    )
}
