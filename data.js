// ESCENARIO 1: Un solo grupo, sin menú de grupo
const usuario1 = [{
  id: "00001",
  nombre: "EL ÁGUILA",
  empresas: [{
    no: "11449",
    nombre: "EL ÁGUILA COMPAÑÍA DE SEGUROS, S.A. DE C.V.",
    rfc: "ASE941124NN4"
  }]
}];

// ESCENARIO 2: 2 grupos con menú de grupo
const usuario2 = [{
    id: "00001",
    nombre: "EL ÁGUILA",
    empresas: [{
      no: "11449",
      nombre: "EL ÁGUILA COMPAÑÍA DE SEGUROS, S.A. DE C.V.",
      rfc: "ASE941124NN4"
    }]
  },
  {
    id: "00002",
    nombre: "JUMEX",
    empresas: [{
        no: "12909",
        nombre: "COMERCIALIZADORA EL ORO, S.A.",
        rfc: "CEL470228G64"
      },
      {
        no: "12910",
        nombre: "JUGOMEX, S.A. DE C.V.",
        rfc: "JUG801202175"
      }
    ]
  }
];

// ESCENARIO 3: 5 grupos (para probar el colapso automático y buscador)
const usuario3 = [{
    id: "00001",
    nombre: "EL ÁGUILA",
    empresas: [{
      no: "11449",
      nombre: "EL ÁGUILA COMPAÑÍA DE SEGUROS",
      rfc: "ASE941124NN4"
    }]
  },
  {
    id: "00002",
    nombre: "JUMEX",
    empresas: [{
        no: "12909",
        nombre: "COMERCIALIZADORA EL ORO, S.A.",
        rfc: "CEL470228G64"
      },
      {
        no: "12910",
        nombre: "JUGOMEX, S.A. DE C.V.",
        rfc: "JUG801202175"
      },
      {
        no: "12929",
        nombre: "BOTEMEX, S.A. DE C.V.",
        rfc: "BOT760202AQ5"
      },
      {
        no: "12955",
        nombre: "JUMEX MEXICALI, S.A. DE C.V.",
        rfc: "JME990601QZ4"
      }
    ]
  },
  {
    id: "00003",
    nombre: "EMPRESA 3",
    empresas: Array(14).fill({
      no: "000",
      nombre: "Empresa de Relleno",
      rfc: "XXXX000000"
    })
  },
  {
    id: "00004",
    nombre: "EMPRESA 4",
    empresas: Array(25).fill({
      no: "000",
      nombre: "Empresa de Relleno",
      rfc: "XXXX000000"
    })
  },
  {
    id: "00005",
    nombre: "GOLD CITRUS",
    empresas: [{
      no: "13729",
      nombre: "GOLD CITRUS SA DE CV",
      rfc: "GCI1501258G6"
    }]
  }
];





/* Mapeo de menús disponibles */

const menu1 = []; // Sin menú

const menu2 = [{
    nombre: "Conciliación",
    url: "/conciliacion.html",
    target: "_self"
  },
  {
    nombre: "Process",
    url: "https://sistema.com/process",
    target: "_blank"
  },
  {
    nombre: "Descargas",
    url: "/downloads",
    target: "_self"
  },
  {
    nombre: "Risk",
    url: "/risk-management",
    target: "_self"
  }
];

const menu3 = [{
    nombre: "Conciliación",
    url: "/conciliacion.html",
    target: "_self"
  },
  {
    nombre: "Process",
    url: "/process",
    target: "_self"
  }
];