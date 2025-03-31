import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';


import AppRouter from './router/AppRouter'

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
