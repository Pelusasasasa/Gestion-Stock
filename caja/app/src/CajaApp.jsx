import React from 'react'
import { AsideBar } from './components/AsideBar'
import AppRouter from './router/AppRouter'

export const CajaApp = () => {
    return (
        <div className='flex'>
            <AsideBar />
            <AppRouter />
        </div>
    )
}
