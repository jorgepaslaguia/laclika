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
  },
  {
    id: 'h0_entrecot_reduccion',
    level: 0,
    text: 'MENU\n1. ENTRECOT CON REDUCCION DE VINO TINTO\nIngredientes: entrecot; vino tinto; fondo',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'h0_ensalada_cruda',
    level: 0,
    text: 'MENU\n1. ENSALADA CRUDA DE TOMATE\nIngredientes: tomate; aceite; sal',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'h0_flan_casero',
    level: 0,
    text: 'MENU\n1. FLAN CASERO\nIngredientes: leche; huevos; azucar',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'h0_bizcocho',
    level: 0,
    text: 'MENU\n1. BIZCOCHO DE LIMON\nIngredientes: harina; huevo; azucar',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'h0_ravioli',
    level: 0,
    text: 'MENU\n1. RAVIOLI DE ESPINACA\nIngredientes: pasta; espinaca; ricotta',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2 }
  },
  {
    id: 'h1_menu_mixto_reduccion',
    level: 1,
    text: 'MENU DEGUSTACION\n1. ENTRECOT CON REDUCCION\n2. ENSALADA DE TOMATE\n3. FLAN',
    expect: { platesMin: 3, tasksMin: 9, phasesMin: 2 }
  },
  {
    id: 'h1_menu_frio',
    level: 1,
    text: 'MENU FRIO\n1. ENSALADA DE TOMATE\n2. CARPACCIO DE TERNERA\n3. GAZPACHO ANDALUZ',
    expect: { platesMin: 3, tasksMin: 9, phasesMin: 2 }
  },
  {
    id: 'h1_menu_caliente_fuerte',
    level: 1,
    text: 'MENU CALIENTE\n1. TARTA DE QUESO\n2. POLLO ASADO\n3. RISOTTO DE SETAS\n4. FLAN CASERO',
    expect: { platesMin: 4, tasksMin: 12, phasesMin: 2 }
  },
  {
    id: 'h1_menu_mini',
    level: 1,
    text: 'MENU MINI\n1. ENSALADA SIMPLE',
    expect: { platesMin: 1, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 'h4_team_counts_plus',
    level: 4,
    text: 'EQUIPO: Chef + 2 pinches\nMENU\n1. ENSALADA SIMPLE\nProcesos: LAVAR, CORTAR, MONTAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2, teamMin: 3 }
  },
  {
    id: 'h4_team_counts_x',
    level: 4,
    text: 'EQUIPO: Chef x2; pinche x3\nMENU\n1. SOPA\nProcesos: COCER, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2, teamMin: 5 }
  },
  {
    id: 'h4_team_counts_plural',
    level: 4,
    text: 'EQUIPO: 2 chefs y 4 pinches\nMENU\n1. ARROZ\nProcesos: COCER, EMPLATAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2, teamMin: 6 }
  },
  {
    id: 'h4_team_mixed_roles',
    level: 4,
    text: 'EQUIPO: Jefe + auxiliar + 2 pinches\nMENU\n1. ENSALADA\nProcesos: LAVAR, MONTAR',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 2, teamMin: 4 }
  }
];
