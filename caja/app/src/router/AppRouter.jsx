import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from '../Home/pages/Home'
import { Cheques } from '../cheque/pages/Cheques'
import { Tarjetas } from '../tarjeta/pages/Tarjetas'

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cheques' element={<Cheques />} />
            <Route path='/tarjetas' element={<Tarjetas />} />
        </Routes>
    )
}

export default AppRouter