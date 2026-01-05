window.PARSER_FIXTURES = [
  {
    id: 'nv_basic',
    text: 'MENU Y ELABORACIONES\n1. TARTAR DE SALMON\nProcesos: LAVAR, CORTAR, MEZCLAR, EMPLATAR\nRecursos: FREGADERO, ESTACION\n2. FLAN\nProcesos: MEZCLAR, BANO MARIA, ENFRIAR, EMPLATAR\nRecursos: HORNO, ESTACION',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'sections_team_resources',
    text: 'EQUIPO DE COCINA\nChef Uno - Jefe - Nivel 3\nPinxe Dos - Pinxe - Nivel 2\nRECURSOS DISPONIBLES\nHorno: 1\nFogones: 2\nEstacion: 1\nFregadero: 1\nMENU Y ELABORACIONES\n1. ENSALADA TEMPLADA\nProcesos: LAVAR, CORTAR, MONTAR\nRecursos: FREGADERO, ESTACION',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'flat_numbers',
    text: 'MENU Y ELABORACIONES 1. TARTAR CITRICO Procesos: LAVAR, CORTAR, MEZCLAR 2. CREMA DE CALABAZA Procesos: CORTAR, COCER, TRITURAR',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'bullets',
    text: 'MENU\n- ENSALADA\nProcesos: LAVAR, CORTAR, MONTAR\n- ROAST BEEF\nProcesos: HORNEAR, EMPLATAR\nRecursos: HORNO',
    expect: { platesMin: 2, tasksMin: 5, phasesMin: 2 }
  },
  {
    id: 'no_processes',
    text: 'MENU Y ELABORACIONES\n1. TARTA DE QUESO\nIngredientes: queso; huevos; azucar\n2. SOPA DE VERDURAS\nIngredientes: zanahoria; puerro; patata',
    expect: { platesMin: 2, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'al_horno',
    text: 'MENU Y ELABORACIONES\n1. CORDERO AL HORNO\nIngredientes: cordero; aceite; sal',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'tempura',
    text: 'MENU Y ELABORACIONES\n1. TEMPURA DE VERDURAS\nProcesos: CORTAR, TEMPURA, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'sous_vide',
    text: 'MENU Y ELABORACIONES\n1. SOLOMILLO SOUS VIDE\nProcesos: MEZCLAR, SOUS VIDE, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'crema_sopa',
    text: 'MENU Y ELABORACIONES\n1. CREMA DE CALABAZA\nProcesos: CORTAR, COCER, TRITURAR, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'croquetas',
    text: 'MENU Y ELABORACIONES\n1. CROQUETAS CASERAS\nProcesos: COCER, ENFRIAR, FORMAR, FREIR, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 5, phasesMin: 2 }
  },
  {
    id: 'pasta',
    text: 'MENU Y ELABORACIONES\n1. PASTA FRESCA\nProcesos: AMASAR, FORMAR, COCER, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'risotto',
    text: 'MENU Y ELABORACIONES\n1. RISOTTO DE SETAS\nProcesos: SOFREIR, COCER, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'flan',
    text: 'MENU Y ELABORACIONES\n1. FLAN\nProcesos: MEZCLAR, BANO MARIA, ENFRIAR, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'mixed_sections',
    text: 'ENTRANTES: ENSALADA, TARTAR\nPRINCIPAL: POLLO ASADO\nPOSTRE: FLAN',
    expect: { platesMin: 3, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'plancha',
    text: 'MENU Y ELABORACIONES\n1. VERDURAS A LA PLANCHA\nProcesos: LAVAR, CORTAR, PLANCHA, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  }
];
