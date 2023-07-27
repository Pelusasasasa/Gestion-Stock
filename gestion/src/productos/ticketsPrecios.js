const { ipcRenderer } = require('electron');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const imprimir = document.getElementById('imprimir');

