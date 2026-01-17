const listarVendedor = (vendedor) => {
  const tr = document.createElement('tr');
  tr.id = vendedor._id;

  const codigo = document.createElement('td');
  const nombre = document.createElement('td');
  const permiso = document.createElement('td');
  const acciones = document.createElement('td');

  codigo.innerText = vendedor.codigo;
  nombre.innerText = vendedor.nombre;
  permiso.innerText = vendedor.permiso;

  acciones.classList.add('acciones');

  acciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `;

  tr.appendChild(codigo);
  tr.appendChild(nombre);
  tr.appendChild(permiso);
  tr.appendChild(acciones);

  return tr;
};

const htmlFormulario = (seleccionado = {}) => {
  const html = `
        <section>
            <main>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" name="nombre" id="nombre" value="${seleccionado?.children?.[1].innerText || ''}" />
            </main>
            <main>
                <label htmlFor="codigo">Codigo</label>
                <input type="text" name="codigo" id="codigo" value="${seleccionado?.children?.[0].innerText || ''}" />
            </main>
            <main>
                <label htmlFor="permisos">Permisos</label>
                <input type="number" name="permisos" id="permisos" value="${seleccionado?.children?.[2].innerText || ''}" />
            </main>
        </section>
        `;
  return html;
};

module.exports = {
  listarVendedor,
  htmlFormulario,
};
