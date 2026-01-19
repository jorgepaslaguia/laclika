window.PARSER_FIXTURES = [
  {
    id: 'h0_basic',
    level: 0,
    text: 'MENU Y ELABORACIONES\n1. ENSALADA DE TOMATE\nProcesos: LAVAR, CORTAR, MONTAR\nRecursos: FREGADERO, ESTACION\n2. FLAN\nProcesos: MEZCLAR, BANO MARIA, ENFRIAR, EMPLATAR\nRecursos: HORNO, ESTACION',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'h0_sections',
    level: 0,
    text: 'ENTRANTES: ENSALADA, TARTAR\nPRINCIPAL: POLLO ASADO\nPOSTRE: NATILLAS',
    expect: { platesMin: 4, tasksMin: 10, phasesMin: 2 }
  },
  {
    id: 'h1_bullets',
    level: 1,
    text: 'MENU\n- ENSALADA TEMPLADA\nProcesos: LAVAR, CORTAR, MONTAR\n- ROAST BEEF\nProcesos: ASAR, EMPLATAR\nRecursos: HORNO',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'h1_numbers',
    level: 1,
    text: 'MENU Y ELABORACIONES\n1. CREMA DE CALABAZA\nProcesos: CORTAR, COCER, TRITURAR\n2. PASTA FRESCA\nProcesos: AMASAR, FORMAR, COCER, EMPLATAR',
    expect: { platesMin: 2, tasksMin: 7, phasesMin: 2 }
  },
  {
    id: 'h2_flat_numbers',
    level: 2,
    text: 'MENU Y ELABORACIONES 1. TARTAR CITRICO Procesos: LAVAR, CORTAR, MEZCLAR 2. CREMA DE CALABAZA Procesos: CORTAR, COCER, TRITURAR',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'h2_flat_sections',
    level: 2,
    text: 'ENTRANTES: ENSALADA, TARTAR PRINCIPAL: POLLO ASADO POSTRE: FLAN',
    expect: { platesMin: 4, tasksMin: 10, phasesMin: 2 }
  },
  {
    id: 'h3_procesos_asar',
    level: 3,
    text: 'MENU Y ELABORACIONES\n1. COSTILLAR\nProcesos: ASAR Y EMPLATAR\nRecursos: HORNO',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'h3_verbos_fuera',
    level: 3,
    text: 'MENU Y ELABORACIONES\n1. POLLO ASADO\nTexto: asar y emplatar al momento\n2. ENSALADA VERDE\nTexto: lavar y cortar',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'h4_team_resources',
    level: 4,
    text: 'EQUIPO DE COCINA\nChef Uno - Jefe - Nivel 3\nPinche Dos - Ayudante - Nivel 2\nRECURSOS DISPONIBLES\nHorno: 1\nFogones: 2\nEstacion: 1\nFregadero: 1\nMENU Y ELABORACIONES\n1. ENSALADA TEMPLADA\nProcesos: LAVAR, CORTAR, MONTAR\nRecursos: FREGADERO, ESTACION',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'h4_dedup_similar',
    level: 4,
    text: 'MENU Y ELABORACIONES\n1. TARTA DE QUESO\nIngredientes: queso; huevos; azucar\n2. TARTA QUESO\nIngredientes: queso; huevos\n3. TARTA DE QUESO\nProcesos: MEZCLAR, HORNEAR, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'h5_mixed_ingredients',
    level: 5,
    text: 'MENU Y ELABORACIONES\n1. TEMPURA DE VERDURAS\nIngredientes: calabacin; zanahoria; sal\n2. RISOTTO DE SETAS\nIngredientes: arroz; setas; caldo\nProcesos: SOFREIR, COCER, EMPLATAR',
    expect: { platesMin: 2, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 'h5_flat_stress',
    level: 5,
    text: 'MENU Y ELABORACIONES 1. CROQUETAS CASERAS Procesos: COCER, ENFRIAR, FORMAR, FREIR, EMPLATAR 2. SOPA DE VERDURAS Procesos: CORTAR, COCER, EMPLATAR 3. POLLO ASADO Procesos: ASAR, EMPLATAR 4. ENSALADA MIXTA Procesos: LAVAR, CORTAR, MONTAR 5. FLAN Procesos: MEZCLAR, BANO MARIA, ENFRIAR, EMPLATAR 6. PASTA FRESCA Procesos: AMASAR, FORMAR, COCER, EMPLATAR',
    expect: { platesMin: 6, tasksMin: 18, phasesMin: 2 }
  }
];
