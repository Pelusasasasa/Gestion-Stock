const sweet = require('sweetalert2');

window.addEventListener('load',e=>{
    sweet.fire({
        title:"Imprimir?",
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(({isConfirmed})=>{
        if (isConfirmed) {
            window.print()
        }
    });
})