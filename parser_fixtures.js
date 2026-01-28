window.PARSER_FIXTURES = [
  {
    id: 't1_numbered_basic',
    level: 0,
    text: 'MENU\n1. Ensalada mixta\n2. Pollo al horno\n3. Flan casero',
    expect: { platesMin: 3, tasksMin: 3, phasesMin: 1, processIncludes: ['HORNEAR', 'BANO_MARIA'] }
  },
  {
    id: 'simple_lines_no_numbers',
    level: 0,
    text: 'Ensalada mixta\nPollo al horno\nFlan casero',
    expect: { platesMin: 3, tasksMin: 3, phasesMin: 1, processIncludes: ['HORNEAR', 'BANO_MARIA'] }
  },
  {
    id: 'menu_simple_lines',
    level: 0,
    text: 'Ensalada mixta\nPollo al horno\nFlan casero',
    expect: { platesMin: 3, tasksMin: 1, phasesMin: 1 }
  },
  {
    id: 'menu_bano_maria',
    level: 0,
    text: 'Recursos: horno x1; estacion x1\nFlan casero',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, missingResourcesInclude: ['FOGONES'] }
  },
  {
    id: 'menu_reposar_enfriar',
    level: 0,
    text: 'Recursos: horno x1\n1. Crema de limon\nProcesos: reposar, enfriar',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, missingResourcesInclude: ['ESTACION'] }
  },
  {
    id: 'menu_with_metadata',
    level: 0,
    text: 'Recursos: horno x1; fogones x2; estacion x1\nEquipo: Chef + 2 pinches\nAlergias: gluten\nEnsalada mixta\nPollo al horno',
    expect: { platesMin: 2, platesMax: 2, tasksMin: 2, phasesMin: 1 }
  },
  {
    id: 't3_ocr_spacing',
    level: 1,
    text: 'MENU 1. ENSALADA   MIXTA 2. POLLO   AL   HORNO 3. FLAN CASERO',
    expect: { platesMin: 3, tasksMin: 3, phasesMin: 1 }
  },
  {
    id: 't4_sections',
    level: 1,
    text: 'Entrante: Ensalada\nPrincipal: Pollo al horno\nPostre: Flan casero',
    expect: { platesMin: 3, tasksMin: 3, phasesMin: 1 }
  },
  {
    id: 't5_resources_team',
    level: 2,
    text: 'RECURSOS\nHorno: 1\nEQUIPO\nChef + 1 pinche\nMENU\n1. Pollo al horno\n2. Ensalada',
    expect: { platesMin: 2, tasksMin: 2, phasesMin: 1 }
  },
  {
    id: 't6_unknown_dish',
    level: 2,
    text: 'MENU\n1. Cosa del chef',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1 }
  },
  {
    id: 'process_bano_maria_accent',
    level: 0,
    text: 'MENU\nCrema catalana - baño maría',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['BANO_MARIA'] }
  },
  {
    id: 'process_sous_vide',
    level: 0,
    text: 'MENU\nSalmon sous vide',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['COCER'] }
  },
  {
    id: 'process_escaldar',
    level: 0,
    text: 'MENU\nVerduras escaldadas',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['COCER'] }
  },
  {
    id: 'process_blanquear',
    level: 0,
    text: 'MENU\nPescado blanqueado',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['COCER'] }
  },
  {
    id: 'process_horno_gratinar',
    level: 0,
    text: 'MENU\nCarne al horno gratinada',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['HORNEAR', 'GRATINAR'] }
  },
  {
    id: 'process_sofreir_accent',
    level: 0,
    text: 'MENU\nSofreír cebolla',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['SOFREIR'] }
  },
  {
    id: 'process_freir_accent',
    level: 0,
    text: 'MENU\nFreír en aceite',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['FREIR'] }
  },
  {
    id: 'process_reposar_explicit',
    level: 0,
    text: 'MENU\nCrema ligera - reposar en frio',
    expect: { platesMin: 1, tasksMin: 1, phasesMin: 1, processIncludes: ['REPOSAR'] }
  },
  {
    id: 'anti_plancha_resource',
    level: 0,
    text: 'Recursos:\nPlancha de acero inoxidable\nMENU\nEnsalada mixta',
    expect: { platesMin: 1, platesMax: 1, tasksMin: 1, phasesMin: 1 }
  },
  {
    id: 'anti_horno_microondas_note',
    level: 0,
    text: 'Recursos:\nHorno microondas roto\nMENU\nEnsalada mixta',
    expect: { platesMin: 1, platesMax: 1, tasksMin: 1, phasesMin: 1 }
  },
  {
    id: 'anti_fuego_sala',
    level: 0,
    text: 'Recursos:\nFuego de sala\nMENU\nEnsalada mixta',
    expect: { platesMin: 1, platesMax: 1, tasksMin: 1, phasesMin: 1 }
  },
  {
    id: 'anti_estacion_central',
    level: 0,
    text: 'Recursos:\nEstación central\nMENU\nEnsalada mixta',
    expect: { platesMin: 1, platesMax: 1, tasksMin: 1, phasesMin: 1 }
  },
  {
    id: 'anti_lavavajillas_industrial',
    level: 0,
    text: 'Recursos:\nLavavajillas industrial\nMENU\nEnsalada mixta',
    expect: { platesMin: 1, platesMax: 1, tasksMin: 1, phasesMin: 1 }
  }
];
window.PARSER_FIXTURES_VERSION = '2026-01-28';
