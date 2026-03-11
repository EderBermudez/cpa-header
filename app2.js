// Configuración: Cambia aquí el set de datos para probar los 3 escenarios (usuario1, usuario2, usuario3)
let datosActuales = usuario3;


const APP_CONFIG = {
    datos: usuario3,      // Opciones: usuario1, usuario2, usuario3
    menu: "completo"      // Opciones: "ninguno", "basico", "completo"
};


document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Escuchar el buscador
  document.getElementById('inputBusqueda').addEventListener('input', filtrarEmpresas);

  // Botones de control masivo
  document.getElementById('btnExpandirTodo').addEventListener('click', () => toggleAll(true));
  document.getElementById('btnContraerTodo').addEventListener('click', () => toggleAll(false));
});

function initApp() {
  renderizarGrupos(datosActuales);
  aplicarLogicaApertura();
}

function renderizarGrupos(grupos) {
  const contenedor = document.getElementById('contenedorGrupos');
  contenedor.innerHTML = ''; // Limpiar

  grupos.forEach((grupo, index) => {
    const totalEmpresas = grupo.empresas.length;
    const accordionId = `collapse${index}`;

    // Construir el menú del grupo si existe
    let menuHTML = '';
    if (grupo.menu && grupo.menu.length > 0) {
      menuHTML = `
        <div class="d-none d-md-flex align-items-center ms-auto me-3 ps-2">
          ${grupo.menu.map(item => `<a href="#" class="group-menu-link  pe-2 me-2">${item}</a>`).join('')}
        </div>`;
    }

    const accordionItem = `
      <div class="accordion-item mb-3 border-0 shadow-sm grupo-item" data-nombre="${grupo.nombre.toLowerCase()}" data-id="${grupo.id}">
        <div class="accordion-header d-flex align-items-center rounded">
          <button class="accordion-button collapsed flex-grow-0 w-auto bg-transparent shadow-none border-0" 
            type="button" data-bs-toggle="collapse" data-bs-target="#${accordionId}">
            <span class="material-symbols-outlined icon-state">expand_circle_down</span>
          </button>
          <span class="accordion-title">${grupo.id} - ${grupo.nombre}</span>
          <span class="badge-count ms-3">${totalEmpresas}</span>
          ${menuHTML}
        </div>
        <div id="${accordionId}" class="accordion-collapse collapse" data-bs-parent="#contenedorGruposFalso">
            <div class="accordion-body p-0">
                <table class="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th style="width: 15%">No. Empresa</th>
                                    <th style="width: 55%">Empresa</th>
                                    <th style="width: 30%">RFC</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${grupo.empresas.map(emp => `
                                    <tr class="empresa-row" data-search="${emp.nombre.toLowerCase()} ${emp.no} ${emp.rfc.toLowerCase()}">
                                        <td class="ps-4">${emp.no}</td>
                                        <td>${emp.nombre}</td>
                                        <td>${emp.rfc}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;

    contenedor.insertAdjacentHTML('beforeend', accordionItem);
  });
}

function aplicarLogicaApertura() {
  const total = datosActuales.length;
  const items = document.querySelectorAll('.accordion-collapse');
  const btnExpandir = document.getElementById('btnExpandirTodo');
  const btnContraer = document.getElementById('btnContraerTodo');

  if (total === 1) {
    // Regla: 1 grupo -> Abierto y botones deshabilitados
    abrirCerrarElemento(items[0], true);
    btnExpandir.disabled = true;
    btnContraer.disabled = true;
  } else if (total === 2) {
    // Regla: 2 grupos -> Ambos abiertos
    items.forEach(item => abrirCerrarElemento(item, true));
  } else {
    // Regla: 3 o más -> Contraídos (ya lo están por default en el HTML generado)
    btnExpandir.disabled = false;
    btnContraer.disabled = false;
  }
}

function abrirCerrarElemento(el, abrir) {
  const bootstrapCollapse = new bootstrap.Collapse(el, {
    toggle: false
  });
  const button = document.querySelector(`[data-bs-target="#${el.id}"]`);

  if (abrir) {
    el.classList.add('show');
    button.classList.remove('collapsed');
  } else {
    el.classList.remove('show');
    button.classList.add('collapsed');
  }
}

function toggleAll(expandir) {
  const items = document.querySelectorAll('.accordion-collapse');
  items.forEach(item => abrirCerrarElemento(item, expandir));
}

function filtrarEmpresas(e) {
  const term = e.target.value.toLowerCase();
  const grupos = document.querySelectorAll('.grupo-item');

  grupos.forEach(grupo => {
    const filas = grupo.querySelectorAll('.empresa-row');
    let grupoTieneMatch = false;

    filas.forEach(fila => {
      const textoFila = fila.getAttribute('data-search');
      if (textoFila.includes(term)) {
        fila.style.display = '';
        grupoTieneMatch = true;
      } else {
        fila.style.display = 'none';
      }
    });

    // Si el término está en el nombre del grupo también mostramos todo el grupo
    const nombreGrupo = grupo.getAttribute('data-nombre');
    const idGrupo = grupo.getAttribute('data-id');
    if (nombreGrupo.includes(term) || idGrupo.includes(term)) grupoTieneMatch = true;

    grupo.style.display = grupoTieneMatch ? '' : 'none';

    // Auto-expandir si hay búsqueda activa
    if (term.length > 0 && grupoTieneMatch) {
      const collapseEl = grupo.querySelector('.accordion-collapse');
      abrirCerrarElemento(collapseEl, true);
    }
  });
}