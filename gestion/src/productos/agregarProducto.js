//Identificador
const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
//Informacion
const unidad = document.querySelector('#unidad');
const marca = document.querySelector('#marca');
const select = document.querySelector('#rubro');
const provedor = document.querySelector('#provedor');
const stock = document.querySelector('#stock');
//Precio
const costo = document.querySelector('#costo');
const costoDolar = document.querySelector('#costoDolar');
const impuesto = document.querySelector('#impuesto');
const costoIva = document.querySelector('#costoIva');
//Total
const ganancia = document.querySelector('#ganancia');
const total = document.querySelector('#total');
//Botones
const guardar = document.querySelector('.guardar');
const salir = document.querySelector('.salir');

const sweet  = require('sweetalert2');
const {cerrarVentana,apretarEnter, redondear, agregarMovimientoVendedores, verificarDatos} = require('../helpers');

const archivo = require('../configuracion.json');

const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config()
const URL = process.env.GESTIONURL;

let vendedor;
//Funciones
const traerRubros = async()=>{
    const rubros =  (await axios.get(`${URL}rubro`)).data;
    for await(let {numero,rubro} of rubros){
        const option = document.createElement('option');
        option.text = numero + " - " + rubro,
        option.value = rubro;
        select.appendChild(option)
    }
};

const traerProvedores = async () => {
    const provedores = (await axios.get(`${URL}provedor`)).data;
    for await(let {nombre} of provedores){
        const option = document.createElement('option');
        option.text = nombre,
        option.value = nombre;
        provedor.appendChild(option);
    }
};

const traerMarcas = async () => {
    const marcas = (await axios.get(`${URL}marca`)).data;
    for await(let {nombre} of marcas){
        const option = document.createElement('option');
        option.text = nombre,
        option.value = nombre;
        marca.appendChild(option);
    }
};

ipcRenderer.on('informacion',(e,args)=>{
    vendedor = args.vendedor;
});

window.addEventListener('load',async e=>{
    if (!archivo.dolar) {
        costoDolar.setAttribute('disabled',"");
    }
    dolar.value = ((await axios.get(`${URL}numero`)).data.Dolar).toFixed(2);
    
    traerRubros();
    traerProvedores();
    traerMarcas();
});

guardar.addEventListener('click',async e=>{
    const producto = {};
    e.preventDefault();
    const verificacion = await verificarDatos();

    if (verificacion) {
        producto._id = codigo.value;
        producto.descripcion = descripcion.value.trim().toUpperCase();
        producto.marca = marca.value.trim().toUpperCase();
        producto.rubro = rubro.value.trim();
        producto.provedor = provedor.value.toUpperCase().trim();
        producto.stock = stock.value;
        producto.costo = costo.value;
        producto.costoDolar = costoDolar.value;
        producto.impuesto = impuesto.value === "" ? 0 : impuesto.value;
        producto.ganancia = ganancia.value;
        producto.precio = total.value;
        producto.unidad = unidad.value;

        const {estado,mensaje} = (await axios.post(`${URL}productos`,producto)).data;

        await sweet.fire({
            title:mensaje,
            icon: "success",
            confirmButtonText:"Aceptar"
        });
        
        //Si el estado es true de que se guardo el producto salimos de la pagina Y guaradmos el movimineto del vendeor si esta activado
        if (estado) {
            await ipcRenderer.send('informacion-a-ventana-principal',producto);
            vendedor && await agregarMovimientoVendedores(`Cargo el producto ${producto.descripcion} con el precio ${producto.precio}`,vendedor);
            window.close();
        };
    }
});

codigo.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        if (codigo.value !== "") {
            const producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
            if (producto) {
                await sweet.fire({
                    title:"Codigo Ya utilizado por " + producto.descripcion
                });
                codigo.value = "";
                codigo.focus();
            }else{
                apretarEnter(e,descripcion);
            }
        }
    }
});

descripcion.addEventListener('keypress',e=>{
    apretarEnter(e,unidad);
});

unidad.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,marca);
});

marca.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,rubro);
});

rubro.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        provedor.focus();
    }
});

provedor.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,stock);
})

stock.addEventListener('keypress',e=>{
    apretarEnter(e,costo);
})

costo.addEventListener('keypress',e=>{
    if (costoDolar.hasAttribute('disabled')) {
        apretarEnter(e,impuesto);
    }else{
        apretarEnter(e,costoDolar);
    }
});

costoDolar.addEventListener('keypress',e=>{
    apretarEnter(e,impuesto);
});

impuesto.addEventListener('keypress',e=>{
    apretarEnter(e,costoIva);
})

costoIva.addEventListener('keypress',e=>{
    apretarEnter(e,ganancia);
})

ganancia.addEventListener('keypress',e=>{
    apretarEnter(e,total);
})

total.addEventListener('keypress',e=>{
    apretarEnter(e,guardar);
})

salir.addEventListener('click',e=>{
    window.close();
})

document.addEventListener('keydown',e=>{
    cerrarVentana(e)
});

codigo.addEventListener('focus',e=>{
    codigo.select();
});

descripcion.addEventListener('focus',async e=>{
    descripcion.select();
});

marca.addEventListener('focus',e=>{
    marca.select();
});

provedor.addEventListener('focus',e=>{
    provedor.select();
});

stock.addEventListener('focus',e=>{
    stock.select();
});

costo.addEventListener('focus',e=>{
    costo.select();
});

costoDolar.addEventListener('focus',e=>{
    costoDolar.select();
});

impuesto.addEventListener('focus',e=>{
    impuesto.select();
});

costoIva.addEventListener('focus',e=>{
    costoIva.select();
});

ganancia.addEventListener('focus',e=>{
    ganancia.select();
});

total.addEventListener('focus',e=>{
    total.select();
});

impuesto.addEventListener('blur',e=>{
    impuesto.value = impuesto.value === "" ? 0 : impuesto.value;
    if (parseFloat(costoDolar.value) !== 0) {
        costoIva.value = redondear(((parseFloat(impuesto.value) * parseFloat(costoDolar.value)/100) + parseFloat(costoDolar.value)) * parseFloat(dolar.value),2)
    }else{
        costoIva.value = ((parseFloat(impuesto.value) * parseFloat(costo.value)/100) + parseFloat(costo.value)).toFixed(2);
    }
});

total.addEventListener('focus',e=>{
    total.value = (parseFloat(costoIva.value) + (parseFloat(costoIva.value) * parseFloat(ganancia.value) / 100)).toFixed(2);
});