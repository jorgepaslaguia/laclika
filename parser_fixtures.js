window.PARSER_FIXTURES = [
  {
    id: 't1_numbered_basic',
    level: 0,
    text: 'MENU\n1. Ensalada mixta\n2. Pollo al horno\n3. Flan casero',
    expect: { platesMin: 3, tasksMin: 6, phasesMin: 2, processIncludes: ['HORNEAR', 'BANO_MARIA'] }
  },
  {
    id: 'simple_lines_no_numbers',
    level: 0,
    text: 'Ensalada mixta\nPollo al horno\nFlan casero',
    expect: { platesMin: 3, tasksMin: 6, phasesMin: 2, processIncludes: ['HORNEAR', 'BANO_MARIA'] }
  },
  {
    id: 't3_ocr_spacing',
    level: 1,
    text: 'MENU 1. ENSALADA   MIXTA 2. POLLO   AL   HORNO 3. FLAN CASERO',
    expect: { platesMin: 3, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 't4_sections',
    level: 1,
    text: 'Entrante: Ensalada\nPrincipal: Pollo al horno\nPostre: Flan casero',
    expect: { platesMin: 3, tasksMin: 6, phasesMin: 2 }
  },
  {
    id: 't5_resources_team',
    level: 2,
    text: 'RECURSOS\nHorno: 1\nEQUIPO\nChef + 1 pinche\nMENU\n1. Pollo al horno\n2. Ensalada',
    expect: { platesMin: 2, tasksMin: 4, phasesMin: 2 }
  },
  {
    id: 't6_unknown_dish',
    level: 2,
    text: 'MENU\n1. Cosa del chef',
    expect: { platesMin: 1, tasksMin: 3, phasesMin: 1 }
  }
];
