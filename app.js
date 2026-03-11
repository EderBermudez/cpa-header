const APP_CONFIG = {
  datos: usuario2, // Fuente de datos: usuario1, usuario2 o usuario3
  menu: menu2 // Fuente de menú: menu1, menu2 o menu3
};

/* ==========================================================================
   3. INICIALIZACIÓN Y EVENTOS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Ejecutar ordenamiento inicial y renderizado
  ejecutarOrdenamientoYRender();

  // Listener para el selector de orden
  const selectOrden = document.getElementById('selectOrden');
  if (selectOrden) {
    selectOrden.addEventListener('change', ejecutarOrdenamientoYRender);
  }

  // Buscador
  document.getElementById('inputBusqueda').addEventListener('input', filtrarEmpresas);

  // Controles masivos
  document.getElementById('btnExpandirTodo').addEventListener('click', () => toggleAll(true));
  document.getElementById('btnContraerTodo').addEventListener('click', () => toggleAll(false));

});

/* ==========================================================================
   4. LÓGICA DE ORDENAMIENTO Y RENDER
   ========================================================================== */
function ejecutarOrdenamientoYRender() {
  const criterio = document.getElementById('selectOrden').value;

  // Clonar datos para no afectar el original
  let datosParaOrdenar = [...APP_CONFIG.datos];

  datosParaOrdenar.sort((a, b) => {
    switch (criterio) {
      case 'nombre_asc':
        return a.nombre.localeCompare(b.nombre);
      case 'nombre_desc':
        return b.nombre.localeCompare(a.nombre);
      case 'id_asc':
        return a.id.localeCompare(b.id);
      case 'id_desc':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  // Renderizar con los datos ya ordenados
  renderizarGrupos(datosParaOrdenar, APP_CONFIG.menu);

  // Aplicar reglas de apertura según cantidad
  aplicarLogicaApertura(datosParaOrdenar.length);

  // Tooltips de Bootstrap
  activarTooltips();

}

function renderizarGrupos(grupos, menu) {
  const contenedor = document.getElementById('contenedorGrupos');
  contenedor.innerHTML = '';

  grupos.forEach((grupo, index) => {
    const totalEmpresas = grupo.empresas.length;
    const accordionId = `collapse${index}`;

    // Generar Menú con parámetros dinámicos
    let menuHTML = '';
    if (menu && menu.length > 0) {
      menuHTML = `
        <div class="d-none d-lg-flex align-items-center ms-auto me-3 ps-2 h-100">
            ${menu.map(opcion => {
                const sep = opcion.url.includes('?') ? '&' : '?';
                const urlFinal = `${opcion.url}${sep}idGrupo=${grupo.id}&nomGrupo=${encodeURIComponent(grupo.nombre)}`;
                return `<a href="${urlFinal}" target="${opcion.target}" class="group-menu-link"><span>${opcion.nombre}</span></a>`;
            }).join('')}
        </div>`;
    }

    const itemHTML = `
        <div class="accordion-item mb-3 shadow-sm grupo-item" data-nombre="${grupo.nombre.toLowerCase()}" data-id="${grupo.id}">
          <div class="accordion-header d-flex align-items-center rounded p-0" style="min-height: 48px;">
            <button class="accordion-button custom-icon collapsed flex-grow-0 w-auto bg-transparent shadow-none border-0" 
                type="button" data-bs-toggle="collapse" data-bs-target="#${accordionId}">
              <span class="material-symbols-outlined icon-state">expand_circle_down</span>
            </button>
            <span class="accordion-title">${grupo.id} - ${grupo.nombre}</span>
            <span class="badge-count mx-3 ">${totalEmpresas}</span>
            ${menuHTML}
          </div>

          <div id="${accordionId}" class="accordion-collapse collapse">
            <div class="accordion-body">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style="width: 15%" class="ps-4">NO. EMPRESA</th>
                    <th style="width: 55%">EMPRESA</th>
                    <th style="width: 30%">RFC</th>
                  </tr>
                </thead>
                <tbody>
                  ${grupo.empresas.map(emp => `
                    <tr class="empresa-row" 
                      onclick="seleccionarEmpresa('${emp.no}', '${emp.nombre}', '${grupo.id}', '${grupo.nombre}')"
                      data-search="${emp.nombre.toLowerCase()} ${emp.no} ${emp.rfc.toLowerCase()}">
                      <td class="ps-4 text-muted small">${emp.no}</td>
                      <td><span class="text-wrap fw-semibold">${emp.nombre}</span></td>
                      <td class="text-muted small">${emp.rfc}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
    contenedor.insertAdjacentHTML('beforeend', itemHTML);
  });
}

/* ==========================================================================
   5. HELPERS DE INTERFAZ Y REGLAS DE NEGOCIO
   ========================================================================== */
function aplicarLogicaApertura(total) {
  const items = document.querySelectorAll('.accordion-collapse');
  const btnExp = document.getElementById('btnExpandirTodo');
  const btnCon = document.getElementById('btnContraerTodo');

  // Reset de botones
  btnExp.disabled = false;
  btnCon.disabled = false;

  if (total === 1) {
    if (items[0]) abrirCerrar(items[0], true);
    btnExp.disabled = true;
    btnCon.disabled = true;
  } else if (total === 2) {
    items.forEach(el => abrirCerrar(el, true));
  } else {
    items.forEach(el => abrirCerrar(el, false));
  }
}

function abrirCerrar(el, abrir) {
  const btn = document.querySelector(`[data-bs-target="#${el.id}"]`);
  if (abrir) {
    el.classList.add('show');
    btn.classList.remove('collapsed');
  } else {
    el.classList.remove('show');
    btn.classList.add('collapsed');
  }
}

function toggleAll(expandir) {
  if (APP_CONFIG.datos.length === 1) return;
  document.querySelectorAll('.accordion-collapse').forEach(el => abrirCerrar(el, expandir));
}

function filtrarEmpresas(e) {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.grupo-item').forEach(grupo => {
    const filas = grupo.querySelectorAll('.empresa-row');
    let match = Array.from(filas).some(f => f.getAttribute('data-search').includes(term));
    if (grupo.getAttribute('data-nombre').includes(term) || grupo.getAttribute('data-id').includes(term)) match = true;

    grupo.style.display = match ? '' : 'none';
    if (term.length > 0 && match) {
      filas.forEach(f => f.style.display = f.getAttribute('data-search').includes(term) || grupo.getAttribute('data-nombre').includes(term) ? '' : 'none');
      abrirCerrar(grupo.querySelector('.accordion-collapse'), true);
    }
  });
}

function activarTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: 'hover' // <--- Esto evita que se quede pegado al hacer clic
    });
  });
}

function seleccionarEmpresa(empId, empNombre, grupoId, grupoNombre) {
  // 1. Mostrar en consola para depuración técnica
  console.log("--- Empresa Seleccionada ---");
  console.log("Grupo:", grupoId, "-", grupoNombre);
  console.log("Empresa:", empId, "-", empNombre);

  // 2. Ver en pantalla (puedes usar un modal o un alert temporal)
  const mensaje = `
        🏢 GRUPO: [${grupoId}] ${grupoNombre}
        🏭 EMPRESA: [${empId}] ${empNombre}
        
        Redireccionando a detalles...
    `;

  alert(mensaje);

  // 3. El siguiente paso real sería algo como:
  // window.location.href = `detalles.php?idG=${grupoId}&idE=${empId}`;
}