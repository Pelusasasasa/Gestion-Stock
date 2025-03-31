import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from '../Home/pages/Home'
import { Cheques } from '../cheque/Cheques'

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cheques' element={<Cheques />} />
        </Routes>
    )
}

export default AppRouter