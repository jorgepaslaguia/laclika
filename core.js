const PRESTART_SECONDS = 10;
var formatClock = typeof formatClock === 'function'
  ? formatClock
  : function (totalSeconds) {
    const total = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(total / 60);
    const seconds = Math.floor(total % 60);
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  };
if (typeof window !== 'undefined') {
        window.__CORE_LOADED__ = true;
      }
      const LOW_CONFIDENCE = 0.6;
      const BANNED_WORDS = ['menu', 'entrantes', 'principal', 'postre', 'equipo', 'cocina'];
      const INGREDIENT_WORDS = [
        'azucar',
        'sal',
        'pimienta',
        'mantequilla',
        'harina',
        'leche',
        'agua',
        'aceite',
        'canela',
        'huevo',
        'huevos',
        'cebolla',
        'ajo',
        'perejil',
        'limon',
        'nuez',
        'nata',
        'queso',
        'pan',
        'arroz',
        'setas',
        'chocolate'
      ];
      const TEAM_EXCLUDE_WORDS = [
        'horno',
        'fogon',
        'fogones',
        'estacion',
        'fregadero',
        'lavavajillas',
        'cocina',
        'capacidad',
        'recursos',
        'uso'
      ];

      const RESOURCE_IDS = {
        HORNO: 'HORNO',
        FOGON: 'FOGONES',
        ESTACION: 'ESTACION',
        FREGADERO: 'FREGADERO'
      };

      const RESOURCE_LABELS = {
        HORNO: 'Horno',
        FOGONES: 'Fogones',
        ESTACION: 'Estacion',
        FREGADERO: 'Fregadero',
        LAVAVAJILLAS: 'Lavavajillas'
      };
      const ALLOWED_RESOURCE_TYPES = new Set(['HORNO', 'FOGONES', 'ESTACION', 'FREGADERO', 'LAVAVAJILLAS']);

      const RESOURCE_TYPES = {
        COCCION: 'COCCION',
        PREP: 'PREP',
        LIMPIEZA: 'LIMPIEZA',
        OTRO: 'OTRO'
      };

      const PROCESS_TYPES = [
        'LAVAR',
        'ESCURRIR',
        'CORTAR',
        'MEZCLAR',
        'MONTAR',
        'FORMAR',
        'FREIR',
        'SALTEAR',
        'SOFREIR',
        'REDUCIR',
        'COCER',
        'HORNEAR',
        'GRATINAR',
        'BANO_MARIA',
        'EMPLATAR',
        'LIMPIAR',
        'REPOSAR',
        'ENFRIAR',
        'TRITURAR',
        'OTRO'
      ];

      const PROCESS_KEYWORDS = [
        { process: 'FREIR', regex: /(freir|fritura|frito|rebozar\s*y\s*freir|dorar en aceite)/i },
        { process: 'GRATINAR', regex: /(gratin|gratinado)/i },
        { process: 'BANO_MARIA', regex: /(bano maria)/i },
        { process: 'HORNEAR', regex: /(hornear|al horno|asar al horno|horno)/i },
        { process: 'SALTEAR', regex: /(saltear|confitar|plancha|sellar)/i },
        { process: 'SOFREIR', regex: /(sofreir|sofrito)/i },
        { process: 'REDUCIR', regex: /(reducir|reduccion|reducido)/i },
        { process: 'COCER', regex: /(cocer|hervir|pochar|guisar|estofar|cuajar)/i },
        { process: 'TRITURAR', regex: /(triturar|batir|licuar|emulsionar)/i },
        { process: 'ESCURRIR', regex: /(escurrir|colar)/i },
        { process: 'LAVAR', regex: /(lavar|enjuagar)/i },
        { process: 'LIMPIAR', regex: /(limpiar|fregar|lavavajillas)/i },
        { process: 'CORTAR', regex: /(cortar|picar|trocear|laminar|filetear|pelar)/i },
        { process: 'FORMAR', regex: /(formar|bolear|rellenar|cerrar|rebozar)/i },
        { process: 'MONTAR', regex: /(montar|armar|terminar emplatado)/i },
        { process: 'MEZCLAR', regex: /(mezclar|amasar|aderezar|sazonar|integrar|mezcla|marinar)/i },
        { process: 'EMPLATAR', regex: /(emplatar|servir|trinchar)/i },
        { process: 'REPOSAR', regex: /(reposar|descansar)/i },
        { process: 'ENFRIAR', regex: /(enfriar|refrigerar|temperar)/i }
      ];
      const PROCESS_VERB_REGEX = /\b(lavar|escurrir|cortar|picar|trocear|laminar|pelar|mezclar|montar|formar|freir|saltear|sofreir|sellar|reducir|reduccion|cocer|hervir|pochar|guisar|estofar|hornear|asar|gratin(?:ar|ado)?|bano maria|emplatar|servir|reposar|enfriar|triturar|limpiar|marinar|amasar|aderezar)\b/i;
      const TECHNIQUE_MAP = {
        BRASEADO: 'COCER',
        BRASADO: 'COCER',
        BRASEAR: 'COCER',
        ESTOFADO: 'COCER',
        GUISADO: 'COCER',
        CONFITADO: 'COCER',
        CONFITAR: 'COCER',
        SOUS_VIDE: 'COCER',
        AL_VACIO: 'COCER',
        BAJO_VACIO: 'COCER',
        ASAR: 'HORNEAR',
        ESCALIVAR: 'HORNEAR',
        PLANCHA: 'SALTEAR',
        TEMPURA: 'FREIR',
        REBOZADO: 'FREIR',
        REBOZAR: 'FREIR',
        AHUMAR: 'HORNEAR',
        GRATINADO: 'GRATINAR',
        REDUCCION: 'REDUCIR',
        REDUCIR: 'REDUCIR',
        REDUCIDO: 'REDUCIR'
      };

      const PROCESS_RESOURCE_PREF = {
        LAVAR: ['FREGADERO'],
        ESCURRIR: ['FREGADERO'],
        CORTAR: ['ESTACION'],
        MEZCLAR: ['ESTACION'],
        MONTAR: ['ESTACION'],
        FORMAR: ['ESTACION'],
        FREIR: ['FOGONES'],
        SALTEAR: ['FOGONES'],
        SOFREIR: ['FOGONES'],
        REDUCIR: ['FOGONES'],
        COCER: ['FOGONES'],
        HORNEAR: ['HORNO'],
        GRATINAR: ['HORNO'],
        BANO_MARIA: ['HORNO'],
        EMPLATAR: ['ESTACION'],
        LIMPIAR: ['LAVAVAJILLAS', 'FREGADERO'],
        REPOSAR: [null],
        ENFRIAR: [null],
        TRITURAR: ['ESTACION'],
        OTRO: [null]
      };

      const VERB_MAP = {
        LAVAR: { phase: 'MISE_EN_PLACE', baseMin: 6, resourceKey: 'FREGADERO' },
        ESCURRIR: { phase: 'MISE_EN_PLACE', baseMin: 4, resourceKey: 'FREGADERO' },
        CORTAR: { phase: 'MISE_EN_PLACE', baseMin: 7, resourceKey: 'ESTACION' },
        MEZCLAR: { phase: 'PREELABORACION', baseMin: 8, resourceKey: 'ESTACION' },
        MONTAR: { phase: 'PREELABORACION', baseMin: 8, resourceKey: 'ESTACION' },
        FORMAR: { phase: 'PREELABORACION', baseMin: 10, resourceKey: 'ESTACION' },
        TRITURAR: { phase: 'PREELABORACION', baseMin: 8, resourceKey: 'ESTACION' },
        SALTEAR: { phase: 'PREELABORACION', baseMin: 10, resourceKey: 'FOGONES' },
        SOFREIR: { phase: 'PREELABORACION', baseMin: 10, resourceKey: 'FOGONES' },
        REDUCIR: { phase: 'PREELABORACION', baseMin: 16, resourceKey: 'FOGONES' },
        FREIR: { phase: 'PREELABORACION', baseMin: 12, resourceKey: 'FOGONES' },
        COCER: { phase: 'PREELABORACION', baseMin: 16, resourceKey: 'FOGONES' },
        POCHAR: { phase: 'PREELABORACION', baseMin: 14, resourceKey: 'FOGONES' },
        HORNEAR: { phase: 'PREELABORACION', baseMin: 35, resourceKey: 'HORNO' },
        ASAR: { phase: 'PREELABORACION', baseMin: 45, resourceKey: 'HORNO' },
        GRATINAR: { phase: 'PREELABORACION', baseMin: 18, resourceKey: 'HORNO' },
        BANO_MARIA: { phase: 'PREELABORACION', baseMin: 35, resourceKey: 'HORNO' },
        EMPLATAR: { phase: 'SERVICIO', baseMin: 6, resourceKey: 'ESTACION' },
        DECORAR: { phase: 'SERVICIO', baseMin: 6, resourceKey: 'ESTACION' },
        TERMINAR: { phase: 'SERVICIO', baseMin: 6, resourceKey: 'ESTACION' },
        LIMPIAR: { phase: 'MISE_EN_PLACE', baseMin: 5, resourceKey: 'FREGADERO' },
        REPOSAR: { phase: 'PREELABORACION', baseMin: 8, resourceKey: null },
        ENFRIAR: { phase: 'PREELABORACION', baseMin: 10, resourceKey: null }
      };

      const RESOURCE_HINTS = {
        horno: 'HORNO',
        hornos: 'HORNO',
        fogon: 'FOGONES',
        fogones: 'FOGONES',
        sarten: 'FOGONES',
        plancha: 'FOGONES',
        olla: 'FOGONES',
        estacion: 'ESTACION',
        mesa: 'ESTACION',
        tabla: 'ESTACION',
        fregadero: 'FREGADERO',
        pila: 'FREGADERO',
        lavavajillas: 'LAVAVAJILLAS'
      };

      const STOPWORDS_PLATO = new Set([
        'procesos',
        'ingredientes',
        'recursos',
        'pax',
        'comensales',
        'personas',
        'raciones',
        'menu',
        'elaboraciones',
        'plato'
      ]);
      const DISH_META_WORDS = new Set([
        'equipo',
        'recursos',
        'ingredientes',
        'procesos',
        'estructura',
        'operativa',
        'cocina'
      ]);
      const DISH_SCORE_THRESHOLD = 0.55;
      const DISH_SIMILARITY_THRESHOLD = 0.88;
      const DISH_MAX_PLATOS_MIN = 6;
      const DISH_MAX_PLATOS_MAX = 50;
      const STYLE_FLAGS = [
        'CASERO',
        'GOURMET',
        'STREET',
        'BATCH_COOKING',
        'FAST',
        'SLOW',
        'VEGETARIANO',
        'VEGANO',
        'SIN_GLUTEN',
        'SALUDABLE',
        'ALTA_PRODUCCION',
        'SHOWCOOKING',
        'FRIO',
        'CALIENTE',
        'PARA_COMPARTIR',
        'EMPLATADO_MINIMO',
        'EMPLATADO_CUIDADO'
      ];

      const DEFAULT_STYLES = ['CASERO', 'CALIENTE', 'EMPLATADO_MINIMO'];

      const TYPE_PRIORITY = {
        CLASICO: 0,
        POPULAR: 1,
        MODERNO: 2,
        STREET: 3,
        TENDENCIA: 4
      };

      function sp(proceso, nombre, fase, nivel_min) {
        return { proceso, nombre, fase, nivel_min };
      }

      const PATTERN_LIBRARY = [
        {
          id: 'CROQUETAS',
          nombre_plato: 'Croquetas',
          aliases: ['croqueta', 'croquetas caseras'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE'],
          subprocesos: [
            sp('LAVAR', 'lavar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('CORTAR', 'picar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('COCER', 'cocer bechamel', 'PREELABORACION', 2),
            sp('ENFRIAR', 'enfriar bechamel', 'PREELABORACION', 1),
            sp('FORMAR', 'formar croquetas', 'PREELABORACION', 1),
            sp('FREIR', 'freir croquetas', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['FREIR'],
          recursos_tipicos: ['FOGONES', 'ESTACION', 'FREGADERO'],
          tiempo_estimado: { min: 45, max: 70 },
          notas: 'Patron casero con bechamel y fritura.'
        },
        {
          id: 'TORTILLA',
          nombre_plato: 'Tortilla espanola',
          aliases: ['tortilla', 'tortilla espanola'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE'],
          subprocesos: [
            sp('LAVAR', 'lavar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('COCER', 'pochar base de {plato}', 'PREELABORACION', 1),
            sp('MEZCLAR', 'mezclar huevos y base', 'PREELABORACION', 1),
            sp('COCER', 'cuajar {plato}', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION', 'FREGADERO']
        },
        {
          id: 'PAELLA',
          nombre_plato: 'Paella',
          aliases: ['paella'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir base de {plato}', 'PREELABORACION', 2),
            sp('COCER', 'cocer arroz', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'ARROZ_NEGRO',
          nombre_plato: 'Arroz negro',
          aliases: ['arroz negro', 'arroz con tinta'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir base de {plato}', 'PREELABORACION', 2),
            sp('COCER', 'cocer arroz', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'FIDEUA',
          nombre_plato: 'Fideua',
          aliases: ['fideua', 'fideua valenciana'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir base de {plato}', 'PREELABORACION', 2),
            sp('COCER', 'cocer fideos', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'PATATAS_BRAVAS',
          nombre_plato: 'Patatas bravas',
          aliases: ['patatas bravas', 'bravas'],
          cocina: 'espanola',
          tipo: 'POPULAR',
          estilos: ['CASERO', 'CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('LAVAR', 'lavar patatas', 'MISE_EN_PLACE', 1),
            sp('CORTAR', 'cortar patatas', 'MISE_EN_PLACE', 1),
            sp('FREIR', 'freir patatas', 'PREELABORACION', 1),
            sp('MEZCLAR', 'mezclar salsa brava', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['FREIR'],
          recursos_tipicos: ['FOGONES', 'ESTACION', 'FREGADERO']
        },
        {
          id: 'GAZPACHO',
          nombre_plato: 'Gazpacho',
          aliases: ['gazpacho'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'FRIO', 'EMPLATADO_MINIMO'],
          subprocesos: [
            sp('LAVAR', 'lavar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('TRITURAR', 'triturar {plato}', 'PREELABORACION', 1),
            sp('ENFRIAR', 'enfriar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['TRITURAR'],
          recursos_tipicos: ['ESTACION', 'FREGADERO']
        },
        {
          id: 'SALMOREJO',
          nombre_plato: 'Salmorejo',
          aliases: ['salmorejo'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'FRIO'],
          subprocesos: [
            sp('LAVAR', 'lavar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('TRITURAR', 'triturar {plato}', 'PREELABORACION', 1),
            sp('ENFRIAR', 'enfriar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['TRITURAR'],
          recursos_tipicos: ['ESTACION', 'FREGADERO']
        },
        {
          id: 'ASADO_HORNO',
          nombre_plato: 'Asado al horno',
          aliases: ['asado al horno', 'cordero al horno', 'pollo asado', 'al horno'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE', 'SLOW'],
          subprocesos: [
            sp('LAVAR', 'lavar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('MEZCLAR', 'sazonar {plato}', 'MISE_EN_PLACE', 1),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'ESTACION']
        },
        {
          id: 'PULPO_GALLEGA',
          nombre_plato: 'Pulpo a la gallega',
          aliases: ['pulpo a la gallega', 'pulpo'],
          cocina: 'espanola',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('COCER', 'cocer pulpo', 'PREELABORACION', 2),
            sp('CORTAR', 'cortar pulpo', 'PREELABORACION', 1),
            sp('MONTAR', 'montar {plato}', 'SERVICIO', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'ENSALADILLA_RUSA',
          nombre_plato: 'Ensaladilla rusa',
          aliases: ['ensaladilla rusa', 'ensaladilla'],
          cocina: 'espanola',
          tipo: 'POPULAR',
          estilos: ['FRIO', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('LAVAR', 'lavar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('COCER', 'cocer verduras', 'PREELABORACION', 1),
            sp('CORTAR', 'cortar ingredientes de {plato}', 'PREELABORACION', 1),
            sp('MEZCLAR', 'mezclar {plato}', 'PREELABORACION', 1),
            sp('ENFRIAR', 'enfriar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MEZCLAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION', 'FREGADERO']
        },
        {
          id: 'PASTA_FRESCA',
          nombre_plato: 'Pasta fresca',
          aliases: ['pasta fresca'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['CASERO', 'CALIENTE'],
          subprocesos: [
            sp('MEZCLAR', 'amasar pasta', 'MISE_EN_PLACE', 2),
            sp('REPOSAR', 'reposar masa', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'formar pasta', 'PREELABORACION', 2),
            sp('COCER', 'cocer pasta', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'LASAGNA',
          nombre_plato: 'Lasagna',
          aliases: ['lasagna', 'lasagna al horno'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'CASERO'],
          subprocesos: [
            sp('SOFREIR', 'sofreir salsa', 'PREELABORACION', 2),
            sp('MONTAR', 'montar capas', 'PREELABORACION', 2),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'ESTACION', 'FOGONES']
        },
        {
          id: 'RISOTTO',
          nombre_plato: 'Risotto',
          aliases: ['risotto'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'CASERO'],
          subprocesos: [
            sp('SOFREIR', 'sofreir base de {plato}', 'PREELABORACION', 2),
            sp('COCER', 'cocer arroz con caldo', 'PREELABORACION', 2),
            sp('MEZCLAR', 'mantecar {plato}', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'PIZZA',
          nombre_plato: 'Pizza',
          aliases: ['pizza'],
          cocina: 'italiana',
          tipo: 'POPULAR',
          estilos: ['CASERO', 'CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('MEZCLAR', 'amasar masa', 'MISE_EN_PLACE', 2),
            sp('REPOSAR', 'reposar masa', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'formar pizza', 'PREELABORACION', 1),
            sp('HORNEAR', 'hornear pizza', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'ESTACION']
        },
        {
          id: 'GNOCCHI',
          nombre_plato: 'Gnocchi',
          aliases: ['gnocchi', 'noquis'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'CASERO'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar masa', 'MISE_EN_PLACE', 2),
            sp('FORMAR', 'formar gnocchi', 'PREELABORACION', 2),
            sp('COCER', 'cocer gnocchi', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'TIRAMISU',
          nombre_plato: 'Tiramisu',
          aliases: ['tiramisu'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['FRIO', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar crema', 'MISE_EN_PLACE', 2),
            sp('MONTAR', 'montar capas', 'PREELABORACION', 1),
            sp('ENFRIAR', 'enfriar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['ENFRIAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'OSSOBUCO',
          nombre_plato: 'Ossobuco',
          aliases: ['ossobuco'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'SLOW'],
          subprocesos: [
            sp('SOFREIR', 'sofreir base de {plato}', 'PREELABORACION', 2),
            sp('COCER', 'cocer {plato} lento', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'CAPRESE',
          nombre_plato: 'Caprese',
          aliases: ['caprese', 'ensalada caprese'],
          cocina: 'italiana',
          tipo: 'CLASICO',
          estilos: ['FRIO', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('MONTAR', 'montar {plato}', 'PREELABORACION', 1),
            sp('MEZCLAR', 'ali+�ar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MONTAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'BURRATA',
          nombre_plato: 'Burrata con tomate',
          aliases: ['burrata', 'burrata con tomate'],
          cocina: 'italiana',
          tipo: 'MODERNO',
          estilos: ['FRIO', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('CORTAR', 'cortar tomate', 'MISE_EN_PLACE', 1),
            sp('MONTAR', 'montar {plato}', 'PREELABORACION', 1),
            sp('MEZCLAR', 'ali+�ar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MONTAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'QUICHE',
          nombre_plato: 'Quiche',
          aliases: ['quiche'],
          cocina: 'francesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'EMPLATADO_MINIMO'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar masa', 'MISE_EN_PLACE', 2),
            sp('REPOSAR', 'reposar masa', 'MISE_EN_PLACE', 1),
            sp('MONTAR', 'montar relleno', 'PREELABORACION', 2),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'ESTACION']
        },
        {
          id: 'RATATOUILLE',
          nombre_plato: 'Ratatouille',
          aliases: ['ratatouille'],
          cocina: 'francesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'VEGETARIANO'],
          subprocesos: [
            sp('CORTAR', 'cortar verduras', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir verduras', 'PREELABORACION', 1),
            sp('COCER', 'cocer {plato}', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'BOEUF_BOURGUIGNON',
          nombre_plato: 'Boeuf bourguignon',
          aliases: ['boeuf bourguignon', 'estofado bourguignon'],
          cocina: 'francesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'SLOW'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sellar carne', 'PREELABORACION', 2),
            sp('COCER', 'cocer {plato} lento', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'CREPES',
          nombre_plato: 'Crepes',
          aliases: ['crepes', 'crepe'],
          cocina: 'francesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar masa', 'MISE_EN_PLACE', 1),
            sp('REPOSAR', 'reposar masa', 'MISE_EN_PLACE', 1),
            sp('COCER', 'cocer crepes', 'PREELABORACION', 1),
            sp('FORMAR', 'rellenar crepes', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'SOUFFLE',
          nombre_plato: 'Souffle',
          aliases: ['souffle'],
          cocina: 'francesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar base', 'MISE_EN_PLACE', 2),
            sp('MONTAR', 'montar claras', 'MISE_EN_PLACE', 2),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 3),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'ESTACION']
        },
        {
          id: 'TARTE_TATIN',
          nombre_plato: 'Tarte tatin',
          aliases: ['tarte tatin'],
          cocina: 'francesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('CORTAR', 'cortar fruta', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'caramelizar fruta', 'PREELABORACION', 2),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 2),
            sp('REPOSAR', 'reposar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'FOGONES']
        },
        {
          id: 'SUSHI',
          nombre_plato: 'Sushi',
          aliases: ['sushi', 'maki', 'nigiri'],
          cocina: 'japonesa',
          tipo: 'CLASICO',
          estilos: ['FRIO', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('COCER', 'cocer arroz', 'PREELABORACION', 1),
            sp('ENFRIAR', 'enfriar arroz', 'PREELABORACION', 1),
            sp('CORTAR', 'cortar rellenos', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'formar sushi', 'SERVICIO', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['FORMAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'POKE',
          nombre_plato: 'Poke',
          aliases: ['poke', 'poke bowl', 'poke bowl'],
          cocina: 'japonesa',
          tipo: 'MODERNO',
          estilos: ['FRIO', 'EMPLATADO_MINIMO', 'SALUDABLE'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes de {plato}', 'MISE_EN_PLACE', 1),
            sp('MEZCLAR', 'ali+�ar ingredientes', 'PREELABORACION', 1),
            sp('MONTAR', 'montar bowl', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MONTAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'RAMEN',
          nombre_plato: 'Ramen',
          aliases: ['ramen'],
          cocina: 'japonesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE'],
          subprocesos: [
            sp('COCER', 'cocer caldo', 'PREELABORACION', 2),
            sp('COCER', 'cocer fideos', 'PREELABORACION', 1),
            sp('CORTAR', 'cortar toppings', 'MISE_EN_PLACE', 1),
            sp('MONTAR', 'montar {plato}', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'UDON',
          nombre_plato: 'Udon',
          aliases: ['udon'],
          cocina: 'japonesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE'],
          subprocesos: [
            sp('COCER', 'cocer fideos', 'PREELABORACION', 1),
            sp('COCER', 'cocer caldo', 'PREELABORACION', 1),
            sp('CORTAR', 'cortar toppings', 'MISE_EN_PLACE', 1),
            sp('MONTAR', 'montar {plato}', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'GYOZAS',
          nombre_plato: 'Gyozas',
          aliases: ['gyozas', 'gyoza'],
          cocina: 'japonesa',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar relleno', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'formar gyozas', 'PREELABORACION', 1),
            sp('SALTEAR', 'saltear gyozas', 'PREELABORACION', 1),
            sp('COCER', 'cocer gyozas', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['SALTEAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'TEMPURA',
          nombre_plato: 'Tempura',
          aliases: ['tempura'],
          cocina: 'japonesa',
          tipo: 'CLASICO',
          estilos: ['CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('CORTAR', 'cortar piezas', 'MISE_EN_PLACE', 1),
            sp('MEZCLAR', 'mezclar rebozado', 'MISE_EN_PLACE', 1),
            sp('FREIR', 'freir tempura', 'PREELABORACION', 2),
            sp('ESCURRIR', 'escurrir tempura', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['FREIR'],
          recursos_tipicos: ['FOGONES', 'FREGADERO', 'ESTACION']
        },
        {
          id: 'TACOS',
          nombre_plato: 'Tacos',
          aliases: ['tacos', 'taco'],
          cocina: 'mexicana',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'PARA_COMPARTIR', 'STREET'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir relleno', 'PREELABORACION', 2),
            sp('COCER', 'calentar tortillas', 'PREELABORACION', 1),
            sp('MONTAR', 'montar tacos', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['SOFREIR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'ENCHILADAS',
          nombre_plato: 'Enchiladas',
          aliases: ['enchiladas'],
          cocina: 'mexicana',
          tipo: 'POPULAR',
          estilos: ['CALIENTE'],
          subprocesos: [
            sp('SOFREIR', 'sofreir relleno', 'PREELABORACION', 2),
            sp('FORMAR', 'rellenar tortillas', 'PREELABORACION', 1),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 2),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['HORNEAR'],
          recursos_tipicos: ['HORNO', 'FOGONES', 'ESTACION']
        },
        {
          id: 'QUESADILLAS',
          nombre_plato: 'Quesadillas',
          aliases: ['quesadillas', 'quesadilla'],
          cocina: 'mexicana',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'PARA_COMPARTIR', 'STREET'],
          subprocesos: [
            sp('CORTAR', 'cortar relleno', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'montar quesadillas', 'PREELABORACION', 1),
            sp('COCER', 'cocer quesadillas', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'GUACAMOLE',
          nombre_plato: 'Guacamole',
          aliases: ['guacamole'],
          cocina: 'mexicana',
          tipo: 'POPULAR',
          estilos: ['FRIO', 'PARA_COMPARTIR', 'VEGETARIANO'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('MEZCLAR', 'mezclar guacamole', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1),
            sp('MONTAR', 'montar acompanamiento', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MEZCLAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'CEVICHE',
          nombre_plato: 'Ceviche',
          aliases: ['ceviche'],
          cocina: 'latam',
          tipo: 'CLASICO',
          estilos: ['FRIO', 'SALUDABLE'],
          subprocesos: [
            sp('CORTAR', 'cortar pescado', 'MISE_EN_PLACE', 1),
            sp('MEZCLAR', 'marinar ceviche', 'PREELABORACION', 1),
            sp('REPOSAR', 'reposar ceviche', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MEZCLAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'AREPAS',
          nombre_plato: 'Arepas',
          aliases: ['arepas', 'arepa'],
          cocina: 'latam',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'STREET'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar masa', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'formar arepas', 'PREELABORACION', 1),
            sp('COCER', 'cocer arepas', 'PREELABORACION', 1),
            sp('MONTAR', 'rellenar arepas', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'WOK_VERDURAS',
          nombre_plato: 'Wok de verduras',
          aliases: ['wok de verduras', 'wok'],
          cocina: 'asiatica',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'FAST', 'VEGETARIANO'],
          subprocesos: [
            sp('CORTAR', 'cortar verduras', 'MISE_EN_PLACE', 1),
            sp('SALTEAR', 'saltear verduras', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1),
            sp('MONTAR', 'montar guarnicion', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['SALTEAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'CURRY',
          nombre_plato: 'Curry',
          aliases: ['curry'],
          cocina: 'asiatica',
          tipo: 'POPULAR',
          estilos: ['CALIENTE'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir base', 'PREELABORACION', 2),
            sp('COCER', 'cocer curry', 'PREELABORACION', 2),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'PAD_THAI',
          nombre_plato: 'Pad thai',
          aliases: ['pad thai'],
          cocina: 'asiatica',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'FAST'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('COCER', 'cocer fideos', 'PREELABORACION', 1),
            sp('SALTEAR', 'saltear {plato}', 'PREELABORACION', 2),
            sp('MONTAR', 'montar {plato}', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['SALTEAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'BAO_BUNS',
          nombre_plato: 'Bao buns',
          aliases: ['bao buns', 'bao'],
          cocina: 'asiatica',
          tipo: 'TENDENCIA',
          estilos: ['CALIENTE', 'STREET'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar masa', 'MISE_EN_PLACE', 2),
            sp('REPOSAR', 'reposar masa', 'MISE_EN_PLACE', 1),
            sp('COCER', 'cocer bao al vapor', 'PREELABORACION', 2),
            sp('FORMAR', 'rellenar baos', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'DUMPLINGS',
          nombre_plato: 'Dumplings',
          aliases: ['dumplings', 'dim sum'],
          cocina: 'asiatica',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'PARA_COMPARTIR'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar relleno', 'MISE_EN_PLACE', 1),
            sp('FORMAR', 'formar dumplings', 'PREELABORACION', 1),
            sp('COCER', 'cocer dumplings', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'FRIED_RICE',
          nombre_plato: 'Fried rice',
          aliases: ['fried rice', 'arroz frito'],
          cocina: 'asiatica',
          tipo: 'POPULAR',
          estilos: ['CALIENTE', 'FAST'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir base', 'PREELABORACION', 1),
            sp('SALTEAR', 'saltear arroz', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['SALTEAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'TARTAR',
          nombre_plato: 'Tartar',
          aliases: ['tartar'],
          cocina: 'moderna',
          tipo: 'MODERNO',
          estilos: ['FRIO', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('CORTAR', 'cortar {plato}', 'MISE_EN_PLACE', 2),
            sp('MEZCLAR', 'ali+�ar {plato}', 'PREELABORACION', 2),
            sp('MONTAR', 'montar {plato}', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MONTAR'],
          recursos_tipicos: ['ESTACION']
        },
        {
          id: 'SMASH_BURGER',
          nombre_plato: 'Smash burger',
          aliases: ['smash burger', 'burger'],
          cocina: 'moderna',
          tipo: 'STREET',
          estilos: ['CALIENTE', 'STREET'],
          subprocesos: [
            sp('FORMAR', 'formar hamburguesas', 'MISE_EN_PLACE', 1),
            sp('FREIR', 'cocinar carne a la plancha', 'PREELABORACION', 1),
            sp('MONTAR', 'montar burger', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['FREIR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'CHEESECAKE',
          nombre_plato: 'Cheesecake',
          aliases: ['cheesecake', 'tarta de queso'],
          cocina: 'moderna',
          tipo: 'POPULAR',
          estilos: ['FRIO', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('MEZCLAR', 'mezclar base', 'MISE_EN_PLACE', 1),
            sp('HORNEAR', 'hornear {plato}', 'PREELABORACION', 2),
            sp('ENFRIAR', 'enfriar {plato}', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['ENFRIAR'],
          recursos_tipicos: ['HORNO', 'ESTACION']
        },
        {
          id: 'PASTA_TRUFA',
          nombre_plato: 'Pasta trufa',
          aliases: ['pasta trufa', 'pasta con trufa'],
          cocina: 'moderna',
          tipo: 'TENDENCIA',
          estilos: ['CALIENTE', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('COCER', 'cocer pasta', 'PREELABORACION', 1),
            sp('SALTEAR', 'saltear salsa', 'PREELABORACION', 2),
            sp('MEZCLAR', 'mezclar pasta', 'PREELABORACION', 1),
            sp('EMPLATAR', 'emplatar {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['COCER'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'HUEVOS_BENEDICT',
          nombre_plato: 'Huevos benedict',
          aliases: ['huevos benedict'],
          cocina: 'moderna',
          tipo: 'TENDENCIA',
          estilos: ['CALIENTE', 'EMPLATADO_CUIDADO'],
          subprocesos: [
            sp('COCER', 'cocer huevos', 'PREELABORACION', 2),
            sp('COCER', 'tostar pan', 'PREELABORACION', 1),
            sp('MEZCLAR', 'mezclar salsa', 'PREELABORACION', 2),
            sp('MONTAR', 'montar {plato}', 'SERVICIO', 2),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MONTAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'BOWL_SALUDABLE',
          nombre_plato: 'Bowl saludable',
          aliases: ['bowl saludable', 'ensalada bowl'],
          cocina: 'moderna',
          tipo: 'POPULAR',
          estilos: ['FRIO', 'SALUDABLE'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('COCER', 'cocer base', 'PREELABORACION', 1),
            sp('MONTAR', 'montar bowl', 'SERVICIO', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['MONTAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        },
        {
          id: 'KIMCHI_FRIED_RICE',
          nombre_plato: 'Kimchi fried rice',
          aliases: ['kimchi fried rice', 'arroz kimchi'],
          cocina: 'moderna',
          tipo: 'TENDENCIA',
          estilos: ['CALIENTE', 'FAST'],
          subprocesos: [
            sp('CORTAR', 'cortar ingredientes', 'MISE_EN_PLACE', 1),
            sp('SOFREIR', 'sofreir base', 'PREELABORACION', 1),
            sp('SALTEAR', 'saltear arroz', 'PREELABORACION', 1),
            sp('EMPLATAR', 'servir {plato}', 'SERVICIO', 1)
          ],
          procesos_obligatorios: ['SALTEAR'],
          recursos_tipicos: ['FOGONES', 'ESTACION']
        }
      ];

      function normalizeStyleFlags(flags) {
        const list = Array.isArray(flags) ? flags : [];
        const normalized = list
          .map((item) => String(item || '').toUpperCase())
          .filter((item) => STYLE_FLAGS.includes(item));
        if (!normalized.length) {
          return [...DEFAULT_STYLES];
        }
        const merged = Array.from(new Set([...DEFAULT_STYLES, ...normalized]));
        return merged;
      }

      function detectStyleFlags(dishName) {
        const token = normalizeToken(dishName);
        const styles = [];
        if (/(vegano)/.test(token)) {
          styles.push('VEGANO');
        }
        if (/(vegetar)/.test(token)) {
          styles.push('VEGETARIANO');
        }
        if (/sin gluten/.test(token)) {
          styles.push('SIN_GLUTEN');
        }
        if (/saludable|light/.test(token)) {
          styles.push('SALUDABLE');
        }
        if (/frio|helad/.test(token)) {
          styles.push('FRIO');
        }
        if (/caliente/.test(token)) {
          styles.push('CALIENTE');
        }
        if (/para compartir|racion/.test(token)) {
          styles.push('PARA_COMPARTIR');
        }
        if (/gourmet|autor/.test(token)) {
          styles.push('EMPLATADO_CUIDADO');
        }
        if (/street|take away/.test(token)) {
          styles.push('STREET');
        }
        if (/rapido|express|fast/.test(token)) {
          styles.push('FAST');
        }
        if (/slow|lento/.test(token)) {
          styles.push('SLOW');
        }
        return styles;
      }

      function mergeStyles(...styleSets) {
        const merged = new Set();
        styleSets.forEach((set) => {
          (set || []).forEach((item) => merged.add(item));
        });
        return Array.from(merged).filter((item) => STYLE_FLAGS.includes(item));
      }

      const DISH_PATTERNS = [
        {
          id: 'CROQUETAS',
          match: (name) => normalizeToken(name).includes('croqueta'),
          extraProcesses: ['COCER', 'ENFRIAR', 'FORMAR', 'FREIR'],
          questions: [
            {
              id: 'CROQ_TIPO',
              pregunta: 'Croquetas: tipo?',
              opciones: ['CASERAS', 'COMPRADAS'],
              tipo: 'CROQUETAS_TIPO'
            }
          ],
          timeMultiplier: 1.2,
          resourceHints: ['FOGONES', 'ESTACION', 'FREGADERO'],
          primaryProcess: 'FREIR'
        },
        {
          id: 'EMPANADILLAS',
          match: (name) => normalizeToken(name).includes('empanadilla'),
          extraProcesses: ['FORMAR', 'FREIR'],
          questions: [
            {
              id: 'EMP_METODO',
              pregunta: 'Empanadillas: metodo?',
              opciones: ['FOGONES', 'HORNO'],
              tipo: 'METODO'
            }
          ],
          timeMultiplier: 1.1,
          resourceHints: ['FOGONES', 'HORNO', 'ESTACION'],
          primaryProcess: 'FREIR'
        },
        {
          id: 'FLAN',
          match: (name) => normalizeToken(name).includes('flan'),
          extraProcesses: ['MEZCLAR', 'BANO_MARIA', 'ENFRIAR', 'EMPLATAR'],
          questions: [
            {
              id: 'FLAN_TIPO',
              pregunta: 'Flan: casero o comprado?',
              opciones: ['CASERO', 'COMPRADO'],
              tipo: 'FLAN_TIPO'
            }
          ],
          timeMultiplier: 1.3,
          resourceHints: ['HORNO', 'ESTACION'],
          primaryProcess: 'BANO_MARIA'
        },
        {
          id: 'TORTILLA',
          match: (name) => normalizeToken(name).includes('tortilla'),
          extraProcesses: ['CORTAR', 'SOFREIR', 'COCER'],
          timeMultiplier: 1.1,
          resourceHints: ['FOGONES', 'ESTACION'],
          primaryProcess: 'COCER'
        },
        {
          id: 'CREMA',
          match: (name) => {
            const token = normalizeToken(name);
            return token.includes('crema') || token.includes('sopa');
          },
          extraProcesses: ['CORTAR', 'COCER', 'TRITURAR'],
          timeMultiplier: 1.15,
          resourceHints: ['FOGONES', 'ESTACION'],
          primaryProcess: 'COCER'
        },
        {
          id: 'RISOTTO',
          match: (name) => normalizeToken(name).includes('risotto'),
          extraProcesses: ['SOFREIR', 'COCER'],
          timeMultiplier: 1.25,
          resourceHints: ['FOGONES'],
          primaryProcess: 'COCER'
        },
        {
          id: 'PASTA',
          match: (name) => normalizeToken(name).includes('pasta'),
          extraProcesses: ['COCER', 'MEZCLAR'],
          timeMultiplier: 1.1,
          resourceHints: ['FOGONES', 'ESTACION'],
          primaryProcess: 'COCER'
        },
        {
          id: 'AL_HORNO',
          match: (name) => /al horno|horno|asado|hornead/.test(normalizeToken(name)),
          extraProcesses: ['HORNEAR', 'REPOSAR'],
          timeMultiplier: 1.4,
          resourceHints: ['HORNO', 'ESTACION'],
          primaryProcess: 'HORNEAR'
        }
      ];
      const DISH_PROFILES = [
        {
          key: 'RAW_SALAD',
          match: (token) => /(ensalada|carpaccio|tartar|gazpacho|crudo)/.test(token),
          processes: ['LAVAR', 'CORTAR', 'MEZCLAR', 'EMPLATAR'],
          resourceHints: ['FREGADERO', 'ESTACION'],
          confidence: 0.62
        },
        {
          key: 'PASTA',
          match: (token) => /(pasta|ravioli|gnocchi|tortellini)/.test(token),
          processes: ['COCER', 'MEZCLAR', 'EMPLATAR'],
          getExtraProcesses: (token) => (/(salsa|ragu|bolo|bolog|pesto)/.test(token) ? ['SALTEAR'] : []),
          resourceHints: ['FOGONES', 'ESTACION'],
          confidence: 0.6
        },
        {
          key: 'POSTRE_HORNO',
          match: (token) => /(tarta|bizcocho|brownie)/.test(token),
          processes: ['MEZCLAR', 'HORNEAR', 'ENFRIAR', 'EMPLATAR'],
          resourceHints: ['HORNO', 'ESTACION'],
          confidence: 0.6
        },
        {
          key: 'FLAN_BANOMARIA',
          match: (token) => /flan/.test(token),
          processes: ['MEZCLAR', 'BANO_MARIA', 'ENFRIAR', 'EMPLATAR'],
          resourceHints: ['HORNO', 'ESTACION'],
          confidence: 0.6
        },
        {
          key: 'CARNE_REDUCCION',
          match: (token) => /(reduccion|reducir|vino tinto|vino_tinto)/.test(token),
          processes: ['SALTEAR', 'REDUCIR', 'EMPLATAR'],
          resourceHints: ['FOGONES', 'ESTACION'],
          confidence: 0.65
        }
      ];
      function getDishProfile(dishName) {
        const token = normalizeToken(dishName || '');
        if (!token) {
          return null;
        }
        for (const profile of DISH_PROFILES) {
          try {
            if (profile.match && profile.match(token, dishName)) {
              return profile;
            }
          } catch (error) {
            // ignore profile errors
          }
        }
        return null;
      }
      function formatSubprocessName(template, dishName) {
        return String(template || '').replace(/\{plato\}/gi, dishName).trim();
      }

      function defaultPhaseForProcess(process) {
        if (process === 'EMPLATAR' || process === 'MONTAR') {
          return 'SERVICIO';
        }
        if (process === 'REPOSAR' || process === 'ENFRIAR') {
          return 'PREELABORACION';
        }
        if (['LAVAR', 'ESCURRIR', 'CORTAR', 'MEZCLAR'].includes(process)) {
          return 'MISE_EN_PLACE';
        }
        return 'PREELABORACION';
      }

      function findPatternForDish(dishName) {
        const token = normalizeToken(dishName);
        const candidates = PATTERN_LIBRARY.filter((pattern) => {
          const names = [pattern.nombre_plato].concat(pattern.aliases || []);
          return names.some((name) => {
            const matchToken = normalizeToken(name);
            return matchToken && token.includes(matchToken);
          });
        });
        if (!candidates.length) {
          return null;
        }
        const sorted = [...candidates].sort((a, b) => {
          const typeDiff = (TYPE_PRIORITY[a.tipo] ?? 9) - (TYPE_PRIORITY[b.tipo] ?? 9);
          if (typeDiff !== 0) {
            return typeDiff;
          }
          const aLen = Math.max(a.nombre_plato.length, ...(a.aliases || []).map((item) => item.length));
          const bLen = Math.max(b.nombre_plato.length, ...(b.aliases || []).map((item) => item.length));
          return bLen - aLen;
        });
        return sorted[0];
      }

      const RESOURCE_CATALOG = [
        { id: 'HORNO', nombre: 'Horno', tipo: 'COCCION', pattern: 'horno(?:s)?', defaultCap: 1 },
        { id: 'FOGONES', nombre: 'Fogones', tipo: 'COCCION', pattern: 'fogones?|fogon(?:es)?', defaultCap: 3 },
        { id: 'ESTACION', nombre: 'Estacion', tipo: 'PREP', pattern: 'estacion(?:es)?', defaultCap: 1 },
        { id: 'FREGADERO', nombre: 'Fregadero', tipo: 'LIMPIEZA', pattern: 'fregadero(?:s)?', defaultCap: 1 },
        { id: 'LAVAVAJILLAS', nombre: 'Lavavajillas', tipo: 'LIMPIEZA', pattern: 'lavavajillas', defaultCap: 1 }
      ];

      const PHASES = ['MISE_EN_PLACE', 'PREELABORACION', 'SERVICIO'];
      const PHASE_LABELS = {
        MISE_EN_PLACE: 'Mise en place',
        PREELABORACION: 'Preelaboracion',
        SERVICIO: 'Servicio'
      };

      function phaseLabel(phaseId) {
        const key = String(phaseId || '').trim().toUpperCase();
        if (!key) {
          return 'Fase';
        }
        return PHASE_LABELS[key] || key.replace(/_/g, ' ');
      }

      const DEFAULT_PLAN = {
        id: 'plan_base',
        recipeId: null,
        name: 'Menu base',
        notes: null,
        pax: null,
        phaseActive: PHASES[0],
        phaseStatus: 'IDLE',
        startedAt: null,
        tasks: [
          {
            id: 't01',
            titleShort: 'LAVAR | Ejemplo | FREGADERO | 10m',
            titleFull: 'lavar ingredientes de ejemplo',
            dish: 'Ejemplo',
            phase: 'MISE_EN_PLACE',
            processKey: 'LAVAR',
            durationMin: 10,
            levelMin: 1,
            resourceTypeKey: 'FREGADERO',
            assignedToId: null,
            status: 'TODO',
            dependsOn: [],
            meta: { inferred: true, confidence: 0.5 }
          },
          {
            id: 't02',
            titleShort: 'CORTAR | Ejemplo | ESTACION | 12m',
            titleFull: 'cortar ingredientes de ejemplo',
            dish: 'Ejemplo',
            phase: 'MISE_EN_PLACE',
            processKey: 'CORTAR',
            durationMin: 12,
            levelMin: 1,
            resourceTypeKey: 'ESTACION',
            assignedToId: null,
            status: 'TODO',
            dependsOn: ['t01'],
            meta: { inferred: true, confidence: 0.5 }
          },
          {
            id: 't03',
            titleShort: 'SALTEAR | Ejemplo | FOGONES | 20m',
            titleFull: 'saltear ejemplo',
            dish: 'Ejemplo',
            phase: 'PREELABORACION',
            processKey: 'SALTEAR',
            durationMin: 20,
            levelMin: 2,
            resourceTypeKey: 'FOGONES',
            assignedToId: null,
            status: 'TODO',
            dependsOn: ['t02'],
            meta: { inferred: true, confidence: 0.5 }
          },
          {
            id: 't04',
            titleShort: 'EMPLATAR | Ejemplo | ESTACION | 8m',
            titleFull: 'emplatar ejemplo',
            dish: 'Ejemplo',
            phase: 'SERVICIO',
            processKey: 'EMPLATAR',
            durationMin: 8,
            levelMin: 1,
            resourceTypeKey: 'ESTACION',
            assignedToId: null,
            status: 'TODO',
            dependsOn: ['t03'],
            meta: { inferred: true, confidence: 0.5 }
          }
        ],
        team: [
          {
            id: 'Chef Tor',
            name: 'Chef Tor',
            role: 'CHEF',
            level: 3,
            speedFactor: 1
          },
          {
            id: 'Pinxe Yorge',
            name: 'Pinxe Yorge',
            role: 'PINXE',
            level: 2,
            speedFactor: 1
          },
          {
            id: 'Pinxe Mandioca',
            name: 'Pinxe Mandioca',
            role: 'PINXE',
            level: 1,
            speedFactor: 1
          }
        ],
        resources: {
          items: [
            { id: 'HORNO', typeKey: 'HORNO', name: 'Horno', capacity: 1 },
            { id: 'FOGONES', typeKey: 'FOGONES', name: 'Fogones', capacity: 3 },
            { id: 'ESTACION', typeKey: 'ESTACION', name: 'Estacion', capacity: 1 },
            { id: 'FREGADERO', typeKey: 'FREGADERO', name: 'Fregadero', capacity: 1 }
          ]
        },
        settings: {
          debugEnabled: false,
          autoFixOnReview: true,
          autoAssignOnReview: true
        }
      };
      const EMPTY_PLAN = {
        id: 'plan_vacio',
        recipeId: null,
        name: 'Plan vacio',
        notes: null,
        pax: null,
        fases: [...PHASES],
        faseActiva: PHASES[0],
        phaseActive: PHASES[0],
        phaseStatus: 'IDLE',
        tareas: [],
        equipo: [],
        recursos: [],
        preguntas_rapidas: [],
        preguntas_guiadas: [],
        advertencias_de_recursos: [],
        incertidumbres_detectadas: [],
        resumen_estilos_aplicados: [],
        isEmpty: true
      };

      const RECIPE_STORAGE_KEY = 'JCD_RECIPES_V1';
      const LEGACY_RECIPE_STORAGE_KEY = 'jcd_recipes_v1';
      const RECIPE_ACTIVE_KEY = 'jcd_active_recipe_v1';
      const LAST_PLAN_KEY = 'jcd_lastPlan_v1';
      const SETTINGS_KEY = 'jcd_settings_v1';

      const USER_SETTINGS_DEFAULT = {
        debugEnabled: false,
        autoFixOnReview: true,
        autoAssignOnReview: true
      };

      const appState = {
        menuRawText: '',
        menuRawTextSource: null,
        lastPdfError: null
      };

      /*
        Esquemas JSON finales (v1)

        recipe = {
          id: string,
          name: string,
          tags: string[],
          paxBase: number,
          phases: string[],
          tasks: Task[],
          notes?: string,
          source?: { type: "pdf"|"text"|"manual", name?: string, createdAt: string }
        }

        plan = {
          id: string,
          recipeId?: string,
          name: string,
          pax: number,
          phaseActive: string,
          phaseStatus: "IDLE"|"RUNNING"|"PAUSED"|"DONE",
          startedAt?: string,
          tasks: Task[],
          team: Person[],
          resources: { items: Resource[] },
          settings: {
            debugEnabled: boolean,
            autoFixOnReview: boolean,
            autoAssignOnReview: boolean
          }
        }

        task = {
          id: string,
          titleShort: string,
          titleFull?: string,
          dish?: string,
          phase: string,
          processKey: string,
          durationMin: number,
          levelMin: number,
          resourceTypeKey?: string,
          assignedToId?: string,
          status: "TODO"|"DOING"|"DONE",
          locked?: { assignment?: boolean, duration?: boolean, resource?: boolean },
          dependsOn?: string[],
          meta?: { inferred?: boolean, confidence?: number }
        }

        person = { id: string, name: string, role: "CHEF"|"PINXE"|"OTRO", level: number, speedFactor?: number }
        resource = { id: string, typeKey: string, name: string, capacity: number }
      */

      /*
        CHANGELOG (hardening)
        - Invariantes en debug + smoke tests controlados desde el panel Debug.
        - Validacion y deteccion de recursos usando typeKey normalizado.
        - Razones de bloqueo en botones principales via tooltip.
        - Truncado de textos largos en tabla y tickets para evitar desbordes.
      */

      let plan = null;
      let menuDraft = null;
      let equipoById = {};
      let recursoById = {};
      let tareaById = {};
      let recipes = [];
      let recipeById = {};
      let userSettings = { ...USER_SETTINGS_DEFAULT };

      const planState = {
        byPhase: {}
      };

        const state = {
          screen: 'library',
          view: 'library',
          activeRecipeId: null,
          libraryTag: 'ALL',
          planReady: false,
          approved: false,
          phaseStatus: 'idle',
          pausedFrom: null,
          prestartRemaining: PRESTART_SECONDS,
          phaseRemaining: 0,
          phaseEstimate: 0,
          alertsOpen: false,
          issuesOpen: false,
          compactMode: false,
          uiMode: 'library',
          advancedOpen: false,
          expertMode: false,
          manualTextOpen: false,
          debugEnabled: false,
          issues: [],
          diagnostics: emptyDiagnostics(),
          invariants: { errors: [], warnings: [] },
          smokeResults: []
        };

      const validationState = {
        errors: [],
        warnings: []
      };

      const filterState = {
        plato: 'ALL',
        fase: 'ALL',
        errors: true,
        noDuration: false,
        noResource: false
      };

      const questionAnswers = {};

      const pdfState = {
        name: null,
        size: 0,
        status: 'Sin archivo cargado.',
        text: ''
      };

      let pdfWorkerReady = false;

      function setState(patch) {
        if (!patch) {
          return;
        }
        Object.assign(state, patch);
      }

      function loadUserSettings() {
        let next = { ...USER_SETTINGS_DEFAULT };
        try {
          if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && typeof parsed === 'object') {
                next = { ...next, ...parsed };
              }
            }
          }
        } catch (error) {
          next = { ...USER_SETTINGS_DEFAULT };
        }
        userSettings = next;
        setState({ debugEnabled: Boolean(userSettings.debugEnabled) });
        return userSettings;
      }

      function saveUserSettings() {
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(userSettings));
          }
        } catch (error) {
          // ignore
        }
      }

      function setUIMode(mode, opts = {}) {
        if (!mode) {
          return;
        }
        const normalized = String(mode).toLowerCase();
        if (!['library', 'prep', 'kitchen'].includes(normalized)) {
          return;
        }
        state.uiMode = normalized;
        state.view = normalized;
        state.screen = normalized === 'library' ? 'library' : 'plan';
        if (normalized === 'kitchen') {
          state.advancedOpen = false;
        }
        if (normalized === 'library') {
          state.advancedOpen = false;
        }
        render();
        if (opts.scrollToUpload) {
          const uploadEl = document.getElementById('upload');
          if (uploadEl && typeof uploadEl.scrollIntoView === 'function') {
            uploadEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        if (opts.focusManual) {
          if (manualTextEl) {
            manualTextEl.focus();
          }
        }
      }

      function goToView(viewKey, opts = {}) {
        if (typeof window !== 'undefined' && typeof window.navigateTo === 'function') {
          window.navigateTo(viewKey, { replace: Boolean(opts.replace) });
          if (opts.scrollToUpload) {
            const uploadEl = document.getElementById('upload');
            if (uploadEl && typeof uploadEl.scrollIntoView === 'function') {
              uploadEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
          if (opts.focusManual && manualTextEl) {
            manualTextEl.focus();
          }
          return;
        }
        setUIMode(viewKey, opts);
      }

      const libraryScreenEl = document.getElementById('library-screen');
      const planScreenEl = document.getElementById('plan-screen');
      const recipeListEl = document.getElementById('recipe-list');
      const recipeEmptyEl = document.getElementById('recipe-empty');
      const recipeFilterEl = document.getElementById('recipe-filter');
      const newRecipeBtn = document.getElementById('new-recipe');
      const importRecipeBtn = document.getElementById('import-pdf');
      const backLibraryBtn = document.getElementById('back-library');
      const saveRecipeBtn = document.getElementById('save-recipe');
      const saveAsRecipeBtn = document.getElementById('save-as-recipe');
      const planTitleEl = document.getElementById('plan-title');
      const activePhaseEl = document.getElementById('active-phase');
      const phaseStateEl = document.getElementById('phase-state');
      const phaseTimerWrapEl = document.getElementById('phase-timer-wrap');
      const phaseTimerEl = document.getElementById('phase-timer');
      const phaseTimerNoteEl = document.getElementById('phase-timer-note');
      const planHealthEl = document.getElementById('plan-health');
      const healthDetailsBtn = document.getElementById('health-details');
      const planStatusEl = document.getElementById('plan-status');
      const autoReviewBtn = document.getElementById('auto-review');
      const startServiceBtn = document.getElementById('start-service');
      const advancedToggleBtn = document.getElementById('advanced-toggle');
      const expertToggleEl = document.getElementById('expert-toggle');
      const bulkResolveBtn = document.getElementById('bulk-resolve');
      const resolveDurationsEl = document.getElementById('resolve-durations');
      const resolveResourcesEl = document.getElementById('resolve-resources');
      const resolveBalanceEl = document.getElementById('resolve-balance');
      const rebalanceTeamBtn = document.getElementById('rebalance-team');
      const advancedPanelEl = document.getElementById('settings-panel');
      const assignmentListEl = document.getElementById('assignment-list');
      const resourceListEl = document.getElementById('resource-list');
      const lineColumnsEl = document.getElementById('line-columns');
      const lineNoteEl = document.getElementById('line-note');
      const aiSummaryEl = document.getElementById('ai-summary-content');
      const validationListEl = document.getElementById('validation-list');
      const settingsStatusEl = document.getElementById('settings-status');
      const settingsStateEl = document.getElementById('settings-state');
      const settingsCountsEl = document.getElementById('settings-counts');
      const settingsIssuesEl = document.getElementById('settings-issues');
      const settingsIssuesToggleEl = document.getElementById('settings-issues-toggle');
      const settingsFixAllBtn = document.getElementById('btn-fix-all');
      const settingsAssignResourcesBtn = document.getElementById('btn-assign-resources');
      const settingsAutoAssignBalancedBtn = document.getElementById('btn-autoassign-balanced');
      const settingsFillDurationsBtn = document.getElementById('btn-fill-durations');
      const settingsToggleIssuesBtn = document.getElementById('btn-toggle-issues');
      const settingsStartServiceBtn = document.getElementById('btn-start-service');
      const questionsListEl = document.getElementById('questions-list');
      const pdfStatusEl = document.getElementById('pdfStatus');
      const pdfErrorPanelEl = document.getElementById('pdf-error-panel');
      const pdfErrorTextEl = document.getElementById('pdf-error-text');
      const dropZoneEl = document.getElementById('pdfDropZone');
      const pdfInputEl = document.getElementById('pdfInput');
      const manualToggleBtn = document.getElementById('manual-toggle');
      const manualBoxEl = document.getElementById('manual-box');
      const manualTextEl = document.getElementById('menuTextArea');
      const parseTextBtn = document.getElementById('btnInterpret');
      const debugToggleEl = document.getElementById('debug-toggle');
        const debugPanelEl = document.getElementById('debug-panel');
        const debugTextEl = document.getElementById('debug-text');
        const smokeResultsEl = document.getElementById('smoke-results');
        const autoAssignPhaseBtn = document.getElementById('auto-assign-phase');
        const autoAssignAllBtn = document.getElementById('auto-assign-all');
        const unlockAssignmentsBtn = document.getElementById('unlock-assignments');
      const approvePlanBtn = document.getElementById('btn-approve-plan') || document.getElementById('approve-plan');
      const startPhaseBtn = document.getElementById('start-phase');
      const skipPrestartBtn = document.getElementById('skip-prestart');
      const prevPhaseBtn = document.getElementById('prev-phase');
      const nextPhaseBtn = document.getElementById('next-phase');
      const calcPlanBtn = document.getElementById('calc-plan');
      const finishScreenEl = document.getElementById('finish-screen');
      const filterPlatoEl = document.getElementById('filter-plato');
      const filterFaseEl = document.getElementById('filter-fase');
      const filterErrorsEl = document.getElementById('filter-errors');
      const filterNoDurationEl = document.getElementById('filter-no-duration');
      const filterNoResourceEl = document.getElementById('filter-no-resource');
      const incompleteCountEl = document.getElementById('incomplete-count');
      const normalizedCountEl = document.getElementById('normalized-count');
      const compactToggleEl = document.getElementById('toggle-compact');
      const prepIssuesGridEl = document.getElementById('prep-issues-grid');
      const prepIssuesSectionEl = document.getElementById('prep-issues');
      const prepResourcesEl = document.getElementById('prep-resources');
      const prepTeamEl = document.getElementById('prep-team');
      const prepReadyEl = document.getElementById('prep-ready');
      const goKitchenBtn = document.getElementById('go-kitchen');
      const fixDurationsBtn = document.getElementById('fix-durations');
      const fixResourcesBtn = document.getElementById('fix-resources');
      const autoAssignBalancedBtn = document.getElementById('auto-assign-balanced');
      const pausePhaseBtn = document.getElementById('pause-phase');
      const finalizePhaseBtn = document.getElementById('finalize-phase');
      const modeLibraryBtn = document.getElementById('mode-library');
      const modeKitchenBtn = document.getElementById('mode-kitchen');
      const modePrepBtn = document.getElementById('mode-prep');
      const resourceEditorEl = document.getElementById('resource-editor');
      const teamEditorEl = document.getElementById('team-editor');
      const addResourceBtn = document.getElementById('add-resource');
        const addPersonBtn = document.getElementById('add-person');
        const resourceSummaryEl = document.getElementById('resource-summary');
        const alertsBoxEl = document.getElementById('alerts-box');
        const alertsCountEl = document.getElementById('alerts-count');
        const alertsLinesEl = document.getElementById('alerts-lines');
        const alertsReviewBtn = document.getElementById('alerts-review');
        const alertsDismissBtn = document.getElementById('alerts-dismiss');
        const alertsPanelEl = document.getElementById('alerts-panel');
        const alertsMissingEl = document.getElementById('alerts-missing');
        const alertsFixesEl = document.getElementById('alerts-fixes');
        const alertsAddResourcesBtn = document.getElementById('alerts-add-resources');

        function deepClone(value) {
          return JSON.parse(JSON.stringify(value));
        }

        function emptyDiagnostics() {
          return {
            warnings: [],
            errors: [],
            fixes: [],
            assumptions: [],
            counts: { warnings: 0, errors: 0, fixes: 0, assumptions: 0 },
            byDishSummary: [],
            missingResources: [],
            missingDurations: 0,
            unassignedTasks: 0
          };
        }

        function stripDiacritics(value) {
          return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }

      function normalizeToken(value) {
        return stripDiacritics(value).toLowerCase();
      }

      function sanitizeInt(value, fallback = 0) {
        if (value === null || value === undefined || value === '') {
          return fallback;
        }
        if (typeof value === 'number' && Number.isFinite(value)) {
          return Math.trunc(value);
        }
        const match = String(value).trim().match(/-?\d+/);
        if (!match) {
          return fallback;
        }
        const parsed = parseInt(match[0], 10);
        return Number.isFinite(parsed) ? parsed : fallback;
      }

      function sanitizeNumber(value, fallback = 0) {
        if (value === null || value === undefined || value === '') {
          return fallback;
        }
        const numeric = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
        if (!Number.isFinite(numeric)) {
          return fallback;
        }
        return numeric;
      }

      function normalizeEvidence(value) {
        if (Array.isArray(value)) {
          return value.map((item) => String(item)).filter(Boolean);
        }
        if (!value) {
          return [];
        }
        return [String(value)];
      }

      function normalizeSource(value, fallback = 'explicit') {
        const normalized = String(value || '').toLowerCase();
        if (['explicit', 'inferred', 'default'].includes(normalized)) {
          return normalized;
        }
        return fallback;
      }

      const STATUS_MAP = {
        PENDIENTE: 'TODO',
        EN_CURSO: 'DOING',
        FINALIZADA: 'DONE'
      };

      const STATUS_MAP_REVERSE = {
        TODO: 'PENDIENTE',
        DOING: 'EN_CURSO',
        DONE: 'FINALIZADA'
      };

      function normalizeStatus(value) {
        if (!value) {
          return 'TODO';
        }
        const normalized = String(value).toUpperCase();
        if (STATUS_MAP[normalized]) {
          return STATUS_MAP[normalized];
        }
        if (STATUS_MAP_REVERSE[normalized]) {
          return normalized;
        }
        return 'TODO';
      }

      function toLegacyStatus(value) {
        if (!value) {
          return 'PENDIENTE';
        }
        const normalized = String(value).toUpperCase();
        return STATUS_MAP_REVERSE[normalized] || 'PENDIENTE';
      }

      function normalizeResourceLabel(value) {
        if (!value) {
          return '';
        }
          const id = normalizeResourceId(value);
          if (id && RESOURCE_LABELS[id]) {
            return RESOURCE_LABELS[id];
          }
          return value;
        }

        function parseMissingResourceFromMessage(message) {
          if (!message) {
            return null;
          }
          const missingMatch = message.match(/Recurso faltante[^:]*:\s*([^\.\n]+)/i);
          if (missingMatch) {
            return missingMatch[1].trim();
          }
          const suggestedMatch = message.match(/Recurso sugerido:\s*([^\.\n]+)/i);
          if (suggestedMatch) {
            return suggestedMatch[1].trim();
          }
          return null;
        }

        function resourceLabelForId(resourceId, resources) {
          if (!resourceId) {
            return 'Sin recurso';
          }
          const match = (resources || []).find((resource) => resource.id === resourceId);
          return match?.nombre || RESOURCE_LABELS[resourceId] || resourceId;
        }

        function stripInferTag(value) {
          return String(value || '')
            .replace(/\[INFERIDO\]\s*/gi, '')
            .trim();
        }

        function makeIdFromName(value, fallback) {
          const base = String(value || fallback || 'ITEM')
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
          return base || fallback || 'ITEM';
        }

        function generatePersonId(existingIds) {
          let id = null;
          if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            id = crypto.randomUUID();
          } else {
            id = makeIdFromName(`PERSONA_${Date.now()}`, 'PERSONA');
          }
          if (existingIds && existingIds.has(id)) {
            id = ensureUniqueId(makeIdFromName('PERSONA', 'PERSONA'), existingIds);
          }
          return id;
        }

      function ensureUniqueId(baseId, existingIds) {
        let candidate = baseId;
        let counter = 2;
        while (existingIds.has(candidate)) {
          candidate = `${baseId}_${counter}`;
          counter += 1;
        }
        return candidate;
      }

      function normalizeResourceId(value) {
        if (!value) {
          return null;
        }
        const normalized = stripDiacritics(String(value || '')).trim().toUpperCase();
        if (normalized === 'HORNO') {
          return RESOURCE_IDS.HORNO;
        }
        if (normalized === 'FOGON' || normalized === 'FOGONES') {
          return RESOURCE_IDS.FOGON;
        }
        if (normalized === 'ESTACION' || normalized === 'ESTACION_DE_PREPARADO') {
          return RESOURCE_IDS.ESTACION;
        }
        if (normalized === 'FREGADERO') {
          return RESOURCE_IDS.FREGADERO;
        }
        if (normalized === 'LAVAVAJILLAS') {
          return 'LAVAVAJILLAS';
        }
        return makeIdFromName(normalized, 'RECURSO');
      }

      function normalizeResourceName(value) {
        if (!value) {
          return null;
        }
        const normalized = normalizeToken(value);
        if (!normalized) {
          return null;
        }
        if (/(horno)/.test(normalized)) {
          return 'HORNO';
        }
        if (/(fogon|fogones|cocina|hornillo)/.test(normalized)) {
          return 'FOGONES';
        }
        if (/(estacion|mesa|tabla|preparad)/.test(normalized)) {
          return 'ESTACION';
        }
        if (/(fregadero|pila)/.test(normalized)) {
          return 'FREGADERO';
        }
        if (/(lavavajillas)/.test(normalized)) {
          return 'LAVAVAJILLAS';
        }
        return makeIdFromName(normalized.toUpperCase(), 'RECURSO');
      }

      function normalizePlanSettings(value) {
        const safe = value || {};
        return {
          debugEnabled: Boolean(safe.debugEnabled ?? userSettings.debugEnabled),
          autoFixOnReview: safe.autoFixOnReview !== false,
          autoAssignOnReview: safe.autoAssignOnReview !== false
        };
      }

      function deriveRecipeName(value) {
        const raw = String(value || '').trim();
        if (!raw) {
          return 'Receta importada';
        }
        return raw.replace(/\.[^.]+$/, '').trim() || 'Receta importada';
      }

      function serializePlan(planToSave) {
        if (!planToSave) {
          return null;
        }
        return deepClone(planToSave);
      }
      function sanitizePlanForStorage(planToSave) {
        if (!planToSave) {
          return null;
        }
        const clean = deepClone(planToSave);
        clean.phaseStatus = 'IDLE';
        clean.phase_status = 'IDLE';
        clean.startedAt = null;
        clean.faseActiva = null;
        clean.phaseActive = null;
        const tasks = clean.tareas || clean.tasks || [];
        tasks.forEach((task) => {
          if (!task) {
            return;
          }
          task.estado = 'PENDIENTE';
          task.status = 'PENDIENTE';
          task.startedAt = null;
          task.justCompleted = false;
          if ('completedAt' in task) {
            task.completedAt = null;
          }
          if ('finishedAt' in task) {
            task.finishedAt = null;
          }
          if ('endedAt' in task) {
            task.endedAt = null;
          }
        });
        if (clean.tareas) {
          clean.tareas = tasks;
        }
        if (clean.tasks) {
          clean.tasks = tasks;
        }
        return clean;
      }


      function normalizePerson(person, existingIds) {
        if (!person) {
          return null;
        }
        const name = String(person.nombre || person.name || 'Persona').trim() || 'Persona';
        const idBase = person.id || generatePersonId(existingIds || new Set());
        const id = ensureUniqueId(String(idBase), existingIds || new Set());
        const source = normalizeSource(person.source || person.origen || person.meta?.source, 'explicit');
        const confidence = sanitizeNumber(
          person.confidence ?? person.confianza ?? person.meta?.confidence,
          source === 'explicit' ? 0.9 : source === 'default' ? 0.5 : 0.65
        );
        const evidence = normalizeEvidence(person.evidence || person.evidencia || person.meta?.evidence || []);
        return {
          id,
          nombre: name,
          rol: person.rol || person.role || 'OTRO',
          nivel: clamp(sanitizeInt(person.nivel ?? person.level, 1), 1, 3),
          factor_velocidad: sanitizeNumber(person.factor_velocidad ?? person.speedFactor, 1),
          restricciones: person.restricciones || person.restrictions || {},
          source,
          confidence,
          evidence
        };
      }

      function inferResourceType(typeKey) {
        if (['HORNO', 'FOGONES'].includes(typeKey)) {
          return RESOURCE_TYPES.COCCION;
        }
        if (['ESTACION'].includes(typeKey)) {
          return RESOURCE_TYPES.PREP;
        }
        if (['FREGADERO', 'LAVAVAJILLAS'].includes(typeKey)) {
          return RESOURCE_TYPES.LIMPIEZA;
        }
        return RESOURCE_TYPES.OTRO;
      }

      function normalizeResource(resource, existingIds) {
        if (!resource) {
          return null;
        }
        const name = String(resource.nombre || resource.name || resource.id || 'Recurso').trim() || 'Recurso';
        const typeKey = normalizeResourceName(resource.typeKey || resource.tipo || name);
        const idBase = resource.id || normalizeResourceId(typeKey || name) || makeIdFromName(name, 'RECURSO');
        const id = ensureUniqueId(String(idBase), existingIds || new Set());
        const source = normalizeSource(resource.source || resource.origen || resource.meta?.source, 'explicit');
        const confidence = sanitizeNumber(
          resource.confidence ?? resource.confianza ?? resource.meta?.confidence,
          source === 'explicit' ? 0.9 : source === 'default' ? 0.5 : 0.65
        );
        const evidence = normalizeEvidence(resource.evidence || resource.evidencia || resource.meta?.evidence || []);
        return {
          id,
          nombre: name,
          typeKey: typeKey || normalizeResourceName(name),
          capacidad: sanitizeInt(resource.capacidad ?? resource.capacity, 0),
          tipo: resource.tipo || resource.type || inferResourceType(typeKey || normalizeResourceName(name)),
          source,
          confidence,
          evidence
        };
      }

      function normalizeTask(task, resources, existingIds) {
        if (!task) {
          return null;
        }
        const process =
          task.proceso ||
          task.processKey ||
          inferProcessFromName(task.nombre || task.titleFull || task.titleShort || '');
        const dish = task.plato || task.dish || 'Plato';
        const phase = task.fase || task.phase || PHASES[0];
        const name = task.nombre || task.titleFull || task.label_full || task.titleShort || 'tarea';
        const statusRaw = task.estado || task.status || 'PENDIENTE';
        const statusMap = {
          TODO: 'PENDIENTE',
          DOING: 'EN_CURSO',
          DONE: 'FINALIZADA'
        };
        const status = statusMap[statusRaw] || statusRaw;
        const idBase = task.id || makeIdFromName(`${dish}_${process}`, 'TASK');
        const id = ensureUniqueId(String(idBase), existingIds || new Set());
        const resourceTypeKey = normalizeResourceName(
          task.resourceTypeKey || task.recurso_id || task.resourceId || task.recurso || ''
        );
        let resourceId = task.recurso_id || task.resourceId || null;
        if (!resourceId && resourceTypeKey) {
          const match = (resources || []).find(
            (resource) =>
              normalizeResourceName(resource.typeKey || resource.nombre || resource.id) === resourceTypeKey ||
              resource.id === resourceTypeKey
          );
          resourceId = match ? match.id : null;
        }
        const origen = task.origen || (task.meta?.inferred ? 'IA' : null);
        const recurso_origen = task.recurso_origen || task.resourceOrigin || task.meta?.resourceOrigin || null;
        const recurso_confianza =
          task.recurso_confianza ?? task.resourceConfidence ?? task.meta?.resourceConfidence ?? null;
        const recurso_trazabilidad = task.recurso_trazabilidad || task.resourceTrace || task.meta?.resourceTrace || null;
        const recurso_inferido = task.recurso_inferido ?? task.resourceInferred ?? false;
        const normalizedTask = {
          id,
          nombre: name,
          plato: dish,
          fase: phase,
          proceso: process,
          duracion_min: sanitizeNumber(task.duracion_min ?? task.durationMin, 0),
          nivel_min: sanitizeInt(task.nivel_min ?? task.levelMin, 1),
          recurso_id: resourceId,
          resourceTypeKey,
          recurso_origen,
          recurso_confianza: Number.isFinite(recurso_confianza) ? recurso_confianza : null,
          recurso_trazabilidad,
          recurso_inferido: Boolean(recurso_inferido),
          asignado_a_id: task.asignado_a_id || task.assignedToId || null,
          estado: status,
          locked: task.locked || false,
          depende_de: task.depende_de || task.dependsOn || [],
          label_short: task.label_short || task.titleShort || '',
          label_full: task.label_full || task.titleFull || '',
          profileKey: task.profileKey || task.profile_key || null,
          origin: task.origin || task.origen || origen,
          confianza: task.confianza ?? task.meta?.confidence,
          origen
        };
        updateTaskLabels(normalizedTask, resources);
        return normalizedTask;
      }

      function normalizePlan(inputPlan) {
        const raw = deepClone(inputPlan ?? EMPTY_PLAN);
        const allowEmpty = Boolean(raw?.isEmpty);
        const rawResources = allowEmpty ? [] : raw.recursos || raw.resources?.items || raw.resources || [];
        const rawTeam = allowEmpty ? [] : raw.equipo || raw.team || [];
        const rawTasks = allowEmpty ? [] : raw.tareas || raw.tasks || [];

        const resourceIds = new Set();
        const resources = rawResources
          .map((resource) => normalizeResource(resource, resourceIds))
          .filter(Boolean);
        resources.forEach((resource) => resourceIds.add(resource.id));

        const personIds = new Set();
        const team = rawTeam
          .map((person) => normalizePerson(person, personIds))
          .filter(Boolean);
        team.forEach((person) => personIds.add(person.id));

        const taskIds = new Set();
        const tasks = rawTasks
          .map((task) => normalizeTask(task, resources, taskIds))
          .filter(Boolean);
        tasks.forEach((task) => taskIds.add(task.id));

        const fases = Array.isArray(raw.fases || raw.phases) && (raw.fases || raw.phases).length
          ? [...(raw.fases || raw.phases)]
          : [...PHASES];
        const faseActiva = raw.faseActiva || raw.phaseActive || fases[0];

        const defaultTeam = allowEmpty ? [] : DEFAULT_PLAN.equipo || DEFAULT_PLAN.team || [];
        const defaultResources = allowEmpty
          ? []
          : DEFAULT_PLAN.recursos || DEFAULT_PLAN.resources?.items || DEFAULT_PLAN.resources || [];
        const planNormalized = {
          ...raw,
          id: raw.id || makeIdFromName(raw.name || raw.meta?.titulo || 'PLAN', 'PLAN'),
          name: raw.name || raw.meta?.titulo || 'Plan',
          notas: raw.notas || raw.meta?.notas || null,
          pax: raw.pax ?? raw.meta?.comensales ?? null,
          fases,
          faseActiva,
          phaseActive: faseActiva,
          phaseStatus: raw.phaseStatus || raw.phase_status || 'IDLE',
          tareas: allowEmpty ? [] : tasks,
          equipo: allowEmpty ? [] : team.length ? team : deepClone(defaultTeam),
          recursos: allowEmpty ? [] : resources.length ? resources : deepClone(defaultResources),
          preguntas_rapidas: allowEmpty ? [] : raw.preguntas_rapidas || [],
          preguntas_guiadas: allowEmpty ? [] : raw.preguntas_guiadas || [],
          advertencias_de_recursos: allowEmpty ? [] : raw.advertencias_de_recursos || [],
          incertidumbres_detectadas: allowEmpty ? [] : raw.incertidumbres_detectadas || [],
          resumen_estilos_aplicados: allowEmpty ? [] : raw.resumen_estilos_aplicados || [],
          isEmpty: allowEmpty,
          settings: normalizePlanSettings(raw.settings || {})
        };

        planNormalized.tasks = planNormalized.tareas;
        planNormalized.team = planNormalized.equipo;
        planNormalized.resources = { items: planNormalized.recursos };
        planNormalized.phases = planNormalized.fases;
        planNormalized.phaseActive = planNormalized.faseActiva;
        return planNormalized;
      }

      function getEffectiveResourcesCatalog(inputResources) {
        const source = Array.isArray(inputResources)
          ? inputResources
          : plan?.recursos || plan?.resources?.items || plan?.resources || [];
        const ids = new Set();
        const list = [];
        (source || []).forEach((resource) => {
          const normalized = normalizeResource(resource, ids);
          if (!normalized) {
            return;
          }
          ids.add(normalized.id);
          list.push({
            ...normalized,
            capacidad: Math.max(0, sanitizeInt(normalized.capacidad, 0)),
            typeKey: normalizeResourceName(normalized.typeKey || normalized.nombre || normalized.id || '')
          });
        });

        const byId = {};
        const byTypeKey = {};
        list.forEach((resource) => {
          byId[resource.id] = resource;
          const typeKey = normalizeResourceName(resource.typeKey || resource.nombre || resource.id || '');
          if (!byTypeKey[typeKey]) {
            byTypeKey[typeKey] = [];
          }
          byTypeKey[typeKey].push(resource);
        });
        return { list, byId, byTypeKey };
      }

      function getEffectiveResources() {
        return getEffectiveResourcesCatalog();
      }

      function syncMaps() {
        equipoById = {};
        recursoById = {};
        tareaById = {};
        (plan?.equipo || []).forEach((person) => {
          equipoById[person.id] = person;
        });
        (plan?.recursos || []).forEach((resource) => {
          recursoById[resource.id] = resource;
        });
        (plan?.tareas || []).forEach((task) => {
          tareaById[task.id] = task;
        });
      }

      function setTaskResource(task, resourceId) {
        if (!task) {
          return;
        }
        let resolved = resourceId || null;
        const catalog = getEffectiveResourcesCatalog();
        let resource = resolved
          ? (plan?.recursos || []).find((item) => item.id === resolved)
          : null;
        if (!resource && resolved) {
          const typeKey = normalizeResourceName(resolved);
          const candidates = (catalog.byTypeKey && catalog.byTypeKey[typeKey]) || [];
          if (candidates.length) {
            resource =
              candidates.find((item) => sanitizeInt(item.capacidad, 0) > 0) ||
              candidates[0];
            resolved = resource ? resource.id : resolved;
          }
        }
        task.recurso_id = resolved || null;
        if (resolved) {
          task.resourceTypeKey = normalizeResourceName(
            resource?.typeKey || resource?.id || resource?.nombre || resolved
          );
        } else {
          task.resourceTypeKey = '';
        }
      }

      function resetPhaseTimer() {
        const activePhase = getActivePhaseId();
        const total = (plan?.tareas || [])
          .filter((task) => task.fase === activePhase)
          .reduce((acc, task) => acc + Math.max(0, Number(task.duracion_min) || 0), 0);
        state.phaseEstimate = total;
        state.phaseRemaining = Math.round(total * 60);
        state.prestartRemaining = PRESTART_SECONDS;
      }

      function getActivePhaseId() {
        if (!plan) {
          return PHASES[0];
        }
        return plan.faseActiva || plan.phaseActive || (plan.fases || PHASES)[0];
      }

      function setPlan(nextPlan, draft = null, summary = '', questions = []) {
        const planInput = nextPlan ?? EMPTY_PLAN;
        plan = normalizePlan(planInput);
        if (draft !== undefined) {
          menuDraft = draft;
        }
        if (!menuDraft && plan?.tareas?.length) {
          const platos = Array.from(new Set(plan.tareas.map((task) => task.plato).filter(Boolean)));
          menuDraft = {
            platos,
            lineCount: platos.length,
            recursos: plan.recursos || [],
            equipo: plan.equipo || [],
            comensales: plan.pax || null,
            lines: []
          };
        }
        if (summary) {
          state.lastPlanMessage = summary;
          setText(planStatusEl, summary);
        }
        if (Array.isArray(questions) && questions.length) {
          plan.preguntas_rapidas = questions;
        }
        state.approved = false;
        state.planReady = false;
        state.phaseStatus = 'idle';
        state.pausedFrom = null;
        resetPhaseTimer();
        syncMaps();
        validateAndStore();
        calculatePlan({ silent: true });
        render();
      }

      function createRecipeFromPlan(planInput, overrides = {}) {
        const normalized = normalizePlan(planInput);
        const baseName = overrides.name || normalized.name || 'Receta';
        const existingIds = new Set(recipes.map((recipe) => recipe.id));
        const id = ensureUniqueId(makeIdFromName(baseName, 'RECIPE'), existingIds);
        return {
          id,
          name: baseName,
          tags: overrides.tags || [],
          paxBase: overrides.paxBase ?? normalized.pax ?? null,
          phases: normalized.fases || [...PHASES],
          tareas: deepClone(normalized.tareas || []),
          notes: normalized.notas || null,
          source: overrides.source || normalized.source || null,
          menuText: overrides.menuText ?? appState.menuRawText ?? '',
          createdAt: overrides.createdAt || new Date().toISOString()
        };
      }

      function addRecipe(recipe) {
        if (!recipe) {
          return null;
        }
        const existingIds = new Set(recipes.map((item) => item.id));
        const id = ensureUniqueId(recipe.id || makeIdFromName(recipe.name || 'RECIPE', 'RECIPE'), existingIds);
        const safe = { ...recipe, id };
        recipes.push(safe);
        recipeById[safe.id] = safe;
        saveRecipesToStorage();
        return safe;
      }

      function saveRecipesToStorage() {
        try {
          localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
          localStorage.setItem(LEGACY_RECIPE_STORAGE_KEY, JSON.stringify(recipes));
        } catch (error) {
          // ignore
        }
      }

      function loadRecipesFromStorage() {
        try {
          const raw = localStorage.getItem(RECIPE_STORAGE_KEY) || localStorage.getItem(LEGACY_RECIPE_STORAGE_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          recipes = Array.isArray(parsed) ? parsed : [];
          if (raw && !localStorage.getItem(RECIPE_STORAGE_KEY)) {
            localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
          }
        } catch (error) {
          recipes = [];
        }
        recipeById = {};
        recipes.forEach((recipe) => {
          if (recipe?.id) {
            recipeById[recipe.id] = recipe;
          }
        });
      }

      function saveLastPlan() {
        try {
          if (plan?.isEmpty) {
            return;
          }
          const cleanPlan = sanitizePlanForStorage(plan);
          if (!cleanPlan) {
            return;
          }
          localStorage.setItem(LAST_PLAN_KEY, JSON.stringify(serializePlan(cleanPlan)));
        } catch (error) {
          // ignore
        }
      }

      function loadLastPlan() {
        try {
          const raw = localStorage.getItem(LAST_PLAN_KEY);
          if (!raw) {
            return null;
          }
          return JSON.parse(raw);
        } catch (error) {
          return null;
        }
      }

      function savePlanAsNewRecipe() {
        if (!plan) {
          return null;
        }
        const recipe = addRecipe(createRecipeFromPlan(plan, { name: deriveRecipeName(plan.name) }));
        return recipe;
      }

      function saveActiveRecipeFromPlan() {
        if (!plan || !state.activeRecipeId) {
          return null;
        }
        const recipe = recipeById[state.activeRecipeId];
        if (!recipe) {
          return null;
        }
        recipe.name = plan.name || recipe.name;
        recipe.paxBase = plan.pax ?? recipe.paxBase ?? null;
        recipe.phases = plan.fases || recipe.phases;
        recipe.tareas = deepClone(plan.tareas || []);
        recipe.notes = plan.notas || recipe.notes || null;
        recipe.menuText = appState.menuRawText ?? recipe.menuText ?? '';
        saveRecipesToStorage();
        return recipe;
      }

      function upsertImportedRecipe(planInput, { name, menuText } = {}) {
        if (!planInput) {
          return null;
        }
        const activeId = localStorage.getItem(RECIPE_ACTIVE_KEY) || state.activeRecipeId;
        const activeRecipe = activeId ? recipeById[activeId] : null;
        const isImportedRecipe = (recipe) => {
          if (!recipe) {
            return false;
          }
          const sourceType = recipe.source && recipe.source.type ? String(recipe.source.type).toLowerCase() : '';
        
          if (sourceType === 'imported') {
            return true;
          }
          const normalizedName = normalizeToken(recipe.name || '');
          return /(?:menu|receta)\s*importad/.test(normalizedName);
        };
        const baseName = deriveRecipeName(name || planInput?.name || planInput?.meta?.titulo || '');
        const now = new Date().toISOString();
        if (activeRecipe && isImportedRecipe(activeRecipe)) {
          const normalized = normalizePlan(planInput);
          activeRecipe.name = baseName || activeRecipe.name;
          activeRecipe.paxBase = normalized.pax ?? activeRecipe.paxBase ?? null;
          activeRecipe.phases = normalized.fases || activeRecipe.phases || [...PHASES];
          activeRecipe.tareas = deepClone(normalized.tareas || []);
          activeRecipe.notes = normalized.notas || activeRecipe.notes || null;
          activeRecipe.menuText = menuText ?? activeRecipe.menuText ?? '';
          const source = activeRecipe.source && typeof activeRecipe.source === 'object' ? { ...activeRecipe.source } : {};
          source.type = source.type || 'imported';
          source.updatedAt = now;
          if (!source.createdAt) {
            source.createdAt = now;
          }
          activeRecipe.source = source;
          saveRecipesToStorage();
          state.activeRecipeId = activeRecipe.id;
          localStorage.setItem(RECIPE_ACTIVE_KEY, activeRecipe.id);
          return activeRecipe;
        }
        const recipe = addRecipe(
          createRecipeFromPlan(planInput, {
            name: baseName,
            source: { type: 'imported', createdAt: now },
            menuText
          })
        );
        if (recipe && recipe.id) {
          state.activeRecipeId = recipe.id;
          localStorage.setItem(RECIPE_ACTIVE_KEY, recipe.id);
        }
        return recipe;
      }

      function instantiatePlanFromRecipe(recipe) {
        const planDraft = {
          id: makeIdFromName(recipe.name || 'PLAN', 'PLAN'),
          recipeId: recipe.id,
          name: recipe.name || 'Plan',
          notas: recipe.notes || null,
          pax: recipe.paxBase ?? null,
          fases: recipe.phases || [...PHASES],
          faseActiva: (recipe.phases && recipe.phases[0]) || PHASES[0],
          tareas: deepClone(recipe.tareas || []),
          equipo: deepClone(plan?.equipo || DEFAULT_PLAN.equipo || DEFAULT_PLAN.team || []),
          recursos: deepClone(
            plan?.recursos || DEFAULT_PLAN.recursos || DEFAULT_PLAN.resources?.items || DEFAULT_PLAN.resources || []
          )
        };
        return normalizePlan(planDraft);
      }

      function setActiveRecipe(recipeId, options = {}) {
        const recipe = recipeById[recipeId];
        if (!recipe) {
          return null;
        }
        const nextPlan = instantiatePlanFromRecipe(recipe);
        setPlan(nextPlan, null, 'Receta cargada', []);
        state.activeRecipeId = recipe.id;
        localStorage.setItem(RECIPE_ACTIVE_KEY, recipe.id);
        if (manualTextEl && recipe.menuText) {
          manualTextEl.value = recipe.menuText;
          appState.menuRawText = recipe.menuText;
          pdfState.text = recipe.menuText;
          setState({ manualTextOpen: true });
          updatePdfStatus();
        }
        if (options.mode) {
          setUIMode(options.mode);
        }
        if (options.openSettings) {
          state.advancedOpen = true;
        }
        render();
        return recipe;
      }

      function duplicateRecipe(recipeId) {
        const recipe = recipeById[recipeId];
        if (!recipe) {
          return null;
        }
        const copy = deepClone(recipe);
        copy.id = makeIdFromName(`${copy.name || 'RECETA'}_COPIA`, 'RECIPE');
        copy.name = `${copy.name || 'Receta'} (copia)`;
        return addRecipe(copy);
      }

      function removeRecipe(recipeId) {
        if (!recipeById[recipeId]) {
          return;
        }
        const wasActive = state.activeRecipeId === recipeId;
        recipes = recipes.filter((recipe) => recipe.id !== recipeId);
        delete recipeById[recipeId];
        if (wasActive) {
          state.activeRecipeId = null;
          localStorage.removeItem(RECIPE_ACTIVE_KEY);
          if (recipes.length) {
            const fallback = recipes[0];
            if (fallback && fallback.id) {
              setActiveRecipe(fallback.id, { mode: 'prep', openSettings: false });
            }
          } else {
            setPlan(EMPTY_PLAN, null, 'Plan vacio', []);
          }
        }
        saveRecipesToStorage();
        render();
      }
      function selfCheck() {
        const summary = {
          view: state.uiMode,
          tasks: plan?.tareas?.length || 0,
          resources: plan?.recursos?.length || 0,
          team: plan?.equipo?.length || 0,
          hasSummary: Boolean(menuDraft),
          lastSummary: state.lastPlanMessage || ''
        };
        if (state.debugEnabled) {
          console.debug('[selfCheck]', summary);
        }
        return summary;
      }

      function normalizeText(text) {
        const enDash = String.fromCharCode(8211);
        const emDash = String.fromCharCode(8212);
        const bullet = String.fromCharCode(8226);
        let normalized = String(text || '');
        normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        normalized = normalized.replace(/\t/g, ' ');
        normalized = normalized.split(enDash).join('-').split(emDash).join('-');
        normalized = normalized.split(bullet).join('-');
        return normalized.trim();
      }

      function normalizeTextLite(text) {
        return String(text || '')
          .normalize('NFC')
          .replace(/\u00A0/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function countNewlines(value) {
        return (String(value || '').match(/\n/g) || []).length;
      }

      function isLikelyFlattenedPdf(text) {
        const normalized = normalizeText(text);
        const lines = normalized.split('\n');
        const lineCount = lines.length;
        if (lineCount <= 2 && normalized.length > 200) {
          return true;
        }
        const avgLen = normalized.length / Math.max(1, lineCount);
        if (avgLen > 120) {
          return true;
        }
        if (lineCount < 5 && /\b\d{1,2}\.\s+[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1]/.test(normalized)) {
          return true;
        }
        if (!normalized.includes('\n') && /procesos?\s*:/i.test(normalized)) {
          return true;
        }
        return false;
      }

      function hasWhitelistedProcessVerb(text) {
        const normalized = normalizeToken(normalizeTextLite(text || ''));
        return PROCESS_VERB_REGEX.test(normalized);
      }

      function computeMaxPlatos(lineCount, baseLineCount) {
        const base = Math.max(lineCount || 0, baseLineCount || 0, 1);
        const scaled = Math.round(base * 0.6);
        return clamp(scaled, DISH_MAX_PLATOS_MIN, DISH_MAX_PLATOS_MAX);
      }

      function normalizeDishKey(name) {
        const cleaned = sanitizeDishName(stripTimeFromLine(String(name || '')));
        const normalized = normalizeToken(cleaned)
          .replace(/[^a-z0-9\s]/g, ' ')
          .replace(/\b(de|del|la|el|al|con|y|a)\b/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!normalized) {
          return '';
        }
        return normalized
          .split(' ')
          .filter((token) => token && !STOPWORDS_PLATO.has(token) && !DISH_META_WORDS.has(token))
          .join(' ')
          .trim();
      }

      function computeDishSimilarity(keyA, keyB) {
        if (!keyA || !keyB) {
          return 0;
        }
        if (keyA === keyB) {
          return 1;
        }
        if (keyA.includes(keyB) || keyB.includes(keyA)) {
          return 0.9;
        }
        const tokensA = new Set(keyA.split(' ').filter(Boolean));
        const tokensB = new Set(keyB.split(' ').filter(Boolean));
        if (!tokensA.size || !tokensB.size) {
          return 0;
        }
        let intersection = 0;
        tokensA.forEach((token) => {
          if (tokensB.has(token)) {
            intersection += 1;
          }
        });
        const union = tokensA.size + tokensB.size - intersection;
        return union ? intersection / union : 0;
      }

      function mergeDishData(target, incoming) {
        if (!target) {
          return incoming;
        }
        if (!incoming) {
          return target;
        }
        const merged = { ...target };
        const incomingName = incoming.nombre || '';
        if (incomingName && incomingName.length > (merged.nombre || '').length) {
          merged.nombre = incomingName;
        }
        merged.id = makeIdFromName(merged.nombre || incomingName || 'PLATO', 'PLATO');
        merged.tiempo = merged.tiempo || incoming.tiempo || null;
        merged.origen =
          merged.origen && merged.origen !== 'IA' ? merged.origen : incoming.origen || merged.origen || 'IA';
        merged.categoria = merged.categoria || incoming.categoria || null;
        merged.procesos = normalizeProcessList(
          (Array.isArray(merged.procesos) ? merged.procesos : []).concat(incoming.procesos || [])
        );
        merged.recursos_hint = Array.from(
          new Set(
            (Array.isArray(merged.recursos_hint) ? merged.recursos_hint : []).concat(incoming.recursos_hint || [])
          )
        ).filter(Boolean);
        merged.ingredientes = Array.from(
          new Set(
            (Array.isArray(merged.ingredientes) ? merged.ingredientes : []).concat(incoming.ingredientes || [])
          )
        ).filter(Boolean);
        merged.pax = merged.pax || incoming.pax || null;
        merged.confianza = Math.max(merged.confianza || 0, incoming.confianza || 0);
        merged.dishKey = normalizeDishKey(merged.nombre);
        return merged;
      }

      function mergeDishCandidate(dishes, candidate, threshold = DISH_SIMILARITY_THRESHOLD) {
        if (!candidate || !Array.isArray(dishes)) {
          return null;
        }
        const candidateKey = normalizeDishKey(candidate.nombre);
        candidate.dishKey = candidateKey;
        if (!candidateKey) {
          return null;
        }
        for (let i = 0; i < dishes.length; i += 1) {
          const existing = dishes[i];
          const existingKey = existing.dishKey || normalizeDishKey(existing.nombre);
          existing.dishKey = existingKey;
          const similarity = computeDishSimilarity(candidateKey, existingKey);
          if (similarity >= threshold) {
            dishes[i] = mergeDishData(existing, candidate);
            return dishes[i];
          }
        }
        return null;
      }

      function dedupeDishes(dishes, options = {}) {
        const threshold = Number.isFinite(options.threshold) ? options.threshold : DISH_SIMILARITY_THRESHOLD;
        if (!Array.isArray(dishes) || !dishes.length) {
          return [];
        }
        const merged = [];
        dishes.forEach((dish) => {
          if (!dish || !dish.nombre) {
            return;
          }
          const candidate = { ...dish };
          const mergedDish = mergeDishCandidate(merged, candidate, threshold);
          if (!mergedDish) {
            candidate.dishKey = candidate.dishKey || normalizeDishKey(candidate.nombre);
            merged.push(candidate);
          }
        });
        return merged;
      }

      function scoreDishCandidate(line, context = {}) {
        const raw = String(line || '').trim();
        if (!raw) {
          return 0;
        }
        const normalized = normalizeToken(raw);
        const dishName =
          context.dishName ||
          sanitizeDishName(stripTimeFromLine(context.cleanedLine || raw));
        const key = normalizeDishKey(dishName);
        let score = 0.2;
        if (context.isNumbered || context.isBullet) {
          score += 0.35;
        }
        if (context.isCaps) {
          score += 0.15;
        }
        if (context.hasTime) {
          score += 0.1;
        }
        if (context.isExplicitBlock) {
          score += 0.2;
        }
        if (context.currentDish && !context.isNumbered && !context.isBullet && !context.isCaps) {
          score -= 0.1;
        }
        if (raw.length > 80) {
          score -= 0.15;
        }
        if (dishName.length <= 3) {
          score -= 0.4;
        }
        if (!key) {
          score -= 0.3;
        }
        if (lineLooksLikeResource(raw) || lineLooksLikeTeam(raw)) {
          score -= 0.8;
        }
        if (isMetadataLine(raw)) {
          score -= 0.5;
        }
        for (const word of DISH_META_WORDS) {
          if (new RegExp(`\\b${word}\\b`).test(normalized)) {
            score -= 0.6;
            break;
          }
        }
        if (isIngredientDishName(dishName)) {
          score -= 0.6;
        }
        return clamp(score, 0, 1);
      }

            function getEl(id) {
        if (!id || typeof document === 'undefined') {
          return null;
        }
        return document.getElementById(id);
      }

      function setText(target, value) {
        const el = typeof target === 'string' ? getEl(target) : target;
        if (el) {
          el.textContent = value;
        }
      }
function normalizeLine(line) {
        return line.replace(/^[\-\*\d\.\)\u2022]+\s*/, '').replace(/\s+/g, ' ').trim();
      }

      function lineLooksLikeResource(line) {
        const raw = String(line || '');
        const normalized = normalizeToken(raw);
        if (raw.includes('-?')) {
          return true;
        }
        if (/\b(recursos|capacidad|uso)\b/.test(normalized)) {
          return true;
        }
        if (/^(horno|fogon|fogones|estacion|fregadero|lavavajillas)$/.test(normalized)) {
          return true;
        }
        if (/\d/.test(normalized) && /(horno|fogon|fogones|estacion|fregadero|lavavajillas)/.test(normalized)) {
          return true;
        }
        if (/:/.test(raw) && /(horno|fogon|fogones|estacion|fregadero|lavavajillas)/.test(normalized)) {
          return true;
        }
        return false;
      }

      function lineLooksLikeTeam(line) {
        const normalized = normalizeToken(line);
        if (!normalized) {
          return false;
        }
        if (lineLooksLikeResource(line)) {
          return false;
        }
        return /(equipo|chef|pinxe|pinche|ayudante|auxiliar|cocinero)/.test(normalized);
      }

      function isInvalidPersonName(name) {
        const raw = String(name || '').trim();
        if (!raw) {
          return true;
        }
        if (/^\d+$/.test(raw)) {
          return true;
        }
        const normalized = normalizeToken(raw);
        if (TEAM_EXCLUDE_WORDS.some((word) => normalized.includes(word))) {
          return true;
        }
        if (/\d/.test(normalized) && /(horno|fogon|fogones|estacion|fregadero|lavavajillas)/.test(normalized)) {
          return true;
        }
        return false;
      }

      function extractTimeRange(line) {
        const match = line.match(/(\d{1,3})\s*(?:-|a)?\s*(\d{0,3})?\s*(?:min|m)\b/i);
        if (!match) {
          return null;
        }
        const min = parseInt(match[1], 10);
        const max = match[2] ? parseInt(match[2], 10) : min;
        return { min, max };
      }

      function stripTimeFromLine(line) {
        return line.replace(/\(?\d{1,3}\s*(?:-|a)?\s*\d{0,3}\s*(?:min|m)\)?/gi, '').trim();
      }

      function detectComensales(text) {
        const match = String(text || '').match(/(\d+)\s*(comensales|personas)/i);
        if (!match) {
          return null;
        }
        return sanitizeInt(match[1], null);
      }

      function detectDate(text) {
        const match = String(text || '').match(/(\d{1,2}[\/-]\d{1,2}(?:[\/-]\d{2,4})?)/);
        if (!match) {
          return null;
        }
        return match[1];
      }

      function extractCapacity(text, keyword) {
        const direct = text.match(new RegExp(`${keyword}\\s*[:=]\\s*(\\d+)`, 'i'));
        if (direct) {
          return sanitizeInt(direct[1], null);
        }
        const inverted = text.match(new RegExp(`(\\d+)\\s*${keyword}`, 'i'));
        if (inverted) {
          return sanitizeInt(inverted[1], null);
        }
        return null;
      }

      function isMetadataLine(line) {
        const normalized = normalizeToken(line);
        const hasBanned = BANNED_WORDS.some((word) => new RegExp(`\\b${word}\\b`).test(normalized));
        if (!hasBanned) {
          return false;
        }
        // Allow list-like lines that may include dishes even if they contain metadata words.
        if (/[,;:\-\u2022\u00b7]/.test(line) || /\b\d{1,2}[\.\-)]\s+/.test(line)) {
          return false;
        }
        return true;
      }

      function sanitizeDishName(name) {
        let cleaned = name;
        BANNED_WORDS.forEach((word) => {
          cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'ig'), '');
        });
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        return cleaned;
      }

      function isIngredientDishName(name) {
        const cleaned = normalizeToken(name || '')
          .replace(/\d+/g, '')
          .replace(/\b(g|kg|ml|l|cl|cucharadas?|cucharaditas?|tazas?|uds?)\b/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (!cleaned) {
          return false;
        }
        const words = cleaned.split(' ');
        if (words.length > 2) {
          return false;
        }
        return words.every((word) => INGREDIENT_WORDS.includes(word));
      }

      function escapeAttribute(value) {
        return String(value || '')
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      function stripTaskNoise(text) {
        return String(text || '')
          .replace(/\[[^\]]*infer[^\]]*\]/gi, '')
          .replace(/\s*procesos?:.*$/i, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function shortenText(text, maxLen) {
        const value = String(text || '').trim();
        if (!maxLen || value.length <= maxLen) {
          return value;
        }
        return `${value.slice(0, Math.max(0, maxLen - 3)).trim()}...`;
      }

      function shortProcessLabel(process) {
        const map = {
          LAVAR: 'LAVAR',
          ESCURRIR: 'ESCURRIR',
          CORTAR: 'CORTAR',
          MEZCLAR: 'MEZCLAR',
          MONTAR: 'MONTAR',
          FORMAR: 'FORMAR',
          FREIR: 'FREIR',
          SALTEAR: 'SALTEAR',
          SOFREIR: 'SOFREIR',
          COCER: 'COCER',
          HORNEAR: 'HORNEAR',
          GRATINAR: 'GRATINAR',
          BANO_MARIA: 'BANO MARIA',
          EMPLATAR: 'EMPLATAR',
          LIMPIAR: 'LIMPIAR',
          REPOSAR: 'REPOSAR',
          ENFRIAR: 'ENFRIAR',
          TRITURAR: 'TRITURAR',
          OTRO: 'AJUSTAR'
        };
        return map[process] || 'TAREA';
      }

      function shortDishLabel(plato) {
        return shortenText(stripTaskNoise(plato), 26) || 'Plato';
      }

      function formatClock(totalSeconds) {
        const total = Math.max(0, Number(totalSeconds) || 0);
        const minutes = Math.floor(total / 60);
        const seconds = Math.floor(total % 60);
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
      }

      function mapTechniqueToProcess(value) {
        const cleaned = stripDiacritics(normalizeTextLite(String(value || '')))
          .toUpperCase()
          .replace(/[^A-Z0-9\s_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!cleaned) {
          return null;
        }
        const direct = cleaned.replace(/\s+/g, '_');
        if (TECHNIQUE_MAP[direct]) {
          return TECHNIQUE_MAP[direct];
        }
        for (const key of Object.keys(TECHNIQUE_MAP)) {
          if (direct.includes(key)) {
            return TECHNIQUE_MAP[key];
          }
        }
        return null;
      }
      function normalizeProcessKey(value) {
        const raw = String(value || '').trim();
        if (!raw) {
          return 'OTRO';
        }
        const cleaned = stripDiacritics(normalizeTextLite(raw))
          .toUpperCase()
          .replace(/[^A-Z0-9\s_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const direct = cleaned.replace(/\s+/g, '_');
        if (PROCESS_TYPES.includes(direct)) {
          return direct;
        }
        const mapped = mapTechniqueToProcess(cleaned);
        if (mapped) {
          return mapped;
        }
        if (cleaned.includes('BA�O') || cleaned.includes('BANO')) {
          return 'BANO_MARIA';
        }
        const inferred = inferProcessFromName(raw);
        if (PROCESS_TYPES.includes(inferred)) {
          return inferred;
        }
        return 'OTRO';
      }

      function getExpectedResourceForProcess(processNameOrKey, resources) {
        const processKey = normalizeProcessKey(processNameOrKey);
        const prefs = PROCESS_RESOURCE_PREF[processKey] || [];
        let typeKey = prefs.find((item) => item) || null;
        const verbSpec = VERB_MAP[processKey];
        if (!typeKey && verbSpec && verbSpec.resourceKey) {
          typeKey = verbSpec.resourceKey;
        }
        if (typeKey) {
          typeKey = normalizeResourceName(typeKey);
          if (!ALLOWED_RESOURCE_TYPES.has(typeKey)) {
            typeKey = null;
          }
        }
        if (!typeKey) {
          const normalized = normalizeToken(processKey);
          if (/lavar|escurrir|limpiar/.test(normalized)) {
            typeKey = 'FREGADERO';
          } else if (/cortar|picar|pelar/.test(normalized)) {
            typeKey = 'ESTACION';
          } else if (/mezclar|montar|emplatar/.test(normalized)) {
            typeKey = 'ESTACION';
          } else if (/cocer|saltear|freir|sofreir|reducir|hervir|guisar|cocinar/.test(normalized)) {
            typeKey = 'FOGONES';
          } else if (/hornear|asar|gratin/.test(normalized)) {
            typeKey = 'HORNO';
          }
        }
        if (typeKey && !ALLOWED_RESOURCE_TYPES.has(typeKey)) {
          typeKey = null;
        }
        if (!typeKey) {
          return { needs: false, typeKey: null, resourceId: null, missing: false, processKey };
        }
        const catalog = getEffectiveResourcesCatalog(resources);
        const candidates = catalog.byTypeKey[typeKey] || [];
        const available =
          candidates.find((resource) => sanitizeInt(resource.capacidad, 0) > 0) || candidates[0] || null;
        const resourceId = available ? available.id : null;
        return { needs: true, typeKey, resourceId, missing: !resourceId, processKey };
      }

      function pushUnique(list, value) {
        if (!Array.isArray(list) || !value) {
          return;
        }
        if (!list.includes(value)) {
          list.push(value);
        }
      }

      function resourceForProcess(processKey, resources, resourceWarnings, guidedQuestions, taskId, dishName, dishResourceHints) {
        const expected = getExpectedResourceForProcess(processKey, resources);
        const catalog = getEffectiveResourcesCatalog(resources);
        const hintTypes = Array.isArray(dishResourceHints)
          ? dishResourceHints.map((hint) => normalizeResourceName(hint)).filter(Boolean)
          : [];
        let hintResourceId = null;
        let hintType = null;
        if (expected.needs && hintTypes.length) {
          const matchType = hintTypes.find(
            (key) => (!expected.typeKey || key === expected.typeKey) && catalog.byTypeKey[key]?.length
          );
          if (matchType) {
            hintType = matchType;
            hintResourceId = catalog.byTypeKey[matchType][0].id;
          }
        }
        if (!expected.needs) {
          const pref = PROCESS_RESOURCE_PREF[expected.processKey];
          if (Array.isArray(pref) && pref.length && pref.every((item) => !item)) {
            return { resourceId: null, origin: null, confidence: null, trace: 'no-resource', inferred: false };
          }
          return { resourceId: null, origin: null, confidence: null, trace: 'no-resource', inferred: false };
        }
        if (hintResourceId) {
          return {
            resourceId: hintResourceId,
            origin: 'HINT',
            confidence: 0.85,
            trace: `hint:${hintType || 'resource'}`,
            inferred: false
          };
        }
        if (expected.resourceId) {
          const label = resourceLabelForId(expected.resourceId, resources);
          const suffix = dishName ? ` (${dishName})` : '';
          pushUnique(resourceWarnings, `Recurso inferido: ${processKey} -> ${label}${suffix}.`);
          return {
            resourceId: expected.resourceId,
            origin: 'PROCESS',
            confidence: 0.65,
            trace: `process:${expected.processKey}`,
            inferred: true
          };
        }
        if (expected.typeKey && Array.isArray(resourceWarnings)) {
          pushUnique(resourceWarnings, `Recurso inferido pendiente: ${expected.typeKey}`);
        }
        if (expected.typeKey && Array.isArray(guidedQuestions)) {
          guidedQuestions.push({
            id: `ADD_RESOURCE_${expected.typeKey}_${taskId || 'TASK'}`,
            pregunta: `Falta recurso ${expected.typeKey}. Anadirlo?`,
            opciones: ['SI', 'NO'],
            afecta_a: taskId ? [taskId] : [],
            tipo: 'ADD_RESOURCE',
            recurso_tipo: expected.typeKey,
            recurso_nombre: RESOURCE_LABELS[expected.typeKey] || expected.typeKey
          });
        }
        return {
          resourceId: null,
          origin: 'PROCESS',
          confidence: 0.4,
          trace: expected.typeKey ? `process-missing:${expected.typeKey}` : `process-missing:${expected.processKey}`,
          inferred: true
        };
      }

      function getShortResourceLabelFor(task, resources) {
        if (task.recurso_id) {
          return resourceLabelForId(task.recurso_id, resources);
        }
        const expected = getExpectedResourceForProcess(task.proceso, resources);
        if (expected.needs && (expected.resourceId || expected.typeKey)) {
          const label = expected.resourceId
            ? resourceLabelForId(expected.resourceId, resources)
            : expected.typeKey;
          return `${label}?`;
        }
        return 'Sin recurso';
      }

      function getShortResourceLabel(task) {
        return getShortResourceLabelFor(task, plan.recursos);
      }

      function getTaskDisplayName(task) {
        if (task.label_short) {
          return task.label_short;
        }
        const cleaned = stripTaskNoise(task.nombre || 'tarea');
        return shortenText(cleaned || 'tarea', 60);
      }

      function updateTaskLabels(task, resources) {
        if (!task) {
          return;
        }
        if (!task.resourceTypeKey && task.recurso_id) {
          const resource = (resources || []).find((item) => item.id === task.recurso_id);
          task.resourceTypeKey =
            resource?.typeKey || normalizeResourceName(resource?.nombre || task.recurso_id);
        }
        const fullLabel = stripTaskNoise(task.nombre || '');
        task.label_full = fullLabel;
        task.label_short = [
          shortProcessLabel(task.proceso),
          shortDishLabel(task.plato),
          getShortResourceLabelFor(task, resources),
          `${task.duracion_min}m`
        ]
          .filter(Boolean)
          .join(' | ');
      }

      function applyAutoFixes(planToFix) {
        if (!planToFix || !Array.isArray(planToFix.tareas)) {
          return 0;
        }
        if (!Array.isArray(planToFix.fix_events)) {
          planToFix.fix_events = [];
        }
        let applied = 0;
        planToFix.tareas.forEach((task) => {
          const duration = Number(task.duracion_min);
          if (!Number.isFinite(duration) || duration <= 0) {
            const process = PROCESS_TYPES.includes(task.proceso)
              ? task.proceso
              : inferProcessFromName(task.nombre || '');
            task.duracion_min = estimateDuration(process, 20, task.plato || '');
            task.duracion_inferida = true;
            if (!task.autoFixedDuration) {
              task.autoFixedDuration = true;
              planToFix.fix_events.push({
                plato: task.plato,
                resumen: 'Duracion inferida automaticamente'
              });
              applied += 1;
            }
          }
          const expected = getExpectedResourceForProcess(task.proceso, planToFix.recursos);
          if (expected.needs && !task.recurso_id && expected.resourceId) {
            const match = planToFix.recursos.find((resource) => resource.id === expected.resourceId);
            if (match) {
              setTaskResource(task, expected.resourceId);
              if (!task.autoFixedResource) {
                task.autoFixedResource = true;
                planToFix.fix_events.push({
                  plato: task.plato,
                  resumen: `Recurso autoasignado (${resourceLabelForId(expected.resourceId, planToFix.recursos)})`
                });
                applied += 1;
              }
            }
          }
          updateTaskLabels(task, planToFix.recursos);
          if ((task.label_full || '').length > 60 && !task.autoNormalized) {
            task.autoNormalized = true;
            planToFix.fix_events.push({
              plato: task.plato,
              resumen: 'Nombre simplificado automaticamente'
            });
            applied += 1;
          }
        });
        return applied;
      }

      function buildFallbackLines(text, options = {}) {
        let virtual = normalizeText(text);
        const diagnostics = options.diagnostics;
        const flattenLikely = options.flattenLikely ?? isLikelyFlattenedPdf(virtual);
        const maxTotalAdds = Number.isFinite(options.maxTotalAdds) ? options.maxTotalAdds : 120;
        let totalAdds = 0;
        let blocked = false;

        const recordTransform = (label, detail) => {
          if (!diagnostics) {
            return;
          }
          if (!Array.isArray(diagnostics.transforms)) {
            diagnostics.transforms = [];
          }
          diagnostics.transforms.push({ label, ...detail });
        };

        const applyTransform = (label, transform) => {
          if (blocked) {
            recordTransform(label, { skipped: true, reason: 'limit', totalAdds });
            return;
          }
          const before = virtual;
          const after = transform(before);
          if (after === before) {
            return;
          }
          const addCount = Math.max(0, countNewlines(after) - countNewlines(before));
          if (totalAdds + addCount > maxTotalAdds) {
            blocked = true;
            recordTransform(label, { skipped: true, addCount, totalAdds, maxTotalAdds });
            return;
          }
          totalAdds += addCount;
          virtual = after;
          recordTransform(label, { addCount, totalAdds });
        };

        // Preprocess flattened PDFs: split numbered dishes and section labels.
        if (flattenLikely) {
          applyTransform('split-numbered', (value) =>
            value.replace(
              /(^|\s)(\d{1,2})\.\s+(?=[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1])/g,
              '\n$2. '
            )
          );
          applyTransform('split-numbered-generic', (value) => value.replace(/(^|\s)(\d{1,2})\.\s+/g, '\n$2. '));

          const sectionLabels = [
            'MENU NOCHEVIEJA',
            'MENU NOCHIEVIEJA',
            'ESTRUCTURA OPERATIVA PARA APP',
            'EQUIPO DE COCINA',
            'RECURSOS DISPONIBLES',
            'MENU Y ELABORACIONES',
            'MENU Y ELABORACION'
          ];
          sectionLabels.forEach((label) => {
            const escaped = label.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const re = new RegExp(`\\s*${escaped}\\s*`, 'gi');
            applyTransform(`section-${label}`, (value) => value.replace(re, `\n${label}\n`));
          });

          applyTransform('split-inline-labels', (value) =>
            value
              .replace(/\s+Procesos\s*:/gi, '\nProcesos:')
              .replace(/\s+Recursos\s*:/gi, '\nRecursos:')
              .replace(/\s+Ingredientes\s*:/gi, '\nIngredientes:')
          );

          applyTransform('expand-processes-resources', (value) =>
            value
              .replace(/Procesos\s*:\s*/gi, '\nProcesos:\n')
              .replace(/Recursos\s*:\s*/gi, '\nRecursos:\n')
              .replace(/Ingredientes\s*\((\d+)\s*pax\)\s*:\s*/gi, '\nIngredientes ($1 pax):\n')
              .replace(/Ingredientes\s*:\s*/gi, '\nIngredientes:\n')
              .replace(/,\s*/g, ', ')
          );

          applyTransform('list-processes', (value) =>
            value.replace(/\nProcesos:\n([^\n]+)/gi, (match, rest) => {
              const parts = rest.split(',').map((item) => item.trim()).filter(Boolean);
              if (!parts.length) {
                return match;
              }
              return '\nProcesos:\n' + parts.map((item) => ` - ${item}`).join('\n');
            })
          );

          applyTransform('list-ingredients', (value) =>
            value.replace(/\nIngredientes(?:\s*\(\d+\s*pax\))?:\n([^\n]+)/gi, (match, rest) => {
              const parts = rest.split(';').map((item) => item.trim()).filter(Boolean);
              if (parts.length <= 1) {
                return match;
              }
              const headerMatch = match.match(/^\nIngredientes[^\n]*:\n/i);
              const header = headerMatch ? headerMatch[0] : '\nIngredientes:\n';
              return header + parts.map((item) => ` - ${item}`).join('\n');
            })
          );
        }

        // Always apply light normalization to improve segmentation.
        applyTransform('section-title', (value) => value.replace(/\b(MENU\s+Y\s+ELABORACIONES)\b/gi, '\n$1\n'));
        applyTransform('section-inline', (value) => value.replace(/\b(Procesos?|Recursos?|Ingredientes?)\s*:/gi, '\n$1:'));
        applyTransform('bullets', (value) =>
          value
            .replace(/\s*[\u2022\u00b7]\s*/g, '\n- ')
            .replace(/\s+-\s+/g, '\n- ')
        );
        applyTransform('numbered', (value) =>
          value
            .replace(/(^|\n)\s*(\d{1,2})\s*[\.\-)\]]\s+/g, '\n$2. ')
            .replace(/(\s)(\d{1,2})\s*[\.\-)\]]\s+/g, '\n$2. ')
        );
        applyTransform('section-titles', (value) =>
          value.replace(
            /\b(Entrantes?|Principal(?:es)?|Postres?|Cocina|Equipo|Recursos(?: disponibles)?|Ingredientes?|Procesos?)\s*:/gi,
            '\n$1: '
          )
        );
        applyTransform('time-split', (value) =>
          value.replace(/\((\d{1,3})(?:\s*(?:-|a)\s*\d{1,3})?\s*min\)/gi, '($1 min)\n')
        );

        const lines = virtual
          .split('\n')
          .map((line) => line.replace(/\s+/g, ' ').trim())
          .filter((line) => line.length > 0);

        return {
          lines,
          stats: {
            totalAdds,
            maxTotalAdds,
            flattenLikely
          }
        };
      }

      function normalizeLines(text, options = {}) {
        const normalized = normalizeText(text);
        const baseLines = normalized
          .split('\n')
          .map((line) => line.replace(/\s+/g, ' ').trim())
          .filter((line) => line.length > 0);
        let lines = baseLines;
        let fallbackUsed = false;
        const flattenLikely = options.flattenLikely ?? isLikelyFlattenedPdf(normalized);
        const roughLineCount = Math.max(baseLines.length, Math.ceil(normalized.length / 80));
        const maxTotalAdds = Number.isFinite(options.maxTotalAdds)
          ? options.maxTotalAdds
          : clamp(roughLineCount * 4, 25, 240);
        const fallback = buildFallbackLines(normalized, {
          diagnostics: options.diagnostics,
          flattenLikely,
          maxTotalAdds
        });
        const expanded = fallback.lines;
        if ((flattenLikely && expanded.length >= baseLines.length) || baseLines.length < 5) {
          fallbackUsed = true;
          lines = expanded;
        }
        if (options.diagnostics && fallback.stats) {
          options.diagnostics.fallbackStats = fallback.stats;
        }
        return { normalized, lines, baseLineCount: baseLines.length, fallbackUsed };
      }

      function stripRepeatedHeaders(lines) {
        const counts = {};
        (lines || []).forEach((line) => {
          const trimmed = String(line || '').trim();
          if (!trimmed || trimmed.length > 60) {
            return;
          }
          const key = normalizeToken(trimmed);
          counts[key] = (counts[key] || 0) + 1;
        });
        const repeated = new Set(
          Object.entries(counts)
            .filter((entry) => entry[1] >= 3)
            .map((entry) => entry[0])
        );
        if (!repeated.size) {
          return lines || [];
        }
        return (lines || []).filter((line) => !repeated.has(normalizeToken(line)));
      }

      function isTrashLine(line) {
        const trimmed = String(line || '').trim();
        if (!trimmed) {
          return true;
        }
        if (/^[-_=]{3,}$/.test(trimmed)) {
          return true;
        }
        if (/^\d+$/.test(trimmed)) {
          return true;
        }
        if (/^pagina\s*\d+/i.test(trimmed)) {
          return true;
        }
        return trimmed.length <= 2;
      }
      function extractPaxFromLine(line) {
        const match = String(line || '').match(/(\d+)\s*(comensales|personas)/i);
        if (!match) {
          return null;
        }
        return sanitizeInt(match[1], null);
      }

      function isUppercaseLine(line) {
        const clean = stripDiacritics(String(line || '')).replace(/[^A-Za-z]/g, '');
        if (clean.length < 4) {
          return false;
        }
        return clean === clean.toUpperCase();
      }

      function parseProcessTokens(text, options = {}) {
        const raw = normalizeTextLite(String(text || ''));
        const allowConjunction =
          typeof options.allowConjunction === 'boolean' ? options.allowConjunction : hasWhitelistedProcessVerb(raw);
        const normalized = allowConjunction ? raw.replace(/\s+y\s+/gi, ',') : raw;
        return normalized
          .split(/[,;/]+/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      function normalizeProcessList(tokens) {
        const list = [];
        (tokens || []).forEach((token) => {
          const trimmed = String(token || '').trim();
          if (!trimmed) {
            return;
          }
          const process = normalizeProcessKey(trimmed);
          if (process && process !== 'OTRO' && !list.includes(process)) {
            list.push(process);
          }
        });
        return list;
      }

      function parseResourceHints(text) {
        const hints = [];
        const normalized = normalizeToken(text || '');
        RESOURCE_CATALOG.forEach((resource) => {
          if (new RegExp(`\\b${resource.pattern}\\b`, 'i').test(normalized)) {
            if (!hints.includes(resource.id)) {
              hints.push(resource.id);
            }
          }
        });
        return hints;
      }

      function parseResourcesFromText(text) {
        const resources = [];
        const normalized = normalizeToken(text || '');
        RESOURCE_CATALOG.forEach((resource) => {
          const capacity = extractCapacity(normalized, resource.pattern);
          const hasKeyword = new RegExp(`\\b${resource.pattern}\\b`, 'i').test(normalized);
          if (capacity !== null || hasKeyword) {
            const fallbackCap = sanitizeInt(resource.defaultCap, 0);
            resources.push({
              id: resource.id,
              nombre: resource.nombre,
              capacidad: capacity !== null ? sanitizeInt(capacity, fallbackCap) : fallbackCap,
              tipo: resource.tipo
            });
          }
        });
        return resources;
      }

      function guessRoleLevel(value) {
        const normalized = normalizeToken(value);
        if (normalized.includes('chef') || normalized.includes('jefe')) {
          return { rol: 'Chef', nivel: 3 };
        }
        if (normalized.includes('pinxe') || normalized.includes('pinche')) {
          return { rol: 'Pinxe', nivel: 2 };
        }
        if (normalized.includes('ayudante') || normalized.includes('auxiliar')) {
          return { rol: 'Ayudante', nivel: 1 };
        }
        if (normalized.includes('cocinero')) {
          return { rol: 'Cocinero', nivel: 2 };
        }
        return { rol: 'Equipo', nivel: 1 };
      }

      function parseTeamFromLines(lines) {
          const team = [];
          const seenNames = new Set();
          const usedIds = new Set();
          lines.forEach((rawLine) => {
            const line = normalizeLine(rawLine);
            if (!line) {
              return;
            }
            if (lineLooksLikeResource(line)) {
              return;
            }
            if (lineLooksLikeTeam(line)) {
              let listPart = line;
              if (line.includes(':')) {
                listPart = line.split(':').slice(1).join(':').trim();
              }
              if (!listPart) {
                return;
              }
              listPart
                .split(/[,/;]+/)
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
                .forEach((item) => {
                  const rawItem = item.replace(/\s+/g, ' ').trim();
                  if (!rawItem) {
                    return;
                  }
                  const nameCandidate = rawItem.split(/[\-|]/)[0].trim() || rawItem;
                  if (isInvalidPersonName(nameCandidate)) {
                    return;
                  }
                  const normalizedName = normalizeToken(nameCandidate);
                  if (seenNames.has(normalizedName)) {
                    return;
                  }
                  const id = generatePersonId(usedIds);
                  usedIds.add(id);
                  const roleInfo = guessRoleLevel(rawItem);
                  const levelMatch = rawItem.match(/nivel\s*(\d)/i);
                  const levelValue = levelMatch ? clamp(parseInt(levelMatch[1], 10), 1, 3) : roleInfo.nivel;
                  team.push({
                    id,
                    nombre: nameCandidate,
                    rol: roleInfo.rol,
                    nivel: levelValue,
                    factor_velocidad: 1,
                    restricciones: {}
                  });
                  seenNames.add(normalizedName);
                });
            }
          });
          return team;
        }

      function parseResourceHintsLite(text) {
        const hints = [];
        const token = normalizeToken(text || '');
        Object.keys(RESOURCE_HINTS).forEach((key) => {
          if (new RegExp(`\\b${key}\\b`, 'i').test(token)) {
            const value = RESOURCE_HINTS[key];
            if (value && !hints.includes(value)) {
              hints.push(value);
            }
          }
        });
        return hints;
      }

      function cleanDishTitle(line) {
        let name = String(line || '').trim();
        name = name.replace(/^\d{1,2}\s*[\.)-]\s*/, '');
        name = name.split(/\b(?:Procesos?|Ingredientes?|Recursos?)\b\s*:/i)[0].trim();
        if (!name) {
          return '';
        }
        const words = name
          .split(/\s+/)
          .map((word) => word.trim())
          .filter((word) => {
            const token = normalizeToken(word.replace(/[^A-Za-z0-9]/g, ''));
            if (!token) {
              return false;
            }
            return !STOPWORDS_PLATO.has(token);
          });
        return sanitizeDishName(words.join(' ').trim());
      }

      function extractDishesFromLines(lines) {
        if (!Array.isArray(lines) || !lines.length) {
          return [];
        }
        const normalized = lines.map((line) => normalizeToken(line));
        let startIndex = normalized.findIndex((line) => line.includes('menu y elaboraciones'));
        const start = startIndex >= 0 ? startIndex + 1 : 0;
        let endIndex = lines.length;
        for (let i = start; i < normalized.length; i += 1) {
          if (
            normalized[i].includes('equipo de cocina') ||
            normalized[i].includes('recursos disponibles') ||
            normalized[i].includes('estructura operativa')
          ) {
            endIndex = i;
            break;
          }
        }
        const blocks = [];
        let current = null;
        for (let i = start; i < endIndex; i += 1) {
          const line = lines[i];
          if (!line) {
            continue;
          }
          const match = line.match(/^\s*(\d{1,2})\s*[\.)-]\s+(.+)$/);
          if (match) {
            if (current) {
              blocks.push(current);
            }
            current = { number: match[1], lines: [line] };
            continue;
          }
          if (current) {
            current.lines.push(line);
          }
        }
        if (current) {
          blocks.push(current);
        }
        if (blocks.length) {
          return blocks;
        }
        // Fallback: cualquier linea numerada en el documento.
        lines.forEach((line) => {
          const match = String(line || '').match(/^\s*(\d{1,2})\s*[\.)-]\s+(.+)$/);
          if (match) {
            blocks.push({ number: match[1], lines: [line] });
          }
        });
        return blocks;
      }

      function parseDishBlock(blockLines) {
        if (!Array.isArray(blockLines) || !blockLines.length) {
          return null;
        }
        const lines = blockLines.map((line) => String(line || '').trim()).filter(Boolean);
        if (!lines.length) {
          return null;
        }
        const dishName = cleanDishTitle(lines[0]);
        if (!dishName) {
          return null;
        }
        const firstLine = lines[0];
        const score = scoreDishCandidate(firstLine, {
          dishName,
          isExplicitBlock: true,
          isNumbered: /^\s*\d{1,2}[\.\-)]\s+/.test(firstLine),
          isBullet: /^[\-\u2022\*]\s+/.test(firstLine),
          isCaps: isUppercaseLine(firstLine),
          hasTime: Boolean(extractTimeRange(firstLine))
        });
        if (score < DISH_SCORE_THRESHOLD) {
          return null;
        }
        let pax = extractPaxFromLine(lines[0]) || null;
        let tiempo = extractTimeRange(lines[0]);
        const procesos = [];
        const ingredientes = [];
        const recursos = [];
        let mode = null;

        const addProcesses = (text) => {
          const allowConjunction = hasWhitelistedProcessVerb(text);
          const list = normalizeProcessList(parseProcessTokens(text, { allowConjunction }));
          list.forEach((proc) => {
            if (!procesos.includes(proc)) {
              procesos.push(proc);
            }
          });
        };
        const addResources = (text) => {
          const hints = parseResourceHints(text).concat(parseResourceHintsLite(text));
          hints.forEach((hint) => {
            if (!recursos.includes(hint)) {
              recursos.push(hint);
            }
          });
        };
        const addIngredient = (text) => {
          const clean = String(text || '').replace(/^[-\u2022*]\s*/, '').trim();
          if (clean) {
            ingredientes.push(clean);
          }
        };

        lines.forEach((rawLine, idx) => {
          const trimmed = String(rawLine || '').trim();
          if (!trimmed) {
            return;
          }
          if (!tiempo) {
            tiempo = extractTimeRange(trimmed) || tiempo;
          }
          const paxFound = extractPaxFromLine(trimmed);
          if (paxFound) {
            pax = paxFound;
          }
          if (/^procesos?\b/i.test(trimmed)) {
            mode = 'procesos';
            const rest = trimmed.split(':').slice(1).join(':').trim();
            if (rest) {
              addProcesses(rest);
            }
            return;
          }
          if (/^recursos?\b/i.test(trimmed)) {
            mode = 'recursos';
            const rest = trimmed.split(':').slice(1).join(':').trim();
            if (rest) {
              addResources(rest);
            }
            return;
          }
          if (/^ingredientes?\b/i.test(trimmed)) {
            mode = 'ingredientes';
            const rest = trimmed.split(':').slice(1).join(':').trim();
            if (rest) {
              rest
                .split(';')
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => addIngredient(item));
            }
            return;
          }
          if (mode === 'procesos') {
            addProcesses(trimmed.replace(/^[-\u2022*]\s*/, ''));
            return;
          }
          if (mode === 'recursos') {
            addResources(trimmed);
            return;
          }
          if (mode === 'ingredientes') {
            addIngredient(trimmed);
            return;
          }
          if (idx === 0 && /procesos?\s*:/i.test(trimmed)) {
            const rest = trimmed.split(/procesos?\s*:/i)[1] || '';
            addProcesses(rest);
          }
          if (idx === 0 && /recursos\s*:/i.test(trimmed)) {
            const rest = trimmed.split(/recursos\s*:/i)[1] || '';
            addResources(rest);
          }
          if (idx === 0 && /ingredientes\s*:/i.test(trimmed)) {
            const rest = trimmed.split(/ingredientes\s*:/i)[1] || '';
            rest
              .split(';')
              .map((item) => item.trim())
              .filter(Boolean)
              .forEach((item) => addIngredient(item));
          }
        });

        if (!recursos.length) {
          addResources(dishName);
        }

        return {
          id: makeIdFromName(dishName, 'PLATO'),
          nombre: dishName,
          tiempo,
          origen: 'PDF',
          categoria: null,
          procesos,
          recursos_hint: recursos,
          pax,
          ingredientes
        };
      }
      function buildMenuIRFromRawText(rawText, sourceMeta = null) {
        const diagnostics = {
          warnings: [],
          errors: [],
          byDish: [],
          processCount: 0,
          inferredCount: 0,
          confidenceAvg: 0,
          transforms: []
        };
        const { normalized, lines, baseLineCount, fallbackUsed } = normalizeLines(rawText, { diagnostics });
        const normalizedText = normalized;
        const normalizedForMatch = normalizeToken(normalizedText);
        const cleanedLines = stripRepeatedHeaders(lines);
        const sectionItems = cleanedLines.map((line) => ({
          text: line,
          notes: isTrashLine(line) ? ['trash'] : []
        }));
        const effectiveLines = cleanedLines.filter((line) => !isTrashLine(line));
        const parseLines = effectiveLines.length ? effectiveLines : cleanedLines;
        const recursos = parseResourcesFromText(normalizedForMatch);
        const equipo = parseTeamFromLines(lines);
        const comensales = detectComensales(normalizedForMatch);
        const fecha = detectDate(normalizedText);
        const blocks = extractDishesFromLines(lines);
        const platos = [];
        const maxPlatos = computeMaxPlatos(lines.length, baseLineCount);
        let maxPlatosReached = false;

        const inferProcessesFromLines = (blockLines) => {
          const joined = blockLines.join(' ');
          const hasVerb = hasWhitelistedProcessVerb(joined);
          const hasProcessBlock = blockLines.some((line) => /^procesos?\b/i.test(normalizeToken(line)));
          if (!hasVerb && !hasProcessBlock) {
            return [];
          }
          const inferred = [];
          if (hasVerb) {
            PROCESS_KEYWORDS.forEach((entry) => {
              if (entry.regex.test(joined)) {
                inferred.push(entry.process);
              }
            });
          }
          const tokens = parseProcessTokens(joined, { allowConjunction: hasVerb }).map((token) =>
            normalizeProcessKey(token)
          );
          return normalizeProcessList(inferred.concat(tokens));
        };

        blocks.forEach((block, index) => {
          if (platos.length >= maxPlatos) {
            if (!maxPlatosReached) {
              diagnostics.warnings.push(`Max platos alcanzado (${maxPlatos}).`);
              maxPlatosReached = true;
            }
            return;
          }
          const parsed = parseDishBlock(block.lines);
          if (!parsed) {
            diagnostics.errors.push(`Plato ${index + 1}: bloque no interpretable.`);
            return;
          }
          const rawProcesses = Array.isArray(parsed.procesos) ? parsed.procesos.slice() : [];
          let processes = rawProcesses.map((proc) => normalizeProcessKey(proc));
          processes = normalizeProcessList(processes);
          if (!processes.length) {
            processes = inferProcessesFromLines(block.lines);
            diagnostics.inferredCount += processes.length;
          }
          const recursosHint = Array.isArray(parsed.recursos_hint)
            ? parsed.recursos_hint.map((hint) => normalizeResourceName(hint)).filter(Boolean)
            : [];
          const ingredientes = Array.isArray(parsed.ingredientes) ? parsed.ingredientes.filter(Boolean) : [];

          const dishWarnings = [];
          if (!processes.length) dishWarnings.push('Sin procesos');
          if (!recursosHint.length) dishWarnings.push('Sin recursos');
          if (!ingredientes.length) dishWarnings.push('Sin ingredientes');

          const confidence = clamp(
            0.45 +
              (processes.length ? 0.25 : 0) +
              (recursosHint.length ? 0.15 : 0) +
              (ingredientes.length ? 0.1 : 0),
            0.3,
            0.95
          );

          diagnostics.processCount += processes.length;
          diagnostics.byDish.push({ plato: parsed.nombre, warnings: dishWarnings, confidence });
          dishWarnings.forEach((warn) => diagnostics.warnings.push(`${parsed.nombre}: ${warn}`));

          platos.push({
            id: parsed.id,
            nombre: parsed.nombre,
            tiempo: parsed.tiempo,
            origen: parsed.origen || 'PDF',
            categoria: parsed.categoria || null,
            procesos: processes,
            recursos_hint: recursosHint,
            pax: parsed.pax || null,
            ingredientes,
            confianza: confidence
          });
        });

        const mergedPlatos = dedupeDishes(platos, {
          threshold: DISH_SIMILARITY_THRESHOLD
        });
        if (mergedPlatos.length !== platos.length) {
          diagnostics.dedupedCount = platos.length - mergedPlatos.length;
        }

        diagnostics.confidenceAvg = mergedPlatos.length
          ? clamp(
            mergedPlatos.reduce((acc, item) => acc + (item.confianza || 0), 0) / mergedPlatos.length,
            0,
            1
          )
          : 0;

        diagnostics.trashLines = sectionItems.filter((item) => item.notes && item.notes.length).length;

        return {
          source: sourceMeta,
          rawText: rawText || '',
          normalizedText,
          lines: parseLines,
          sections: [{ id: 'raw', title: 'RAW', items: sectionItems }],
          lineCount: parseLines.length,
          baseLineCount,
          fallbackUsed,
          recursos,
          equipo,
          comensales,
          fecha,
          platos: mergedPlatos,
          parseDiagnostics: diagnostics
        };
      }

      function menuIRToPlan(menuIR, existingResources, existingTeam) {
        const hasExplicitResources = Array.isArray(existingResources)
          ? existingResources.some((item) => normalizeSource(item?.source, '') === 'explicit')
          : false;
        const hasExplicitTeam = Array.isArray(existingTeam)
          ? existingTeam.some((item) => normalizeSource(item?.source, '') === 'explicit')
          : false;
        const resources = menuIR?.recursos?.length
          ? menuIR.recursos
          : hasExplicitResources
            ? existingResources
            : [];
        const team = menuIR?.equipo?.length
          ? menuIR.equipo
          : hasExplicitTeam
            ? existingTeam
            : [];
        const normalizedText = menuIR?.normalizedText || normalizeText(menuIR?.rawText || '');
        const draft = {
          rawText: menuIR?.rawText || '',
          normalizedText,
          rawTextLength: String(menuIR?.rawText || '').length,
          normalizedTextLength: normalizedText.length,
          platos: menuIR?.platos || [],
          comensales: menuIR?.comensales || null,
          fecha: menuIR?.fecha || null,
          recursos: resources,
          equipo: team,
          lineCount: menuIR?.lineCount || 0,
          baseLineCount: menuIR?.baseLineCount || 0,
          fallbackUsed: Boolean(menuIR?.fallbackUsed),
          lines: menuIR?.lines || []
        };
        const result = buildPlanFromDraft(draft);
        const confidenceAvg = menuIR?.parseDiagnostics?.confidenceAvg;
        if (typeof confidenceAvg === 'number' && confidenceAvg > 0 && confidenceAvg < 0.35) {
          const note = 'Confianza baja: revisa platos y procesos.';
          if (result.plan) {
            const existing = Array.isArray(result.plan.incertidumbres_detectadas)
              ? result.plan.incertidumbres_detectadas
              : [];
            result.plan.incertidumbres_detectadas = Array.from(new Set(existing.concat(note)));
            const guided = Array.isArray(result.plan.preguntas_guiadas)
              ? result.plan.preguntas_guiadas.slice()
              : [];
            guided.push({
              id: 'GUIDE-PAX',
              pregunta: 'Cuantos comensales?',
              opciones: ['4', '6', '8', '10', '12'],
              afecta_a: [],
              tipo: 'PAX',
              plato: 'GLOBAL'
            });
            guided.push({
              id: 'GUIDE-TECNICA',
              pregunta: 'Tecnica principal?',
              opciones: ['HORNO', 'FOGONES', 'FRIO', 'MIXTA'],
              afecta_a: [],
              tipo: 'TECNICA',
              plato: 'GLOBAL'
            });
            guided.push({
              id: 'GUIDE-ORIGEN',
              pregunta: 'Casero o comprado?',
              opciones: ['CASERO', 'COMPRADO', 'MIXTO'],
              afecta_a: [],
              tipo: 'ORIGEN',
              plato: 'GLOBAL'
            });
            result.plan.preguntas_guiadas = guided.slice(0, 5);
          }
        }
        return { plan: result.plan, draft, suggestions: result.suggestions || [] };
      }

      function parseMenuToStructure(text) {
        const normalized = normalizeText(text);
        const normalizedForMatch = normalizeToken(normalized);
        const { lines } = normalizeLines(normalized);
        const recursos = parseResourcesFromText(normalizedForMatch);
        const equipo = parseTeamFromLines(lines);
        const platos = [];
        const blocks = extractDishesFromLines(lines);
        const maxPlatos = computeMaxPlatos(lines.length, lines.length);
        const inferProcessesFromLines = (blockLines) => {
          const joined = blockLines.join(' ');
          const hasVerb = hasWhitelistedProcessVerb(joined);
          const hasProcessBlock = blockLines.some((line) => /^procesos?\b/i.test(normalizeToken(line)));
          if (!hasVerb && !hasProcessBlock) {
            return [];
          }
          const inferred = [];
          if (hasVerb) {
            PROCESS_KEYWORDS.forEach((entry) => {
              if (entry.regex.test(joined)) {
                inferred.push(entry.process);
              }
            });
          }
          const tokens = normalizeProcessList(parseProcessTokens(joined, { allowConjunction: hasVerb }));
          return normalizeProcessList(inferred.concat(tokens));
        };
        blocks.forEach((block) => {
          if (platos.length >= maxPlatos) {
            return;
          }
          const parsed = parseDishBlock(block.lines);
          if (!parsed) {
            return;
          }
          if (!Array.isArray(parsed.procesos) || !parsed.procesos.length) {
            parsed.procesos = inferProcessesFromLines(block.lines);
          }
          platos.push(parsed);
        });
        const mergedPlatos = dedupeDishes(platos, {
          threshold: DISH_SIMILARITY_THRESHOLD
        });
        return { equipo, recursos, platos: mergedPlatos, lines };
      }

      function parseMenuDraft(text) {
        const normalized = normalizeText(text);
        const normalizedForMatch = normalizeToken(normalized);
        const { lines, baseLineCount, fallbackUsed } = normalizeLines(normalized);
        const resources = parseResourcesFromText(normalizedForMatch);
        const dishes = [];
        const comensales = detectComensales(normalizedForMatch);
        const fecha = detectDate(normalized);
        const equipo = parseTeamFromLines(lines);
        const maxPlatos = computeMaxPlatos(lines.length, baseLineCount);
        let currentCategory = null;
        let currentDish = null;
        let mode = null;

        const addDish = (name, time, origin, rawLine, context = {}) => {
          const dishName = sanitizeDishName(stripTimeFromLine(name));
          if (dishName.length <= 3 || isIngredientDishName(dishName)) {
            return null;
          }
          const score = scoreDishCandidate(rawLine || name, {
            dishName,
            ...context
          });
          if (score < DISH_SCORE_THRESHOLD) {
            return null;
          }
          const dish = {
            id: makeIdFromName(dishName, 'PLATO'),
            nombre: dishName,
            tiempo: time,
            origen: origin,
            categoria: currentCategory,
            procesos: [],
            recursos_hint: [],
            pax: extractPaxFromLine(rawLine || name) || null
          };
          const hints = parseResourceHints(dishName);
          if (hints.length) {
            dish.recursos_hint = hints;
          }
          const merged = mergeDishCandidate(dishes, dish, DISH_SIMILARITY_THRESHOLD);
          if (merged) {
            return merged;
          }
          if (dishes.length >= maxPlatos) {
            return null;
          }
          dish.dishKey = normalizeDishKey(dishName);
          dishes.push(dish);
          return dish;
        };

        lines.forEach((rawLine) => {
          if (!rawLine) {
            return;
          }
          const sectionMatch = rawLine.match(/^(entrantes?|principal(?:es)?|postres?|platos?)\s*:\s*(.*)$/i);
          if (sectionMatch) {
            currentCategory = sectionMatch[1].toUpperCase();
            const rest = sectionMatch[2];
            if (rest) {
              rest
                .split(/[,;\/]/)
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => {
                  const time = extractTimeRange(item);
                  addDish(item, time, 'PDF', item, {
                    isExplicitBlock: true,
                    hasTime: Boolean(time)
                  });
                });
            }
            currentDish = null;
            mode = null;
            return;
          }
          const menuMatch = rawLine.match(/^menu\b[^:]*:\s*(.*)$/i);
          if (menuMatch) {
            const rest = menuMatch[1];
            if (rest) {
              rest
                .split(/[,;\/]/)
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => {
                  const time = extractTimeRange(item);
                  addDish(item, time, 'PDF', item, {
                    isExplicitBlock: true,
                    hasTime: Boolean(time)
                  });
                });
            }
            currentDish = null;
            mode = null;
            return;
          }

          const trimmed = rawLine.trim();
          if (!trimmed) {
            return;
          }
          const token = normalizeToken(trimmed);
          const line = normalizeLine(trimmed);
          if (!line) {
            return;
          }
          if (lineLooksLikeResource(trimmed) || lineLooksLikeTeam(trimmed)) {
            return;
          }
          if (isMetadataLine(line)) {
            return;
          }

          if (/^procesos?\b/.test(token)) {
            if (currentDish) {
              const rest = trimmed.split(':').slice(1).join(':').trim();
              if (rest) {
                const allowConjunction = hasWhitelistedProcessVerb(rest);
                const processes = normalizeProcessList(parseProcessTokens(rest, { allowConjunction }));
                processes.forEach((process) => {
                  if (!currentDish.procesos.includes(process)) {
                    currentDish.procesos.push(process);
                  }
                });
              }
            }
            mode = 'procesos';
            return;
          }
          if (/^recursos?\b/.test(token)) {
            if (currentDish) {
              const rest = trimmed.split(':').slice(1).join(':').trim();
              const hints = parseResourceHints(rest || trimmed);
              hints.forEach((hint) => {
                if (!currentDish.recursos_hint.includes(hint)) {
                  currentDish.recursos_hint.push(hint);
                }
              });
            }
            mode = 'recursos';
            return;
          }
          if (/^ingredientes?\b/.test(token)) {
            if (currentDish) {
              const pax = extractPaxFromLine(trimmed);
              if (pax) {
                currentDish.pax = pax;
              }
            }
            mode = 'ingredientes';
            return;
          }

          const isNumbered = /^\d{1,2}[\.\-)]\s+/.test(trimmed);
          const isBullet = /^[\-\u2022\*]\s+/.test(trimmed);
          const isCaps = isUppercaseLine(line);
          const time = extractTimeRange(line);
          const dishName = sanitizeDishName(stripTimeFromLine(line));
          if (dishName.length <= 3 || isIngredientDishName(dishName)) {
            return;
          }

          if (mode === 'procesos' && currentDish && !isNumbered && !isBullet && !isCaps && !time) {
            const allowConjunction = hasWhitelistedProcessVerb(line);
            const processes = normalizeProcessList(parseProcessTokens(line, { allowConjunction }));
            processes.forEach((process) => {
              if (!currentDish.procesos.includes(process)) {
                currentDish.procesos.push(process);
              }
            });
            return;
          }
          if (mode === 'recursos' && currentDish && !isNumbered && !isBullet && !isCaps && !time) {
            const hints = parseResourceHints(line);
            hints.forEach((hint) => {
              if (!currentDish.recursos_hint.includes(hint)) {
                currentDish.recursos_hint.push(hint);
              }
            });
            return;
          }
          if (mode === 'ingredientes' && currentDish && !isNumbered && !isBullet && !isCaps && !time) {
            const pax = extractPaxFromLine(line);
            if (pax) {
              currentDish.pax = pax;
            }
            return;
          }

          const origin = isNumbered || isBullet || time ? 'PDF' : 'IA';
          const candidateContext = {
            dishName,
            cleanedLine: line,
            isNumbered,
            isBullet,
            isCaps,
            hasTime: Boolean(time),
            currentDish: Boolean(currentDish)
          };
          if (isNumbered || isBullet || isCaps || (!currentDish && dishName.length > 3)) {
            currentDish = addDish(dishName, time, origin, trimmed, candidateContext);
            mode = null;
            return;
          }
          if (line.length <= 80 && !currentDish) {
            currentDish = addDish(dishName, time, origin, trimmed, candidateContext);
            mode = null;
          }
        });

        const mergedDishes = dedupeDishes(dishes, {
          threshold: DISH_SIMILARITY_THRESHOLD
        });
        return {
          rawText: text,
          normalizedText: normalized,
          rawTextLength: String(text || '').length,
          normalizedTextLength: normalized.length,
          platos: mergedDishes,
          comensales,
          fecha,
          recursos: resources,
          equipo,
          lineCount: lines.length,
          baseLineCount,
          fallbackUsed,
          lines
        };
      }

      function inferResourceForDish(dishName) {
        const profile = getDishPatternProfile(dishName);
        if (profile && Array.isArray(profile.resourceHints) && profile.resourceHints.length) {
          return profile.resourceHints[0];
        }
        const pattern = profile?.id || detectDishPattern(dishName);
        const process = inferPrimaryProcessForDish(dishName, profile || pattern);
        const prefs = PROCESS_RESOURCE_PREF[process] || [null];
        return prefs.find((item) => item) || null;
      }

      function inferLevelForDish(dishName) {
        const lower = dishName.toLowerCase();
        if (/(solomillo|pescado|lomo|magret|reduccion)/.test(lower)) {
          return 3;
        }
        if (/(ravioli|crepe|risotto|pasta|salsa|masa|flan|crema)/.test(lower)) {
          return 2;
        }
        return 1;
      }

      function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
      }

      function computeBaseTime(dish) {
        if (dish.tiempo) {
          const avg = dish.tiempo.max ? (dish.tiempo.min + dish.tiempo.max) / 2 : dish.tiempo.min;
          return Math.round(avg);
        }
        return 20;
      }

      function clampDurationForProcess(process, duration, dishName) {
        const normalized = normalizeToken(dishName);
        if (process === 'LAVAR' || process === 'CORTAR') {
          return clamp(duration, 3, 8);
        }
        if (process === 'MEZCLAR') {
          return clamp(duration, 5, 12);
        }
        if (process === 'SALTEAR' || process === 'SOFREIR') {
          return clamp(duration, 6, 15);
        }
        if (process === 'COCER' && /(pasta|ravioli|gnocchi|tortellini)/.test(normalized)) {
          return clamp(duration, 10, 20);
        }
        if (process === 'HORNEAR' && /(tarta|bizcocho|brownie)/.test(normalized)) {
          return clamp(duration, 25, 50);
        }
        if (process === 'BANO_MARIA') {
          return clamp(duration, 25, 45);
        }
        if (process === 'ENFRIAR' || process === 'REPOSAR') {
          return clamp(duration, 5, 15);
        }
        if (process === 'REDUCIR') {
          if (/(vino tinto|fondo|salsa)/.test(normalized)) {
            return clamp(duration, 15, 25);
          }
          return clamp(duration, 8, 20);
        }
        return duration;
      }

      function estimateDuration(process, baseTime, dishName) {
        const normalized = normalizeToken(dishName);
        if (process === 'HORNEAR') {
          if (/(tarta|bizcocho|brownie)/.test(normalized)) {
            return clamp(Math.round(baseTime || 40), 25, 50);
          }
          return clamp(Math.round(baseTime || 60), 35, 120);
        }
        if (process === 'GRATINAR') {
          return clamp(Math.round(baseTime || 25), 12, 40);
        }
        if (process === 'BANO_MARIA') {
          return clamp(Math.round(baseTime || 35), 25, 45);
        }
        if (process === 'FREIR') {
          return clamp(Math.round(baseTime * 0.4), 8, 15);
        }
        if (process === 'COCER') {
          if (/(pasta|ravioli|gnocchi|tortellini)/.test(normalized)) {
            return clamp(Math.round(baseTime * 0.45), 10, 20);
          }
          return clamp(Math.round(baseTime * 0.5), 15, 45);
        }
        if (process === 'SALTEAR') {
          return clamp(Math.round(baseTime * 0.45), 6, 15);
        }
        if (process === 'SOFREIR') {
          return clamp(Math.round(baseTime * 0.4), 6, 15);
        }
        if (process === 'REDUCIR') {
          if (/(vino tinto|fondo|salsa)/.test(normalized)) {
            return clamp(Math.round(baseTime * 0.6), 15, 25);
          }
          return clamp(Math.round(baseTime * 0.45), 8, 20);
        }
        if (process === 'TRITURAR') {
          return clamp(Math.round(baseTime * 0.3), 6, 15);
        }
        if (process === 'FORMAR') {
          return clamp(Math.round(baseTime * 0.3), 8, 25);
        }
        if (process === 'MONTAR') {
          return clamp(Math.round(baseTime * 0.25), 6, 18);
        }
        if (process === 'MEZCLAR') {
          return clamp(Math.round(baseTime * 0.35), 5, 12);
        }
        if (process === 'CORTAR') {
          return clamp(Math.round(baseTime * 0.25), 3, 8);
        }
        if (process === 'LAVAR') {
          return clamp(Math.round(baseTime * 0.2), 3, 8);
        }
        if (process === 'ESCURRIR') {
          return clamp(Math.round(baseTime * 0.2), 4, 12);
        }
        if (process === 'EMPLATAR') {
          return clamp(Math.round(baseTime * 0.2), 4, 12);
        }
        if (process === 'ENFRIAR' || process === 'REPOSAR') {
          return clamp(Math.round(baseTime * 0.3), 5, 15);
        }
        return clamp(Math.round(baseTime * 0.4), 6, 25);
      }

      function processToVerb(process, dishName) {
        const normalized = normalizeToken(dishName);
        if (process === 'COCER' && normalized.includes('tortilla')) {
          return 'cuajar';
        }
        if (process === 'MEZCLAR' && /(ensalada|tartar|carpaccio)/.test(normalized)) {
          return 'aderezar';
        }
        if (process === 'SALTEAR' && normalized.includes('plancha')) {
          return 'planchar';
        }
        const verbs = {
          LAVAR: 'lavar',
          ESCURRIR: 'escurrir',
          CORTAR: 'cortar',
          MEZCLAR: 'mezclar',
          MONTAR: 'montar',
          FORMAR: 'formar',
          FREIR: 'freir',
          SALTEAR: 'saltear',
          SOFREIR: 'sofreir',
          REDUCIR: 'reducir',
          COCER: 'cocer',
          HORNEAR: 'hornear',
          GRATINAR: 'gratinar',
          BANO_MARIA: 'cocer al bano maria',
          EMPLATAR: 'emplatar',
          LIMPIAR: 'limpiar',
          REPOSAR: 'reposar',
          ENFRIAR: 'enfriar',
          TRITURAR: 'triturar',
          OTRO: 'ajustar'
        };
        return verbs[process] || 'ajustar';
      }

      function inferProcessFromName(name) {
        const token = normalizeToken(name);
        for (const entry of PROCESS_KEYWORDS) {
          if (entry.regex.test(token)) {
            return entry.process;
          }
        }
        const mapped = mapTechniqueToProcess(token);
        if (mapped) {
          return mapped;
        }
        return 'OTRO';
      }

      function getDishPatternRegistry(dishName) {
        const token = normalizeToken(dishName || '');
        for (const pattern of DISH_PATTERNS) {
          try {
            if (pattern.match && pattern.match(token, dishName)) {
              return pattern;
            }
          } catch (error) {
            // ignore pattern errors
          }
        }
        return null;
      }

      function getDishPatternProfile(dishName) {
        const registry = getDishPatternRegistry(dishName);
        if (registry) {
          return registry;
        }
        const libraryPattern = findPatternForDish(dishName);
        if (!libraryPattern) {
          return null;
        }
        return {
          id: libraryPattern.id,
          extraProcesses: Array.isArray(libraryPattern.procesos_obligatorios)
            ? libraryPattern.procesos_obligatorios
            : [],
          questions: [],
          timeMultiplier: libraryPattern.tiempo_estimado ? 1.2 : 1,
          resourceHints: Array.isArray(libraryPattern.recursos_tipicos)
            ? libraryPattern.recursos_tipicos
            : [],
          primaryProcess:
            Array.isArray(libraryPattern.procesos_obligatorios) && libraryPattern.procesos_obligatorios.length
              ? libraryPattern.procesos_obligatorios[0]
              : null
        };
      }
      function detectDishPattern(dishName) {
        const profile = getDishPatternProfile(dishName);
        if (profile && profile.id) {
          return profile.id;
        }
        return 'CASERO';
      }

      function inferPrimaryProcessForDish(dishName, pattern) {
        const normalized = normalizeToken(dishName);
        const patternId = typeof pattern === 'string' ? pattern : pattern?.id;
        if (pattern && pattern.primaryProcess) {
          return pattern.primaryProcess;
        }
        if (patternId === 'CROQUETAS') {
          return 'FREIR';
        }
        if (patternId === 'FLAN') {
          return 'BANO_MARIA';
        }
        if (patternId === 'AL_HORNO') {
          return 'HORNEAR';
        }
        if (patternId === 'EMPANADILLAS') {
          return normalized.includes('horno') ? 'HORNEAR' : 'FREIR';
        }
        if (patternId === 'TORTILLA') {
          return 'COCER';
        }
        if (patternId === 'CREMA') {
          return 'COCER';
        }
        if (patternId === 'RISOTTO') {
          return 'COCER';
        }
        if (patternId === 'PASTA') {
          return 'COCER';
        }
        if (/(reduccion|reducir|vino tinto)/.test(normalized)) {
          return 'REDUCIR';
        }
        if (/(tarta|bizcocho|brownie)/.test(normalized)) {
          return 'HORNEAR';
        }
        if (normalized.includes('flan')) {
          return 'BANO_MARIA';
        }
        if (/(ensalada|tartar|carpaccio|crudo|gazpacho)/.test(normalized)) {
          return 'MEZCLAR';
        }
        if (/gratin/.test(normalized)) {
          return 'GRATINAR';
        }
        if (/bano maria/.test(normalized)) {
          return 'BANO_MARIA';
        }
        if (/(frit|frito)/.test(normalized)) {
          return 'FREIR';
        }
        if (/(plancha|saltear|saltead|sofreir)/.test(normalized)) {
          return 'SALTEAR';
        }
        if (/(horno|asado|hornead|gratin)/.test(normalized)) {
          return 'HORNEAR';
        }
        if (/(hervir|cocer|pochar|guisar|estofar)/.test(normalized)) {
          return 'COCER';
        }
        return 'SALTEAR';
      }

      function inferProcessForResource(dishName, resourceId, resources) {
        const profile = getDishPatternProfile(dishName);
        const pattern = profile?.id || detectDishPattern(dishName);
        const resource = resources
          ? resources.find((item) => item.id === resourceId)
          : recursoById[resourceId];
        if (!resourceId) {
          return inferPrimaryProcessForDish(dishName, profile || pattern);
        }
        if (resource?.tipo === RESOURCE_TYPES.LIMPIEZA) {
          const token = normalizeToken(resource.nombre);
          return token.includes('lavavajillas') ? 'LIMPIAR' : 'LAVAR';
        }
        if (resource?.tipo === RESOURCE_TYPES.PREP) {
          return pattern === 'CREMA' ? 'TRITURAR' : 'MEZCLAR';
        }
        if (resource?.tipo === RESOURCE_TYPES.COCCION) {
          const token = normalizeToken(resource.nombre || '');
          if (resourceId === 'HORNO' || token.includes('horno')) {
            if (/bano maria/.test(normalizeToken(dishName))) {
              return 'BANO_MARIA';
            }
            if (/gratin/.test(normalizeToken(dishName))) {
              return 'GRATINAR';
            }
            return 'HORNEAR';
          }
          if (/reduccion|reducir|vino tinto/.test(normalizeToken(dishName))) {
            return 'REDUCIR';
          }
          if (pattern === 'CROQUETAS' || pattern === 'EMPANADILLAS') {
            return 'FREIR';
          }
          if (['CREMA', 'RISOTTO', 'PASTA', 'TORTILLA'].includes(pattern)) {
            return 'COCER';
          }
          return 'SALTEAR';
        }
        return inferProcessFromName(dishName);
      }
function buildTask(id, dishName, name, phase, duration, process, resource, level, deps, origin, confidence, resourceInfo = null) {
          return {
            id,
            plato: dishName,
            nombre: name,
            fase: phase,
            duracion_min: duration,
            duracion_inferida: false,
            recurso_id: resource,
            resourceTypeKey: normalizeResourceName(resource),
            recurso_origen: resourceInfo?.origin || null,
            recurso_confianza: Number.isFinite(resourceInfo?.confidence) ? resourceInfo.confidence : null,
            recurso_trazabilidad: resourceInfo?.trace || null,
            recurso_inferido: Boolean(resourceInfo?.inferred),
            proceso: process,
            nivel_min: level,
            depende_de: deps,
            asignado_a_id: null,
            locked: false,
            origen: origin,
            confianza: confidence,
            estado: 'PENDIENTE'
          };
        }

      function inferCookVerb(dishName, resourceId, resources) {
        const process = inferProcessForResource(dishName, resourceId, resources);
        return processToVerb(process, dishName);
      }

      function withInferTag(name, inferred) {
        return inferred ? `${name} [INFERIDO]` : name;
      }

      function resolveResourceId(hint, resources, suggestions) {
        if (!hint) {
          return null;
        }
        const normalizedHint = normalizeToken(hint);
        const match = resources.find((resource) => {
          const nameToken = normalizeToken(resource.nombre);
          const idToken = normalizeToken(resource.id);
          if (normalizedHint === idToken || normalizedHint === nameToken) {
            return true;
          }
          if (normalizedHint.includes('horno')) {
            return nameToken.includes('horno');
          }
          if (normalizedHint.includes('fogon') || normalizedHint.includes('fogones')) {
            return (
              nameToken.includes('fogon') ||
              nameToken.includes('fogones') ||
              nameToken.includes('plancha') ||
              (resource.tipo === RESOURCE_TYPES.COCCION && !nameToken.includes('horno'))
            );
          }
          if (normalizedHint.includes('estacion')) {
            return nameToken.includes('estacion') || resource.tipo === RESOURCE_TYPES.PREP;
          }
          if (normalizedHint.includes('fregadero')) {
            return nameToken.includes('fregadero') || resource.tipo === RESOURCE_TYPES.LIMPIEZA;
          }
          if (normalizedHint.includes('lavavajillas')) {
            return nameToken.includes('lavavajillas');
          }
          return false;
        });
        if (match) {
          return match.id;
        }
        if (suggestions) {
          suggestions.push(`Recurso sugerido: ${hint}`);
        }
        return null;
      }

      function inferDishProcessesForResources(dish) {
        const dishName = dish?.nombre || '';
        const explicit = normalizeProcessList(dish?.procesos || []);
        if (explicit.length) {
          return explicit;
        }
        const profile = getDishProfile(dishName);
        if (profile) {
          return resolveProfileProcesses(profile, dishName);
        }
        const token = normalizeToken(dishName);
        if (!token) {
          return [];
        }
        if (/(ensalada|tartar|carpaccio|gazpacho|crudo)/.test(token)) {
          return normalizeProcessList(['LAVAR', 'CORTAR', 'MEZCLAR', 'EMPLATAR']);
        }
        if (/(tarta|bizcocho|brownie)/.test(token)) {
          return normalizeProcessList(['MEZCLAR', 'HORNEAR', 'ENFRIAR', 'EMPLATAR']);
        }
        if (/flan/.test(token)) {
          return normalizeProcessList(['MEZCLAR', 'BANO_MARIA', 'ENFRIAR', 'EMPLATAR']);
        }
        if (/(pasta|ravioli|gnocchi|tortellini)/.test(token)) {
          return normalizeProcessList(['COCER', 'MEZCLAR', 'EMPLATAR']);
        }
        if (/(reduccion|reducir|vino tinto)/.test(token)) {
          return normalizeProcessList(['SALTEAR', 'REDUCIR', 'EMPLATAR']);
        }
        const patternProfile = getDishPatternProfile(dishName);
        const primary = inferPrimaryProcessForDish(dishName, patternProfile || detectDishPattern(dishName));
        const extra = Array.isArray(patternProfile?.extraProcesses) ? patternProfile.extraProcesses : [];
        return normalizeProcessList([primary, 'EMPLATAR'].concat(extra));
      }

      function inferResourcesFromDraft(draft) {
        if (!draft || draft.isEmpty) {
          return [];
        }
        const dishes = Array.isArray(draft.platos) ? draft.platos : [];
        if (!dishes.length) {
          return [];
        }
        const typeCounts = { HORNO: 0, FOGONES: 0, ESTACION: 0, FREGADERO: 0 };
        const processCounts = {};
        let totalProcesses = 0;
        dishes.forEach((dish) => {
          const processes = inferDishProcessesForResources(dish);
          processes.forEach((process) => {
            totalProcesses += 1;
            processCounts[process] = (processCounts[process] || 0) + 1;
            const expected = getExpectedResourceForProcess(process, []);
            if (expected.needs && expected.typeKey) {
              typeCounts[expected.typeKey] = (typeCounts[expected.typeKey] || 0) + 1;
            }
          });
        });
        if (!totalProcesses) {
          return [];
        }
        const resources = [];
        const addResource = (typeKey, capacity, evidence, confidence) => {
          if (!capacity) {
            return;
          }
          resources.push({
            id: typeKey,
            nombre: RESOURCE_LABELS[typeKey] || typeKey,
            typeKey,
            capacidad: capacity,
            tipo: inferResourceType(typeKey),
            source: 'inferred',
            confidence,
            evidence
          });
        };
        const hornoCount = typeCounts.HORNO || 0;
        const fogonCount = typeCounts.FOGONES || 0;
        const stationCount = typeCounts.ESTACION || 0;
        const sinkCount = typeCounts.FREGADERO || 0;
        const dishCount = dishes.length;
        const estTaskCount = totalProcesses;

        const hornoCap = hornoCount >= 3 ? 2 : hornoCount >= 1 ? 1 : 0;
        const fogonCap = fogonCount >= 7 ? 3 : fogonCount >= 4 ? 2 : fogonCount >= 1 ? 1 : 0;
        const stationCap = dishCount
          ? dishCount >= 4 || estTaskCount >= 12 || stationCount >= 6
            ? 2
            : 1
          : 0;
        const sinkCap = sinkCount >= 4 || dishCount >= 4 ? 2 : sinkCount ? 1 : 0;

        if (hornoCap) {
          addResource(
            'HORNO',
            hornoCap,
            [`procesos hornear/gratinar/bano maria=${hornoCount}`],
            clamp(0.6 + hornoCount * 0.05, 0.6, 0.85)
          );
        }
        if (fogonCap) {
          addResource(
            'FOGONES',
            fogonCap,
            [`procesos calientes=${fogonCount}`],
            clamp(0.6 + fogonCount * 0.04, 0.6, 0.85)
          );
        }
        if (stationCap) {
          addResource(
            'ESTACION',
            stationCap,
            [`platos=${dishCount}`, `tareas~${estTaskCount}`],
            clamp(0.6 + stationCount * 0.04, 0.6, 0.85)
          );
        }
        if (sinkCap) {
          addResource(
            'FREGADERO',
            sinkCap,
            [`lavar/escurrir=${sinkCount}`],
            clamp(0.6 + sinkCount * 0.04, 0.6, 0.85)
          );
        }
        return resources;
      }

      function inferTeamFromDraft(draft, tasks, resources) {
        if (!draft || draft.isEmpty) {
          return [];
        }
        const dishes = Array.isArray(draft.platos) ? draft.platos : [];
        const dishCount = dishes.length || new Set((tasks || []).map((task) => task.plato)).size;
        if (!dishCount) {
          return [];
        }
        const taskCount = Array.isArray(tasks) ? tasks.length : 0;
        const hotProcesses = new Set([
          'HORNEAR',
          'GRATINAR',
          'BANO_MARIA',
          'COCER',
          'SALTEAR',
          'SOFREIR',
          'FREIR',
          'REDUCIR'
        ]);
        const hotDishes = new Set();
        const hasEmplatar = (tasks || []).some((task) => task.proceso === 'EMPLATAR');
        (tasks || []).forEach((task) => {
          if (hotProcesses.has(task.proceso)) {
            hotDishes.add(task.plato);
          }
        });
        const hotDishCount = hotDishes.size;
        const hasHorno = (resources || []).some(
          (resource) => normalizeResourceName(resource.typeKey || resource.nombre || resource.id) === 'HORNO'
        );
        const hasFogones = (resources || []).some(
          (resource) => normalizeResourceName(resource.typeKey || resource.nombre || resource.id) === 'FOGONES'
        );
        let target = 2;
        const evidence = [];
        if (dishCount >= 3) {
          target = Math.max(target, 3);
          evidence.push(`platos=${dishCount}`);
        }
        if (dishCount >= 5) {
          target = 4;
          evidence.push(`platos>=5`);
        }
        if (taskCount >= 12) {
          target = Math.max(target, 3);
          evidence.push(`tareas=${taskCount}`);
        }
        if (taskCount >= 18) {
          target = 4;
          evidence.push(`tareas>=18`);
        }
        if (hotDishCount >= 3) {
          target = Math.max(target, 3);
          evidence.push(`platos_calientes=${hotDishCount}`);
        }
        if (hasHorno && hasFogones && hasEmplatar && hotDishCount >= 2) {
          target = Math.max(target, 3);
          evidence.push('horno+fogones+emplatado');
        }
        target = clamp(target, 2, 4);
        const confidence = clamp(0.6 + evidence.length * 0.05, 0.6, 0.8);
        const ids = new Set();
        const team = [];
        const addPerson = (name, role, level) => {
          const id = ensureUniqueId(makeIdFromName(name, 'PERSONA'), ids);
          ids.add(id);
          team.push({
            id,
            nombre: name,
            rol: role,
            nivel: level,
            factor_velocidad: 1,
            restricciones: {},
            source: 'inferred',
            confidence,
            evidence: evidence.slice()
          });
        };
        addPerson('Chef', 'CHEF', 3);
        if (target >= 2) {
          addPerson('Pinche 1', 'PINXE', 2);
        }
        if (target >= 3) {
          addPerson('Pinche 2', 'PINXE', 1);
        }
        if (target >= 4) {
          addPerson('Pinche 3', 'PINXE', 1);
        }
        return team;
      }

      function buildTasksFromPattern(pattern, dish, index, resources, resourceWarnings) {
        const dishName = dish.nombre;
        const slug = `d${index + 1}`;
        const inferred = !dish.tiempo || dish.origen !== 'PDF';
        const baseTime = computeBaseTime(dish);
        const origin = 'PATRON';
        const confidenceBase = dish.tiempo ? 0.85 : 0.6;
        const level = inferLevelForDish(dishName);
        const tasks = [];
        const uncertainties = [];
        const guidedQuestions = [];
        const questions = [];
        const styles = mergeStyles(normalizeStyleFlags(pattern.estilos || []), detectStyleFlags(dishName));
        if (inferred) {
          uncertainties.push(`Se aplico patron ${pattern.nombre_plato} a ${dishName}.`);
        }

        pattern.subprocesos.forEach((subprocess, idx) => {
          const process = PROCESS_TYPES.includes(subprocess.proceso)
            ? subprocess.proceso
            : inferProcessFromName(subprocess.nombre || '');
          const phase = subprocess.fase || defaultPhaseForProcess(process);
          const duration = estimateDuration(process, baseTime, dishName);
          const prevId = idx > 0 ? `${slug}-p${idx}` : null;
          const deps = prevId ? [prevId] : [];
          const resourceInfo = resourceForProcess(
            process,
            resources,
            resourceWarnings,
            guidedQuestions,
            `${slug}-p${idx + 1}`,
            dishName,
            dish?.recursos_hint
          );
          const resourceIdValue = resourceInfo?.resourceId || null;
          const name = formatSubprocessName(subprocess.nombre, dishName);
          tasks.push(
            buildTask(
              `${slug}-p${idx + 1}`,
              dishName,
              withInferTag(name, inferred),
              phase,
              duration,
              process,
              resourceIdValue,
              subprocess.nivel_min || level,
              deps,
              origin,
              clamp(confidenceBase - 0.1, 0.3, 0.95),
              resourceInfo
            )
          );
        });

        if (pattern.id === 'CROQUETAS') {
          guidedQuestions.push({
            id: `GUIDE-${slug}-CROQ`,
            pregunta: `Croquetas ${dishName}: tipo?`,
            opciones: ['CASERAS', 'COMPRADAS'],
            afecta_a: [],
            tipo: 'CROQUETAS_TIPO',
            plato: dishName
          });
        }

        if (pattern.id === 'EMPANADILLAS') {
          guidedQuestions.push({
            id: `GUIDE-${slug}-EMP`,
            pregunta: `Empanadillas ${dishName}: metodo?`,
            opciones: ['FOGONES', 'HORNO'],
            afecta_a: [],
            tipo: 'METODO',
            plato: dishName
          });
        }

        if (pattern.id === 'FLAN') {
          guidedQuestions.push({
            id: `GUIDE-${slug}-FLAN`,
            pregunta: `Flan ${dishName}: casero o comprado?`,
            opciones: ['CASERO', 'COMPRADO'],
            afecta_a: [],
            tipo: 'FLAN_TIPO',
            plato: dishName
          });
        }

          const durationInferred = !dish.tiempo;
          if (durationInferred) {
            tasks.forEach((task) => {
              task.duracion_inferida = true;
              task.confianza = Math.min(task.confianza, 0.55);
            });
          }
          return { tasks, questions, guidedQuestions, uncertainties, estilos: styles, pattern };
        }

      function resolveProfileProcesses(profile, dishName) {
        const token = normalizeToken(dishName || '');
        const base = Array.isArray(profile.processes) ? profile.processes.slice() : [];
        const extra =
          typeof profile.getExtraProcesses === 'function' ? profile.getExtraProcesses(token, dishName) || [] : [];
        return normalizeProcessList(base.concat(extra));
      }

      function mergeProfileTasks(existingTasks, profileTasks) {
        const list = Array.isArray(existingTasks) ? existingTasks : [];
        const existingIds = new Set(list.map((task) => task.id));
        const existingKeys = new Set(list.map((task) => `${task.plato}::${task.proceso}`));
        const addedIds = new Set();
        profileTasks.forEach((task) => {
          const key = `${task.plato}::${task.proceso}`;
          if (existingKeys.has(key)) {
            const target = list.find((item) => `${item.plato}::${item.proceso}` === key);
            if (target && task.profileKey && !target.profileKey) {
              target.profileKey = task.profileKey;
            }
            return;
          }
          const deps = Array.isArray(task.depende_de) ? task.depende_de : [];
          const allowed = new Set([...existingIds, ...addedIds]);
          task.depende_de = deps.filter((dep) => allowed.has(dep));
          list.push(task);
          existingIds.add(task.id);
          existingKeys.add(key);
          addedIds.add(task.id);
        });
        return list;
      }

      function buildTasksFromProfile(profile, dish, index, resources, suggestions) {
        const dishName = dish.nombre;
        const slug = `d${index + 1}`;
        const inferred = !dish.tiempo || dish.origen !== 'PDF';
        const baseTime = Math.max(1, computeBaseTime(dish) * (profile.timeMultiplier || 1));
        const origin = 'profile';
        const confidenceBase = clamp(profile.confidence ?? 0.6, 0.55, 0.7);
        const level = inferLevelForDish(dishName);
        const tasks = [];
        const questions = [];
        const guidedQuestions = [];
        const uncertainties = [];
        const estilos = mergeStyles([...DEFAULT_STYLES], detectStyleFlags(dishName));
        const dishResourceHints = Array.isArray(dish.recursos_hint) ? dish.recursos_hint : [];
        const mergedResourceHints = dishResourceHints.concat(
          Array.isArray(profile.resourceHints) ? profile.resourceHints : []
        );
        const processes = resolveProfileProcesses(profile, dishName);
        const addTask = (id, process, deps) => {
          const verbSpec = VERB_MAP[process];
          const phase = verbSpec?.phase || defaultPhaseForProcess(process);
          const baseDuration = Number.isFinite(verbSpec?.baseMin)
            ? verbSpec.baseMin
            : estimateDuration(process, baseTime, dishName);
          let duration = clamp(Math.round(baseDuration), 2, 180);
          duration = clampDurationForProcess(process, duration, dishName);
          const resourceInfo = resourceForProcess(
            process,
            resources,
            suggestions,
            guidedQuestions,
            id,
            dishName,
            mergedResourceHints
          );
          const resourceIdValue = resourceInfo?.resourceId || null;
          let verb = processToVerb(process, dishName);
          if (profile.key === 'CARNE_REDUCCION' && process === 'SALTEAR') {
            verb = 'sellar';
          }
          const name = process === 'REDUCIR' ? `reducir salsa de ${dishName}` : `${verb} ${dishName}`;
          const task = buildTask(
            id,
            dishName,
            withInferTag(name, inferred),
            phase,
            duration,
            process,
            resourceIdValue,
            level,
            deps,
            origin,
            confidenceBase,
            resourceInfo
          );
          task.profileKey = profile.key;
          task.origin = origin;
          tasks.push(task);
        };

        processes.forEach((process, idx) => {
          const prevId = idx > 0 ? `${slug}-prof-${idx}` : null;
          const deps = prevId ? [prevId] : [];
          addTask(`${slug}-prof-${idx + 1}`, process, deps);
        });

        if (inferred) {
          tasks.forEach((task) => {
            task.duracion_inferida = true;
            task.confianza = Math.min(task.confianza, 0.6);
          });
        }

        return { tasks, questions, guidedQuestions, uncertainties, estilos, profile };
      }

      function buildTasksFromProcessList(processList, dish, index, resources, suggestions) {
        const dishName = dish.nombre;
        const slug = `d${index + 1}`;
        const inferred = !dish.tiempo || dish.origen !== 'PDF';
        const patternProfile = getDishPatternProfile(dishName);
        const timeMultiplier = patternProfile?.timeMultiplier || 1;
        const baseTime = Math.max(1, computeBaseTime(dish) * timeMultiplier);
        const origin = 'IA';
        const confidenceBase = dish.tiempo ? 0.85 : 0.45;
        const level = inferLevelForDish(dishName);
        const tasks = [];
        const questions = [];
        const guidedQuestions = [];
        const uncertainties = [];
        const styles = mergeStyles([...DEFAULT_STYLES], detectStyleFlags(dishName));

        const explicitProcesses = Array.isArray(processList)
          ? processList.filter(Boolean)
          : Array.isArray(dish.procesos)
            ? dish.procesos.filter(Boolean)
            : [];
        const extraProcesses = Array.isArray(patternProfile?.extraProcesses)
          ? patternProfile.extraProcesses
          : [];
        const base = [];
        if (!explicitProcesses.includes('LAVAR')) {
          base.push('LAVAR');
        }
        if (!explicitProcesses.includes('CORTAR')) {
          base.push('CORTAR');
        }
        let processes = normalizeProcessList(base.concat(explicitProcesses, extraProcesses));
        if (!processes.includes('EMPLATAR')) {
          processes.push('EMPLATAR');
        }
        if (processes.length < 4) {
          const insertAt = Math.max(0, processes.length - 1);
          processes.splice(insertAt, 0, 'MEZCLAR');
        }
        if (explicitProcesses.length) {
          return buildTasksFromProcessList(processes, dish, index, resources, suggestions);
        }
        const ingredientCount = Array.isArray(dish.ingredientes) ? dish.ingredientes.length : 0;
        const paxValue = sanitizeInt(dish.pax, 0);
        const extraLoad = Math.min(10, Math.floor(ingredientCount / 6) * 2) + (paxValue >= 8 ? 2 : 0);
        const dishResourceHints = Array.isArray(dish.recursos_hint) ? dish.recursos_hint : [];
        const mergedResourceHints = dishResourceHints.concat(
          Array.isArray(patternProfile?.resourceHints) ? patternProfile.resourceHints : []
        );

        const addTask = (id, process, deps) => {
          const verbSpec = VERB_MAP[process];
          const phase = verbSpec?.phase || defaultPhaseForProcess(process);
          const baseDuration = Number.isFinite(verbSpec?.baseMin)
            ? verbSpec.baseMin
            : estimateDuration(process, baseTime, dishName);
          let duration = clamp(Math.round(baseDuration + extraLoad), 2, 180);
          duration = clampDurationForProcess(process, duration, dishName);
          const resourceInfo = resourceForProcess(
            process,
            resources,
            suggestions,
            guidedQuestions,
            id,
            dishName,
            mergedResourceHints
          );
          const resourceIdValue = resourceInfo?.resourceId || null;
          const verb = processToVerb(process, dishName);
          const confidence = clamp((verbSpec ? 0.85 : 0.6) - (dish.tiempo ? 0 : 0.1), 0.35, 0.95);
          tasks.push(
            buildTask(
              id,
              dishName,
              withInferTag(`${verb} ${dishName}`, inferred),
              phase,
              duration,
              process,
              resourceIdValue,
              level,
              deps,
              origin,
              confidence,
              resourceInfo
            )
          );
        };

        processes.forEach((process, idx) => {
          const prevId = idx > 0 ? `${slug}-p${idx}` : null;
          const deps = prevId ? [prevId] : [];
          addTask(`${slug}-p${idx + 1}`, process, deps);
        });

        if (patternProfile?.questions && patternProfile.questions.length) {
          patternProfile.questions.forEach((question) => {
            guidedQuestions.push({
              id: `GUIDE-${slug}-${question.id}`,
              pregunta: question.pregunta,
              opciones: question.opciones || [],
              afecta_a: question.afecta_a || [],
              tipo: question.tipo || 'PATRON',
              plato: dishName
            });
          });
        }

        if (!dish.tiempo) {
          tasks.forEach((task) => {
            task.duracion_inferida = true;
            task.confianza = Math.min(task.confianza, 0.55);
          });
        }

        const dishProfile = getDishProfile(dishName);
        if (dishProfile) {
          const profileResult = buildTasksFromProfile(dishProfile, dish, index, resources, suggestions);
          mergeProfileTasks(tasks, profileResult.tasks || []);
        }

        return { tasks, questions, guidedQuestions, uncertainties, estilos: styles };
      }

      function buildTasksForDish(dish, index, resources, suggestions) {
        const dishName = dish.nombre;
        const slug = `d${index + 1}`;
        const inferred = !dish.tiempo || dish.origen !== 'PDF';
        const level = inferLevelForDish(dishName);
        const patternProfile = getDishPatternProfile(dishName);
        const dishProfile = getDishProfile(dishName);
        const timeMultiplier = patternProfile?.timeMultiplier || 1;
        const baseTime = Math.max(1, computeBaseTime(dish) * timeMultiplier);
        const origin = 'IA';
        const hasTime = Boolean(dish.tiempo);
        const confidenceBase = hasTime ? 0.85 : origin === 'PDF' ? 0.65 : 0.45;
        const estilos = mergeStyles([...DEFAULT_STYLES], detectStyleFlags(dishName));

        const tasks = [];
        const uncertainties = [];
        const guidedQuestions = [];

        const explicitProcesses = Array.isArray(dish.procesos)
          ? dish.procesos.filter(Boolean)
          : [];
        if (!explicitProcesses.length && dishProfile) {
          return buildTasksFromProfile(dishProfile, dish, index, resources, suggestions);
        }
        const extraProcesses = Array.isArray(patternProfile?.extraProcesses)
          ? patternProfile.extraProcesses
          : [];
        const base = [];
        if (!explicitProcesses.includes('LAVAR')) {
          base.push('LAVAR');
        }
        if (!explicitProcesses.includes('CORTAR')) {
          base.push('CORTAR');
        }
        let processes = normalizeProcessList(base.concat(explicitProcesses, extraProcesses));
        if (!processes.includes('EMPLATAR')) {
          processes.push('EMPLATAR');
        }
        if (processes.length < 4) {
          const insertAt = Math.max(0, processes.length - 1);
          processes.splice(insertAt, 0, 'MEZCLAR');
        }
        if (explicitProcesses.length) {
          return buildTasksFromProcessList(processes, dish, index, resources, suggestions);
        }
        const ingredientCount = Array.isArray(dish.ingredientes) ? dish.ingredientes.length : 0;
        const paxValue = sanitizeInt(dish.pax, 0);
        const extraLoad = Math.min(10, Math.floor(ingredientCount / 6) * 2) + (paxValue >= 8 ? 2 : 0);

        const dishResourceHints = Array.isArray(dish.recursos_hint) ? dish.recursos_hint : [];
        const mergedResourceHints = dishResourceHints.concat(
          Array.isArray(patternProfile?.resourceHints) ? patternProfile.resourceHints : []
        );

        const addTask = (id, name, phase, duration, process, minLevel, deps, resourceOverride) => {
          const resourceInfo =
            resourceOverride !== undefined
              ? { resourceId: resourceOverride, origin: 'OVERRIDE', confidence: 0.95, trace: 'override', inferred: false }
              : resourceForProcess(
                process,
                resources,
                suggestions,
                guidedQuestions,
                id,
                dishName,
                mergedResourceHints
              );
          const resourceIdValue = resourceInfo?.resourceId || null;
          tasks.push(
            buildTask(
              id,
              dishName,
              withInferTag(name, inferred),
              phase,
              duration,
              process,
              resourceIdValue,
              minLevel || level,
              deps,
              origin,
              clamp(confidenceBase - 0.05, 0.3, 0.95),
              resourceInfo
            )
          );
        };

        const washId = `${slug}-lavar`;
        const cutId = `${slug}-cortar`;
        const seasonId = `${slug}-sazonar`;
        const prepId = `${slug}-prep`;
        const serveId = `${slug}-serv`;

        const washDuration = estimateDuration('LAVAR', baseTime, dishName);
        const cutDuration = estimateDuration('CORTAR', baseTime, dishName);
        const serveDuration = estimateDuration('EMPLATAR', baseTime, dishName);
        const patternId = patternProfile?.id || detectDishPattern(dishName);
        const mainProcess = inferPrimaryProcessForDish(dishName, patternProfile || patternId);
        const mainVerb = processToVerb(mainProcess, dishName);
        let mainTaskId = prepId;

        if (patternId === 'CROQUETAS') {
          uncertainties.push(`Croquetas: se asume bechamel, formado y fritura casera.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `picar ingredientes de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          const bechamelId = `${slug}-bechamel`;
          addTask(
            bechamelId,
            `cocer bechamel`,
            'PREELABORACION',
            estimateDuration('COCER', baseTime * 0.6, dishName),
            'COCER',
            2,
            [cutId]
          );
          const enfriarId = `${slug}-enfriar`;
          addTask(
            enfriarId,
            `enfriar bechamel`,
            'PREELABORACION',
            estimateDuration('ENFRIAR', baseTime * 0.4, dishName),
            'ENFRIAR',
            1,
            [bechamelId]
          );
          const formarId = `${slug}-formar`;
          addTask(
            formarId,
            `formar croquetas`,
            'PREELABORACION',
            estimateDuration('FORMAR', baseTime * 0.6, dishName),
            'FORMAR',
            1,
            [enfriarId]
          );
          const rebozarId = `${slug}-rebozar`;
          addTask(
            rebozarId,
            `rebozar croquetas`,
            'PREELABORACION',
            estimateDuration('FORMAR', baseTime * 0.4, dishName),
            'FORMAR',
            1,
            [formarId]
          );
          addTask(
            prepId,
            `freir croquetas`,
            'PREELABORACION',
            estimateDuration('FREIR', baseTime, dishName),
            'FREIR',
            2,
            [rebozarId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
          guidedQuestions.push({
            id: `GUIDE-${slug}-CROQ`,
            pregunta: `Croquetas ${dishName}: tipo?`,
            opciones: ['CASERAS', 'COMPRADAS'],
            afecta_a: [],
            tipo: 'CROQUETAS_TIPO',
            plato: dishName
          });
        } else if (patternId === 'EMPANADILLAS') {
          uncertainties.push(`Empanadillas: se asume fritura, confirmar metodo.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `cortar relleno de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          const rellenarId = `${slug}-rellenar`;
          addTask(
            rellenarId,
            `rellenar empanadillas`,
            'PREELABORACION',
            estimateDuration('FORMAR', baseTime, dishName),
            'FORMAR',
            1,
            [cutId]
          );
          const cerrarId = `${slug}-cerrar`;
          addTask(
            cerrarId,
            `cerrar empanadillas`,
            'PREELABORACION',
            estimateDuration('FORMAR', baseTime * 0.8, dishName),
            'FORMAR',
            1,
            [rellenarId]
          );
          addTask(
            prepId,
            `freir empanadillas`,
            'PREELABORACION',
            estimateDuration('FREIR', baseTime, dishName),
            'FREIR',
            Math.max(1, level),
            [cerrarId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
          guidedQuestions.push({
            id: `GUIDE-${slug}-EMP`,
            pregunta: `Empanadillas ${dishName}: metodo?`,
            opciones: ['FOGONES', 'HORNO'],
            afecta_a: [prepId],
            tipo: 'METODO',
            plato: dishName
          });
        } else if (patternId === 'TORTILLA') {
          uncertainties.push(`Tortilla: se asume pochar y cuajar en sarten.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `cortar ingredientes de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          const pocharId = `${slug}-pochar`;
          addTask(
            pocharId,
            `pochar base de ${dishName}`,
            'PREELABORACION',
            estimateDuration('COCER', baseTime * 0.6, dishName),
            'COCER',
            1,
            [cutId]
          );
          addTask(
            prepId,
            `cuajar ${dishName}`,
            'PREELABORACION',
            estimateDuration('COCER', baseTime * 0.5, dishName),
            'COCER',
            Math.max(1, level),
            [pocharId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
        } else if (patternId === 'CREMA') {
          uncertainties.push(`Crema/sopa: se asume coccion + triturado.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `cortar ingredientes de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          const cocerId = `${slug}-cocer`;
          addTask(
            cocerId,
            `cocer ${dishName}`,
            'PREELABORACION',
            estimateDuration('COCER', baseTime, dishName),
            'COCER',
            Math.max(1, level),
            [cutId]
          );
          const triturarId = `${slug}-triturar`;
          addTask(
            triturarId,
            `triturar ${dishName}`,
            'PREELABORACION',
            estimateDuration('TRITURAR', baseTime, dishName),
            'TRITURAR',
            1,
            [cocerId]
          );
          addTask(
            prepId,
            `ajustar sazon de ${dishName}`,
            'PREELABORACION',
            estimateDuration('MEZCLAR', baseTime * 0.3, dishName),
            'MEZCLAR',
            1,
            [triturarId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
          mainTaskId = cocerId;
        } else if (patternId === 'RISOTTO') {
          uncertainties.push(`Risotto: se asume sofrito + coccion con caldo.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `cortar ingredientes de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          const sofreirId = `${slug}-sofreir`;
          addTask(
            sofreirId,
            `sofreir base de ${dishName}`,
            'PREELABORACION',
            estimateDuration('SALTEAR', baseTime * 0.5, dishName),
            'SALTEAR',
            Math.max(1, level),
            [cutId]
          );
          const caldoId = `${slug}-caldo`;
          addTask(
            caldoId,
            `cocer ${dishName} con caldo`,
            'PREELABORACION',
            estimateDuration('COCER', baseTime, dishName),
            'COCER',
            Math.max(2, level),
            [sofreirId]
          );
          addTask(
            prepId,
            `terminar ${dishName}`,
            'PREELABORACION',
            estimateDuration('SALTEAR', baseTime * 0.4, dishName),
            'SALTEAR',
            Math.max(2, level),
            [caldoId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
          mainTaskId = caldoId;
        } else if (patternId === 'PASTA') {
          uncertainties.push(`Pasta: se asume coccion en agua y mezclado final.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `cortar ingredientes de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          const hervirId = `${slug}-hervir`;
          addTask(
            hervirId,
            `hervir pasta`,
            'PREELABORACION',
            estimateDuration('COCER', baseTime, dishName),
            'COCER',
            1,
            [cutId]
          );
          const salsaId = `${slug}-salsa`;
          addTask(
            salsaId,
            `saltear salsa`,
            'PREELABORACION',
            estimateDuration('SALTEAR', baseTime * 0.6, dishName),
            'SALTEAR',
            Math.max(1, level),
            [cutId]
          );
          addTask(
            prepId,
            `mezclar pasta`,
            'PREELABORACION',
            estimateDuration('MEZCLAR', baseTime * 0.4, dishName),
            'MEZCLAR',
            Math.max(1, level),
            [hervirId, salsaId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
          mainTaskId = hervirId;
        } else if (patternId === 'AL_HORNO') {
          uncertainties.push(`Al horno: se asume sazonado + horneado + reposo.`);
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(
            seasonId,
            `sazonar ${dishName}`,
            'MISE_EN_PLACE',
            estimateDuration('MEZCLAR', baseTime * 0.3, dishName),
            'MEZCLAR',
            1,
            [washId]
          );
          addTask(
            prepId,
            `hornear ${dishName}`,
            'PREELABORACION',
            estimateDuration('HORNEAR', baseTime, dishName),
            'HORNEAR',
            Math.max(2, level),
            [seasonId]
          );
          const reposoId = `${slug}-reposo`;
          addTask(
            reposoId,
            `reposar ${dishName}`,
            'PREELABORACION',
            estimateDuration('REPOSAR', baseTime * 0.4, dishName),
            'REPOSAR',
            1,
            [prepId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [reposoId]);
        } else if (patternId === 'FLAN') {
          uncertainties.push(`Flan: se asume preparado casero al bano maria.`);
          addTask(washId, `lavar utensilios de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(
            cutId,
            `mezclar ingredientes de ${dishName}`,
            'MISE_EN_PLACE',
            estimateDuration('MEZCLAR', baseTime * 0.6, dishName),
            'MEZCLAR',
            1,
            [washId]
          );
          addTask(
            prepId,
            `cocer ${dishName} al bano maria`,
            'PREELABORACION',
            estimateDuration('BANO_MARIA', baseTime, dishName),
            'BANO_MARIA',
            Math.max(2, level),
            [cutId]
          );
          const enfriarId = `${slug}-enfriar`;
          addTask(
            enfriarId,
            `enfriar ${dishName}`,
            'PREELABORACION',
            estimateDuration('ENFRIAR', baseTime * 0.4, dishName),
            'ENFRIAR',
            1,
            [prepId]
          );
          addTask(serveId, `desmoldar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [enfriarId]);
          guidedQuestions.push({
            id: `GUIDE-${slug}-FLAN`,
            pregunta: `Flan ${dishName}: casero o comprado?`,
            opciones: ['CASERO', 'COMPRADO'],
            afecta_a: [],
            tipo: 'FLAN_TIPO',
            plato: dishName
          });
        } else {
          if (inferred) {
            uncertainties.push(`Se asume preparacion casera para ${dishName}.`);
          }
          addTask(washId, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', washDuration, 'LAVAR', 1, []);
          addTask(cutId, `cortar ingredientes de ${dishName}`, 'MISE_EN_PLACE', cutDuration, 'CORTAR', 1, [washId]);
          addTask(
            seasonId,
            `sazonar ${dishName}`,
            'MISE_EN_PLACE',
            estimateDuration('MEZCLAR', baseTime * 0.3, dishName),
            'MEZCLAR',
            1,
            [cutId]
          );
          addTask(
            prepId,
            `${mainVerb} ${dishName}`,
            'PREELABORACION',
            estimateDuration(mainProcess, baseTime, dishName),
            mainProcess,
            Math.max(1, level),
            [seasonId]
          );
          addTask(serveId, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', Math.max(1, level - 1), [
            prepId
          ]);
        }

          const questions = [];
          if (mainProcess === 'OTRO') {
            const resourceOptions = resources.map((item) => item.id).concat('NINGUNO');
            questions.push({
            id: `RES-${slug}`,
            pregunta: `Recurso principal para ${dishName}?`,
            opciones: resourceOptions,
            afecta_a: [mainTaskId]
          });
        }

          if (tasks.length < 4) {
            addTask(`${slug}-extra`, `emplatar ${dishName}`, 'SERVICIO', serveDuration, 'EMPLATAR', 1, [prepId]);
          }

          const durationInferred = !dish.tiempo;
          if (durationInferred) {
            tasks.forEach((task) => {
              task.duracion_inferida = true;
              task.confianza = Math.min(task.confianza, 0.55);
            });
          }
          return { tasks, questions, guidedQuestions, uncertainties, estilos };
        }

      function prioritizeQuestions(questions) {
        if (!Array.isArray(questions)) {
          return [];
        }
        const ordered = [...questions].sort((a, b) => {
          const aScore = a.tipo === 'ADD_RESOURCE' ? 0 : 1;
          const bScore = b.tipo === 'ADD_RESOURCE' ? 0 : 1;
          if (aScore !== bScore) {
            return aScore - bScore;
          }
          return 0;
        });
        return ordered.slice(0, 5);
      }

        function applyResourceConsistencyFixer(planToFix, resourceWarnings) {
          const warnings = [];
          const guidedQuestions = planToFix.preguntas_guiadas || [];
          const resources = planToFix.recursos || [];
          const tasks = planToFix.tareas || [];
          const resourceIds = new Set(resources.map((resource) => resource.id));
          const teamIds = new Set((planToFix.equipo || []).map((person) => person.id));
          const resourceTypeKeys = new Set(
            resources.map((resource) =>
              normalizeResourceName(resource.typeKey || resource.nombre || resource.id)
            )
          );
          resourceIds.forEach((id) => resourceTypeKeys.add(id));

          (resources || []).forEach((resource) => {
            const capacity = Number(resource.capacity ?? resource.capacidad);
            if (!Number.isFinite(capacity)) {
              warnings.push(`Capacidad no valida en recurso ${resource.name || resource.nombre || resource.id}.`);
            }
          });

          (tasks || []).forEach((task) => {
            const duration = Number(task.durationMin ?? task.duracion_min);
            if (!Number.isFinite(duration) || duration <= 0) {
              warnings.push(`Duracion no valida en tarea ${task.titleShort || task.nombre || task.id}.`);
            }
            const assignedId = task.assignedToId || task.asignado_a_id;
            if (assignedId && !teamIds.has(assignedId)) {
              warnings.push(`Asignado inexistente en tarea ${task.titleShort || task.nombre || task.id}.`);
            }
            const resourceId = task.resourceId || task.recurso_id;
            const resourceTypeKey = normalizeResourceName(task.resourceTypeKey || resourceId || '');
            if (resourceTypeKey && !resourceTypeKeys.has(resourceTypeKey) && !resourceIds.has(resourceId)) {
              warnings.push(`Tipo de recurso no disponible en ${task.titleShort || task.nombre || task.id}.`);
            }
            if (task.resourceTypeKey && normalizeResourceName(task.resourceTypeKey) !== task.resourceTypeKey) {
              warnings.push(`resourceTypeKey no normalizado en ${task.titleShort || task.nombre || task.id}.`);
            }
          });

          return warnings;
        }

      function buildPlanFromDraft(draft) {
        const tasks = [];
        const questions = [];
        const guidedQuestions = [];
        const uncertainties = [];
        const styleSet = new Set();
        const explicitResources = draft.recursos && draft.recursos.length ? deepClone(draft.recursos) : [];
        const resources = explicitResources.length ? explicitResources : inferResourcesFromDraft(draft);
        const resourceWarnings = [];

        if (state && state.debugEnabled) {
          console.debug('[buildPlanFromDraft] platos', Array.isArray(draft.platos) ? draft.platos.length : 0);
        }
        draft.platos.forEach((dish, index) => {
          const safeDish = dish && dish.nombre
            ? dish
            : { ...dish, nombre: dish?.nombre || `Plato ${index + 1}` };
          const hasProcesses = Array.isArray(safeDish.procesos) && safeDish.procesos.length;
          let result = null;
          try {
            result = hasProcesses
              ? buildTasksFromProcessList(safeDish.procesos, safeDish, index, resources, resourceWarnings)
              : buildTasksForDish(safeDish, index, resources, resourceWarnings);
          } catch (error) {
            if (state && state.debugEnabled) {
              console.warn('[buildPlanFromDraft] Error generando tareas', error);
            }
            result = buildTasksForDish(safeDish, index, resources, resourceWarnings);
          }
          if (!result || !Array.isArray(result.tasks) || !result.tasks.length) {
            result = buildTasksForDish(safeDish, index, resources, resourceWarnings);
          }
          tasks.push(...(result.tasks || []));
          questions.push(...(result.questions || []));
          if (result.guidedQuestions?.length) {
            guidedQuestions.push(...result.guidedQuestions);
          }
          if (result.uncertainties?.length) {
            uncertainties.push(...result.uncertainties);
          }
          if (result.estilos?.length) {
            result.estilos.forEach((style) => styleSet.add(style));
          }
          if (state && state.debugEnabled) {
            console.debug('[buildPlanFromDraft] plato', {
              nombre: safeDish?.nombre || '',
              procesos: Array.isArray(safeDish?.procesos) ? safeDish.procesos.length : 0,
              tasks: result.tasks?.length || 0,
              usesProcesos: hasProcesses
            });
          }
        });
        if (state && state.debugEnabled) {
          console.debug('[buildPlanFromDraft] total tasks', tasks.length);
        }


        const uniqueUncertainties = Array.from(new Set(uncertainties)).slice(0, 5);
        const explicitTeam = draft.equipo && draft.equipo.length ? deepClone(draft.equipo) : [];
        const equipo = explicitTeam.length ? explicitTeam : inferTeamFromDraft(draft, tasks, resources);
        if (state && state.debugEnabled) {
          const teamSummary = equipo.length
            ? equipo.map((person) => `${person.nombre} (${normalizeSource(person.source, 'explicit')})`).join(' | ')
            : 'sin equipo';
          const resourceSummary = resources.length
            ? resources
              .map((resource) => {
                const label = resource.nombre || resource.id;
                const cap = sanitizeInt(resource.capacidad ?? resource.capacity, 0);
                const source = normalizeSource(resource.source, 'explicit');
                const evidence = normalizeEvidence(resource.evidence);
                const evidenceText = evidence.length ? `: ${evidence.join('; ')}` : '';
                return `${label} ${cap} (${source}${evidenceText})`;
              })
              .join(' | ')
            : 'sin recursos';
          console.debug(`[inferencia] Equipo: ${teamSummary}`);
          console.debug(`[inferencia] Recursos: ${resourceSummary}`);
        }

        const planBuilt = {
          meta: {
            titulo: 'Menu importado',
            comensales: draft.comensales,
            notas: null
          },
          equipo,
          recursos: resources,
            fases: [...PHASES],
            tareas: tasks,
            preguntas_rapidas: questions.slice(0, 5),
            preguntas_guiadas: guidedQuestions,
            fix_events: [],
            incertidumbres_detectadas: uniqueUncertainties,
            advertencias_de_recursos: [],
            resumen_estilos_aplicados: styleSet.size ? Array.from(styleSet) : [...DEFAULT_STYLES]
          };

        const fixerWarnings = applyResourceConsistencyFixer(planBuilt, resourceWarnings);
        planBuilt.preguntas_guiadas = prioritizeQuestions(planBuilt.preguntas_guiadas);

        const uniqueResourceWarnings = Array.from(new Set(resourceWarnings));
        const uniqueSuggestions = Array.from(new Set(resourceWarnings.concat(fixerWarnings)));
        planBuilt.advertencias_de_recursos = uniqueResourceWarnings;
        let error = null;
        if (!tasks.length) {
          error = {
            severity: 'error',
            code: 'PARSE_FAILED_NO_TASKS',
            messageHumano: 'No se detectaron platos/tareas. Revisa el formato del menu o pega el texto manualmente.'
          };
          planBuilt.meta.parseErrorCode = error.code;
          planBuilt.meta.parseErrorMessage = error.messageHumano;
          planBuilt.meta.parseStatus = 'BLOCKER';
        }

        return {
          plan: planBuilt,
          suggestions: uniqueSuggestions,
          error
        };
      }

        function renderDraftSummary() {
          if (!menuDraft) {
            aiSummaryEl.textContent = 'Sin interpretacion aun.';
            return;
          }
          const plateCount = menuDraft.platos.length;
          const taskCount = plan?.tareas?.length || 0;
          const teamCount = plan?.equipo?.length || 0;
          const resourceCount = plan?.recursos?.length || 0;
          const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
          const warningCount = (state.issues || []).filter((issue) => issue.severity === 'warning').length;
          const diagnostics = state.diagnostics || emptyDiagnostics();
          let statusLine = 'Menu interpretado correctamente';
          if (errorCount > 0) {
            statusLine = `Bloqueado: ${errorCount} errores`;
          } else if (warningCount > 0) {
            statusLine = `Avisos: ${warningCount}`;
          }
          const metaLine = `${plateCount} platos | ${taskCount} tareas | ${teamCount} personas | ${resourceCount} recursos`;
          let detailLine = '';
          if (diagnostics.unassignedTasks) {
            detailLine = `Hay tareas sin asignar (${diagnostics.unassignedTasks})`;
          } else if (diagnostics.missingDurations) {
            detailLine = `Hay tareas sin duracion (${diagnostics.missingDurations})`;
          } else if (diagnostics.missingResources?.length) {
            detailLine = `Faltan recursos (${diagnostics.missingResources.length})`;
          }
          const showReview = Boolean(detailLine);
          aiSummaryEl.innerHTML = `
            <div class="summary-status">${statusLine}</div>
            <div class="summary-meta">${metaLine}</div>
            ${detailLine ? `<div class="summary-meta">${detailLine}</div>` : ''}
            ${showReview ? '<button class="btn ghost mini-btn" data-action="review">Ver</button>' : ''}
          `;
        }

        function checkPlanInvariants(planToCheck) {
          const errors = [];
          const warnings = [];
          if (!planToCheck) {
            errors.push('Plan no inicializado.');
            return { errors, warnings };
          }
          const tasks = planToCheck.tasks || planToCheck.tareas;
          const team = planToCheck.team || planToCheck.equipo;
          const resources = planToCheck.resources?.items || planToCheck.recursos;
          const phases = planToCheck.phases || planToCheck.fases || [];
          const phaseActive = planToCheck.phaseActive || planToCheck.faseActiva;

          if (!Array.isArray(tasks)) {
            errors.push('Tareas no es un array.');
          }
          if (!Array.isArray(team)) {
            errors.push('Equipo no es un array.');
          }
          if (!Array.isArray(resources)) {
            errors.push('Recursos no es un array.');
          }
          if (!Array.isArray(phases) || !phases.length) {
            errors.push('Fases no es un array valido.');
          } else if (!phases.includes(phaseActive)) {
            errors.push('Fase activa fuera de fases disponibles.');
          }

          const teamIds = new Set((team || []).map((person) => person.id));
          const resourceIds = new Set((resources || []).map((resource) => resource.id));
          const resourceTypeKeys = new Set(
            (resources || []).map((resource) =>
              normalizeResourceName(resource.typeKey || resource.nombre || resource.id)
            )
          );
          resourceIds.forEach((id) => resourceTypeKeys.add(id));

          (resources || []).forEach((resource) => {
            const capacity = Number(resource.capacity ?? resource.capacidad);
            if (!Number.isFinite(capacity)) {
              errors.push(`Capacidad no valida en recurso ${resource.name || resource.nombre || resource.id}.`);
            }
          });

          (tasks || []).forEach((task) => {
            const duration = Number(task.durationMin ?? task.duracion_min);
            if (!Number.isFinite(duration) || duration <= 0) {
              errors.push(`Duracion no valida en tarea ${task.titleShort || task.nombre || task.id}.`);
            }
            const assignedId = task.assignedToId || task.asignado_a_id;
            if (assignedId && !teamIds.has(assignedId)) {
              errors.push(`Asignado inexistente en tarea ${task.titleShort || task.nombre || task.id}.`);
            }
            const resourceId = task.resourceId || task.recurso_id;
            const resourceTypeKey = normalizeResourceName(task.resourceTypeKey || resourceId || '');
            if (resourceTypeKey && !resourceTypeKeys.has(resourceTypeKey) && !resourceIds.has(resourceId)) {
              warnings.push(`Tipo de recurso no disponible en ${task.titleShort || task.nombre || task.id}.`);
            }
            if (task.resourceTypeKey && normalizeResourceName(task.resourceTypeKey) !== task.resourceTypeKey) {
              warnings.push(`resourceTypeKey no normalizado en ${task.titleShort || task.nombre || task.id}.`);
            }
          });

          return { errors, warnings };
        }

        function runSmokeTests() {
          const results = [];
          const addResult = (label, ok, detail = '') => {
            results.push({ label, ok, detail });
          };
          addResult(
            'wiring',
            Boolean(dropZoneEl && pdfInputEl && parseTextBtn && bulkResolveBtn && startServiceBtn),
            'botones clave'
          );
          addResult('dropzone', Boolean(dropZoneEl && pdfInputEl), 'click + drop');
          addResult('parse', Array.isArray(plan?.tareas) && plan.tareas.length > 0, 'plan con tareas');
          const invariantState = checkPlanInvariants(plan);
          addResult('validate', invariantState.errors.length === 0, `errores: ${invariantState.errors.length}`);
          addResult(
            'autoFix',
            typeof fillMissingDurations === 'function' && typeof assignResourcesByHeuristic === 'function',
            'funciones disponibles'
          );

          let autoAssignOk = true;
          let autoAssignDetail = 'sin prueba';
          if (plan && (plan.tareas || []).length && (plan.equipo || []).length > 1) {
            const snapshot = serializePlan(plan);
            const prevPlan = plan;
            try {
              plan = normalizePlan(snapshot);
              syncMaps();
              autoAssignBalanced({ phaseOnly: false, respectLocked: true, onlyUnassigned: true });
              const totals = {};
              let totalMinutes = 0;
              plan.tareas.forEach((task) => {
                const assigned = task.asignado_a_id;
                const duration = Math.max(1, Number(task.duracion_min) || 1);
                totalMinutes += duration;
                if (!assigned) {
                  return;
                }
                totals[assigned] = (totals[assigned] || 0) + duration;
              });
              const maxShare =
                totalMinutes > 0 ? Math.max(0, ...Object.values(totals).map((value) => value / totalMinutes)) : 0;
              autoAssignOk = maxShare <= 0.8;
              autoAssignDetail = `max share ${(maxShare * 100).toFixed(0)}%`;
            } catch (error) {
              autoAssignOk = false;
              autoAssignDetail = 'error en autoasignacion';
            } finally {
              plan = prevPlan;
              syncMaps();
            }
          }
          addResult('autoAssign', autoAssignOk, autoAssignDetail);

          const activePhase = getActivePhaseId();
          const hasOtherPhases = (plan?.tareas || []).some((task) => task.fase !== activePhase);
          addResult('linea-fase', Boolean(activePhase) && lineColumnsEl, hasOtherPhases ? 'filtrado activo' : 'fase unica');

          state.smokeResults = results;
          return results;
        }

        function runResourceSmokeTest() {
          if (!state.debugEnabled) {
            return null;
          }
          const result = { ok: true, detail: 'ok' };
          const prevPlan = plan;
          try {
            const testPlan = normalizePlan({
              name: 'Resource Smoke',
              fases: PHASES,
              recursos: [
                { id: 'HORNO', nombre: 'Horno', capacidad: 1, typeKey: 'HORNO', tipo: 'COCCION' },
                { id: 'FOGONES', nombre: 'Fogones', capacidad: 2, typeKey: 'FOGONES', tipo: 'COCCION' },
                { id: 'ESTACION', nombre: 'Estacion', capacidad: 1, typeKey: 'ESTACION', tipo: 'PREP' },
                { id: 'FREGADERO', nombre: 'Fregadero', capacidad: 1, typeKey: 'FREGADERO', tipo: 'LIMPIEZA' }
              ],
              equipo: [],
              tareas: [
                { id: 'T1', plato: 'Test', nombre: 'lavar', fase: 'MISE_EN_PLACE', proceso: 'LAVAR', duracion_min: 5, estado: 'PENDIENTE' },
                { id: 'T2', plato: 'Test', nombre: 'cortar', fase: 'MISE_EN_PLACE', proceso: 'CORTAR', duracion_min: 5, estado: 'PENDIENTE' },
                { id: 'T3', plato: 'Test', nombre: 'saltear', fase: 'PREELABORACION', proceso: 'SALTEAR', duracion_min: 8, estado: 'PENDIENTE' },
                { id: 'T4', plato: 'Test', nombre: 'hornear', fase: 'PREELABORACION', proceso: 'HORNEAR', duracion_min: 30, estado: 'PENDIENTE' },
                { id: 'T5', plato: 'Test', nombre: 'emplatar', fase: 'SERVICIO', proceso: 'EMPLATAR', duracion_min: 4, estado: 'PENDIENTE' },
                { id: 'T6', plato: 'Test', nombre: 'freir', fase: 'PREELABORACION', proceso: 'FREIR', duracion_min: 6, estado: 'PENDIENTE' }
              ]
            });
            plan = testPlan;
            syncMaps();
            assignResourcesByHeuristic({ silent: true });
            const failures = [];
            plan.tareas.forEach((task) => {
              const expected = getExpectedResourceForProcess(task.proceso, plan.recursos);
              if (!expected.needs) {
                return;
              }
              const assignedId = task.recurso_id || null;
              const assignedTypeKey = normalizeResourceName(task.resourceTypeKey || assignedId || '');
              if (!assignedId || !assignedTypeKey || (expected.typeKey && expected.typeKey !== assignedTypeKey)) {
                failures.push(`${task.proceso}:${expected.typeKey || '-'}`);
              }
            });
            result.ok = failures.length === 0;
            result.detail = failures.length ? `fail ${failures.length}` : 'ok';
          } catch (error) {
            result.ok = false;
            result.detail = error && error.message ? error.message : 'error';
          } finally {
            plan = prevPlan;
            syncMaps();
          }
          return result;
        }


        let parserFixturesRequested = false;

        function ensureParserFixturesLoaded() {
          if (parserFixturesRequested || typeof document === 'undefined') {
            return;
          }
          if (window.PARSER_FIXTURES && Array.isArray(window.PARSER_FIXTURES)) {
            return;
          }
          parserFixturesRequested = true;
          try {
            const script = document.createElement('script');
            script.src = 'parser_fixtures.js';
            script.async = true;
            script.onload = () => {
              if (state.debugEnabled) {
                updateDebugText();
              }
            };
            script.onerror = () => {
              if (state.debugEnabled) {
                console.warn('[parser fixtures] no se pudo cargar parser_fixtures.js');
              }
            };
            document.head.appendChild(script);
          } catch (error) {
            if (state.debugEnabled) {
              console.warn('[parser fixtures] error al cargar fixtures', error);
            }
          }
        }

        function runParserSmokeTests() {
          ensureParserFixturesLoaded();
          const fixtures = Array.isArray(window.PARSER_FIXTURES) ? window.PARSER_FIXTURES : [];
          const results = [];
          if (!fixtures.length) {
            results.push({ id: 'fixtures', ok: false, detail: 'sin fixtures' });
            return results;
          }
          fixtures.forEach((fixture) => {
            let ok = true;
            let detail = '';
            try {
              const menuIR = buildMenuIRFromRawText(fixture.text || '', { source: 'fixture', id: fixture.id });
              const built = menuIRToPlan(menuIR, [], []);
              let planBuilt = built?.plan || null;
              let plateCount = menuIR?.platos?.length || 0;
              if (!plateCount || !(planBuilt?.tareas || []).length) {
                const draft = parseMenuDraft(fixture.text || '');
                const fallback = buildPlanFromDraft(draft);
                planBuilt = fallback?.plan || planBuilt;
                plateCount = draft?.platos?.length || plateCount;
              }
              const taskCount = planBuilt?.tareas?.length || 0;
              const phases = new Set((planBuilt?.tareas || []).map((task) => task.fase));
              const expect = fixture.expect || {};
              const platesOk = plateCount >= (expect.platesMin || 1);
              const tasksOk = taskCount >= (expect.tasksMin || 1);
              const phasesOk = phases.size >= (expect.phasesMin || 1);
              ok = platesOk && tasksOk && phasesOk;
              detail = `platos ${plateCount} tareas ${taskCount} fases ${phases.size}`;
            } catch (error) {
              ok = false;
              detail = error && error.message ? error.message : 'error';
            }
            results.push({ id: fixture.id, ok, detail });
          });
          return results;
        }
        function updateDebugText() {
          const show = debugToggleEl.checked;
          debugPanelEl.classList.toggle('show', show);
          if (!show) {
            debugTextEl.value = '';
            if (smokeResultsEl) {
              smokeResultsEl.textContent = '';
            }
            return;
          }
          const smoke = runSmokeTests();
          const parserSmoke = runParserSmokeTests();
          const resourceSmoke = runResourceSmokeTest();
          const blockSummary = summarizeTaskBlocks();
          if (smokeResultsEl) {
            const lines = smoke
              .map(
                (item) =>
                  `${item.ok ? '[OK]' : '[FAIL]'} ${item.label}${item.detail ? `: ${item.detail}` : ''}`
              );
            if (parserSmoke && parserSmoke.length) {
              lines.push('--- PARSER FIXTURES ---');
              parserSmoke.forEach((item) => {
                lines.push(`${item.ok ? '[OK]' : '[FAIL]'} ${item.id}${item.detail ? `: ${item.detail}` : ''}`);
              });
            }
            if (resourceSmoke) {
              lines.push(`resource-assign: ${resourceSmoke.ok ? 'OK' : 'FAIL'}${resourceSmoke.detail ? ` (${resourceSmoke.detail})` : ''}`);
            }
            smokeResultsEl.textContent = lines.join('\n');
          }
          const lines = menuDraft?.lines || [];
          const preview = lines
            .slice(0, 30)
            .map((line, index) => `${String(index + 1).padStart(2, '0')}: ${line}`)
            .join('\n');
          const draftJson = menuDraft ? JSON.stringify(menuDraft, null, 2) : '{}';
          const menuIrJson = appState.menuIR ? JSON.stringify(appState.menuIR, null, 2) : '{}';
          const menuIrDiag = appState.menuIR?.parseDiagnostics || {};
          const diagnosticsJson = JSON.stringify(state.diagnostics || emptyDiagnostics(), null, 2);
          const invariantState = state.invariants || { errors: [], warnings: [] };
          debugTextEl.value = [
            `CHARS: ${(pdfState.text || '').length}`,
            `LINES: ${lines.length}`,
            `PLATOS: ${menuDraft?.platos?.length || 0}`,
            `IR_PLATOS: ${appState.menuIR?.platos?.length || 0}`,
            `IR_PROCESOS: ${menuIrDiag.processCount || 0}`,
            `IR_INFERIDOS: ${menuIrDiag.inferredCount || 0}`,
            `IR_CONF: ${Number(menuIrDiag.confidenceAvg || 0).toFixed(2)}`,
            `TAREAS: ${plan?.tareas?.length || 0}`,
            `SIN_ASIGNAR: ${state.diagnostics?.unassignedTasks || 0}`,
            `EXECUTABLES: ${blockSummary.executable}/${blockSummary.total}`,
            `BLOCKED_RESOURCE: ${blockSummary.blockedByResource}`,
            `BLOCKED_PERSON: ${blockSummary.blockedByPerson}`,
            `BLOCKED_EXAMPLES: ${(blockSummary.examples || []).join(' | ') || 'n/a'}`,
            `DURACIONES_INFERIDAS: ${state.diagnostics?.missingDurations || 0}`,
            `WARNINGS: ${validationState.warnings.length}`,
            `ERRORS: ${validationState.errors.length}`,
            `INVARIANT_ERRORS: ${invariantState.errors.length}`,
            `INVARIANT_WARNINGS: ${invariantState.warnings.length}`,
            '--- PRIMERAS LINEAS ---',
            preview || 'Sin lineas',
            '--- MENUDRAFT ---',
            draftJson,
            '--- MENU_IR ---',
            menuIrJson,
            '--- DIAGNOSTICS ---',
            diagnosticsJson
          ].join('\n');
        }

      function validatePlan(planToCheck) {
        if (planToCheck?.isEmpty) {
          return { errors: [], warnings: [] };
        }
        const errors = [];
        const warnings = [];
        const resources = planToCheck.resources?.items || planToCheck.recursos || [];
        const tasks = planToCheck.tasks || planToCheck.tareas || [];
        const resourceSet = new Set(resources.map((resource) => resource.id));
        const resourceTypeKeys = new Set(
          resources.map((resource) => resource.typeKey || normalizeResourceName(resource.name || resource.nombre || resource.id))
        );
        resourceSet.forEach((id) => resourceTypeKeys.add(id));
        const tasksByDish = {};

        const addIssue = (list, severity, message, entityType = 'global', entityId = null, field = null) => {
          const id = makeIdFromName(`${severity}_${entityType}_${entityId || message}`.slice(0, 80), 'ISSUE');
          list.push({ id, severity, message, entityType, entityId, field });
        };
        if (!tasks.length) {
          addIssue(
            errors,
            'error',
            'No se detectaron platos/tareas. Revisa el formato del menu o pega el texto manualmente.',
            'global',
            'plan',
            'tasks'
          );
        }

        resources.forEach((resource) => {
          if (sanitizeInt(resource.capacity ?? resource.capacidad, 0) <= 0) {
            addIssue(
              errors,
              'error',
              `Recurso sin capacidad: ${resource.name || resource.nombre || resource.id}.`,
              'resource',
              resource.id,
              'capacity'
            );
          }
        });

        const dishCounts = {};
        tasks.forEach((task) => {
          const taskName = task.titleFull || task.label_full || task.nombre || task.titleShort || 'tarea';
          const dish = task.dish || task.plato || 'Plato';
          dishCounts[dish] = (dishCounts[dish] || 0) + 1;
          tasksByDish[dish] = tasksByDish[dish] || [];
          tasksByDish[dish].push(task);

          if (taskName.length > 70) {
            addIssue(warnings, 'warning', `Nombre demasiado largo: ${taskName}.`, 'task', task.id, 'titleFull');
          }
          if (/(preparar|cocinar|hacer plato)/i.test(taskName)) {
            addIssue(warnings, 'warning', `Tarea demasiado generica: ${taskName}.`, 'task', task.id, 'titleFull');
          }
          const processKey = task.processKey || task.proceso;
          if (!PROCESS_TYPES.includes(processKey)) {
            addIssue(errors, 'error', `Proceso invalido en tarea: ${taskName}.`, 'task', task.id, 'processKey');
          }
          if (BANNED_WORDS.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(taskName))) {
            addIssue(errors, 'error', `Nombre invalido (metadata) en tarea: ${taskName}.`, 'task', task.id, 'titleFull');
          }
          if (sanitizeNumber(task.durationMin ?? task.duracion_min, 0) <= 0) {
            addIssue(errors, 'error', `Duracion invalida en tarea: ${taskName}.`, 'task', task.id, 'durationMin');
          }
          const assignedId = task.resourceId || task.recurso_id || null;
          const assignedTypeKey = normalizeResourceName(task.resourceTypeKey || assignedId || '');
          if (assignedId || assignedTypeKey) {
            const hasResource =
              (assignedId && resourceSet.has(assignedId)) ||
              (assignedTypeKey && resourceTypeKeys.has(assignedTypeKey));
            if (!hasResource) {
              addIssue(
                errors,
                'error',
                `Recurso desconocido en tarea: ${taskName}.`,
                'task',
                task.id,
                'resourceTypeKey'
              );
            }
          }
          const expected = getExpectedResourceForProcess(processKey, resources);
          if (expected.needs && !expected.missing) {
            if (assignedTypeKey && expected.typeKey && assignedTypeKey !== expected.typeKey) {
              if (processKey === 'FREIR') {
                addIssue(errors, 'error', `Fritura sin fogones: ${taskName}.`, 'task', task.id, 'resourceTypeKey');
              } else {
                addIssue(warnings, 'warning', `Recurso no coincide con proceso: ${taskName}.`, 'task', task.id, 'resourceTypeKey');
              }
            }
          }
          if (expected.needs && expected.missing) {
            addIssue(
              warnings,
              'warning',
              `Recurso faltante para proceso ${processKey}: ${taskName}.`,
              'task',
              task.id,
              'resourceTypeKey'
            );
          }
          if (
            sanitizeNumber(task.durationMin ?? task.duracion_min, 0) > 60 &&
            assignedTypeKey !== 'HORNO' &&
            !/(reposo|enfriar)/i.test(taskName)
          ) {
            addIssue(warnings, 'warning', `Duracion alta para tarea manual: ${taskName}.`, 'task', task.id, 'durationMin');
          }
          const deps = task.dependsOn || task.depende_de || [];
          deps.forEach((depId) => {
            if (!tasks.find((item) => item.id === depId)) {
              addIssue(errors, 'error', `Dependencia inexistente: ${taskName} -> ${depId}.`, 'task', task.id, 'dependsOn');
            }
          });
        });

        Object.entries(dishCounts).forEach(([dish, count]) => {
          if (count < 4) {
            addIssue(warnings, 'warning', `Plato con pocas tareas: ${dish}.`, 'task', dish, 'dish');
          }
        });

        Object.entries(tasksByDish).forEach(([dish, dishTasks]) => {
          const patternMatch = findPatternForDish(dish);
          const hasProcess = (process) => dishTasks.some((task) => (task.processKey || task.proceso) === process);
          if (patternMatch?.procesos_obligatorios?.length) {
            patternMatch.procesos_obligatorios.forEach((process) => {
              if (!hasProcess(process)) {
                addIssue(warnings, 'warning', `Proceso obligatorio ${process} ausente en ${dish}.`, 'task', dish, 'processKey');
              }
            });
            return;
          }
          const pattern = detectDishPattern(dish);
          if (pattern === 'CROQUETAS' && !hasProcess('FREIR')) {
            addIssue(warnings, 'warning', `Croquetas sin fritura: ${dish}.`, 'task', dish, 'processKey');
          }
          if (pattern === 'FLAN' && !hasProcess('BANO_MARIA')) {
            addIssue(warnings, 'warning', `Flan sin bano maria: ${dish}.`, 'task', dish, 'processKey');
          }
          if (pattern === 'AL_HORNO' && !hasProcess('HORNEAR')) {
            addIssue(warnings, 'warning', `Plato al horno sin horneado: ${dish}.`, 'task', dish, 'processKey');
          }
          if (pattern === 'EMPANADILLAS' && !hasProcess('FREIR') && !hasProcess('HORNEAR')) {
            addIssue(warnings, 'warning', `Empanadillas sin metodo definido: ${dish}.`, 'task', dish, 'processKey');
          }
        });

        const graph = Object.fromEntries(tasks.map((task) => [task.id, task.dependsOn || task.depende_de || []]));
        const visiting = new Set();
        const visited = new Set();

        function dfs(node) {
          if (visiting.has(node)) {
            return true;
          }
          if (visited.has(node)) {
            return false;
          }
          visiting.add(node);
          const deps = graph[node] || [];
          for (const dep of deps) {
            if (dfs(dep)) {
              return true;
            }
          }
          visiting.delete(node);
          visited.add(node);
          return false;
        }

        for (const node of Object.keys(graph)) {
          if (dfs(node)) {
            addIssue(errors, 'error', 'Ciclo detectado en dependencias.', 'global', 'dependencias');
            break;
          }
        }

        return { errors, warnings };
      }

      function pruneInvalidTeam() {
        const removed = [];
        const cleaned = [];
        plan.equipo.forEach((person) => {
          if (isInvalidPersonName(person.nombre)) {
            removed.push(person);
          } else {
            cleaned.push(person);
          }
        });
        if (removed.length) {
          const removedIds = new Set(removed.map((person) => person.id));
          plan.equipo = cleaned;
          plan.tareas.forEach((task) => {
            if (removedIds.has(task.asignado_a_id)) {
              task.asignado_a_id = null;
            }
          });
          syncMaps();
        }
        return removed;
      }

        function isPersistentQuestion(question) {
          return ['ADD_RESOURCE', 'CROQUETAS_TIPO', 'FLAN_TIPO'].includes(question.tipo);
        }

        function pruneQuestions() {
          const hasTask = (taskId) => plan.tareas.some((task) => task.id === taskId);
          const isTimeQuestion = (question) =>
            /^TIME-/.test(question.id || '') || /tiempo estimado/i.test(question.pregunta || '');
          const filterList = (list) =>
            (list || []).filter((question) => {
              if (isTimeQuestion(question)) {
                return false;
              }
              if (isPersistentQuestion(question)) {
                return true;
              }
              const targets = question.afecta_a || [];
              return targets.some((taskId) => hasTask(taskId));
            });
          plan.preguntas_rapidas = filterList(plan.preguntas_rapidas);
          plan.preguntas_guiadas = prioritizeQuestions(filterList(plan.preguntas_guiadas));
        }

        function analyzePlan(planToCheck, draft, removed) {
          const validation = validatePlan(planToCheck);
          const validationErrors = validation.errors.map((issue) => issue.message);
          const validationWarnings = validation.warnings.map((issue) => issue.message);
          const assignment = validateAssignments(planToCheck);
          const resourceSet = new Set((planToCheck.recursos || []).map((resource) => resource.id));
          const resourceWarnings = (planToCheck?.advertencias_de_recursos || draft?.suggestions || []).filter(
            (message) => {
              const match = message.match(/Recurso sugerido:\s*(.+)$/i);
              if (!match) {
                return true;
              }
              const resourceId = normalizeResourceId(match[1]);
              return resourceId && !resourceSet.has(resourceId);
            }
          );
          const uncertaintyWarnings = (planToCheck?.incertidumbres_detectadas || []).map(
            (item) => `Hipotesis: ${item}`
          );
          const removalWarnings = removed?.length
            ? [
                `Se descarto un miembro invalido detectado como recurso: ${removed
                  .map((person) => person.nombre)
                  .join(', ')}.`
              ]
            : [];
          const errors = validationErrors.concat(assignment.errors);
          const warnings = validationWarnings.concat(
            assignment.warnings,
            resourceWarnings,
            uncertaintyWarnings,
            removalWarnings
          );
          const diagnostics = buildDiagnostics(planToCheck, errors, warnings, draft);
        const issues = getBlockingIssues(planToCheck);
        return { errors, warnings, diagnostics, issues };
      }

        function validateAndStore() {
          if (plan?.isEmpty) {
            state.diagnostics = emptyDiagnostics();
            state.issues = [];
            validationState.errors = [];
            validationState.warnings = [];
            state.invariants = { errors: [], warnings: [] };
            if (state.approved) {
              state.approved = false;
              state.planReady = false;
            }
            return;
          }
          const removed = pruneInvalidTeam();
          pruneQuestions();
          applyAutoFixes(plan);
          const analysis = analyzePlan(plan, menuDraft, removed);
          state.diagnostics = analysis.diagnostics;
          state.issues = analysis.issues || [];
          validationState.errors = state.issues
            .filter((issue) => issue.severity === 'error')
            .map((issue) => issue.messageHumano);
          validationState.warnings = state.issues
            .filter((issue) => issue.severity === 'warning')
            .map((issue) => issue.messageHumano);
          state.invariants = state.debugEnabled ? checkPlanInvariants(plan) : { errors: [], warnings: [] };
          if (state.debugEnabled) {
            if (analysis.errors.length) {
              console.warn('Errores plan', analysis.errors);
            }
            if (analysis.warnings.length) {
              console.debug('Warnings plan', analysis.warnings);
            }
            if (state.diagnostics.fixes.length) {
              console.debug('Fixes aplicados', state.diagnostics.fixes);
            }
            if (state.invariants.errors.length || state.invariants.warnings.length) {
              console.warn('Invariants', state.invariants);
            }
          }
          if (validationState.errors.length) {
            state.approved = false;
            state.planReady = false;
          }
          saveLastPlan();
        }

      function updatePdfStatus() {
        if (!pdfStatusEl) {
          return;
        }
        if (!pdfState.name) {
          pdfStatusEl.textContent = pdfState.status;
        } else {
          const sizeKb = Math.round(pdfState.size / 1024);
          pdfStatusEl.textContent = `Archivo: ${pdfState.name} | Tamano: ${sizeKb} KB | Estado: ${pdfState.status}`;
        }
        if (pdfErrorPanelEl) {
          const hasError = Boolean(appState.lastPdfError);
          pdfErrorPanelEl.style.display = hasError ? '' : 'none';
          if (!hasError) {
            pdfErrorPanelEl.open = false;
          }
        }
        if (pdfErrorTextEl) {
          pdfErrorTextEl.textContent = appState.lastPdfError ? String(appState.lastPdfError) : '';
        }
      }

      async function extractPdfText(file) {
        if (!window.pdfjsLib) {
          return { text: '', error: 'Lector PDF no disponible.' };
        }
        if (!pdfWorkerReady) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          pdfWorkerReady = true;
        }
        const data = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data }).promise;
        let fullText = '';
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const text = content.items.map((item) => item.str).join(' ');
          fullText += `${text}\n`;
        }
        return { text: fullText.trim(), error: null };
      }
            function processMenuText(text) {
        const normalizedText = normalizeText(text);
        const normalizedForMatch = normalizeToken(normalizedText);
        const { lines, baseLineCount, fallbackUsed } = normalizeLines(normalizedText);
        const cleanedLines = stripRepeatedHeaders(lines);
        const sectionItems = cleanedLines.map((line) => ({
          text: line,
          notes: isTrashLine(line) ? ['trash'] : []
        }));
        const effectiveLines = cleanedLines.filter((line) => !isTrashLine(line));
        const parseLines = effectiveLines.length ? effectiveLines : cleanedLines;
        let draft = null;
        let result = null;
        let menuIR = null;

        if (state.debugEnabled) {
          console.debug('[processMenuText] start', { chars: (text || '').length });
        }

        try {
          menuIR = buildMenuIRFromRawText(text, appState.menuRawTextSource || null);
          appState.menuIR = menuIR;
          if (state.debugEnabled && menuIR) {
            console.debug('[menuIR] platos', menuIR.platos?.length || 0, menuIR.parseDiagnostics || {});
          }
        } catch (error) {
          if (state.debugEnabled) {
            console.warn('[processMenuText] Error buildMenuIRFromRawText', error);
          }
          appState.menuIR = null;
        }

        if (menuIR) {
          try {
            const built = menuIRToPlan(menuIR, plan?.recursos || [], plan?.equipo || []);
            draft = built.draft;
            result = { plan: built.plan, suggestions: built.suggestions || [] };
          } catch (error) {
            if (state.debugEnabled) {
              console.warn('[processMenuText] Error menuIRToPlan', error);
            }
          }
        }

        if (!result) {
          try {
            draft = parseMenuDraft(text);
            if (state.debugEnabled && draft && Array.isArray(draft.platos)) {
              const sample = draft.platos.slice(0, 2).map((plato) => ({
                nombre: plato?.nombre || '',
                procesos: plato?.procesos || [],
                recursos_hint: plato?.recursos_hint || [],
                pax: plato?.pax || null,
                ingredientes: Array.isArray(plato?.ingredientes) ? plato.ingredientes.length : 0
              }));
              console.debug('[processMenuText] platos', draft.platos.length, sample);
            }
          } catch (error) {
            if (state.debugEnabled) {
              console.warn('[processMenuText] Error en parseMenuDraft', error);
            }
          }

          if (!draft || !Array.isArray(draft.platos)) {
            draft = {
              rawText: text,
              normalizedText,
              rawTextLength: String(text || '').length,
              normalizedTextLength: normalizedText.length,
              platos: [],
              comensales: detectComensales(normalizedForMatch),
              fecha: detectDate(normalizedText),
              recursos: parseResourcesFromText(normalizedForMatch),
              equipo: parseTeamFromLines(lines),
              lineCount: lines.length,
              baseLineCount,
              fallbackUsed,
              lines
            };
          }

          try {
            result = buildPlanFromDraft(draft);
          } catch (error) {
            if (state.debugEnabled) {
              console.warn('[processMenuText] Error en buildPlanFromDraft', error);
            }
            const fallbackPlan = {
              meta: {
                titulo: 'Menu importado',
                comensales: draft?.comensales || null,
                notas: null,
                parseErrorCode: 'PARSE_FAILED_NO_TASKS',
                parseErrorMessage: 'No se detectaron platos/tareas. Revisa el formato del menu o pega el texto manualmente.',
                parseStatus: 'BLOCKER'
              },
              equipo: draft?.equipo && draft.equipo.length ? deepClone(draft.equipo) : [],
              recursos: draft?.recursos && draft.recursos.length ? deepClone(draft.recursos) : [],
              fases: [...PHASES],
              tareas: [],
              preguntas_rapidas: [],
              preguntas_guiadas: [],
              fix_events: [],
              incertidumbres_detectadas: [],
              advertencias_de_recursos: [],
              resumen_estilos_aplicados: [...DEFAULT_STYLES]
            };
            result = { plan: fallbackPlan, suggestions: [] };
          }
        }

        draft.suggestions = result.suggestions || [];
        draft.incertidumbres_detectadas = result.plan.incertidumbres_detectadas || [];
        draft.preguntas_guiadas = result.plan.preguntas_guiadas || [];
        draft.advertencias_de_recursos = result.plan.advertencias_de_recursos || [];
        draft.resumen_estilos_aplicados = result.plan.resumen_estilos_aplicados || [];

        const minTasks = Array.isArray(draft.platos) ? draft.platos.length * 3 : 0;
        const totalTasks = result.plan?.tareas?.length || 0;
        if (minTasks > 0 && totalTasks < minTasks) {
          const warning = `Tareas insuficientes: ${totalTasks} para ${draft.platos.length} platos.`;
          result.plan.incertidumbres_detectadas = Array.from(
            new Set([...(result.plan.incertidumbres_detectadas || []), warning])
          );
          draft.incertidumbres_detectadas = Array.from(
            new Set([...(draft.incertidumbres_detectadas || []), warning])
          );
        }
        if (state.debugEnabled) {
          const sampleTasks = (result.plan?.tareas || []).slice(0, 5).map((task) => ({
            nombre: task?.nombre || '',
            plato: task?.plato || '',
            proceso: task?.proceso || '',
            fase: task?.fase || '',
            recurso: task?.recurso_id || ''
          }));
          console.debug('[processMenuText] tareas', { total: totalTasks, sample: sampleTasks });
        }

        const summary = draft.platos && draft.platos.length
          ? (result.plan?.incertidumbres_detectadas || []).some((item) =>
            String(item || '').includes('Tareas insuficientes')
          )
            ? 'Menu interpretado (tareas insuficientes).'
            : 'Menu interpretado.'
          : 'Menu interpretado (sin platos detectados).';
        setPlan(result.plan, draft, summary, result.plan.preguntas_rapidas);

        try {
          const baseName = deriveRecipeName(result.plan?.name || result.plan?.meta?.titulo || pdfState.name || '');
          const recipe = addRecipe(createRecipeFromPlan(plan, { name: baseName }));
          if (recipe && recipe.id) {
            state.activeRecipeId = recipe.id;
            localStorage.setItem(RECIPE_ACTIVE_KEY, recipe.id);
          }
        } catch (error) {
          if (state.debugEnabled) {
            console.warn('[processMenuText] Error guardando receta', error);
          }
        }

        goToView('prep', { replace: true });
        updateDebugText();
        if (state.debugEnabled) {
          console.debug('[processMenuText] end', {
            tasks: plan?.tareas?.length || 0,
            resources: plan?.recursos?.length || 0,
            team: plan?.equipo?.length || 0
          });
        }
        return draft;
      }
async function handlePdfFile(file) {
        if (!file) {
          return;
        }
        const isPdfFile =
          file.type === 'application/pdf' ||
          (file.name && String(file.name).toLowerCase().endsWith('.pdf'));
        if (!isPdfFile) {
          pdfState.status = 'No es un PDF valido. Puedes pegar el texto manualmente.';
          pdfState.name = file.name;
          pdfState.size = file.size;
          appState.lastPdfError = `Tipo de archivo no valido: ${file.type || 'desconocido'}`;
          updatePdfStatus();
          setState({ manualTextOpen: true });
          goToView('prep', { scrollToUpload: true, focusManual: true });
          return;
        }
        pdfState.name = file.name;
        pdfState.size = file.size;
        pdfState.status = 'Leyendo...';
        appState.lastPdfError = null;
        updatePdfStatus();

        try {
          const result = await extractPdfText(file);
          if (result.error) {
            pdfState.status = 'No pude leer el PDF. Puedes pegar el texto manualmente.';
            appState.lastPdfError = result.error;
            updatePdfStatus();
            setState({ manualTextOpen: true });
            goToView('prep', { scrollToUpload: true, focusManual: true });
            return;
          }
          pdfState.text = result.text;
          appState.menuRawText = result.text;
          appState.menuRawTextSource = { type: 'pdf', name: file.name, size: file.size };
          updateDebugText();
          if (!result.text || result.text.length < 20) {
            pdfState.status = 'No pude extraer texto del PDF. Prueba otro o pega el texto manualmente.';
            appState.lastPdfError = 'Texto extraido vacio o demasiado corto.';
            updatePdfStatus();
            setState({ manualTextOpen: true });
            goToView('prep', { scrollToUpload: true, focusManual: true });
            return;
          }
          if (manualTextEl) {
            manualTextEl.value = result.text;
          }
          pdfState.status = 'Texto extraido. Interpretando...';
          updatePdfStatus();
          setState({ manualTextOpen: true });
          goToView('prep', { scrollToUpload: true, focusManual: true });
          try {
            processMenuText(result.text);
            pdfState.status = 'Menu interpretado.';
            appState.lastPdfError = null;
            updatePdfStatus();
            if (state.debugEnabled) {
              console.debug('[PDF] Interpretado', {
                chars: result.text.length,
                tasks: plan?.tareas?.length || 0,
                resources: plan?.recursos?.length || 0,
                team: plan?.equipo?.length || 0
              });
            }
          } catch (error) {
            pdfState.status = 'No pude interpretar el texto. Revisa el contenido e intentalo de nuevo.';
            appState.lastPdfError = error?.stack || error?.message || String(error);
            updatePdfStatus();
            if (state.debugEnabled) {
              console.warn('[PDF] Error interpretando', error);
            }
          }
        } catch (error) {
          pdfState.status = 'No pude leer el PDF. Puedes pegar el texto manualmente.';
          appState.lastPdfError = error?.stack || error?.message || String(error);
          updatePdfStatus();
          setState({ manualTextOpen: true });
          goToView('prep', { scrollToUpload: true, focusManual: true });
        }
      }

      function handleManualText() {
        if (!manualTextEl) {
          return;
        }
        const text = manualTextEl.value.trim();
        if (!text) {
          return;
        }
        pdfState.text = text;
        appState.menuRawText = text;
        appState.menuRawTextSource = { type: 'manual', name: pdfState.name || null };
        updateDebugText();
        try {
          processMenuText(text);
          pdfState.status = 'Texto manual interpretado.';
          appState.lastPdfError = null;
          updatePdfStatus();
        } catch (error) {
          pdfState.status = 'No pude interpretar el texto. Revisa el contenido e intentalo de nuevo.';
          appState.lastPdfError = error?.stack || error?.message || String(error);
          updatePdfStatus();
          if (state.debugEnabled) {
            console.warn('[Manual] Error interpretando', error);
          }
        }
      }

      function isBasicTask(task) {
        return /(lavar|pelar|limpiar|fregar)/i.test(task.nombre);
      }

      function isCriticalTask(task) {
        return /(salsa|punto|pase|reduccion|glasear|ajustar|emulsionar|final)/i.test(task.nombre);
      }

      function isDelicateTask(task) {
        return task.nivel_min >= 2 || /(ravioli|crepe|crepa|masa|risotto|salsa)/i.test(task.nombre);
      }

      function isOperationalTask(task) {
        return task.nivel_min === 1 || isBasicTask(task);
      }

      function isTechnicalTask(task) {
        return task.nivel_min === 2 || isDelicateTask(task);
      }

      function isAssignmentAllowed(task, person) {
        if (!person) {
          return false;
        }
        if (person.nivel < task.nivel_min) {
          return false;
        }
        if (person.restricciones?.solo_criticas && !isCriticalTask(task) && task.nivel_min < 3) {
          return false;
        }
        if (person.restricciones?.no_tareas_basicas && isBasicTask(task)) {
          return false;
        }
        if (person.restricciones?.no_fregadero && task.resourceTypeKey === 'FREGADERO') {
          return false;
        }
        if (person.restricciones?.no_delicado && isDelicateTask(task)) {
          return false;
        }
        return true;
      }

      function validateAssignments(planToCheck) {
        const errors = [];
        const warnings = [];
        planToCheck.tareas.forEach((task) => {
          if (!task.asignado_a_id) {
            warnings.push(`Tarea sin asignar: ${task.nombre}.`);
            return;
          }
          const person = planToCheck.equipo.find((item) => item.id === task.asignado_a_id);
          if (!person) {
            errors.push(`Persona asignada no existe: ${task.nombre}.`);
            return;
          }
          if (!isAssignmentAllowed(task, person)) {
            errors.push(`Asignacion invalida: ${task.nombre} -> ${person.nombre}.`);
          }
        });
        return { errors, warnings };
      }

      function dependenciesMet(task) {
        return task.depende_de.every((depId) => tareaById[depId]?.estado === 'FINALIZADA');
      }

      function getActiveTasks() {
        return plan.tareas.filter((task) => task.estado === 'EN_CURSO');
      }

      function isPersonAvailable(personId) {
        return !getActiveTasks().some((task) => task.asignado_a_id === personId);
      }

      function getResourceUsage() {
        const usage = {};
        const effective = getEffectiveResources();
        effective.list.forEach((resource) => {
          usage[resource.id] = { used: 0, capacity: resource.capacidad, tasks: [] };
        });
        getActiveTasks().forEach((task) => {
          if (!task.recurso_id) {
            return;
          }
          const slot = usage[task.recurso_id];
          if (slot) {
            slot.used += 1;
            slot.tasks.push(task);
          }
        });
        return usage;
      }

      function getResourceLabel(resourceId) {
        if (!resourceId) {
          return 'Ninguno';
        }
        return recursoById[resourceId]?.nombre || resourceId;
      }

      function isResourceAvailable(resourceId) {
        if (!resourceId) {
          return true;
        }
        const usage = getResourceUsage();
        const slot = usage[resourceId];
        if (!slot) {
          return false;
        }
        return slot.used < slot.capacity;
      }

      function canStartTask(task) {
        if (state.phaseStatus !== 'running' && state.phaseStatus !== 'overdue') {
          return false;
        }
        if (task.estado !== 'PENDIENTE') {
          return false;
        }
        if (task.fase !== getActivePhaseId()) {
          return false;
        }
        if (!dependenciesMet(task)) {
          return false;
        }
        if (!task.asignado_a_id) {
          return false;
        }
        const person = equipoById[task.asignado_a_id];
        if (!isAssignmentAllowed(task, person)) {
          return false;
        }
        if (!isPersonAvailable(task.asignado_a_id)) {
          return false;
        }
        const expected = getExpectedResourceForProcess(task.proceso, plan.recursos);
        if (
          expected.needs &&
          (!task.resourceTypeKey ||
            (expected.typeKey && task.resourceTypeKey !== expected.typeKey) ||
            !task.recurso_id)
        ) {
          return false;
        }
        if (!isResourceAvailable(task.recurso_id)) {
          return false;
        }
        return true;
      }

      function explainTaskBlocked(task) {
        const reasons = [];
        if (!task) {
          return reasons;
        }
        if (!task.asignado_a_id) {
          reasons.push('missing-person');
        }
        const expected = getExpectedResourceForProcess(task.proceso, plan.recursos);
        const assignedId = task.recurso_id || task.resourceId || null;
        const assignedTypeKey = normalizeResourceName(task.resourceTypeKey || assignedId || '');
        if (expected.needs) {
          if (!assignedId || !assignedTypeKey) {
            reasons.push('missing-resource');
          } else if (expected.typeKey && assignedTypeKey !== expected.typeKey) {
            reasons.push('resource-mismatch');
          }
          if (assignedId && !recursoById[assignedId]) {
            reasons.push('resource-invalid');
          } else if (assignedId && !isResourceAvailable(assignedId)) {
            reasons.push('resource-unavailable');
          }
        }
        return reasons;
      }

      function summarizeTaskBlocks() {
        const summary = {
          total: 0,
          executable: 0,
          blockedByResource: 0,
          blockedByPerson: 0,
          examples: []
        };
        if (!plan) {
          return summary;
        }
        const activePhase = getActivePhaseId();
        (plan.tareas || []).forEach((task) => {
          if (task.fase !== activePhase) {
            return;
          }
          if (task.estado && task.estado !== 'PENDIENTE') {
            return;
          }
          summary.total += 1;
          const reasons = explainTaskBlocked(task);
          if (!reasons.length) {
            summary.executable += 1;
            return;
          }
          if (reasons.includes('missing-person')) {
            summary.blockedByPerson += 1;
          }
          if (reasons.some((reason) => reason.indexOf('resource') === 0)) {
            summary.blockedByResource += 1;
          }
          if (summary.examples.length < 3) {
            const label = task.label_short || task.nombre || task.plato || task.id;
            summary.examples.push(`${label}: ${reasons.join(',')}`);
          }
        });
        return summary;
      }

      function startTask(task) {
        task.estado = 'EN_CURSO';
        task.startedAt = Date.now();
        task.justCompleted = false;
      }

      function completeTask(task) {
        task.estado = 'FINALIZADA';
        task.startedAt = null;
        task.justCompleted = true;
      }

      function autoStartTasks() {
        const activePhase = getActivePhaseId();
        const pending = plan.tareas
          .filter((task) => task.fase === activePhase && task.estado === 'PENDIENTE')
          .sort((a, b) => {
            const priorityDiff = (b.priorityScore || 0) - (a.priorityScore || 0);
            if (priorityDiff !== 0) {
              return priorityDiff;
            }
            return (a.duracion_min || 0) - (b.duracion_min || 0);
          });
        let started = false;
        pending.forEach((task) => {
          if (canStartTask(task)) {
            startTask(task);
            started = true;
          }
        });
        return started;
      }

      function maybeAutoAdvance() {
        if (state.phaseStatus !== 'running') {
          return;
        }
        if (state.phaseRemaining <= 0) {
          return;
        }
        const activePhase = getActivePhaseId();
        const phaseTasks = plan.tareas.filter((task) => task.fase === activePhase);
        if (phaseTasks.length && phaseTasks.every((task) => task.estado === 'FINALIZADA')) {
          advancePhase(true);
        }
      }

      function schedulePhase(phaseId) {
        const phaseTasks = plan.tareas.filter((task) => task.fase === phaseId);
        const taskById = Object.fromEntries(phaseTasks.map((task) => [task.id, task]));
        const depsMap = new Map();
        const dependentsMap = new Map();
        phaseTasks.forEach((task) => {
          const deps = task.depende_de.filter((depId) => tareaById[depId]?.fase === phaseId);
          depsMap.set(task.id, deps);
          deps.forEach((depId) => {
            if (!dependentsMap.has(depId)) {
              dependentsMap.set(depId, []);
            }
            dependentsMap.get(depId).push(task.id);
          });
        });

        const criticalCache = {};
        function computeCriticalPath(taskId) {
          if (criticalCache[taskId] !== undefined) {
            return criticalCache[taskId];
          }
          const children = dependentsMap.get(taskId) || [];
          const childMax = children.length
            ? Math.max(...children.map((childId) => computeCriticalPath(childId)))
            : 0;
          const duration = taskById[taskId]?.duracion_min || 0;
          const total = duration + childMax;
          criticalCache[taskId] = total;
          return total;
        }

        phaseTasks.forEach((task) => {
          const outDegree = (dependentsMap.get(task.id) || []).length;
          const critical = computeCriticalPath(task.id);
          task.priorityScore = critical + outDegree * 5;
        });

        const scheduled = new Set();
        const endTimes = {};
        const personReady = {};
        plan.equipo.forEach((person) => {
          personReady[person.id] = 0;
        });
        const resourceSlots = {};
        const effectiveResources = getEffectiveResources();
        effectiveResources.list.forEach((resource) => {
          const capacity = Math.max(0, sanitizeInt(resource.capacidad, 0));
          resourceSlots[resource.id] = Array(capacity).fill(0);
        });

        let rank = 0;
        let guard = 0;
        while (scheduled.size < phaseTasks.length && guard < phaseTasks.length * 4) {
          guard += 1;
          let ready = phaseTasks.filter(
            (task) =>
              !scheduled.has(task.id) && (depsMap.get(task.id) || []).every((depId) => scheduled.has(depId))
          );
          if (!ready.length) {
            ready = phaseTasks.filter((task) => !scheduled.has(task.id));
          }
          ready.sort((a, b) => {
            const priorityDiff = (b.priorityScore || 0) - (a.priorityScore || 0);
            if (priorityDiff !== 0) {
              return priorityDiff;
            }
            return b.duracion_min - a.duracion_min;
          });
          const task = ready[0];
          const deps = depsMap.get(task.id) || [];
          const depsEnd = deps.length ? Math.max(...deps.map((depId) => endTimes[depId] || 0)) : 0;
          const personId =
            task.asignado_a_id && equipoById[task.asignado_a_id] ? task.asignado_a_id : null;
          const personTime = personId ? personReady[personId] || 0 : 0;
          let resourceTime = 0;
          let resourceSlotIndex = null;
          if (task.recurso_id && resourceSlots[task.recurso_id]) {
            const slots = resourceSlots[task.recurso_id];
            if (!slots.length) {
              resourceTime = Infinity;
            } else {
              resourceTime = Math.min(...slots);
              resourceSlotIndex = slots.indexOf(resourceTime);
            }
          }
          const start = Math.max(depsEnd, personTime, resourceTime);
          const end = start + task.duracion_min;
          task.planRank = rank;
          task.planStart = start;
          task.planEnd = end;
          endTimes[task.id] = end;
          if (personId) {
            personReady[personId] = end;
          }
          if (
            task.recurso_id &&
            resourceSlots[task.recurso_id] &&
            resourceSlotIndex !== null &&
            resourceSlotIndex !== -1
          ) {
            resourceSlots[task.recurso_id][resourceSlotIndex] = end;
          }
          scheduled.add(task.id);
          rank += 1;
        }
        const maxEnd = phaseTasks.length ? Math.max(...phaseTasks.map((task) => task.planEnd || 0)) : 0;
        return maxEnd;
      }

        function calculatePlan({ silent = false } = {}) {
          validateAndStore();
          if (validationState.errors.length) {
            return false;
          }
        plan.tareas.forEach((task) => {
          task.planRank = null;
          task.planStart = null;
          task.planEnd = null;
        });
        planState.byPhase = {};
        plan.fases.forEach((phaseId) => {
          planState.byPhase[phaseId] = schedulePhase(phaseId);
        });
        state.planReady = true;
        if (state.phaseStatus === 'idle') {
          resetPhaseTimer();
        }
        if (!silent) {
          state.lastPlanMessage = 'Ruta optimizada.';
        }
          return true;
        }

        function getTaskLevelMin(task) {
          if (Number.isFinite(task.nivel_min) && task.nivel_min > 0) {
            return clamp(Math.round(task.nivel_min), 1, 3);
          }
          const process = String(task.proceso || '').toUpperCase();
          if (
            ['HORNEAR', 'COCER', 'SALTEAR', 'FREIR', 'TRITURAR', 'EMULSIONAR', 'MONTAR', 'BANO_MARIA', 'GRATINAR'].includes(
              process
            )
          ) {
            return 2;
          }
          if (process === 'EMPLATAR') {
            return /fino|cuidado|gourmet/.test(normalizeToken(task.nombre || '')) ? 2 : 1;
          }
          if (['CORTAR', 'LAVAR', 'PELAR', 'MEDIR', 'MEZCLAR'].includes(process)) {
            return 1;
          }
          return 1;
        }

        function getPersonFactor(person) {
          const value = Number(person.factor_velocidad);
          return Number.isFinite(value) && value > 0 ? value : 1;
        }

      function unlockAllAssignments() {
        let unlocked = 0;
        plan.tareas.forEach((task) => {
          if (task.locked) {
            task.locked = false;
            task.autoAssigned = false;
            unlocked += 1;
          }
        });
        return unlocked;
      }

        function autoAssignBalanced({
          phaseOnly = true,
          respectLocked = true,
          onlyUnassigned = true,
          maxShare = 0.45
        } = {}) {
          const activePhase = getActivePhaseId();
          const scopeTasks = plan.tareas.filter((task) => !phaseOnly || task.fase === activePhase);
          const lockedCount = scopeTasks.filter((task) => task.locked).length;
          const candidates = scopeTasks.filter(
            (task) => !(respectLocked && task.locked) && (!onlyUnassigned || !task.asignado_a_id)
          );
          const skippedLocked = lockedCount;
          if (!candidates.length) {
            return { assignedCount: 0, skippedLocked, notEligible: 0 };
          }

          const scopeSet = new Set(scopeTasks.map((task) => task.id));
          const candidateIds = new Set(candidates.map((task) => task.id));
          const dependentsMap = new Map();
          scopeTasks.forEach((task) => {
            (task.depende_de || []).forEach((depId) => {
              if (!scopeSet.has(depId)) {
                return;
              }
              if (!dependentsMap.has(depId)) {
                dependentsMap.set(depId, []);
              }
              dependentsMap.get(depId).push(task.id);
            });
          });

          const effectiveCatalog = getEffectiveResourcesCatalog();
          const resourceCapByType = {};
          Object.entries(effectiveCatalog.byTypeKey).forEach(([typeKey, list]) => {
            resourceCapByType[typeKey] = list.reduce(
              (sum, resource) => sum + Math.max(0, sanitizeInt(resource.capacidad, 0)),
              0
            );
          });

          const phaseSet = new Set(scopeTasks.map((task) => task.fase));
          const loadByPhase = {};
          const loadRawByPhase = {};
          const countByPhase = {};
          const dishCountByPhase = {};
          const totalCountByPhase = {};
          const totalMinutesByPhase = {};

          phaseSet.forEach((fase) => {
            loadByPhase[fase] = {};
            loadRawByPhase[fase] = {};
            countByPhase[fase] = {};
            dishCountByPhase[fase] = {};
            totalCountByPhase[fase] = 0;
            totalMinutesByPhase[fase] = 0;
            plan.equipo.forEach((person) => {
              loadByPhase[fase][person.id] = 0;
              loadRawByPhase[fase][person.id] = 0;
              countByPhase[fase][person.id] = 0;
              dishCountByPhase[fase][person.id] = {};
            });
          });

          scopeTasks.forEach((task) => {
            const duration = Math.max(1, Number(task.duracion_min) || 1);
            totalMinutesByPhase[task.fase] += duration;
            totalCountByPhase[task.fase] += 1;
          });

          plan.tareas.forEach((task) => {
            if (!task.asignado_a_id) {
              return;
            }
            if (candidateIds.has(task.id)) {
              return;
            }
            if (!phaseSet.has(task.fase)) {
              return;
            }
            const person = equipoById[task.asignado_a_id];
            if (!person) {
              return;
            }
            const duration = Math.max(1, Number(task.duracion_min) || 1);
            const factor = getPersonFactor(person);
            loadByPhase[task.fase][person.id] += duration / factor;
            loadRawByPhase[task.fase][person.id] += duration;
            countByPhase[task.fase][person.id] += 1;
            dishCountByPhase[task.fase][person.id][task.plato] =
              (dishCountByPhase[task.fase][person.id][task.plato] || 0) + 1;
          });

          candidates.forEach((task) => {
            if (!onlyUnassigned) {
              task.asignado_a_id = null;
            }
            task.autoAssigned = false;
          });

          const taskPriority = (task) => {
            const duration = task.duracion_min || 0;
            const outDegree = (dependentsMap.get(task.id) || []).length;
            let score = duration + outDegree * 5;
            const resourceKey =
              task.resourceTypeKey || getExpectedResourceForProcess(task.proceso, plan.recursos).typeKey;
            if (resourceKey) {
              const cap = resourceCapByType[resourceKey] || 0;
              if (cap <= 1) {
                score += 10;
                if (duration >= 30) {
                  score += 8;
                }
              }
            }
            if (isCriticalTask(task)) {
              score += 8;
            }
            return score;
          };

          const orderedTasks = [...candidates].sort((a, b) => {
            const phaseDiff = phaseOnly ? 0 : plan.fases.indexOf(a.fase) - plan.fases.indexOf(b.fase);
            if (phaseDiff !== 0) {
              return phaseDiff;
            }
            const priorityDiff = taskPriority(b) - taskPriority(a);
            if (priorityDiff !== 0) {
              return priorityDiff;
            }
            return (b.duracion_min || 0) - (a.duracion_min || 0);
          });

          let assignedCount = 0;
          let notEligible = 0;

          orderedTasks.forEach((task) => {
            const effectiveMin = getTaskLevelMin(task);
            if (!task.nivel_min || task.nivel_min !== effectiveMin) {
              task.nivel_min = effectiveMin;
            }
            const taskForCheck = effectiveMin !== task.nivel_min ? { ...task, nivel_min: effectiveMin } : task;
            let candidatesPeople = plan.equipo.filter(
              (person) => person.nivel >= effectiveMin && isAssignmentAllowed(taskForCheck, person)
            );
            if (!candidatesPeople.length) {
              notEligible += 1;
              return;
            }

            const critical = isCriticalTask(task);
            const operational = effectiveMin === 1 || isBasicTask(task);
            const technical = effectiveMin >= 2 || isDelicateTask(task);
            const hasNonChef = candidatesPeople.some((person) => person.nivel < 3);
            const duration = Math.max(1, Number(task.duracion_min) || 1);
            const phase = task.fase;
            const totalMinutes = Math.max(1, totalMinutesByPhase[phase] || duration);
            const totalCount = Math.max(1, totalCountByPhase[phase] || 1);

            const scored = candidatesPeople
              .map((person) => {
                const factor = getPersonFactor(person);
                const load = loadByPhase[phase][person.id] || 0;
                const loadRaw = loadRawByPhase[phase][person.id] || 0;
                const count = countByPhase[phase][person.id] || 0;
                let score = load + count * 0.35;

                const projectedShare = (loadRaw + duration) / totalMinutes;
                if (projectedShare > maxShare && candidatesPeople.length > 1) {
                  score += (projectedShare - maxShare) * 120;
                }

                const projectedCountShare = (count + 1) / totalCount;
                if (projectedCountShare > 0.6 && candidatesPeople.length > 1) {
                  score += (projectedCountShare - 0.6) * 40;
                }

                if (person.nivel === 3 && effectiveMin < 3 && hasNonChef && !critical) {
                  score += 15;
                  if (operational || isBasicTask(task)) {
                    score += 20;
                  }
                }
                if (person.nivel === 2 && technical) {
                  score -= 4;
                }
                if (person.nivel === 1 && operational) {
                  score -= 4;
                }
                if (person.nivel === 3 && critical) {
                  score -= 3;
                }

                const dishKey = task.plato || '';
                if (dishKey) {
                  const dishCount = dishCountByPhase[phase][person.id][dishKey] || 0;
                  if (dishCount === 0 && count > 0) {
                    score += 1.2;
                  } else if (dishCount > 0) {
                    score -= 0.6;
                  }
                }
                return { person, score };
              })
              .sort((a, b) => a.score - b.score);

            if (!scored.length) {
              return;
            }

            let chosen = scored[0].person;
            if (critical && chosen.nivel < 3) {
              const chefOption = scored.find((item) => item.person.nivel === 3);
              if (chefOption) {
                const diff = Math.abs(chefOption.score - scored[0].score);
                if (diff <= Math.max(1, Math.abs(scored[0].score) * 0.1)) {
                  chosen = chefOption.person;
                }
              }
            }

            task.asignado_a_id = chosen.id;
            task.autoAssigned = true;
            assignedCount += 1;
            const factor = getPersonFactor(chosen);
            loadByPhase[phase][chosen.id] += duration / factor;
            loadRawByPhase[phase][chosen.id] += duration;
            countByPhase[phase][chosen.id] += 1;
            dishCountByPhase[phase][chosen.id][task.plato] =
              (dishCountByPhase[phase][chosen.id][task.plato] || 0) + 1;
          });

          const phasesToBalance = phaseOnly
            ? [activePhase]
            : Array.from(new Set(candidates.map((task) => task.fase)));

          const rebalancePhase = (phaseId) => {
            const phaseTasks = plan.tareas.filter((task) => task.fase === phaseId);
            const totalMinutes = phaseTasks.reduce(
              (sum, task) => sum + Math.max(1, Number(task.duracion_min) || 1),
              0
            );
            if (!totalMinutes) {
              return;
            }
            const loadRaw = {};
            plan.equipo.forEach((person) => {
              loadRaw[person.id] = 0;
            });
            phaseTasks.forEach((task) => {
              if (!task.asignado_a_id) {
                return;
              }
              const duration = Math.max(1, Number(task.duracion_min) || 1);
              loadRaw[task.asignado_a_id] += duration;
            });

            const levelOnePeople = plan.equipo.filter((person) => person.nivel === 1);
            if (levelOnePeople.length) {
              phaseTasks
                .filter(
                  (task) =>
                    candidateIds.has(task.id) &&
                    !task.locked &&
                    getTaskLevelMin(task) === 1 &&
                    task.asignado_a_id
                )
                .forEach((task) => {
                  const assigned = equipoById[task.asignado_a_id];
                  if (assigned && assigned.nivel === 1) {
                    return;
                  }
                  const taskForCheck = { ...task, nivel_min: 1 };
                  const eligible = levelOnePeople.filter((person) => isAssignmentAllowed(taskForCheck, person));
                  if (!eligible.length) {
                    return;
                  }
                  const chosen = eligible.reduce((best, person) =>
                    loadRaw[person.id] <= loadRaw[best.id] ? person : best
                  );
                  const duration = Math.max(1, Number(task.duracion_min) || 1);
                  if (assigned) {
                    loadRaw[assigned.id] -= duration;
                  }
                  task.asignado_a_id = chosen.id;
                  task.autoAssigned = true;
                  loadRaw[chosen.id] += duration;
                });
            }

            const movableByPerson = {};
            phaseTasks.forEach((task) => {
              if (!task.asignado_a_id) {
                return;
              }
              if (!candidateIds.has(task.id) || task.locked) {
                return;
              }
              movableByPerson[task.asignado_a_id] = movableByPerson[task.asignado_a_id] || [];
              movableByPerson[task.asignado_a_id].push(task);
            });

            const shareFor = (personId) => (loadRaw[personId] || 0) / totalMinutes;

            const tryMoveFrom = (fromId) => {
              const tasks = (movableByPerson[fromId] || []).sort(
                (a, b) => (a.duracion_min || 0) - (b.duracion_min || 0)
              );
              for (const task of tasks) {
                const effectiveMin = getTaskLevelMin(task);
                const taskForCheck = { ...task, nivel_min: effectiveMin };
                const eligible = plan.equipo.filter(
                  (person) =>
                    person.id !== fromId &&
                    person.nivel >= effectiveMin &&
                    isAssignmentAllowed(taskForCheck, person)
                );
                if (!eligible.length) {
                  continue;
                }
                let chosen = eligible.reduce((best, person) =>
                  loadRaw[person.id] <= loadRaw[best.id] ? person : best
                );
                const duration = Math.max(1, Number(task.duracion_min) || 1);
                const projectedShare = (loadRaw[chosen.id] + duration) / totalMinutes;
                if (projectedShare > maxShare) {
                  const viable = eligible
                    .map((person) => ({
                      person,
                      share: (loadRaw[person.id] + duration) / totalMinutes
                    }))
                    .filter((item) => item.share <= maxShare)
                    .sort((a, b) => a.share - b.share);
                  if (viable.length) {
                    chosen = viable[0].person;
                  }
                }
                loadRaw[fromId] -= duration;
                loadRaw[chosen.id] += duration;
                task.asignado_a_id = chosen.id;
                task.autoAssigned = true;
                return true;
              }
              return false;
            };

            let moved = true;
            while (moved) {
              moved = false;
              const over = plan.equipo
                .map((person) => ({ person, share: shareFor(person.id) }))
                .filter((item) => item.share > maxShare)
                .sort((a, b) => b.share - a.share);
              if (!over.length) {
                break;
              }
              const offender = over[0].person;
              if (tryMoveFrom(offender.id)) {
                moved = true;
              }
            }
          };

          phasesToBalance.forEach((phaseId) => rebalancePhase(phaseId));

          validateAndStore();
          return { assignedCount, skippedLocked, notEligible };
        }

        function autoAssignTasks({ phaseOnly = true, respectLocked = true, onlyUnassigned = true } = {}) {
          return autoAssignBalanced({ phaseOnly, respectLocked, onlyUnassigned });
        }

      function startPhaseCountdown() {
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        if (errorCount) {
          setText(planStatusEl, `Hay ${errorCount} problemas que requieren decision.`);
          state.issuesOpen = true;
          renderValidation();
          return;
        }
        if (!state.approved) {
          setText(planStatusEl, 'Revisa automaticamente antes de iniciar.');
          return;
        }
        if (state.phaseStatus === 'running' || state.phaseStatus === 'prestart') {
          return;
        }
        state.prestartRemaining = PRESTART_SECONDS;
        state.phaseStatus = 'prestart';
        ensureTicker();
        render();
      }

      function beginPhase() {
        state.phaseStatus = 'running';
        state.pausedFrom = null;
        if (state.phaseRemaining <= 0) {
          state.phaseRemaining = Math.round(state.phaseEstimate * 60);
        }
        ensureTicker();
        autoStartTasks();
        render();
      }

      function togglePausePhase() {
        if (!state.approved) {
          setText(planStatusEl, 'Plan sin aprobar.');
          return;
        }
        if (state.phaseStatus === 'paused') {
          state.phaseStatus = state.pausedFrom || 'running';
          state.pausedFrom = null;
          ensureTicker();
          render();
          return;
        }
        if (state.phaseStatus === 'running' || state.phaseStatus === 'prestart') {
          state.pausedFrom = state.phaseStatus;
          state.phaseStatus = 'paused';
          stopTicker();
          render();
        }
      }

      function finalizePhase() {
        if (!state.approved) {
          setText(planStatusEl, 'Plan sin aprobar.');
          return;
        }
        advancePhase(false);
      }

      function skipPrestart() {
        if (state.phaseStatus === 'prestart') {
          state.prestartRemaining = 0;
          beginPhase();
        }
      }

      function canChangePhase() {
        return !getActiveTasks().length;
      }

      function advancePhase(autoTriggered = false) {
        if (!plan) {
          return;
        }
        if (!canChangePhase()) {
          planStatusEl.textContent = 'Hay tareas en curso.';
          return;
        }
        const phases = plan.fases || plan.phases || PHASES;
        const activePhase = getActivePhaseId();
        const activePhaseIndex = Math.max(0, phases.indexOf(activePhase));
        if (activePhaseIndex >= phases.length - 1) {
          if (!autoTriggered) {
            planStatusEl.textContent = 'Ultima fase alcanzada.';
          }
          return;
        }
        const nextPhase = phases[activePhaseIndex + 1];
        plan.faseActiva = nextPhase;
        plan.phaseActive = nextPhase;
        resetPhaseTimer();
        if (autoTriggered) {
          startPhaseCountdown();
        }
        render();
      }

      function retreatPhase() {
        if (!plan) {
          return;
        }
        if (!canChangePhase()) {
          planStatusEl.textContent = 'Hay tareas en curso.';
          return;
        }
        const phases = plan.fases || plan.phases || PHASES;
        const activePhase = getActivePhaseId();
        const activePhaseIndex = Math.max(0, phases.indexOf(activePhase));
        if (activePhaseIndex === 0) {
          return;
        }
        const nextPhase = phases[activePhaseIndex - 1];
        plan.faseActiva = nextPhase;
        plan.phaseActive = nextPhase;
        resetPhaseTimer();
        render();
      }

      let tickId = null;

      function ensureTicker() {
        if (tickId) {
          return;
        }
        tickId = window.setInterval(() => {
          if (state.phaseStatus === 'prestart') {
            state.prestartRemaining = Math.max(0, state.prestartRemaining - 1);
            if (state.prestartRemaining === 0) {
              beginPhase();
            }
          } else if (state.phaseStatus === 'running') {
            state.phaseRemaining = Math.max(0, state.phaseRemaining - 1);
            autoStartTasks();
            if (state.phaseRemaining === 0) {
              state.phaseStatus = 'overdue';
            }
          }
          maybeAutoAdvance();
          render();
        }, 1000);
      }

      function stopTicker() {
        if (tickId) {
          window.clearInterval(tickId);
          tickId = null;
        }
      }

      function renderFilters() {
        const filtersWrap = filterPlatoEl ? filterPlatoEl.closest('.filters') : null;
        const hasTasks = Boolean(plan && Array.isArray(plan.tareas) && plan.tareas.length);
        const inPrepView = state && (state.uiMode === 'prep' || state.view === 'prep');
        const isEmptyPlan = Boolean(plan && plan.isEmpty);

        if (!hasTasks || isEmptyPlan || !inPrepView || !filterPlatoEl || !filterFaseEl) {
          if (filtersWrap) {
            filtersWrap.style.display = 'none';
          }
          if (filterPlatoEl) {
            filterPlatoEl.innerHTML = '';
          }
          if (filterFaseEl) {
            filterFaseEl.innerHTML = '';
          }
          return;
        }

        if (filtersWrap) {
          filtersWrap.style.display = 'flex';
        }

        const platos = Array.from(new Set(plan.tareas.map((task) => task.plato).filter(Boolean))).sort();
        if (!platos.includes(filterState.plato)) {
          filterState.plato = 'ALL';
        }

        filterPlatoEl.innerHTML = `<option value="ALL">Todos los platos</option>${platos
          .map((plato) => `<option value="${plato}">${plato}</option>`)
          .join('')}`;
        filterPlatoEl.value = filterState.plato;

        const phases = plan.fases || plan.phases || PHASES;
        if (!phases.includes(filterState.fase)) {
          filterState.fase = 'ALL';
        }

        filterFaseEl.innerHTML = `<option value="ALL">Todas las fases</option>${phases
          .map((fase) => `<option value="${fase}">${phaseLabel(fase)}</option>`)
          .join('')}`;
        filterFaseEl.value = filterState.fase;

        if (filterErrorsEl) {
          filterErrorsEl.checked = !filterState.errors;
        }
        if (filterNoDurationEl) {
          filterNoDurationEl.checked = filterState.noDuration;
        }
        if (filterNoResourceEl) {
          filterNoResourceEl.checked = filterState.noResource;
        }
        if (compactToggleEl) {
          compactToggleEl.checked = state.compactMode;
        }
      }

        function summarizeFixEvents(fixEvents) {
          const byDish = new Map();
          (fixEvents || []).forEach((event) => {
            if (!event) {
              return;
            }
            const dish = event.plato || 'General';
            if (!byDish.has(dish)) {
              byDish.set(dish, []);
            }
            byDish.get(dish).push(event.resumen || 'Correccion aplicada');
          });
          return Array.from(byDish.entries())
            .map(([plato, summaries]) => ({
              plato,
              resumen: summaries.slice(0, 2).join(' | ')
            }))
            .slice(0, 5);
        }

        function buildDiagnostics(planToCheck, errors, warnings, draft) {
          const missingResources = new Set();
          const assumptions = Array.isArray(planToCheck?.incertidumbres_detectadas)
            ? planToCheck.incertidumbres_detectadas
            : [];
          const fixes = Array.isArray(planToCheck?.fix_events) ? planToCheck.fix_events : [];
          const missingDurations = planToCheck?.tareas
            ? planToCheck.tareas.filter((task) => task.duracion_inferida).length
            : 0;
          const unassignedTasks = planToCheck?.tareas
            ? planToCheck.tareas.filter((task) => !task.asignado_a_id).length
            : 0;
          const knownTypeKeys = new Set(Object.keys(RESOURCE_LABELS || {}));
          const addMissingType = (value) => {
            const typeKey = normalizeResourceName(value);
            if (!typeKey || !knownTypeKeys.has(typeKey)) {
              return;
            }
            missingResources.add(RESOURCE_LABELS[typeKey] || typeKey);
          };

          (planToCheck?.tareas || []).forEach((task) => {
            if (!task) {
              return;
            }
            const assignedId = task.recurso_id || task.resourceId || null;
            const explicitType = normalizeResourceName(task.resourceTypeKey || '');
            if (explicitType && !assignedId) {
              addMissingType(explicitType);
              return;
            }
            const expected = getExpectedResourceForProcess(task.proceso, planToCheck?.recursos || []);
            if (expected.needs && !assignedId) {
              addMissingType(expected.typeKey);
            }
          });

          (planToCheck?.preguntas_guiadas || []).forEach((question) => {
            if (question.tipo === 'ADD_RESOURCE') {
              addMissingType(question.recurso_nombre || question.recurso_id || question.recurso_tipo);
            }
          });

          const hintSources = []
            .concat(planToCheck?.advertencias_de_recursos || [])
            .concat(draft?.suggestions || [])
            .concat(warnings || []);
          hintSources.forEach((message) => {
            const resource = parseMissingResourceFromMessage(message);
            if (resource) {
              addMissingType(resource);
            }
          });

          const diagnostics = {
            warnings: warnings || [],
            errors: errors || [],
            fixes,
            assumptions,
            missingResources: Array.from(missingResources),
            missingDurations,
            unassignedTasks,
            counts: {
              warnings: (warnings || []).length,
              errors: (errors || []).length,
              fixes: fixes.length,
              assumptions: assumptions.length
            },
            byDishSummary: summarizeFixEvents(fixes)
          };

          return diagnostics;
        }

        function getAlertIssues(diagnostics) {
          const issues = [];
          if (diagnostics.missingResources.length) {
            issues.push({
              id: 'resources',
              message: 'Faltan recursos',
              action: 'add-resources',
              label: 'Anadir'
            });
          }
          if (diagnostics.missingDurations) {
            issues.push({
              id: 'durations',
              message: 'Faltan duraciones',
              action: 'review',
              label: 'Revisar'
            });
          }
          if (diagnostics.unassignedTasks) {
            issues.push({
              id: 'unassigned',
              message: 'Hay tareas sin asignar',
              action: 'review',
              label: 'Revisar'
            });
          }
          return issues;
        }

        function getBlockingIssues(planToCheck) {
          const issues = [];
          const resources = planToCheck.resources?.items || planToCheck.recursos || [];
          const tasks = planToCheck.tasks || planToCheck.tareas || [];
          const team = planToCheck.team || planToCheck.equipo || [];
          const phases = planToCheck.phases || planToCheck.fases || PHASES;
          const effectiveResources = getEffectiveResourcesCatalog(resources);
          const resourceIds = new Set(effectiveResources.list.map((resource) => resource.id));
          const resourceTypeKeys = new Set(
            effectiveResources.list.map((resource) => resource.typeKey || resource.id)
          );
          resourceIds.forEach((id) => resourceTypeKeys.add(id));
          const personIds = new Set(team.map((person) => person.id));

          const addIssue = (issue) => {
            if (!issues.some((item) => item.id === issue.id)) {
              issues.push(issue);
            }
          };
          if (!tasks.length) {
            const parseCode = planToCheck?.meta?.parseErrorCode || 'TASKS_EMPTY';
            addIssue({
              id: 'PLAN_TASKS_EMPTY',
              severity: 'error',
              code: parseCode,
              messageHumano: 'No se detectaron platos/tareas. Revisa el formato del menu o pega el texto manualmente.',
              blocker: true,
              entityType: 'plan',
              entityId: 'tasks'
            });
          }

          effectiveResources.list.forEach((resource) => {
            if (sanitizeInt(resource.capacidad, 0) <= 0) {
              addIssue({
                id: `RESOURCE_CAP_${resource.id}`,
                severity: 'error',
                code: 'RESOURCE_CAPACITY',
                messageHumano: `Recurso sin capacidad: ${resource.nombre}.`,
                entityType: 'resource',
                entityId: resource.id
              });
            }
          });

          tasks.forEach((task) => {
            const taskName = task.titleShort || task.nombre || task.titleFull || 'tarea';
            const dishName = task.dish || task.plato || task.plato_id || '';
            const taskPhase = task.phase || task.fase;
            const processKey = task.processKey || task.proceso;
            const assignedId = task.resourceId || task.recurso_id || null;
            const assignedTypeKey = normalizeResourceName(task.resourceTypeKey || assignedId || '');
            const durationValue = Number(task.durationMin ?? task.duracion_min);
            const confidence = sanitizeNumber(task.meta?.confidence ?? task.confianza, 1);

            if (!String(dishName || '').trim()) {
              addIssue({
                id: `TASK_PLATO_${task.id}`,
                severity: 'error',
                code: 'TASK_DISH_MISSING',
                messageHumano: `Tarea sin plato: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'plato'
              });
            }
            if (!phases.includes(taskPhase)) {
              addIssue({
                id: `TASK_PHASE_${task.id}`,
                severity: 'error',
                code: 'TASK_PHASE_INVALID',
                messageHumano: `Fase invalida en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'fase'
              });
            }
            if (!PROCESS_TYPES.includes(processKey)) {
              addIssue({
                id: `TASK_PROC_${task.id}`,
                severity: 'error',
                code: 'TASK_PROCESS_INVALID',
                messageHumano: `Proceso invalido en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id
              });
            }
            if (BANNED_WORDS.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(taskName))) {
              addIssue({
                id: `TASK_NAME_META_${task.id}`,
                severity: 'error',
                code: 'TASK_NAME_METADATA',
                messageHumano: `Nombre invalido (metadata) en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id
              });
            }
            if (!Number.isFinite(durationValue) || durationValue <= 0) {
              addIssue({
                id: `TASK_DURATION_${task.id}`,
                severity: 'error',
                code: 'TASK_DURATION_MISSING',
                messageHumano: `Duracion invalida en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'duracion',
                fix: { label: 'Auto-rellenar duracion', action: 'FILL_DURATION' }
              });
            }
            const expected = getExpectedResourceForProcess(processKey, resources);
            if (expected.needs && !assignedTypeKey) {
              const fix =
                expected.resourceId && resourceIds.has(expected.resourceId)
                  ? { label: 'Asignar recurso', action: 'SET_RESOURCE', resourceId: expected.resourceId }
                  : null;
              const severity = 'error';
              addIssue({
                id: `TASK_RESOURCE_REQUIRED_${task.id}`,
                severity,
                code: 'TASK_RESOURCE_REQUIRED',
                messageHumano: `Falta recurso en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'recurso',
                fix
              });
            }
            if (
              expected.needs &&
              expected.typeKey &&
              assignedTypeKey &&
              assignedTypeKey !== expected.typeKey &&
              processKey === 'FREIR'
            ) {
              addIssue({
                id: `TASK_RESOURCE_MISMATCH_${task.id}`,
                severity: 'error',
                code: 'TASK_RESOURCE_MISMATCH',
                messageHumano: `Fritura sin fogones: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'recurso'
              });
            }
            const hasResource =
              (assignedId && resourceIds.has(assignedId)) ||
              (assignedTypeKey && resourceTypeKeys.has(assignedTypeKey));
            if ((assignedId || assignedTypeKey) && !hasResource) {
              addIssue({
                id: `TASK_RESOURCE_INVALID_${task.id}`,
                severity: 'error',
                code: 'TASK_RESOURCE_INVALID',
                messageHumano: `Recurso desconocido en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'recurso',
                fix: { label: 'Quitar recurso', action: 'CLEAR_RESOURCE' }
              });
            }
            if (!task.asignado_a_id) {
              addIssue({
                id: `TASK_ASSIGN_${task.id}`,
                severity: 'warning',
                code: 'TASK_ASSIGN_MISSING',
                messageHumano: `Tarea sin asignar: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'asignado'
              });
            } else if (!personIds.has(task.asignado_a_id)) {
              addIssue({
                id: `TASK_ASSIGN_MISSING_${task.id}`,
                severity: 'error',
                code: 'TASK_ASSIGN_MISSING_PERSON',
                messageHumano: `Persona asignada no existe en: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'asignado',
                fix: { label: 'Desasignar', action: 'UNASSIGN' }
              });
            } else {
              const person = team.find((item) => item.id === task.asignado_a_id);
              if (person && !isAssignmentAllowed(task, person)) {
                addIssue({
                  id: `TASK_ASSIGN_INVALID_${task.id}`,
                  severity: 'error',
                  code: 'TASK_ASSIGN_INVALID',
                  messageHumano: `Asignacion invalida: ${taskName}.`,
                  entityType: 'task',
                  entityId: task.id,
                  field: 'asignado',
                  fix: { label: 'Desasignar', action: 'UNASSIGN' }
                });
              }
            }
            if (task.locked && !task.asignado_a_id) {
              addIssue({
                id: `TASK_LOCKED_${task.id}`,
                severity: 'error',
                code: 'TASK_LOCKED_NO_ASSIGN',
                messageHumano: `Tarea bloqueada sin asignado: ${taskName}.`,
                entityType: 'task',
                entityId: task.id,
                field: 'asignado',
                fix: { label: 'Desbloquear', action: 'UNLOCK' }
              });
            }
            const deps = task.dependsOn || task.depende_de || [];
            deps.forEach((depId) => {
              if (!tasks.find((item) => item.id === depId)) {
                addIssue({
                  id: `TASK_DEP_${task.id}_${depId}`,
                  severity: 'error',
                  code: 'TASK_DEP_MISSING',
                  messageHumano: `Dependencia inexistente en ${taskName}.`,
                  entityType: 'task',
                  entityId: task.id
                });
              }
            });
            if (confidence < LOW_CONFIDENCE) {
              addIssue({
                id: `TASK_WARN_${task.id}`,
                severity: 'info',
                code: 'TASK_LOW_CONFIDENCE',
                messageHumano: `Baja confianza en tarea: ${taskName}.`,
                entityType: 'task',
                entityId: task.id
              });
            }
          });

          const graph = Object.fromEntries(
            tasks.map((task) => [task.id, task.dependsOn || task.depende_de || []])
          );
          const visiting = new Set();
          const visited = new Set();
          let cycleDetected = false;

          function dfs(node) {
            if (visiting.has(node)) {
              return true;
            }
            if (visited.has(node)) {
              return false;
            }
            visiting.add(node);
            const deps = graph[node] || [];
            for (const dep of deps) {
              if (dfs(dep)) {
                return true;
              }
            }
            visiting.delete(node);
            visited.add(node);
            return false;
          }

          for (const node of Object.keys(graph)) {
            if (dfs(node)) {
              cycleDetected = true;
              break;
            }
          }
          if (cycleDetected) {
            addIssue({
              id: 'GLOBAL_DEP_CYCLE',
              severity: 'error',
              code: 'DEPS_CYCLE',
              messageHumano: 'Ciclo detectado en dependencias.',
              entityType: 'global',
              entityId: 'dependencias'
            });
          }

          return issues;
        }

        function getPanelClass(canShowDetails, isOpen) {
          if (!canShowDetails) {
            return 'issue-panel';
          }
          return isOpen ? 'issue-panel show' : 'issue-panel';
        }

      function renderValidation() {
        const issues = state.issues || [];
        const errors = issues.filter((issue) => issue.severity === 'error');
        const warnings = issues.filter((issue) => issue.severity === 'warning');
        const errorCount = errors.length;
        const warningCount = warnings.length;
        const diagnostics = state.diagnostics || emptyDiagnostics();
        const hasIssues = errorCount + warningCount > 0;
        const canShowDetails = true;
        if (!canShowDetails) {
          state.issuesOpen = false;
        }
        if (!hasIssues) {
          state.issuesOpen = false;
          const fixCount = diagnostics.fixes?.length || 0;
          const label = fixCount
            ? `Plan listo con ${fixCount} ajustes automaticos.`
            : 'Plan listo.';
          validationListEl.innerHTML = `<div class="issue-bar ok"><strong>Salud del plan</strong><span>${label}</span></div>`;
          return;
        }

        const barLabel = errorCount ? `Bloqueado: ${errorCount} errores` : `Avisos: ${warningCount}`;
        const barClass = errorCount ? 'issue-bar error' : 'issue-bar warn';
        const barNote = errorCount
          ? `Hay ${errorCount} problemas que requieren decision.`
          : `Avisos: ${warningCount}.`;

        const anyFix = issues.some((issue) => issue.fix);
        const summaryItems = [];
        if (diagnostics.missingDurations) {
          summaryItems.push({
            message: `Faltan duraciones en ${diagnostics.missingDurations} tareas`,
            fixAction: 'validation-fix-durations',
            fixLabel: 'Resolver automaticamente',
            reviewAction: 'review',
            reviewLabel: 'Editar manualmente'
          });
        }
        if (diagnostics.unassignedTasks) {
          summaryItems.push({
            message: `Faltan cocineros en ${diagnostics.unassignedTasks} tareas`,
            fixAction: 'validation-auto-assign',
            fixLabel: 'Resolver automaticamente',
            reviewAction: 'review',
            reviewLabel: 'Editar manualmente'
          });
        }
        if (diagnostics.missingResources.length) {
          summaryItems.push({
            message: `Faltan recursos: ${diagnostics.missingResources.join(', ')}`,
            fixAction: 'validation-add-resources',
            fixLabel: 'Resolver automaticamente',
            reviewAction: 'review',
            reviewLabel: 'Editar manualmente'
          });
        }
        if (!summaryItems.length) {
          summaryItems.push({
            message: errorCount
              ? `Hay ${errorCount} errores en tareas.`
              : `Avisos pendientes: ${warningCount}.`,
            reviewAction: 'review',
            reviewLabel: 'Editar manualmente'
          });
        }

        const summaryHtml = summaryItems
          .map((item) => {
            const fixBtn = item.fixAction
              ? `<button class="btn ghost mini-btn" data-action="${item.fixAction}">${item.fixLabel}</button>`
              : '';
            const reviewBtn = item.reviewAction
              ? `<button class="btn ghost mini-btn" data-action="${item.reviewAction}">${item.reviewLabel}</button>`
              : '';
            return `
              <div class="validation-item ${errorCount ? 'error' : 'warn'}">
                <div>${item.message}</div>
                <div class="issue-actions">${fixBtn}${reviewBtn}</div>
              </div>
            `;
          })
          .join('');

        const visible = (errorCount ? errors : warnings).slice(0, 5);
        const listHtml = visible
          .map((issue) => {
            const fixBtn = issue.fix
              ? `<button class="btn ghost mini-btn" data-action="issue-fix" data-issue-id="${issue.id}">Resolver automaticamente</button>`
              : '';
            const context = getIssueContext(issue);
            return `
              <div class="issue-item">
                <div>${issue.messageHumano} ${context ? `<span class="note">${context}</span>` : ''}</div>
                <div class="issue-actions">
                  <button class="btn ghost mini-btn" data-action="issue-goto" data-issue-id="${issue.id}">Editar manualmente</button>
                  ${fixBtn}
                </div>
              </div>
            `;
          })
          .join('');
        const moreNote =
          (errorCount ? errors : warnings).length > visible.length
            ? `<div class="note">+${(errorCount ? errors : warnings).length - visible.length} mas</div>`
            : '';
        const toggleLabel = state.issuesOpen ? 'Ocultar' : 'Ver';
        const toggleBtn = canShowDetails
          ? `<button class="btn ghost mini-btn" data-action="issue-toggle">${toggleLabel}</button>`
          : '';
        const fixAllBtn = canShowDetails && anyFix
          ? `<button class="btn ghost mini-btn" data-action="issue-fix-all">Resolver automaticamente todo lo posible</button>`
          : '';
        const panelClass = getPanelClass(canShowDetails, state.issuesOpen);

        validationListEl.innerHTML = `
          <div class="${barClass}">
            <strong>Salud del plan</strong>
            <span>${barLabel}</span>
            <span>${barNote}</span>
            ${toggleBtn}
            ${fixAllBtn}
          </div>
          ${summaryHtml}
          ${canShowDetails ? `
          <div class="${panelClass}">
            <div class="issue-list">${listHtml || '<div class="note">Sin errores.</div>'}</div>
            ${moreNote}
          </div>` : ''}
        `;
      }

      function updateSettingsPanel() {
        if (!settingsStateEl && !settingsCountsEl && !settingsIssuesEl && !settingsFixAllBtn && !settingsAssignResourcesBtn &&
            !settingsAutoAssignBalancedBtn && !settingsFillDurationsBtn && !settingsToggleIssuesBtn && !settingsStartServiceBtn) {
          return;
        }
        const diagnostics = state.diagnostics || emptyDiagnostics();
        const issues = state.issues || [];
        const errorCount = issues.filter((issue) => issue.severity === 'error').length;
        const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
        const needsDurations = diagnostics.missingDurations > 0;
        const needsResources = (diagnostics.missingResources || []).length > 0;
        const needsAssignments = diagnostics.unassignedTasks > 0;
        const hasProblems = errorCount + warningCount > 0 || needsDurations || needsResources || needsAssignments;
        const statusLabel = errorCount ? 'Bloqueado' : state.approved ? 'Aprobado' : 'Listo';
        const setButtonState = (button, disabled, reason) => {
          if (!button) {
            return;
          }
          button.disabled = disabled;
          button.title = disabled && reason ? reason : '';
        };
        if (settingsStateEl) {
          settingsStateEl.textContent = statusLabel;
        }
        if (settingsCountsEl) {
          settingsCountsEl.textContent = `Errores: ${errorCount} | Avisos: ${warningCount}`;
        }
        const canStart = state.approved && errorCount === 0 && state.phaseStatus === 'idle';
        setButtonState(
          settingsStartServiceBtn,
          !canStart,
          !state.approved ? 'Plan sin aprobar' : errorCount ? 'Plan bloqueado' : 'Servicio en curso'
        );
        setButtonState(settingsFixAllBtn, !hasProblems, 'Sin problemas');
        setButtonState(settingsAssignResourcesBtn, !needsResources, 'Sin recursos pendientes');
        setButtonState(settingsAutoAssignBalancedBtn, !needsAssignments, 'Sin tareas sin asignar');
        setButtonState(settingsFillDurationsBtn, !needsDurations, 'Sin duraciones pendientes');
        setButtonState(settingsToggleIssuesBtn, !hasProblems, 'Sin problemas');
        if (settingsToggleIssuesBtn) {
          settingsToggleIssuesBtn.textContent = state.issuesOpen ? 'Ocultar problemas' : 'Ver problemas';
        }
        if (settingsIssuesEl) {
          settingsIssuesEl.classList.toggle('show', state.issuesOpen && hasProblems);
        }
        if (settingsIssuesToggleEl) {
          settingsIssuesToggleEl.classList.toggle('hidden', !hasProblems);
        }
      }

      function renderPrepIssues() {
        if (!prepIssuesGridEl) {
          return;
        }
        if (plan?.isEmpty) {
          prepIssuesGridEl.innerHTML = '';
          if (prepIssuesSectionEl) {
            prepIssuesSectionEl.classList.add('hidden');
          }
          return;
        }
        const diagnostics = state.diagnostics || emptyDiagnostics();
        const issues = state.issues || [];
        const errorCount = issues.filter((issue) => issue.severity === 'error').length;
        const cards = [];
        if (diagnostics.missingDurations) {
          cards.push({
            severity: 'error',
            title: 'Tareas sin duracion',
            meta: `${diagnostics.missingDurations} tareas`,
            action: 'validation-fix-durations',
            label: 'Completar automaticamente'
          });
        }
        if (diagnostics.unassignedTasks) {
          cards.push({
            severity: 'warn',
            title: 'Tareas sin asignar',
            meta: `${diagnostics.unassignedTasks} tareas`,
            action: 'validation-assign',
            label: 'Repartir tareas'
          });
        }
        if (diagnostics.missingResources?.length) {
          cards.push({
            severity: 'warn',
            title: 'Recursos faltantes',
            meta: diagnostics.missingResources.join(', '),
            action: 'validation-add-resources',
            label: 'Asignar recursos'
          });
        }
        if (!cards.length && errorCount > 0) {
          cards.push({
            severity: 'error',
            title: 'Errores bloqueantes',
            meta: `${errorCount} problemas`,
            action: 'review',
            label: 'Editar manualmente'
          });
        }
        if (!cards.length) {
          prepIssuesGridEl.innerHTML = '';
          if (prepIssuesSectionEl) {
            prepIssuesSectionEl.classList.add('hidden');
          }
          return;
        }
        if (prepIssuesSectionEl) {
          prepIssuesSectionEl.classList.remove('hidden');
        }
        prepIssuesGridEl.innerHTML = cards
          .map(
            (card) => `
            <div class="issue-card ${card.severity}">
              <div class="issue-title">${card.title}</div>
              <div class="issue-meta">${card.meta}</div>
              <button class="btn ghost mini-btn" data-action="${card.action}">${card.label}</button>
            </div>
          `
          )
          .join('');
      }

      function renderPrepContext() {
        if (!prepResourcesEl || !prepTeamEl) {
          return;
        }
        const contextSection = prepResourcesEl.closest('#prep-context');
        if (plan?.isEmpty) {
          if (contextSection) {
            contextSection.classList.add('hidden');
          }
          prepResourcesEl.textContent = '';
          prepTeamEl.textContent = '';
          return;
        }
        if (contextSection) {
          contextSection.classList.remove('hidden');
        }
        const effective = getEffectiveResources();
        if (!effective.list.length) {
          prepResourcesEl.textContent = 'Sin recursos definidos.';
        } else {
          prepResourcesEl.innerHTML = effective.list
            .map((resource) => `${resource.nombre} (${resource.capacidad})`)
            .join(' | ');
        }
        if (!plan.equipo.length) {
          prepTeamEl.textContent = 'Sin equipo definido.';
        } else {
          prepTeamEl.innerHTML = plan.equipo
            .map((person) => `${person.nombre} (${person.rol})`)
            .join(' | ');
        }
      }

      function renderPrepReady() {
        if (!prepReadyEl) {
          return;
        }
        if (plan?.isEmpty || !plan?.tareas?.length) {
          prepReadyEl.classList.add('hidden');
          return;
        }
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        prepReadyEl.classList.toggle('hidden', errorCount > 0);
      }

      function renderAlerts() {
        if (plan?.isEmpty) {
          if (alertsCountEl) {
            alertsCountEl.textContent = '0';
          }
          if (alertsLinesEl) {
            alertsLinesEl.innerHTML = '<div>Sin alertas.</div>';
          }
          if (alertsBoxEl) {
            alertsBoxEl.classList.add('hidden');
          }
          if (alertsPanelEl) {
            alertsPanelEl.classList.remove('show');
          }
          if (alertsMissingEl) {
            alertsMissingEl.textContent = 'Sin recursos faltantes.';
          }
          if (alertsAddResourcesBtn) {
            alertsAddResourcesBtn.disabled = true;
          }
          state.alertsOpen = false;
          return;
        }
        const diagnostics = state.diagnostics || emptyDiagnostics();
        const issues = getAlertIssues(diagnostics);
          const hasAlerts = issues.length > 0;
          alertsCountEl.textContent = hasAlerts ? String(issues.length) : '0';
          if (!hasAlerts) {
            alertsLinesEl.innerHTML = '<div>Plan listo.</div>';
          } else {
            const preview = issues.slice(0, 2);
            const moreCount = Math.max(0, issues.length - preview.length);
            const lines = preview
              .map((issue) => {
                const button = issue.action
                  ? `<button class="btn ghost mini-btn" data-action="${issue.action}">${issue.label}</button>`
                  : '';
                return `<div>${issue.message} ${button}</div>`;
              })
              .concat(moreCount ? [`<div>+${moreCount} avisos mas</div>`] : [])
              .join('');
            alertsLinesEl.innerHTML = lines;
          }
          alertsReviewBtn.disabled = !hasAlerts;
          alertsDismissBtn.disabled = !hasAlerts;
          alertsPanelEl.classList.toggle('show', state.alertsOpen && hasAlerts);
          if (alertsBoxEl) {
            alertsBoxEl.classList.toggle('hidden', !hasAlerts);
          }
          if (!hasAlerts) {
            state.alertsOpen = false;
          }

          alertsMissingEl.textContent = diagnostics.missingResources.length
            ? diagnostics.missingResources.join(' | ')
            : 'Sin recursos faltantes.';
          alertsAddResourcesBtn.disabled = !diagnostics.missingResources.length;

        const fixesSection = alertsFixesEl?.closest('.alert-section');
        if (fixesSection) {
          fixesSection.style.display = 'none';
        }
      }

      function renderLibrary() {
        if (!recipeListEl || !recipeFilterEl || !recipeEmptyEl) {
          return;
        }
        const allTags = Array.from(
          new Set(recipes.flatMap((recipe) => (recipe.tags || []).map((tag) => String(tag))))
        )
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        const filterValue = state.libraryTag || 'ALL';
        const options = ['ALL', ...allTags]
          .map((tag) => {
            const label = tag === 'ALL' ? 'Todas las etiquetas' : tag;
            return `<option value="${tag}" ${filterValue === tag ? 'selected' : ''}>${label}</option>`;
          })
          .join('');
        recipeFilterEl.innerHTML = options;

        const visibleRecipes =
          filterValue === 'ALL'
            ? recipes
            : recipes.filter((recipe) => (recipe.tags || []).includes(filterValue));
        const filterWrap = recipeFilterEl.closest('.library-filters');
        if (filterWrap) {
          filterWrap.style.display = visibleRecipes.length ? 'flex' : 'none';
        }
        if (!visibleRecipes.length) {
          recipeEmptyEl.textContent = 'Sin recetas guardadas.';
        } else {
          recipeEmptyEl.textContent = '';
        }
        recipeListEl.innerHTML = visibleRecipes
          .map((recipe) => {
            const taskCount = recipe.tareas?.length || 0;
            const phaseCount = recipe.fases?.length || 0;
            const pax = recipe.paxBase ? `${recipe.paxBase} pax` : 'pax variable';
            const tags = (recipe.tags || []).length ? recipe.tags.join(' | ') : 'Sin etiquetas';
            const isActive = state.activeRecipeId === recipe.id;
            return `
              <div class="recipe-card ${isActive ? 'active' : ''}" data-recipe-id="${recipe.id}">
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-meta">${taskCount} tareas | ${phaseCount} fases | ${pax}</div>
                <div class="recipe-tags">${tags}</div>
                <div class="recipe-actions">
                  <button class="btn primary mini-btn" data-action="start-recipe">Iniciar receta</button>
                  <button class="btn ghost mini-btn" data-action="edit-recipe">Editar</button>
                  <button class="btn ghost mini-btn" data-action="duplicate-recipe">Duplicar</button>
                  <button class="btn danger mini-btn" data-action="delete-recipe">Borrar</button>
                </div>
              </div>
            `;
          })
          .join('');
      }

        function handleAlertAction(action) {
          if (!action) {
            return;
          }
          if (action === 'add-resources') {
            addSuggestedResources();
            assignResourcesByHeuristic({ silent: true });
            render();
            return;
          }
          if (action === 'review') {
            state.alertsOpen = true;
            const diagnostics = state.diagnostics || emptyDiagnostics();
            filterState.plato = 'ALL';
            filterState.fase = 'ALL';
            filterState.errors = true;
            filterState.noDuration = diagnostics.missingDurations > 0;
            filterState.noResource = false;
            state.screen = 'plan';
            state.uiMode = 'prep';
            state.advancedOpen = true;
            render();
            const reviewSection = document.getElementById('review');
            if (reviewSection) {
              reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }

        function renderQuestions() {
          const allQuestions = (plan.preguntas_rapidas || []).concat(plan.preguntas_guiadas || []);
          if (!allQuestions.length) {
            questionsListEl.innerHTML = '<div class="note">Sin preguntas pendientes.</div>';
            return;
        }
        questionsListEl.innerHTML = allQuestions
          .map((question) => {
            const selected = questionAnswers[question.id] || '';
            const options = [''].concat(question.opciones || []);
            const optionsHtml = options
              .map((option) => {
                let label = option || 'Selecciona opcion';
                if (option && recursoById[option]) {
                  label = recursoById[option].nombre;
                } else if (option === 'NINGUNO') {
                  label = 'Ninguno';
                }
                return `<option value="${option}" ${
                  option === selected ? 'selected' : ''
                }>${label}</option>`;
              })
              .join('');
            return `
              <div class="question-item">
                <div><strong>${question.pregunta}</strong></div>
                <select data-question-id="${question.id}">${optionsHtml}</select>
              </div>
            `;
          })
          .join('');
      }

      function removeTasksByPredicate(predicate) {
        const removed = plan.tareas.filter(predicate);
        if (!removed.length) {
          return [];
        }
        const removedIds = new Set(removed.map((task) => task.id));
        plan.tareas = plan.tareas.filter((task) => !removedIds.has(task.id));
        plan.tareas.forEach((task) => {
          task.depende_de = task.depende_de.filter((depId) => !removedIds.has(depId));
        });
        syncMaps();
        return removed;
      }

      function cleanupIngredientTasks() {
        const removed = removeTasksByPredicate((task) => {
          if (!isIngredientDishName(task.plato)) {
            return false;
          }
          const name = normalizeToken(task.nombre || '');
          if (/\d/.test(name)) {
            return true;
          }
          return /(g|kg|ml|l|cl|gramo|cucharad|taza|ud)/.test(name);
        });
        return removed.length;
      }

      function pickDependencyForDish(dishName, targetPhase) {
        const phaseOrder = plan.fases || PHASES;
        const targetIndex = phaseOrder.indexOf(targetPhase);
        const candidates = plan.tareas.filter(
          (task) => task.plato === dishName && phaseOrder.indexOf(task.fase) <= targetIndex
        );
        if (!candidates.length) {
          return [];
        }
        const sorted = candidates.sort((a, b) => {
          const phaseDiff = phaseOrder.indexOf(a.fase) - phaseOrder.indexOf(b.fase);
          if (phaseDiff !== 0) {
            return phaseDiff;
          }
          return (a.planRank ?? 0) - (b.planRank ?? 0);
        });
        const last = sorted[sorted.length - 1];
        return last ? [last.id] : [];
      }

        function addQuickTaskForDish(dishName, name, phase, process, level) {
          const existingIds = new Set(plan.tareas.map((task) => task.id));
          const idBase = makeIdFromName(`${dishName}-${process}`, 'TASK');
          const id = ensureUniqueId(idBase, existingIds);
          const deps = pickDependencyForDish(dishName, phase);
          const resourceInfo = resourceForProcess(
            process,
            plan.recursos,
            menuDraft?.suggestions,
            plan.preguntas_guiadas,
            id,
            dishName
          );
          const task = buildTask(
            id,
            dishName,
            withInferTag(name, true),
            phase,
            estimateDuration(process, 20, dishName),
            process,
            resourceInfo?.resourceId || null,
            level,
            deps,
            'FIX',
            0.45,
            resourceInfo
          );
          task.duracion_inferida = true;
          plan.tareas.push(task);
          syncMaps();
          return task;
        }

        function applyAddResourceAnswer(question, value) {
          if (value !== 'SI') {
            return;
          }
          const resourceId = normalizeResourceId(question.recurso_id || question.recurso_nombre || '');
          if (resourceId && !recursoById[resourceId]) {
            plan.recursos.push({
              id: resourceId,
              nombre: question.recurso_nombre || RESOURCE_LABELS[resourceId] || resourceId,
              capacidad: Math.max(0, sanitizeInt(question.capacidad, 1)),
              tipo: question.tipo_recurso || 'OTRO',
              typeKey: normalizeResourceName(question.recurso_nombre || resourceId)
            });
            syncMaps();
          }
          (question.afecta_a || []).forEach((taskId) => {
            const task = tareaById[taskId];
            if (task && resourceId) {
              setTaskResource(task, resourceId);
              if (!PROCESS_TYPES.includes(task.proceso)) {
                task.proceso = inferProcessFromName(task.nombre || '');
              }
            }
          });
        }

      function applyQuestionAnswer(questionId, value) {
        const allQuestions = (plan.preguntas_rapidas || []).concat(plan.preguntas_guiadas || []);
        const question = allQuestions.find((item) => item.id === questionId);
        if (!question) {
          return;
        }
        questionAnswers[questionId] = value;
        if (question.tipo === 'ADD_RESOURCE') {
          applyAddResourceAnswer(question, value);
          plan.preguntas_guiadas = prioritizeQuestions(plan.preguntas_guiadas);
          validateAndStore();
          calculatePlan({ silent: true });
          render();
          return;
        }
        if (question.tipo === 'CROQUETAS_TIPO') {
          const dishName = question.plato;
          if (dishName && value === 'COMPRADAS') {
            removeTasksByPredicate(
              (task) => task.plato === dishName && !['FREIR', 'EMPLATAR'].includes(task.proceso)
            );
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'FREIR')) {
              addQuickTaskForDish(dishName, 'freir croquetas', 'PREELABORACION', 'FREIR', 2);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'EMPLATAR')) {
              addQuickTaskForDish(dishName, `emplatar ${dishName}`, 'SERVICIO', 'EMPLATAR', 1);
            }
          }
          if (dishName && value === 'CASERAS') {
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'LAVAR')) {
              addQuickTaskForDish(dishName, `lavar ingredientes de ${dishName}`, 'MISE_EN_PLACE', 'LAVAR', 1);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'CORTAR')) {
              addQuickTaskForDish(dishName, `picar ingredientes de ${dishName}`, 'MISE_EN_PLACE', 'CORTAR', 1);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'COCER')) {
              addQuickTaskForDish(dishName, 'cocer bechamel', 'PREELABORACION', 'COCER', 2);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'ENFRIAR')) {
              addQuickTaskForDish(dishName, 'enfriar bechamel', 'PREELABORACION', 'ENFRIAR', 1);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'FORMAR')) {
              addQuickTaskForDish(dishName, 'formar croquetas', 'PREELABORACION', 'FORMAR', 1);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'FREIR')) {
              addQuickTaskForDish(dishName, 'freir croquetas', 'PREELABORACION', 'FREIR', 2);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'EMPLATAR')) {
              addQuickTaskForDish(dishName, `emplatar ${dishName}`, 'SERVICIO', 'EMPLATAR', 1);
            }
          }
          plan.preguntas_guiadas = prioritizeQuestions(plan.preguntas_guiadas);
          validateAndStore();
          calculatePlan({ silent: true });
          render();
          return;
        }
        if (question.tipo === 'FLAN_TIPO') {
          const dishName = question.plato;
          if (dishName && value === 'COMPRADO') {
            removeTasksByPredicate(
              (task) => task.plato === dishName && task.proceso !== 'EMPLATAR'
            );
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'EMPLATAR')) {
              addQuickTaskForDish(dishName, `servir ${dishName}`, 'SERVICIO', 'EMPLATAR', 1);
            }
          }
          if (dishName && value === 'CASERO') {
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'MEZCLAR')) {
              addQuickTaskForDish(dishName, `mezclar ingredientes de ${dishName}`, 'MISE_EN_PLACE', 'MEZCLAR', 1);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'BANO_MARIA')) {
              addQuickTaskForDish(
                dishName,
                `cocer ${dishName} al bano maria`,
                'PREELABORACION',
                'BANO_MARIA',
                2
              );
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'ENFRIAR')) {
              addQuickTaskForDish(dishName, `enfriar ${dishName}`, 'PREELABORACION', 'ENFRIAR', 1);
            }
            if (!plan.tareas.some((task) => task.plato === dishName && task.proceso === 'EMPLATAR')) {
              addQuickTaskForDish(dishName, `desmoldar ${dishName}`, 'SERVICIO', 'EMPLATAR', 1);
            }
          }
          plan.preguntas_guiadas = prioritizeQuestions(plan.preguntas_guiadas);
          validateAndStore();
          calculatePlan({ silent: true });
          render();
          return;
        }
        (question.afecta_a || []).forEach((taskId) => {
          const task = tareaById[taskId];
          if (!task) {
            return;
          }
          if (value === 'NINGUNO') {
            setTaskResource(task, null);
            task.autoAssigned = false;
            return;
          }
          if (/^\d+$/.test(value)) {
            task.duracion_min = parseInt(value, 10);
            task.duracion_inferida = false;
            task.autoAssigned = false;
            return;
          }
          const resource = normalizeResourceId(value);
          if (resource && !recursoById[resource]) {
            queueAddResourceQuestion(resource, plan.preguntas_guiadas, taskId, task.plato);
            return;
          }
          if (resource && recursoById[resource]) {
            setTaskResource(task, resource);
            task.proceso = inferProcessForResource(task.plato, resource, plan.recursos);
            task.autoAssigned = false;
            if (question.tipo === 'METODO') {
              updateTaskNameForProcess(task, task.proceso);
            }
          }
        });
        plan.preguntas_guiadas = prioritizeQuestions(plan.preguntas_guiadas);
        validateAndStore();
        calculatePlan({ silent: true });
        render();
      }

      function addSuggestedResources() {
        const questions = (plan.preguntas_guiadas || []).filter((item) => item.tipo === 'ADD_RESOURCE');
        if (!questions.length) {
          return 0;
        }
        let created = 0;
        questions.forEach((question) => {
          const before = plan.recursos.length;
          questionAnswers[question.id] = 'SI';
          applyAddResourceAnswer(question, 'SI');
          const after = plan.recursos.length;
          if (after > before) {
            created += after - before;
          }
        });
        plan.preguntas_guiadas = prioritizeQuestions(plan.preguntas_guiadas);
        validateAndStore();
        calculatePlan({ silent: true });
        return created;
      }

      function renderAssignments() {
        const reviewSection = document.getElementById('review');
        const isEmptyPlan = Boolean(plan && plan.isEmpty);
        const hasTasks = Boolean(plan && Array.isArray(plan.tareas) && plan.tareas.length);
        if (reviewSection) {
          reviewSection.classList.toggle('hidden', isEmptyPlan || !hasTasks);
        }
        if (isEmptyPlan || !hasTasks) {
          if (assignmentListEl) {
            assignmentListEl.innerHTML = '';
          }
          if (incompleteCountEl) {
            incompleteCountEl.textContent = 'Errores bloqueantes: 0 | Avisos: 0';
          }
          if (normalizedCountEl) {
            normalizedCountEl.textContent = '';
          }
          return;
        }
        const incompleteMap = new Map();
        let incompleteCount = 0;
        const errorTaskIds = new Set(
          (state.issues || [])
            .filter((issue) => issue.severity === 'error' && issue.entityType === 'task')
            .map((issue) => issue.entityId)
        );
        const warningTaskIds = new Set(
          (state.issues || [])
            .filter((issue) => issue.severity === 'warning' && issue.entityType === 'task')
            .map((issue) => issue.entityId)
        );
        plan.tareas.forEach((task) => {
          const info = getTaskIncompleteInfo(task);
          if (errorTaskIds.has(task.id)) {
            info.incomplete = true;
          }
          incompleteMap.set(task.id, info);
          if (info.incomplete) {
            incompleteCount += 1;
          }
        });
        if (incompleteCountEl) {
          const warningCount = warningTaskIds.size;
          incompleteCountEl.textContent = `Errores bloqueantes: ${incompleteCount} | Avisos: ${warningCount}`;
        }
        if (normalizedCountEl) {
          const normalizedCount = plan.tareas.filter((task) => task.autoNormalized).length;
          normalizedCountEl.textContent = normalizedCount
            ? `Nombres simplificados automaticamente: ${normalizedCount}`
            : '';
        }
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        if (approvePlanBtn) {
          approvePlanBtn.disabled = errorCount > 0;
          approvePlanBtn.title = errorCount
            ? `Hay ${errorCount} problemas que requieren decision.`
            : '';
        }

        if (!assignmentListEl) {
          return;
        }
        const tasks = plan.tareas.filter((task) => {
          if (filterState.plato !== 'ALL' && task.plato !== filterState.plato) {
            return false;
          }
          if (filterState.fase !== 'ALL' && task.fase !== filterState.fase) {
            return false;
          }
          const missing = incompleteMap.get(task.id)?.missing || {};
          const isProblem =
            errorTaskIds.has(task.id) ||
            warningTaskIds.has(task.id) ||
            Boolean(incompleteMap.get(task.id)?.incomplete);
          if (filterState.errors && !isProblem) {
            return false;
          }
          if (filterState.noDuration && !missing.duracion) {
            return false;
          }
          if (filterState.noResource && !missing.recurso) {
            return false;
          }
          return true;
        });

        tasks.sort((a, b) => {
          const phaseDiff = plan.fases.indexOf(a.fase) - plan.fases.indexOf(b.fase);
          if (phaseDiff !== 0) {
            return phaseDiff;
          }
          const rankDiff = (a.planRank ?? 999) - (b.planRank ?? 999);
          if (rankDiff !== 0) {
            return rankDiff;
          }
          return a.nombre.localeCompare(b.nombre);
        });

        const isExpert = state.expertMode;
        const isPrep = state.uiMode === 'prep' && !isExpert;
        assignmentListEl.dataset.mode = isPrep ? 'prep' : isExpert ? 'expert' : 'basic';
        const header = isExpert
          ? `
          <div class="assign-row header">
            <div class="cell col-action">Accion</div>
            <div class="cell col-dish">Plato</div>
            <div class="cell col-phase">Fase</div>
            <div class="cell col-resource">Recurso<br /><button class="btn ghost mini-btn" data-action="bulk-resource">Asignar heuristica</button></div>
            <div class="cell col-duration">Duracion<br /><button class="btn ghost mini-btn" data-action="bulk-duration">Aplicar por defecto</button></div>
            <div class="cell col-level">Nivel</div>
            <div class="cell col-person">Persona<br /><button class="btn ghost mini-btn" data-action="bulk-assign">Equilibrar</button></div>
            <div class="cell col-state">Estado</div>
          </div>
        `
          : isPrep
          ? `
          <div class="assign-row header">
            <div class="cell col-action">Tarea</div>
            <div class="cell col-dish">Plato</div>
            <div class="cell col-phase">Fase</div>
            <div class="cell col-resource">Recurso</div>
            <div class="cell col-duration">Duracion</div>
            <div class="cell col-person">Asignado</div>
          </div>
        `
          : `
          <div class="assign-row header">
            <div class="cell col-action">Accion</div>
            <div class="cell col-dish">Plato</div>
            <div class="cell col-resource">Recurso<br /><button class="btn ghost mini-btn" data-action="bulk-resource">Asignar heuristica</button></div>
            <div class="cell col-person">Persona<br /><button class="btn ghost mini-btn" data-action="bulk-assign">Equilibrar</button></div>
            <div class="cell col-state">Estado</div>
          </div>
        `;

        const rows = tasks
          .map((task) => {
            const incompleteInfo = incompleteMap.get(task.id) || { incomplete: false, missing: {} };
            const missing = incompleteInfo.missing || {};
            const person = task.asignado_a_id ? equipoById[task.asignado_a_id] : null;
            const invalid =
              (person && !isAssignmentAllowed(task, person)) ||
              (!person && task.asignado_a_id);
            const incomplete = incompleteInfo.incomplete;
            const warning = warningTaskIds.has(task.id);
            const low = task.confianza < LOW_CONFIDENCE;
            const showLow = state.expertMode && low;
            const status = state.expertMode
              ? `${task.estado} | Conf: ${task.confianza.toFixed(2)}`
              : task.estado;
            const disabled = task.estado !== 'PENDIENTE' ? 'disabled' : '';
            const phaseOptions = plan.fases
              .map(
                (fase) =>
                  `<option value="${fase}" ${fase === task.fase ? 'selected' : ''}>${phaseLabel(
                    fase
                  )}</option>`
              )
              .join('');
            const resourceValue = task.recurso_id || '';
            const resourceCatalog = getEffectiveResourcesCatalog();
            const resourceOptions = ['NINGUNO']
              .concat(resourceCatalog.list.map((resource) => resource.id))
              .map((resourceId) => {
                const value = resourceId === 'NINGUNO' ? '' : resourceId;
                if (!value) {
                  return `<option value="" ${resourceValue === '' ? 'selected' : ''}>Ninguno</option>`;
                }
                const resource = resourceCatalog.list.find((item) => item.id === resourceId);
                const label = resource
                  ? `${resource.typeKey || resource.id} (${resource.capacidad})`
                  : resourceId;
                return `<option value="${value}" ${
                  resourceValue === value ? 'selected' : ''
                }>${label}</option>`;
              })
              .join('');
            const assigneeOptions = [
              `<option value="">Sin asignar</option>`,
              ...plan.equipo.map(
                (member) =>
                  `<option value="${member.id}" ${
                    task.asignado_a_id === member.id ? 'selected' : ''
                  }>${member.nombre}</option>`
              )
            ].join('');
            let statusIcon = 'OK';
            if (incomplete) {
              statusIcon = 'X';
            } else if (warning) {
              statusIcon = '!';
            }
            const badge = incomplete
              ? '<span class="badge incomplete">ERROR</span>'
              : warning
              ? '<span class="badge warning">AVISO</span>'
              : '';
            const fullLabel = escapeAttribute(task.label_full || task.nombre || '');
            const missingNotes = [];
            if (missing.duracion) missingNotes.push('falta duracion');
            if (missing.recurso) missingNotes.push('falta recurso');
            if (missing.fase) missingNotes.push('falta fase');
            if (missing.asignado) missingNotes.push('falta persona');
            const rowTitle = escapeAttribute(
              [fullLabel, missingNotes.length ? `Falta: ${missingNotes.join(', ')}` : ''].filter(Boolean).join(' | ')
            );
            const rowClass = `${invalid ? 'invalid' : ''} ${incomplete ? 'incomplete' : ''} ${
              warning ? 'warning' : ''
            } ${showLow ? 'low' : ''}`;
            if (isExpert) {
              return `
                <div class="assign-row ${rowClass}" data-task-id="${task.id}" title="${rowTitle}">
                  <div class="cell col-action">
                    <span class="state-icon">${statusIcon}</span>
                    <strong>${getTaskDisplayName(task)}</strong> ${badge}
                  </div>
                  <div class="cell col-dish">${shortDishLabel(task.plato)}</div>
                  <div class="cell col-phase">
                    <select data-task-id="${task.id}" data-field="fase" ${disabled}>${phaseOptions}</select>
                  </div>
                  <div class="cell col-resource">
                    <select data-task-id="${task.id}" data-field="recurso" ${disabled}>${resourceOptions}</select>
                  </div>
                  <div class="cell col-duration">
                    <input type="number" min="1" data-task-id="${task.id}" data-field="duracion" value="${
                task.duracion_min
              }" ${disabled} class="${missing.duracion ? 'field-missing' : ''}" />
                  </div>
                  <div class="cell col-level">${task.nivel_min}</div>
                  <div class="cell col-person">
                    <select data-task-id="${task.id}" data-field="asignado" ${disabled}>${assigneeOptions}</select>
                  </div>
                  <div class="cell col-state">${status}</div>
                </div>
              `;
            }
            if (isPrep) {
              return `
                <div class="assign-row ${rowClass}" data-task-id="${task.id}" title="${rowTitle}">
                  <div class="cell col-action">
                    <span class="state-icon">${statusIcon}</span>
                    <strong>${getTaskDisplayName(task)}</strong> ${badge}
                  </div>
                  <div class="cell col-dish">${shortDishLabel(task.plato)}</div>
                  <div class="cell col-phase">
                    <select data-task-id="${task.id}" data-field="fase" ${disabled}>${phaseOptions}</select>
                  </div>
                  <div class="cell col-resource">
                    <select data-task-id="${task.id}" data-field="recurso" ${disabled}>${resourceOptions}</select>
                  </div>
                  <div class="cell col-duration">
                    <input type="number" min="1" data-task-id="${task.id}" data-field="duracion" value="${
                task.duracion_min
              }" ${disabled} class="${missing.duracion ? 'field-missing' : ''}" />
                  </div>
                  <div class="cell col-person">
                    <select data-task-id="${task.id}" data-field="asignado" ${disabled}>${assigneeOptions}</select>
                  </div>
                </div>
              `;
            }
            return `
              <div class="assign-row ${rowClass}" data-task-id="${task.id}" title="${rowTitle}">
                <div class="cell col-action">
                  <span class="state-icon">${statusIcon}</span>
                  <strong>${getTaskDisplayName(task)}</strong> ${badge}
                </div>
                <div class="cell col-dish">${shortDishLabel(task.plato)}</div>
                <div class="cell col-resource">
                  <select data-task-id="${task.id}" data-field="recurso" ${disabled}>${resourceOptions}</select>
                </div>
                <div class="cell col-person">
                  <select data-task-id="${task.id}" data-field="asignado" ${disabled}>${assigneeOptions}</select>
                </div>
                <div class="cell col-state">${status}</div>
              </div>
            `;
          })
          .join('');

        assignmentListEl.innerHTML = header + rows;
      }

      function getTaskIncompleteInfo(task) {
        const missing = {
          plato: !String(task.plato || task.plato_id || '').trim(),
          fase: !plan.fases.includes(task.fase),
          duracion: !Number.isFinite(Number(task.duracion_min)) || Number(task.duracion_min) <= 0,
          asignado: false,
          recurso: false
        };
        const expected = getExpectedResourceForProcess(task.proceso, plan.recursos);
        if (expected.needs) {
          const catalog = getEffectiveResourcesCatalog();
          const assignedId = task.resourceId || task.recurso_id || null;
          const assignedTypeKey = normalizeResourceName(task.resourceTypeKey || assignedId || '');
          const hasResource =
            (assignedId && catalog.list.some((resource) => resource.id === assignedId)) ||
            (assignedTypeKey && (catalog.byTypeKey[assignedTypeKey] || []).length > 0);
          if (expected.missing) {
            missing.recurso = true;
          } else if (!assignedTypeKey || !hasResource) {
            missing.recurso = true;
          } else if (expected.typeKey && assignedTypeKey !== expected.typeKey) {
            missing.recurso = true;
          }
        }
        const incomplete = Object.values(missing).some(Boolean);
        return { incomplete, missing, expected };
      }

      function fillMissingDurations({ silent = false } = {}) {
        let count = 0;
        plan.tareas.forEach((task) => {
          const duration = Number(task.duracion_min);
          if (!Number.isFinite(duration) || duration <= 0) {
            const process = PROCESS_TYPES.includes(task.proceso)
              ? task.proceso
              : inferProcessFromName(task.nombre || '');
            task.duracion_min = estimateDuration(process, 20, task.plato || '');
            task.duracion_inferida = true;
            task.autoAssigned = false;
            updateTaskLabels(task, plan.recursos);
            count += 1;
          }
        });
        if (count) {
          validateAndStore();
          calculatePlan({ silent: true });
          if (!silent) {
            state.lastPlanMessage = `Duraciones completadas: ${count}.`;
          }
        }
        return count;
      }

      function assignResourcesByHeuristic({ silent = false } = {}) {
        let count = 0;
        let changed = false;
        const effective = getEffectiveResourcesCatalog();
        plan.tareas.forEach((task) => {
          if (task && task.estado && task.estado !== 'PENDIENTE') {
            return;
          }
          if (task && task.locked) {
            return;
          }
          const currentId = task.recurso_id || task.resourceId || null;
          if (currentId) {
            const entry = effective.list.find((resource) => resource.id === currentId);
            if (entry && sanitizeInt(entry.capacidad, 0) > 0) {
              if (!task.recurso_id) {
                setTaskResource(task, currentId);
                changed = true;
              }
              return;
            }
            setTaskResource(task, null);
            changed = true;
          }
          const taskTypeKey = normalizeResourceName(task.resourceTypeKey || '');
          if (taskTypeKey) {
            const candidates = effective.byTypeKey[taskTypeKey] || [];
            const available =
              candidates.find((resource) => sanitizeInt(resource.capacidad, 0) > 0) || candidates[0];
            if (available) {
              setTaskResource(task, available.id);
              updateTaskLabels(task, plan.recursos);
              count += 1;
              changed = true;
              return;
            }
          }
          const expected = getExpectedResourceForProcess(task.proceso, plan.recursos);
          if (expected.needs) {
            if (expected.resourceId) {
              const resourceEntry = effective.list.find((item) => item.id === expected.resourceId);
              if (!resourceEntry || sanitizeInt(resourceEntry.capacidad, 0) <= 0) {
                return;
              }
              setTaskResource(task, expected.resourceId);
              updateTaskLabels(task, plan.recursos);
              count += 1;
              changed = true;
            }
            return;
          }
          const dishHint = task.plato ? inferResourceForDish(task.plato) : null;
          if (dishHint) {
            const candidates = effective.byTypeKey[dishHint] || [];
            const available =
              candidates.find((resource) => sanitizeInt(resource.capacidad, 0) > 0) || candidates[0];
            if (available) {
              setTaskResource(task, available.id);
              updateTaskLabels(task, plan.recursos);
              count += 1;
              changed = true;
            }
          }
        });
        if (changed) {
          validateAndStore();
          calculatePlan({ silent: true });
          if (!silent) {
            state.lastPlanMessage = `Recursos asignados: ${count}.`;
          }
        }
        if (!silent) {
          render();
        }
        return count;
      }

      function unlockNonCriticalAssignments() {
        let unlocked = 0;
        plan.tareas.forEach((task) => {
          if (!task.locked) {
            return;
          }
          const assignedId = task.asignado_a_id;
          if (!assignedId || !equipoById[assignedId]) {
            task.locked = false;
            task.asignado_a_id = assignedId && equipoById[assignedId] ? assignedId : null;
            task.autoAssigned = false;
            unlocked += 1;
          }
        });
        return unlocked;
      }

      function reviewPlan(planToReview) {
        if (!planToReview) {
          return { errorCount: 0, adjustments: 0 };
        }
        const settings = normalizePlanSettings(planToReview.settings || {});
        let adjustments = 0;
        state.issuesOpen = false;
        const unlocked = unlockNonCriticalAssignments();
        adjustments += unlocked;
        if (settings.autoFixOnReview) {
          adjustments += cleanupIngredientTasks();
          adjustments += normalizeTaskLabels();
          adjustments += fillMissingDurations({ silent: true });
          adjustments += assignResourcesByHeuristic({ silent: true });
        }
        let autoAssignResult = { assignedCount: 0, skippedLocked: 0 };
        if (settings.autoAssignOnReview) {
          autoAssignResult = autoAssignBalanced({
            phaseOnly: false,
            respectLocked: true,
            onlyUnassigned: true
          });
          adjustments += autoAssignResult?.assignedCount || 0;
        }
        const scheduled = calculatePlan({ silent: true });
        validateAndStore();
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        state.approved = scheduled && errorCount === 0;
        return { errorCount, adjustments, assignedCount: autoAssignResult.assignedCount || 0 };
      }

      function reviewAutomatically() {
        if (!plan) {
          return;
        }
        const result = reviewPlan(plan);
        if (result.errorCount) {
          planStatusEl.textContent = `Hay ${result.errorCount} problemas que requieren decision.`;
        } else if (result.adjustments > 0) {
          planStatusEl.textContent = `Plan listo con ${result.adjustments} ajustes automaticos.`;
        } else {
          planStatusEl.textContent = 'Plan listo.';
        }
        render();
      }

      function normalizeTaskLabels() {
        let updated = 0;
        plan.tareas.forEach((task) => {
          const prev = task.label_short;
          updateTaskLabels(task, plan.recursos);
          if (task.label_short !== prev) {
            updated += 1;
          }
        });
        return updated;
      }

      function resolveAllAutomatically(options = {}) {
        if (!plan) {
          return { errorCount: 0, warningCount: 0, adjustments: 0, scheduled: false };
        }
        const settings = {
          durations: true,
          resources: true,
          assign: true,
          normalize: true,
          cleanup: true,
          ...options
        };
        const cleaned = settings.cleanup ? cleanupIngredientTasks() : 0;
        const labelUpdates = settings.normalize ? normalizeTaskLabels() : 0;
        const durationFixes = settings.durations ? fillMissingDurations({ silent: true }) : 0;
        const resourceFixes = settings.resources ? assignResourcesByHeuristic({ silent: true }) : 0;
        const autoAssignResult = settings.assign
          ? autoAssignBalanced({
              phaseOnly: false,
              respectLocked: true,
              onlyUnassigned: true
            })
          : { assignedCount: 0 };
        const scheduled = calculatePlan({ silent: true });
        validateAndStore({ skipAutoFixes: true });
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        const warningCount = (state.issues || []).filter((issue) => issue.severity === 'warning').length;
        const autoAssigned = autoAssignResult?.assignedCount || 0;
        const adjustments = labelUpdates + durationFixes + resourceFixes + autoAssigned + cleaned;
        state.approved = scheduled && errorCount === 0;
        return { errorCount, warningCount, adjustments, scheduled };
      }

      function startService() {
        if (!plan) {
          return;
        }
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        if (errorCount) {
          setText(planStatusEl, `Hay ${errorCount} problemas que requieren decision.`);
          return;
        }
        if (!state.approved) {
          setText(planStatusEl, 'Revisa automaticamente antes de iniciar.');
          return;
        }
        state.uiMode = 'kitchen';
        state.advancedOpen = false;
        if (!plan.startedAt) {
          plan.startedAt = new Date().toISOString();
        }
        startPhaseCountdown();
      }

      function getIssueById(issueId) {
        return (state.issues || []).find((issue) => issue.id === issueId);
      }

      function getIssueContext(issue) {
        if (!issue) {
          return '';
        }
        if (issue.entityType === 'task') {
          const task = tareaById[issue.entityId];
          if (!task) {
            return '';
          }
          return `(${shortDishLabel(task.plato)} | ${shortProcessLabel(task.proceso)})`;
        }
        if (issue.entityType === 'resource') {
          const resource = recursoById[issue.entityId];
          return resource ? `(Recurso: ${resource.nombre})` : '';
        }
        if (issue.entityType === 'person') {
          const person = equipoById[issue.entityId];
          return person ? `(Equipo: ${person.nombre})` : '';
        }
        return '';
      }

      function pulseElement(element) {
        if (!element) {
          return;
        }
        element.classList.add('pulse-error');
        window.setTimeout(() => {
          element.classList.remove('pulse-error');
        }, 2000);
      }

      function highlightField(element) {
        if (!element) {
          return;
        }
        element.classList.add('field-focus');
        window.setTimeout(() => {
          element.classList.remove('field-focus');
        }, 2000);
      }

      function scrollToIssue(issueId) {
        const issue = getIssueById(issueId);
        if (!issue) {
          return;
        }
        if (issue.entityType === 'task') {
          let row = assignmentListEl.querySelector(`.assign-row[data-task-id="${issue.entityId}"]`);
          if (!row) {
            filterState.plato = 'ALL';
            filterState.fase = 'ALL';
            filterState.errors = false;
            filterState.noDuration = false;
            filterState.noResource = false;
            renderFilters();
            renderAssignments();
            row = assignmentListEl.querySelector(`.assign-row[data-task-id="${issue.entityId}"]`);
          }
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            pulseElement(row);
            if (issue.field) {
              const fieldEl = row.querySelector(`[data-field="${issue.field}"]`);
              highlightField(fieldEl);
              if (fieldEl && typeof fieldEl.focus === 'function') {
                fieldEl.focus();
              }
            }
          }
          return;
        }
        if (issue.entityType === 'resource') {
          const section = document.getElementById('config');
          const row = document.querySelector(`[data-resource-id="${issue.entityId}"]`);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          pulseElement(row);
          return;
        }
        if (issue.entityType === 'person') {
          const section = document.getElementById('config');
          const row = document.querySelector(`[data-person-id="${issue.entityId}"]`);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          pulseElement(row);
          return;
        }
        const reviewSection = document.getElementById('review');
        if (reviewSection) {
          reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      function applyIssueFix(issue, options = {}) {
        const { silent = false } = options;
        if (!issue || !issue.fix) {
          return false;
        }
        if (issue.entityType === 'task') {
          const task = tareaById[issue.entityId];
          if (!task) {
            return false;
          }
          if (issue.fix.action === 'FILL_DURATION') {
            const process = PROCESS_TYPES.includes(task.proceso)
              ? task.proceso
              : inferProcessFromName(task.nombre || '');
            task.duracion_min = estimateDuration(process, 20, task.plato || '');
            task.duracion_inferida = true;
            task.autoAssigned = false;
          } else if (issue.fix.action === 'SET_RESOURCE') {
            const resourceId = issue.fix.resourceId;
            if (resourceId && recursoById[resourceId]) {
              setTaskResource(task, resourceId);
            }
          } else if (issue.fix.action === 'CLEAR_RESOURCE') {
            setTaskResource(task, null);
          } else if (issue.fix.action === 'UNASSIGN') {
            task.asignado_a_id = null;
            task.locked = false;
            task.autoAssigned = false;
          } else if (issue.fix.action === 'UNLOCK') {
            task.locked = false;
          } else {
            return false;
          }
          updateTaskLabels(task, plan.recursos);
        } else {
          return false;
        }
        if (!silent) {
          validateAndStore();
          calculatePlan({ silent: true });
          render();
        }
        return true;
      }

      function applyAllIssueFixes() {
        const issuesWithFix = (state.issues || []).filter((issue) => issue.fix);
        let count = 0;
        issuesWithFix.forEach((issue) => {
          if (applyIssueFix(issue, { silent: true })) {
            count += 1;
          }
        });
        validateAndStore();
        calculatePlan({ silent: true });
        render();
        if (count) {
          planStatusEl.textContent = `Auto-fix aplicado en ${count} tareas.`;
        }
        return count;
      }

      function renderResourceEditor() {
        if (!plan.recursos.length) {
          resourceEditorEl.innerHTML = '<div class="note">Sin recursos.</div>';
          return;
        }
        resourceEditorEl.innerHTML = plan.recursos
          .map(
            (resource) => {
              const tipo = Object.values(RESOURCE_TYPES).includes(resource.tipo)
                ? resource.tipo
                : RESOURCE_TYPES.OTRO;
              const options = Object.values(RESOURCE_TYPES)
                .map(
                  (item) =>
                    `<option value="${item}" ${tipo === item ? 'selected' : ''}>${item}</option>`
                )
                .join('');
              return `
              <div class="config-row" data-resource-id="${resource.id}">
                <input type="text" data-field="nombre" value="${resource.nombre}" />
                <input type="number" min="0" data-field="capacidad" value="${resource.capacidad}" />
                <select data-field="tipo">
                  ${options}
                </select>
                <button class="btn ghost mini-btn" data-action="remove-resource">x</button>
              </div>
            `;
            }
          )
          .join('');
      }

      function renderResourceSummary() {
        if (!resourceSummaryEl) {
          return;
        }
        const effective = getEffectiveResources();
        if (!effective.list.length) {
          resourceSummaryEl.textContent = 'Capacidades detectadas: sin datos.';
          return;
        }
        const summary = effective.list
          .map((resource) => `${resource.nombre} ${resource.capacidad}`)
          .join(' | ');
        resourceSummaryEl.textContent = `Capacidades detectadas: ${summary}`;
      }

      function renderTeamEditor() {
        if (!plan.equipo.length) {
          teamEditorEl.innerHTML = '<div class="note">Sin equipo.</div>';
          return;
        }
          teamEditorEl.innerHTML = plan.equipo
            .map((person) => {
              const levels = [1, 2, 3]
                .map(
                  (lvl) =>
                    `<option value="${lvl}" ${person.nivel === lvl ? 'selected' : ''}>${lvl}</option>`
                )
                .join('');
              return `
                <div class="config-row team" data-person-id="${person.id}">
                  <input type="text" data-field="nombre" value="${person.nombre}" />
                  <input type="text" data-field="rol" value="${person.rol}" />
                  <select data-field="nivel">${levels}</select>
                  <button class="btn ghost mini-btn" data-action="remove-person">x</button>
                </div>
              `;
            })
            .join('');
        }

      function renderResources() {
        const usage = getResourceUsage();
        const effective = getEffectiveResources();
        if (!effective.list.length) {
          resourceListEl.innerHTML = '<div class="note">Sin recursos.</div>';
          return;
        }
        const iconForResource = (resource) => {
          const key = normalizeResourceName(resource.typeKey || resource.nombre || resource.id || '') || '';
          if (key === 'HORNO') return 'H';
          if (key === 'FOGONES') return 'F';
          if (key === 'ESTACION') return 'E';
          if (key === 'FREGADERO') return 'G';
          if (key === 'LAVAVAJILLAS') return 'L';
          return 'R';
        };
        resourceListEl.innerHTML = effective.list
          .map((resource) => {
            const slot = usage[resource.id];
            const used = slot ? slot.used : 0;
            let stateAttr = 'free';
            let stateLabel = 'Libre';
            if (used > 0 && used < resource.capacidad) {
              stateAttr = 'occupied';
              stateLabel = 'En uso';
            } else if (used >= resource.capacidad) {
              stateAttr = 'blocked';
              stateLabel = 'Saturado';
            }
            return `
              <div class="resource-item" data-state="${stateAttr}">
                <div class="resource-name"><span class="resource-icon">${iconForResource(resource)}</span>${resource.nombre}</div>
                <div class="resource-meta">Uso: ${used}/${resource.capacidad}</div>
                <div class="resource-meta">Estado: ${stateLabel}</div>
              </div>
            `;
          })
          .join('');
      }

      function renderLine() {
        const activePhase = getActivePhaseId();
        const teamIds = new Set(plan.equipo.map((person) => person.id));
        const phaseTasks = plan.tareas.filter((task) => task.fase === activePhase);
        const tasks = phaseTasks.filter((task) => teamIds.has(task.asignado_a_id));
        const isExecutable = (task) => {
          if (task.estado !== 'PENDIENTE') {
            return false;
          }
          if (!dependenciesMet(task)) {
            return false;
          }
          if (!task.asignado_a_id) {
            return false;
          }
          const person = equipoById[task.asignado_a_id];
          if (!person || !isAssignmentAllowed(task, person)) {
            return false;
          }
          if (!isPersonAvailable(task.asignado_a_id)) {
            return false;
          }
          const expected = getExpectedResourceForProcess(task.proceso, plan.recursos);
          if (expected.needs) {
            if (!task.resourceTypeKey || !task.recurso_id) {
              return false;
            }
            if (expected.typeKey && task.resourceTypeKey !== expected.typeKey) {
              return false;
            }
          }
          if (!isResourceAvailable(task.recurso_id)) {
            return false;
          }
          return true;
        };
        const executablePending = tasks.filter((task) => isExecutable(task)).length;
        lineNoteEl.innerHTML = `
          <div class="line-phase">FASE ACTIVA: ${phaseLabel(activePhase)}</div>
          <div class="note">Tareas visibles: ${tasks.length} | Ejecutables: ${executablePending}</div>
        `;

        if (!plan.equipo.length) {
          lineColumnsEl.innerHTML = '<div class="empty">Sin equipo definido</div>';
          return;
        }
        lineColumnsEl.innerHTML = plan.equipo
          .map((person) => {
            const personTasks = tasks.filter((task) => task.asignado_a_id === person.id);
            const pendingTasks = personTasks.filter((task) => isExecutable(task));
            const activeTasks = personTasks.filter((task) => task.estado === 'EN_CURSO');
            const doneTasks = personTasks.filter((task) => task.estado === 'FINALIZADA');

            let stateLabel = 'Sin tareas en fase';
            if (activeTasks.length) {
              stateLabel = 'En curso';
            } else if (pendingTasks.length) {
              stateLabel = 'Pendiente';
            } else if (doneTasks.length) {
              stateLabel = 'Hecho';
            }

            const buildCards = (list, hiddenCount) => {
              if (!list.length) {
                if (hiddenCount > 0) {
                  return `<div class="empty">+${hiddenCount} mas</div>`;
                }
                return '<div class="empty">Sin tareas</div>';
              }
              const cards = list
                .map((task) => {
                  const classes = [
                    'ticket',
                    task.estado === 'EN_CURSO' ? 'active' : task.estado === 'FINALIZADA' ? 'done' : 'pending',
                    task.justCompleted ? 'flash' : ''
                  ]
                    .filter(Boolean)
                    .join(' ');
                  const actionLabel = shortProcessLabel(task.proceso);
                  const dishLabel = shortDishLabel(task.plato);
                  const resourceLabel = getShortResourceLabel(task);
                  const resourceIcon = (() => {
                    const key = normalizeResourceName(task.resourceTypeKey || task.recurso_id || '');
                    if (key === 'HORNO') return 'H';
                    if (key === 'FOGONES') return 'F';
                    if (key === 'ESTACION') return 'E';
                    if (key === 'FREGADERO') return 'G';
                    if (key === 'LAVAVAJILLAS') return 'L';
                    return 'R';
                  })();
                  const durationLabel = `${task.duracion_min}m`;
                  const inferred = task.origen !== 'PDF' || task.duracion_inferida;
                  const inferredTitle =
                    task.confianza < LOW_CONFIDENCE ? 'Inferido (conf baja)' : 'Inferido';
                  const inferIcon = inferred ? `<span class="infer-icon" title="${inferredTitle}">~</span>` : '';
                  const stateText =
                    task.estado === 'EN_CURSO'
                      ? 'EN CURSO'
                      : task.estado === 'FINALIZADA'
                      ? 'HECHO'
                      : 'PENDIENTE';
                  return `
                    <div class="${classes}" data-action="toggle" data-task-id="${task.id}">
                      <div class="ticket-title">${actionLabel} | ${dishLabel}${inferIcon}</div>
                      <div class="ticket-line"><span>${resourceIcon} ${resourceLabel}</span><span>${durationLabel}</span></div>
                      <div class="ticket-line"><span>Estado</span><span class="badge state">${stateText}</span></div>
                    </div>
                  `;
                })
                .join('');
              const tail = hiddenCount > 0 ? `<div class="empty">+${hiddenCount} mas</div>` : '';
              return cards + tail;
            };

            const maxVisible = 3;
            const activeVisible = activeTasks.slice(0, maxVisible);
            let remaining = maxVisible - activeVisible.length;
            const pendingVisible = pendingTasks.slice(0, Math.max(0, remaining));
            remaining -= pendingVisible.length;
            const doneVisible = doneTasks.slice(0, Math.max(0, remaining));
            const hiddenPending = pendingTasks.length - pendingVisible.length;
            const hiddenActive = activeTasks.length - activeVisible.length;
            const hiddenDone = doneTasks.length - doneVisible.length;
            const pendingCards = buildCards(pendingVisible, hiddenPending);
            const activeCards = buildCards(activeVisible, hiddenActive);
            const doneCards = buildCards(doneVisible, hiddenDone);

            personTasks.forEach((task) => {
              task.justCompleted = false;
            });

            return `
              <div class="person-column">
                <div class="person-header">
                  <div class="person-name">${person.nombre}</div>
                  <div class="person-role">${person.rol} | Nivel ${person.nivel}</div>
                  <div class="person-state">${stateLabel}</div>
                </div>
                <div class="person-lanes">
                  <div class="lane-col">
                    <div class="lane-title">Pendiente</div>
                    <div class="lane">${pendingCards}</div>
                  </div>
                  <div class="lane-col">
                    <div class="lane-title">En curso</div>
                    <div class="lane">${activeCards}</div>
                  </div>
                  <div class="lane-col">
                    <div class="lane-title">Hecho</div>
                    <div class="lane">${doneCards}</div>
                  </div>
                </div>
              </div>
            `;
          })
          .join('');
      }
      function renderHeader() {
        try {
          if (planTitleEl) {
            if (state.screen === 'library') {
              planTitleEl.textContent = 'BIBLIOTECA';
            } else {
              planTitleEl.textContent = state.uiMode === 'prep' ? 'PREPARACION' : 'COCINA';
            }
          }
          if (state.screen === 'library') {
            return;
          }
          if (!plan) {
            return;
          }
          const activePhase = getActivePhaseId();
          if (activePhaseEl) {
            activePhaseEl.textContent = phaseLabel(activePhase);
            activePhaseEl.classList.add('status-badge', 'phase');
          }
          if (phaseStateEl) {
            if (!state.approved) {
              phaseStateEl.textContent = 'Plan sin aprobar';
            } else if (state.phaseStatus === 'idle') {
              phaseStateEl.textContent = 'En espera';
            } else if (state.phaseStatus === 'prestart') {
              phaseStateEl.textContent = 'Pre-start';
            } else if (state.phaseStatus === 'paused') {
              phaseStateEl.textContent = 'Pausado';
            } else if (state.phaseStatus === 'running') {
              phaseStateEl.textContent = 'En curso';
            } else if (state.phaseStatus === 'overdue') {
              phaseStateEl.textContent = 'Tiempo agotado';
            }
          }

          if (state.phaseStatus === 'prestart' || state.pausedFrom === 'prestart') {
            if (phaseTimerEl) {
              phaseTimerEl.textContent = formatClock(state.prestartRemaining);
            }
            if (phaseTimerNoteEl) {
              phaseTimerNoteEl.textContent = state.phaseStatus === 'paused' ? 'Pausado' : 'Cuenta atras inicio';
            }
          } else {
            if (phaseTimerEl) {
              phaseTimerEl.textContent = formatClock(state.phaseRemaining);
            }
            if (phaseTimerNoteEl) {
              phaseTimerNoteEl.textContent =
                state.phaseStatus === 'overdue'
                  ? 'Tiempo agotado'
                  : state.phaseStatus === 'paused'
                  ? 'Pausado'
                  : 'Cuenta atras fase';
            }
          }
          if (phaseTimerWrapEl) {
            const isServiceActive = state.phaseStatus !== 'idle';
            phaseTimerWrapEl.classList.toggle('hidden', !isServiceActive);
          }

          const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
          const warningCount = (state.issues || []).filter((issue) => issue.severity === 'warning').length;
          if (healthDetailsBtn) {
            const hasIssues = errorCount > 0 || warningCount > 0;
            healthDetailsBtn.disabled = !hasIssues;
            healthDetailsBtn.title = hasIssues ? '' : 'Sin problemas detectados';
          }
          if (planHealthEl) {
            planHealthEl.className = 'status-badge health';
            const isRunning = ['running', 'prestart', 'paused', 'overdue'].includes(state.phaseStatus);
            if (errorCount > 0) {
              planHealthEl.classList.add('error');
              planHealthEl.textContent = 'BLOQUEADO (' + errorCount + ')';
            } else if (isRunning) {
              if (warningCount > 0) {
                planHealthEl.classList.add('warn');
                planHealthEl.textContent = 'AVISOS (' + warningCount + ')';
              } else {
                planHealthEl.classList.add('ok');
                planHealthEl.textContent = 'LISTO';
              }
            } else if (warningCount > 0) {
              planHealthEl.classList.add('warn');
              planHealthEl.textContent = 'AVISOS (' + warningCount + ')';
            } else {
              planHealthEl.classList.add('ok');
              planHealthEl.textContent = 'LISTO';
            }
          }
        } catch (error) {
          console.error('renderHeader failed', error);
        }
      }
function updateControls() {
        const hasErrors = (state.issues || []).some((issue) => issue.severity === 'error');
        const hasPlanTasks = Boolean(plan && Array.isArray(plan.tareas) && plan.tareas.length > 0);
        const noPlan = !hasPlanTasks;
        const setButtonState = (button, disabled, reason) => {
          if (!button) {
            return;
          }
          button.disabled = disabled;
          button.title = disabled && reason ? reason : '';
        };
        if (noPlan) {
          const reason = 'No hay un plan activo';
          setButtonState(bulkResolveBtn, true, reason);
          setButtonState(rebalanceTeamBtn, true, reason);
          setButtonState(calcPlanBtn, true, reason);
          setButtonState(approvePlanBtn, true, reason);
          setButtonState(startPhaseBtn, true, reason);
          setButtonState(skipPrestartBtn, true, reason);
          setButtonState(prevPhaseBtn, true, reason);
          setButtonState(nextPhaseBtn, true, reason);
          setButtonState(autoAssignPhaseBtn, true, reason);
          setButtonState(autoAssignAllBtn, true, reason);
          setButtonState(unlockAssignmentsBtn, true, reason);
          setButtonState(fixDurationsBtn, true, reason);
          setButtonState(fixResourcesBtn, true, reason);
          setButtonState(autoAssignBalancedBtn, true, reason);
        }
        // Keep kitchen navigation always enabled; only block actions when plan not ready.
        if (startServiceBtn) {
          const disabled = noPlan || hasErrors || !state.approved || state.phaseStatus !== 'idle';
          const reason = hasErrors
            ? 'Bloqueado: errores en el plan'
            : noPlan
            ? 'No hay un plan activo'
            : !state.approved
            ? 'Plan sin aprobar'
            : state.phaseStatus !== 'idle'
            ? 'Servicio en curso'
            : '';
          setButtonState(startServiceBtn, disabled, reason);
          startServiceBtn.classList.remove('hidden');
        }
        if (startPhaseBtn) {
          const disabled = !state.approved || state.phaseStatus !== 'idle' || hasErrors;
          const reason = hasErrors
            ? 'Bloqueado: errores en el plan'
            : !state.approved
            ? 'Plan sin aprobar'
            : state.phaseStatus !== 'idle'
            ? 'Servicio en curso'
            : '';
          setButtonState(startPhaseBtn, disabled, reason);
        }
        if (pausePhaseBtn) {
          const disabled =
            !state.approved || !['running', 'prestart', 'paused'].includes(state.phaseStatus);
          pausePhaseBtn.textContent = state.phaseStatus === 'paused' ? 'Reanudar' : 'Pausar';
          const reason = !state.approved
            ? 'Plan sin aprobar'
            : !['running', 'prestart', 'paused'].includes(state.phaseStatus)
            ? 'Servicio inactivo'
            : '';
          setButtonState(pausePhaseBtn, disabled, reason);
        }
        if (finalizePhaseBtn) {
          const disabled = !state.approved || state.phaseStatus === 'idle';
          const reason = !state.approved ? 'Plan sin aprobar' : state.phaseStatus === 'idle' ? 'Servicio inactivo' : '';
          setButtonState(finalizePhaseBtn, disabled, reason);
        }
        if (healthDetailsBtn) {
          const hasIssues = (state.issues || []).length > 0;
          setButtonState(healthDetailsBtn, !hasIssues, hasIssues ? '' : 'Sin problemas');
        }
        setButtonState(
          skipPrestartBtn,
          noPlan || state.phaseStatus !== 'prestart',
          noPlan ? 'No hay un plan activo' : 'No hay pre-start activo'
        );
        setButtonState(prevPhaseBtn, noPlan || !state.approved, noPlan ? 'No hay un plan activo' : 'Plan sin aprobar');
        setButtonState(nextPhaseBtn, noPlan || !state.approved, noPlan ? 'No hay un plan activo' : 'Plan sin aprobar');
      }

      function updateFinishScreen() {
        const allDone = plan.tareas.length && plan.tareas.every((task) => task.estado === 'FINALIZADA');
        finishScreenEl.classList.toggle('show', allDone);
        if (allDone) {
          stopTicker();
        }
      }

      function render() {
        document.body.classList.toggle('screen-library', state.screen === 'library');
        document.body.classList.toggle('screen-plan', state.screen === 'plan');
        renderLibrary();
        if (!plan) {
          return;
        }
        document.body.classList.toggle('compact', state.compactMode);
        document.body.classList.toggle('mode-library', state.uiMode === 'library');
        document.body.classList.toggle('mode-kitchen', state.uiMode === 'kitchen');
        document.body.classList.toggle('mode-prep', state.uiMode === 'prep');
        const viewLibraryEl = document.getElementById('view-library');
        const viewPrepEl = document.getElementById('view-prep');
        const viewKitchenEl = document.getElementById('view-kitchen');
        if (viewLibraryEl) {
          viewLibraryEl.hidden = state.screen !== 'library';
        }
        if (viewPrepEl) {
          viewPrepEl.hidden = state.uiMode !== 'prep';
        }
        if (viewKitchenEl) {
          viewKitchenEl.hidden = state.uiMode !== 'kitchen';
        }
        document.body.classList.toggle('expert', state.expertMode);
        document.body.classList.toggle('service-active', state.phaseStatus !== 'idle');
        document.body.classList.toggle('manual-open', state.manualTextOpen);
        if (advancedPanelEl) {
          advancedPanelEl.open = state.advancedOpen;
        }
        if (advancedToggleBtn) {
          advancedToggleBtn.classList.toggle('active', state.advancedOpen);
        }
        if (expertToggleEl) {
          expertToggleEl.checked = state.expertMode;
        }
        if (debugToggleEl) {
          debugToggleEl.checked = state.debugEnabled;
        }
        if (modeLibraryBtn) {
          modeLibraryBtn.classList.toggle('active', state.uiMode === 'library');
        }
        if (modeKitchenBtn) {
          modeKitchenBtn.classList.toggle('active', state.uiMode === 'kitchen');
        }
        if (modePrepBtn) {
          modePrepBtn.classList.toggle('active', state.uiMode === 'prep');
        }
        const hasPlanTasks = Boolean(plan && Array.isArray(plan.tareas) && plan.tareas.length > 0);
        // Allow kitchen navigation always; only disable actions when no plan tasks.
        if (goKitchenBtn) {
          goKitchenBtn.disabled = false;
          goKitchenBtn.title = hasPlanTasks ? '' : 'No hay un plan activo';
        }
        if (modeKitchenBtn) {
          modeKitchenBtn.disabled = false;
          modeKitchenBtn.title = hasPlanTasks ? '' : 'No hay un plan activo';
        }
        renderDraftSummary();
        renderAlerts();
        renderFilters();
        renderValidation();
        updateSettingsPanel();
        renderQuestions();
        renderAssignments();
        renderPrepIssues();
        renderPrepContext();
        renderPrepReady();
          renderResourceSummary();
          renderResourceEditor();
          renderTeamEditor();
          renderResources();
          renderLine();
          renderHeader();
          updateControls();
          updateFinishScreen();
          updateDebugText();
        }

      function updateTaskField(taskId, field, value) {
        const task = tareaById[taskId];
        if (!task || task.estado !== 'PENDIENTE') {
          return;
        }
        if (field === 'fase') {
          task.fase = value;
        } else if (field === 'recurso') {
          const resourceId = value || null;
          setTaskResource(task, resourceId && recursoById[resourceId] ? resourceId : null);
          if (task.recurso_id) {
            const inferred = inferProcessFromName(task.nombre || '');
            const newProcess = inferProcessForResource(task.plato, task.recurso_id, plan.recursos);
            task.proceso = newProcess;
            if (inferred !== newProcess || inferred === 'OTRO') {
              updateTaskNameForProcess(task, newProcess);
            }
          }
          } else if (field === 'duracion') {
            const duration = Math.max(1, Number(value) || 1);
            task.duracion_min = duration;
            task.duracion_inferida = false;
        } else if (field === 'asignado') {
            task.asignado_a_id = value || null;
            task.locked = Boolean(value);
            task.autoAssigned = false;
          }
        updateTaskLabels(task, plan.recursos);
        validateAndStore();
        calculatePlan({ silent: true });
        render();
      }

      function updateTask(taskId, patch) {
        if (!patch || !taskId) {
          return;
        }
        Object.entries(patch).forEach(([field, value]) => {
          updateTaskField(taskId, field, value);
        });
      }

      function updateResourceField(resourceId, field, value) {
        const resource = plan.recursos.find((item) => item.id === resourceId);
        if (!resource) {
          return;
        }
        if (field === 'nombre') {
          const trimmed = String(value || '').trim();
          if (!trimmed) {
            return;
          }
          const oldId = resource.id;
          const newIdBase = makeIdFromName(trimmed, 'RECURSO');
          const existing = new Set(plan.recursos.map((item) => item.id));
          let newId = newIdBase;
          let counter = 2;
          while (existing.has(newId) && newId !== oldId) {
            newId = `${newIdBase}_${counter}`;
            counter += 1;
          }
          resource.nombre = trimmed;
          resource.typeKey = normalizeResourceName(trimmed) || resource.typeKey;
          resource.id = newId;
          if (newId !== oldId) {
            plan.tareas.forEach((task) => {
              if (task.recurso_id === oldId) {
                setTaskResource(task, newId);
              }
            });
          }
        } else if (field === 'capacidad') {
          resource.capacidad = Math.max(0, sanitizeInt(value, 0));
        } else if (field === 'tipo') {
          resource.tipo = Object.values(RESOURCE_TYPES).includes(value) ? value : resource.tipo;
        }
        plan.tareas.forEach((task) => updateTaskLabels(task, plan.recursos));
        syncMaps();
        validateAndStore();
        calculatePlan({ silent: true });
        render();
      }

      function updateResource(resourceId, patch) {
        if (!patch || !resourceId) {
          return;
        }
        Object.entries(patch).forEach(([field, value]) => {
          updateResourceField(resourceId, field, value);
        });
      }

      function removeResource(resourceId) {
        if (!resourceId) {
          return;
        }
        plan.recursos = plan.recursos.filter((resource) => resource.id !== resourceId);
        plan.tareas.forEach((task) => {
          if (task.recurso_id === resourceId) {
            setTaskResource(task, null);
          }
        });
        syncMaps();
        validateAndStore();
        calculatePlan({ silent: true });
        render();
      }

        function updatePersonField(personId, field, value) {
          const person = plan.equipo.find((item) => item.id === personId);
          if (!person) {
            return;
          }
        if (field === 'nombre') {
          const trimmed = String(value || '').trim();
          if (!trimmed) {
            return;
          }
          person.nombre = trimmed;
        } else if (field === 'rol') {
          person.rol = value || person.rol;
          } else if (field === 'nivel') {
            person.nivel = Math.max(1, Math.min(3, Number(value) || 1));
          }
          handleTeamChange();
        }

        function updatePerson(personId, patch) {
          if (!patch || !personId) {
            return;
          }
          Object.entries(patch).forEach(([field, value]) => {
            updatePersonField(personId, field, value);
          });
        }

        function removePerson(personId) {
          if (!personId) {
            return;
          }
          plan.equipo = plan.equipo.filter((person) => person.id !== personId);
          let unassignedCount = 0;
          plan.tareas.forEach((task) => {
            if (task.asignado_a_id === personId) {
              task.asignado_a_id = null;
              task.locked = false;
              unassignedCount += 1;
            }
          });
          handleTeamChange({ unassignedCount });
        }

        function handleTeamChange({ unassignedCount = 0 } = {}) {
          syncMaps();
          validateAndStore();
          if (state.planReady || state.approved) {
            calculatePlan({ silent: true });
          }
          let message = '';
          if (unassignedCount) {
            message = `${unassignedCount} tareas quedaron sin asignar.`;
          }
          if (state.planReady || state.approved) {
            message = message ? `${message} Ruta recalculada.` : 'Equipo actualizado. Ruta recalculada.';
          }
          if (message) {
            planStatusEl.textContent = message;
          }
          render();
        }

      function addResource() {
        const baseName = `Recurso ${plan.recursos.length + 1}`;
        const existing = new Set(plan.recursos.map((item) => item.id));
        const id = ensureUniqueId(makeIdFromName(baseName, 'RECURSO'), existing);
        plan.recursos.push({
          id,
          nombre: baseName,
          capacidad: 1,
          tipo: 'OTRO'
        });
        syncMaps();
        validateAndStore();
      }

        function addPerson() {
          const existing = new Set(plan.equipo.map((item) => item.id));
          const id = generatePersonId(existing);
          plan.equipo.push({
            id,
            nombre: 'Nueva persona',
            rol: 'Pinxe',
            nivel: 1,
            factor_velocidad: 1,
            restricciones: {}
          });
          handleTeamChange();
        }

      function handleTaskFinish(taskId) {
        const task = tareaById[taskId];
        if (!task || task.estado !== 'EN_CURSO') {
          return;
        }
        completeTask(task);
        autoStartTasks();
        maybeAutoAdvance();
      }

      function handleTaskToggle(taskId) {
        const task = tareaById[taskId];
        if (!task) {
          return;
        }
        if (task.estado === 'PENDIENTE') {
          if (!canStartTask(task)) {
            return;
          }
          startTask(task);
          return;
        }
        if (task.estado === 'EN_CURSO') {
          completeTask(task);
          autoStartTasks();
          maybeAutoAdvance();
        }
      }

      if (typeof window !== 'undefined') {
        window.__CORE_EXPORTED__ = true;
        window.DEFAULT_PLAN = DEFAULT_PLAN;
        window.EMPTY_PLAN = EMPTY_PLAN;
        window.loadUserSettings = loadUserSettings;
        window.saveUserSettings = saveUserSettings;
        window.selfCheck = selfCheck;
        window.handlePdfFile = handlePdfFile;
        window.handleManualText = handleManualText;
        window.processMenuText = processMenuText;
        window.setPlan = setPlan;
        window.setState = setState;
        window.state = state;
        window.plan = plan;
        window.render = render;
        window.updatePdfStatus = updatePdfStatus;
        window.setUIMode = setUIMode;
        window.goToView = goToView;
        window.assignResourcesByHeuristic = assignResourcesByHeuristic;
        window.addSuggestedResources = addSuggestedResources;
        window.fillMissingDurations = fillMissingDurations;
        window.autoAssignBalanced = autoAssignBalanced;
        window.sanitizePlanForStorage = sanitizePlanForStorage;
      }

      // UI bindings and initialization moved to app.js.



























































