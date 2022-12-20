const salir = document.querySelector('.salir');
const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
const marca = document.querySelector('#marca');
const select = document.querySelector('#rubro');
const stock = document.querySelector('#stock');
const costo = document.querySelector('#costo');
const costoDolar = document.querySelector('#costoDolar');
const impuesto = document.querySelector('#impuesto');
const costoIva = document.querySelector('#costoIva');
const ganancia = document.querySelector('#ganancia');
const total = document.querySelector('#total');
const guardar = document.querySelector('.guardar');

const sweet  = require('sweetalert2');
const {cerrarVentana,apretarEnter, redondear} = require('../helpers');
const archivo = require('../configuracion.json');

const archivo = require('../configuracion.json');

const axios = require('axios');
require('dotenv').config()
const URL = process.env.URL;

const traerRubros = async()=>{
    const rubros =  (await axios.get(`${URL}rubro`)).data;
    for await(let {numero,rubro} of rubros){
        const option = document.createElement('option');
        option.text = numero + " - " + rubro,
        option.value = rubro;
        select.appendChild(option)
    }
}

traerRubros();

window.addEventListener('load',async e=>{
    if (!archivo.dolar) {
        costoDolar.setAttribute('disabled',"");
    }
    dolar.value = ((await axios.get(`${URL}numero`)).data.Dolar).toFixed(2);
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

guardar.addEventListener('click',async ()=>{
    const producto = {}
    producto._id = codigo.value;
    producto.descripcion = descripcion.value.trim().toUpperCase();
    producto.marca = marca.value.trim().toUpperCase();
    producto.rubro = rubro.value.trim();
    producto.stock = stock.value;
    producto.costo = costo.value;
    producto.costoDolar = costoDolar.value;
    producto.impuesto = impuesto.value === "" ? 0 : impuesto.value;
    producto.ganancia = ganancia.value;
    producto.precio = total.value;
    const {estado,mensaje} = (await axios.post(`${URL}productos`,producto)).data
    sweet.fire({
        title:mensaje
    })
    if (estado) {
        window.close();
    } 
});

codigo.addEventListener('keypress',e=>{
    apretarEnter(e,descripcion);
})

descripcion.addEventListener('keypress',e=>{
    apretarEnter(e,marca);
})

marca.addEventListener('keypress',e=>{
    apretarEnter(e,rubro);
})

rubro.addEventListener('keypress',e=>{
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

descripcion.addEventListener('focus',e=>{
    descripcion.select();
});

marca.addEventListener('focus',e=>{
    marca.select();
});

rubro.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        stock.focus();
    }
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
