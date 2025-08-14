import React from 'react'
import { Link, useResolvedPath } from 'react-router-dom'

export const AsideCard = ({ elem, asideView, style }) => {
    const { pathname } = useResolvedPath();
    return (
        <Link to={`/${elem.text === 'Resumen de valores' ? 'valores' : elem.text}`} className={`${style} ${pathname.slice(1) === elem.text ? 'bg-gray-500' : ''}`} >
            <div className={'flex gap-2 text-white items-center pl-3 cursor-pointer hover:bg-gray-600 py-2 '}>
                <elem.icon />
                {
                    asideView && <p>{elem.text}</p>
                }
            </div>
        </Link >
    )
}
