import React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div className='bg-amber-700 w-screen h-screen flex justify-around'>

            <div className='w-56 h-56 bg-gray-500 flex justify-center items-center cursor-pointer'>
                <Link to='/cheques'>
                    <p className='text-white text-2xl'>Cheques</p>
                </Link>
            </div>
            <div className='w-56 h-56 bg-gray-500 flex justify-center items-center cursor-pointer'>
                <Link to='/tarjetas'>
                    <p className='text-white text-2xl'>Tarjetas</p>
                </Link>
            </div>

        </div>
    )
}
