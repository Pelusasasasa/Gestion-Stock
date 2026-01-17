const sweet = require('sweetalert2');
const { vendedores: verVendedores } = require('../configuracion.json');
const { getVendedores, postVendedor, putVendedor, deleteVendedor } = require('../services/vendedorService');

const { cerrarVentana, verificarUsuarios } = require('../helpers');
const funciones = require('../helpers');
const { listarVendedor, htmlFormulario } = require('../ui/vendedor');

const tbody = document.querySelector('tbody');

//botones
const agregar = document.querySelector('.agregar');
const eliminar = document.querySelector('.eliminar');

let seleccionado;

window.addEventListener('load', async (e) => {
  if (verVendedores) {
    const vendedor = await verificarUsuarios();

    if (vendedor === '') {
      await sweet.fire({
        title: 'Contraseña incorrecta',
      });
      location.reload();
    } else if (vendedor.permiso !== 0) {
      await sweet.fire({
        title: 'Acceso Denegado',
      });
      window.close();
    }
  }

  const vendedores = await getVendedores();
  listarVendedores(vendedores);
});

const listarVendedores = (lista) => {
  tbody.innerHTML = '';
  for (let vendedor of lista) {
    const tr = listarVendedor(vendedor);

    tbody.appendChild(tr);
  }
};

agregar.addEventListener('click', (e) => {
  sweet
    .fire({
      html: htmlFormulario(),
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
    })
    .then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        const vendedorNuevo = {};
        vendedorNuevo.nombre = document.getElementById('nombre').value.toUpperCase();
        vendedorNuevo.codigo = document.getElementById('codigo').value;
        vendedorNuevo.permiso = document.getElementById('permisos').value;

        try {
          const { ok, vendedor } = await postVendedor(vendedorNuevo);
          if (ok) {
            const tr = listarVendedor(vendedor);

            tbody.appendChild(tr);
          }
        } catch (error) {
          console.log(error);
          await sweet.fire({
            title: 'No se pudo agregar Vendedor',
          });
        }
      }
    });
});

tbody.addEventListener('click', async (e) => {
  seleccionado = funciones.obtenerElementoSeleccionado(e);

  if (e.target.innerText === 'edit') {
    sweet
      .fire({
        title: 'Modificar Vendedor',
        html: htmlFormulario(seleccionado),
        showCancelButton: true,
        confirmButtonText: 'Modificar',
      })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          const vendedorNuevo = {};
          vendedorNuevo.nombre = document.getElementById('nombre').value.toUpperCase();
          vendedorNuevo.codigo = document.getElementById('codigo').value;
          vendedorNuevo.permiso = document.getElementById('permisos').value;

          const { ok, vendedor } = await putVendedor(vendedorNuevo, seleccionado.id);

          if (ok) {
            location.reload();
          }
        }
      });
  } else if (e.target.innerText === 'delete') {
    const { isConfirmed } = await sweet.fire({
      title: 'Eliminar Vendedor?',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
    });

    if (isConfirmed) {
      const { ok } = await deleteVendedor(seleccionado.id);
      if (ok) {
        tbody.removeChild(seleccionado);
      }
    }
  }
});

document.addEventListener('keyup', (e) => {
  cerrarVentana(e);
});
