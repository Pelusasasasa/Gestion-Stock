import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { CajaApp } from './CajaApp';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <CajaApp />
      </HashRouter>
    </Provider>
  </StrictMode>,
)


window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});
