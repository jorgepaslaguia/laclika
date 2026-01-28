(function () {
  if (typeof window === 'undefined') {
    return;
  }

  function waitForFixtures(maxMs = 500) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (Array.isArray(window.PARSER_FIXTURES) && window.PARSER_FIXTURES.length) {
        return true;
      }
    }
    return Array.isArray(window.PARSER_FIXTURES) && window.PARSER_FIXTURES.length > 0;
  }

  function normalizeKey(value) {
    return String(value || '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
  }

  function dumpT4(label, obj) {
    if (!DEBUG_SMOKE) {
      return;
    }
    console.log(`${label}:`, obj);
  }

  function splitInlineSectionDish(line) {
    const match = String(line || '').match(/^([^:]+):\s*(.+)$/);
    if (!match) {
      return null;
    }
    const section = String(match[1] || '').trim();
    const dish = String(match[2] || '').trim();
    if (!section || !dish) {
      return null;
    }
    return { section, dish };
  }

  function isSectionHeaderLine(line) {
    const trimmed = String(line || '').trim();
    if (!trimmed) {
      return false;
    }
    if (/:\s*.+/.test(trimmed)) {
      return false;
    }
    return /[:\-\u2013\u2014]\s*$/.test(trimmed);
  }

  function safeStringify(value) {
    const seen = new WeakSet();
    try {
      return JSON.stringify(
        value,
        (key, val) => {
          if (val && typeof val === 'object') {
            if (seen.has(val)) {
              return '[Circular]';
            }
            seen.add(val);
          }
          return val;
        },
        2
      );
    } catch (error) {
      return String(value);
    }
  }

  function isSectionHeaderCandidate(line) {
    const trimmed = String(line || '').trim();
    if (!trimmed) {
      return false;
    }
    if (trimmed.includes(':')) {
      const rest = trimmed.split(':').slice(1).join(':').trim();
      if (rest) {
        return false;
      }
    }
    const endsWithMarker = /[:\-\u2013\u2014]\s*$/.test(trimmed);
    const clean = trimmed.replace(/[:\-\u2013\u2014]+$/, '').trim();
    if (!clean || clean.length > 40) {
      return false;
    }
    const headerToken = /^(entrantes?|principal(?:es)?|postres?|platos?|primeros?|segundos?)$/i.test(clean);
    if (!endsWithMarker && !headerToken) {
      return false;
    }
    if (/\d/.test(clean)) {
      return false;
    }
    if (/\b(hornear|asar|gratin|freir|fritar|saltear|sofreir|reducir|cocer|hervir|pochar|reposar|enfriar|lavar|cortar|picar|pelar|mezclar|montar|emplatar)\b/i.test(clean)) {
      return false;
    }
    const words = clean.split(/\s+/).filter(Boolean);
    if (!words.length) {
      return false;
    }
    const isUpper = clean === clean.toUpperCase();
    const isTitle = words.every((word) => {
      const plain = word.replace(/[^A-Za-z\u00C0-\u00FF]/g, '');
      if (!plain) {
        return false;
      }
      return (
        plain[0] === plain[0].toUpperCase() &&
        plain.slice(1) === plain.slice(1).toLowerCase()
      );
    });
    return isUpper || isTitle;
  }

  function summarizePlan(planBuilt) {
    const tasks = Array.isArray(planBuilt?.tareas) ? planBuilt.tareas : [];
    const recursos = Array.isArray(planBuilt?.recursos) ? planBuilt.recursos : [];
    const phases = new Set(tasks.map((task) => task.fase).filter(Boolean));
    const tasksByDish = {};
    tasks.forEach((task) => {
      const dish = task.plato || task.dish || 'Plato';
      tasksByDish[dish] = (tasksByDish[dish] || 0) + 1;
    });
    return {
      tasks: tasks.length,
      phases: Array.from(phases),
      resources: recursos.map((resource) => resource.typeKey || resource.nombre || resource.id).filter(Boolean),
      tasksByDish
    };
  }

  function summarizeDraft(draft) {
    const platos = Array.isArray(draft?.platos) ? draft.platos : [];
    return {
      platos: platos.length,
      nombres: platos.map((plato) => plato?.nombre || plato?.name || '').filter(Boolean),
      detalles: platos
        .map((plato) => ({
          nombre: plato?.nombre || plato?.name || '',
          categoria: plato?.categoria || plato?.section || plato?.seccion || null
        }))
        .filter((item) => item.nombre)
    };
  }

  function inferMissingResourceKeys(planBuilt) {
    const missing = new Set();
    const resources = Array.isArray(planBuilt?.recursos) ? planBuilt.recursos : [];
    const resourceTypeKeys = new Set(
      resources.map((resource) => normalizeKey(resource.typeKey || resource.nombre || resource.id)).filter(Boolean)
    );
    const warnings = []
      .concat(planBuilt?.advertencias_de_recursos || [])
      .concat(planBuilt?.suggestions || []);
    warnings.forEach((message) => {
      const raw = String(message || '');
      const match = raw.match(/Recurso inferido pendiente:\s*([A-Z_]+)/i) || raw.match(/Falta recurso\s+([A-Z_]+)/i);
      if (match && match[1]) {
        missing.add(normalizeKey(match[1]));
      }
    });
    const processToResource = (processKey) => {
      switch (normalizeKey(processKey)) {
        case 'BANOMARIA':
          return 'FOGONES';
        case 'REPOSAR':
        case 'ENFRIAR':
        case 'EMPLATAR':
        case 'MEZCLAR':
        case 'MONTAR':
        case 'TRITURAR':
        case 'CORTAR':
        case 'PICAR':
        case 'PELAR':
          return 'ESTACION';
        case 'HORNEAR':
        case 'ASAR':
        case 'GRATINAR':
          return 'HORNO';
        case 'COCER':
        case 'HERVIR':
        case 'REDUCIR':
        case 'SALTEAR':
        case 'SOFREIR':
        case 'FREIR':
        case 'POCHAR':
          return 'FOGONES';
        case 'LAVAR':
        case 'ESCURRIR':
        case 'LIMPIAR':
          return 'FREGADERO';
        default:
          return null;
      }
    };
    (planBuilt?.tareas || []).forEach((task) => {
      const assignedId = task.recurso_id || task.resourceId || null;
      const explicitType = normalizeKey(task.resourceTypeKey || '');
      if (explicitType && !assignedId && !resourceTypeKeys.has(explicitType)) {
        missing.add(explicitType);
        return;
      }
      const inferred = processToResource(task.proceso || '');
      if (inferred && !assignedId && !resourceTypeKeys.has(inferred)) {
        missing.add(inferred);
      }
    });
    return missing;
  }

  const deepCloneKeys = new Set(['state', 'menuDraft']);
  const DEBUG_SMOKE = Boolean(window.DEBUG_SMOKE);

  function cloneShallowObject(value) {
    if (!value || typeof value !== 'object') {
      return value;
    }
    const proto = Object.getPrototypeOf(value);
    const cloneTarget = proto === null ? Object.create(null) : {};
    return Object.assign(cloneTarget, value);
  }

  function cloneShallowArray(value) {
    return Array.isArray(value) ? value.slice() : value;
  }

  function safeClone(value, label = 'value') {
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(value);
      } catch (error) {
        console.warn(`[parser_smoke] clone failed (${label}) via structuredClone: ${error?.message || error}`);
        if (error?.stack) {
          console.warn(error.stack);
        }
      }
    }
    if (Array.isArray(value)) {
      return cloneShallowArray(value);
    }
    if (value && typeof value === 'object') {
      return cloneShallowObject(value);
    }
    return value;
  }

  function snapshotAppState(source) {
    if (!source) {
      return null;
    }
    return {
      menuRawText: source.menuRawText,
      menuRawTextSource: cloneShallowObject(source.menuRawTextSource),
      lastPdfError: source.lastPdfError,
      menuIR: source.menuIR
    };
  }

  function restoreAppState(target, snapshot) {
    if (!target || !snapshot) {
      return;
    }
    target.menuRawText = snapshot.menuRawText;
    target.menuRawTextSource = snapshot.menuRawTextSource;
    target.lastPdfError = snapshot.lastPdfError;
    if ('menuIR' in snapshot) {
      target.menuIR = snapshot.menuIR;
    }
  }

  function snapshotUiContext() {
    if (!window.state) {
      return null;
    }
    return {
      unsavedPlan: window.state.unsavedPlan,
      activeRecipeId: window.state.activeRecipeId,
      view: window.state.view,
      screen: window.state.screen,
      uiMode: window.state.uiMode,
      libraryTag: window.state.libraryTag,
      planReady: window.state.planReady,
      approved: window.state.approved,
      alertsOpen: window.state.alertsOpen,
      issuesOpen: window.state.issuesOpen,
      manualTextOpen: window.state.manualTextOpen,
      expertMode: window.state.expertMode,
      debugEnabled: window.state.debugEnabled,
      compactMode: window.state.compactMode,
      ignoreMissingResources: window.state.ignoreMissingResources,
      phaseStatus: window.state.phaseStatus,
      lastPlanMessage: window.state.lastPlanMessage
    };
  }

  function restoreObject(target, snapshot) {
    if (!target || !snapshot) {
      return;
    }
    Object.keys(target).forEach((key) => {
      delete target[key];
    });
    Object.keys(snapshot).forEach((key) => {
      target[key] = snapshot[key];
    });
  }

  function restoreArray(target, snapshot) {
    if (!Array.isArray(target) || !Array.isArray(snapshot)) {
      return;
    }
    target.length = 0;
    snapshot.forEach((item) => target.push(item));
  }

  function snapshotCoreState() {
    const planSnapshot = typeof plan !== 'undefined' && plan ? plan : window.plan || null;
    const stateSnapshot = window.state
      ? deepCloneKeys.has('state')
        ? safeClone(window.state, 'state')
        : window.state
      : null;
    const menuDraftSnapshot = typeof menuDraft !== 'undefined'
      ? deepCloneKeys.has('menuDraft')
        ? safeClone(menuDraft, 'menuDraft')
        : menuDraft
      : undefined;
    const appStateSnapshot = typeof appState !== 'undefined' ? snapshotAppState(appState) : undefined;
    const uiContextSnapshot = snapshotUiContext();
    const filterStateSnapshot = typeof filterState !== 'undefined' ? cloneShallowObject(filterState) : undefined;
    const validationStateSnapshot =
      typeof validationState !== 'undefined' ? cloneShallowObject(validationState) : undefined;
    const planStateSnapshot = typeof planState !== 'undefined' ? cloneShallowObject(planState) : undefined;
    const questionAnswersSnapshot =
      typeof questionAnswers !== 'undefined' ? cloneShallowObject(questionAnswers) : undefined;
    const pdfStateSnapshot = typeof pdfState !== 'undefined' ? cloneShallowObject(pdfState) : undefined;
    const pdfWorkerReadySnapshot = typeof pdfWorkerReady !== 'undefined' ? pdfWorkerReady : undefined;
    const recipesSnapshot = typeof recipes !== 'undefined' ? cloneShallowArray(recipes) : undefined;
    const recipeByIdSnapshot = typeof recipeById !== 'undefined' ? cloneShallowObject(recipeById) : undefined;
    return {
      planSnapshot,
      stateSnapshot,
      menuDraftSnapshot,
      appStateSnapshot,
      uiContextSnapshot,
      filterStateSnapshot,
      validationStateSnapshot,
      planStateSnapshot,
      questionAnswersSnapshot,
      pdfStateSnapshot,
      pdfWorkerReadySnapshot,
      recipesSnapshot,
      recipeByIdSnapshot
    };
  }

  function restoreCoreState(snapshot, options = {}) {
    if (!snapshot) {
      return;
    }
    const allowSetPlan = options.allowSetPlan !== false;
    if (allowSetPlan && snapshot.planSnapshot && typeof window.setPlan === 'function') {
      window.setPlan(
        snapshot.planSnapshot,
        snapshot.menuDraftSnapshot !== undefined ? snapshot.menuDraftSnapshot : null,
        '',
        [],
        { keepIgnoreMissingResources: true, markDirty: false }
      );
    }
    if (!allowSetPlan && snapshot.planSnapshot && typeof plan !== 'undefined') {
      plan = snapshot.planSnapshot;
      window.plan = snapshot.planSnapshot;
    }
    if (!allowSetPlan && snapshot.menuDraftSnapshot !== undefined && typeof menuDraft !== 'undefined') {
      menuDraft = snapshot.menuDraftSnapshot;
    }
    if (window.state && snapshot.stateSnapshot) {
      Object.assign(window.state, snapshot.stateSnapshot);
    }
    if (window.state && snapshot.uiContextSnapshot) {
      Object.assign(window.state, snapshot.uiContextSnapshot);
    }
    if (typeof appState !== 'undefined' && snapshot.appStateSnapshot) {
      restoreAppState(appState, snapshot.appStateSnapshot);
    }
    if (typeof filterState !== 'undefined' && snapshot.filterStateSnapshot) {
      Object.assign(filterState, snapshot.filterStateSnapshot);
    }
    if (typeof validationState !== 'undefined' && snapshot.validationStateSnapshot) {
      Object.assign(validationState, snapshot.validationStateSnapshot);
    }
    if (typeof planState !== 'undefined' && snapshot.planStateSnapshot) {
      Object.assign(planState, snapshot.planStateSnapshot);
    }
    if (typeof questionAnswers !== 'undefined' && snapshot.questionAnswersSnapshot) {
      restoreObject(questionAnswers, snapshot.questionAnswersSnapshot);
    }
    if (typeof pdfState !== 'undefined' && snapshot.pdfStateSnapshot) {
      Object.assign(pdfState, snapshot.pdfStateSnapshot);
    }
    if (typeof pdfWorkerReady !== 'undefined' && snapshot.pdfWorkerReadySnapshot !== undefined) {
      pdfWorkerReady = snapshot.pdfWorkerReadySnapshot;
    }
    if (typeof recipes !== 'undefined' && snapshot.recipesSnapshot) {
      recipes = snapshot.recipesSnapshot;
    }
    if (typeof recipeById !== 'undefined' && snapshot.recipeByIdSnapshot) {
      recipeById = snapshot.recipeByIdSnapshot;
    }
    if (allowSetPlan && typeof render === 'function') {
      render();
    }
  }

  function runFixtures(fixtures, options = {}) {
    const results = [];
    const fixtureId = options.fixtureId || options.onlyId || null;
    if (fixtureId) {
      const matched = fixtures.filter((fixture) => fixture.id === fixtureId);
      if (!matched.length) {
        return [{ id: 'fixtures', level: 0, ok: false, detail: `fixture not found id=${fixtureId}` }];
      }
      fixtures = matched;
    }
    fixtures.forEach((fixture) => {
      let ok = true;
      let detail = '';
      let failures = [];
      let draftSummary = null;
      let planSummary = null;
      let plateCount = 0;
      let taskCount = 0;
      let teamCount = 0;
      let phases = new Set();
      let resourceKeys = new Set();
      let missingResourceKeys = new Set();
      let t4Lines = null;
      let t4Summary = null;
      let t4Expected = null;
      try {
        const menuIR = window.buildMenuIRFromRawText
          ? window.buildMenuIRFromRawText(fixture.text || '', { source: 'fixture', id: fixture.id })
          : null;
        const built = menuIR && window.menuIRToPlan ? window.menuIRToPlan(menuIR, [], []) : null;
        let planBuilt = built?.plan || null;
        const draft = built?.draft || null;
        plateCount = menuIR?.platos?.length || 0;
        if ((!plateCount || !(planBuilt?.tareas || []).length) && window.parseMenuDraft && window.buildPlanFromDraft) {
          const draftParsed = window.parseMenuDraft(fixture.text || '');
          const fallback = window.buildPlanFromDraft(draftParsed);
          planBuilt = fallback?.plan || planBuilt;
          plateCount = draftParsed?.platos?.length || plateCount;
          draftSummary = summarizeDraft(draftParsed);
        }
        taskCount = planBuilt?.tareas?.length || 0;
        teamCount = planBuilt?.equipo?.length || planBuilt?.team?.length || 0;
        phases = new Set((planBuilt?.tareas || []).map((task) => task.fase));
        const tasksByDish = {};
        const dishOrder = [];
        const processesByDish = {};
        const processSet = new Set();
        let fallbackCount = 0;
        resourceKeys = new Set(
          (planBuilt?.recursos || [])
            .map((resource) => normalizeKey(resource.typeKey || resource.nombre || resource.id))
            .filter(Boolean)
        );
        missingResourceKeys = new Set();
        (planBuilt?.tareas || []).forEach((task) => {
          const dish = task.plato || task.dish || 'Plato';
          if (!tasksByDish[dish]) {
            tasksByDish[dish] = 0;
            dishOrder.push(dish);
          }
          tasksByDish[dish] += 1;
          if (!processesByDish[dish]) {
            processesByDish[dish] = new Set();
          }
          if (task.proceso) {
            processesByDish[dish].add(task.proceso);
            processSet.add(task.proceso);
          }
          if ((task.origin || task.origen) === 'FALLBACK') {
            fallbackCount += 1;
          }
        });
        const taskCounts = Object.values(tasksByDish);
        const processCounts = Object.values(processesByDish).map((set) => set.size);
        const tasksPerDishMin = taskCounts.length ? Math.min(...taskCounts) : 0;
        const tasksPerDishMax = taskCounts.length ? Math.max(...taskCounts) : 0;
        const procPerDishMin = processCounts.length ? Math.min(...processCounts) : 0;
        const procPerDishMax = processCounts.length ? Math.max(...processCounts) : 0;
        let warnings = null;
        let infos = null;
        let warningsAfter = null;
        let infosAfter = null;
        let normalizedTaskCount = null;
        if (draft && !draftSummary) {
          draftSummary = summarizeDraft(draft);
        }
        planSummary = summarizePlan(planBuilt);
        if (window.setPlan && window.state && !window.__SMOKE_PURE__) {
          const snapshot = window.plan ? safeClone(window.plan, 'plan') : window.EMPTY_PLAN || null;
          window.setPlan(planBuilt, null, '', []);
          warnings = (window.state.issues || []).filter((issue) => issue.severity === 'warning').length;
          infos = (window.state.issues || []).filter((issue) => issue.severity === 'info').length;
          normalizedTaskCount = window.plan?.tareas?.length ?? null;
          const diagnostics = window.state?.diagnostics || {};
          const missingList = Array.isArray(diagnostics.missingResourceTypeKeys) && diagnostics.missingResourceTypeKeys.length
            ? diagnostics.missingResourceTypeKeys
            : diagnostics.missingResources || [];
          missingResourceKeys = new Set(missingList.map((item) => normalizeKey(item)).filter(Boolean));
          if ((planBuilt?.tareas || []).length) {
            if (typeof window.assignResourcesByHeuristic === 'function') {
              window.assignResourcesByHeuristic({ silent: true });
            }
            if (typeof window.fillMissingDurations === 'function') {
              window.fillMissingDurations({ silent: true });
            }
            if (typeof window.autoAssignBalanced === 'function') {
              window.autoAssignBalanced({ phaseOnly: false, respectLocked: true, onlyUnassigned: true });
            }
            warningsAfter = (window.state.issues || []).filter((issue) => issue.severity === 'warning').length;
            infosAfter = (window.state.issues || []).filter((issue) => issue.severity === 'info').length;
          } else {
            warningsAfter = warnings;
            infosAfter = infos;
          }
          if (snapshot) {
            window.setPlan(snapshot, null, '', []);
          }
        } else if (window.__SMOKE_PURE__) {
          missingResourceKeys = inferMissingResourceKeys(planBuilt);
        }
        const expect = fixture.expect || {};
        if (fixture.id === 't4_sections') {
          t4Lines = String(fixture.text || '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          t4Expected = expect;
          if (DEBUG_SMOKE) {
            t4Lines.forEach((line) => {
              const inline = splitInlineSectionDish(line);
              dumpT4('[t4] line', {
                line,
                inline: Boolean(inline),
                inlineParsed: inline,
                header: isSectionHeaderLine(line)
              });
            });
          }

          const t4Draft =
            draft || (typeof window.parseMenuDraft === 'function' ? window.parseMenuDraft(fixture.text || '') : null);
          const t4DishList = Array.isArray(t4Draft?.platos)
            ? t4Draft.platos
            : Array.isArray(planBuilt?.platos)
              ? planBuilt.platos
              : [];
          const t4DraftNames = t4DishList.map((plato) => plato?.nombre || '').filter(Boolean);
          const t4DraftSections = t4DishList.map((plato) => plato?.section || plato?.categoria || null);
          const t4Pre = typeof window.buildPlanFromDraft === 'function' ? window.buildPlanFromDraft(t4Draft) : null;
          const t4PrePlan = t4Pre?.plan || null;
          const t4PreTasks = Array.isArray(t4PrePlan?.tareas) ? t4PrePlan.tareas : [];
          const t4PreDishNames = Array.from(new Set(t4PreTasks.map((task) => task.plato).filter(Boolean)));
          const t4PreCounts = t4PreTasks.reduce((acc, task) => {
            const key = task.plato || 'Plato';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          const t4Final =
            typeof window.normalizePlan === 'function' && t4PrePlan ? window.normalizePlan(t4PrePlan) : t4PrePlan;
          const t4FinalTasks = Array.isArray(t4Final?.tareas) ? t4Final.tareas : [];
          const t4FinalDishNames = Array.from(new Set(t4FinalTasks.map((task) => task.plato).filter(Boolean)));
          const t4FinalCounts = t4FinalTasks.reduce((acc, task) => {
            const key = task.plato || 'Plato';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          const t4DishNames = t4DraftNames.length ? t4DraftNames : t4PreDishNames;
          const t4DishCount = t4DishNames.length;
          plateCount = t4DishCount;
          const t4Sections =
            t4DraftSections.length && t4DraftSections.length === t4DishNames.length
              ? t4DraftSections
              : t4DishNames.map(() => null);
          t4Summary = {
            gotDishCount: t4DishCount,
            gotDishNames: t4DishNames,
            gotSections: t4Sections,
            gotTasksCounts: t4DishNames.map((name) => t4PreCounts[name] || 0)
          };

          if (DEBUG_SMOKE) {
            dumpT4('[t4] draft dishes', t4DraftNames);
            dumpT4('[t4] draft sections', t4DraftSections);
            dumpT4('[t4] preNorm dishes', t4PreDishNames);
            dumpT4('[t4] preNorm tasks', t4PreCounts);
            dumpT4('[t4] final dishes', t4FinalDishNames);
            dumpT4('[t4] final tasks', t4FinalCounts);
            dumpT4('[t4] expected', t4Expected);
            dumpT4('[t4] got summary', t4Summary);
          }
        }
        const platesMin = Number.isFinite(expect.platesMin) ? expect.platesMin : 1;
        const platesMax = Number.isFinite(expect.platesMax) ? expect.platesMax : null;
        const platesOk = plateCount >= platesMin && (platesMax === null || plateCount <= platesMax);
        const tasksMin = Number.isFinite(expect.tasksMin) ? expect.tasksMin : 1;
        const tasksMax = Number.isFinite(expect.tasksMax) ? expect.tasksMax : null;
        const tasksOk =
          plateCount === 0 ? true : taskCount >= tasksMin && (tasksMax === null || taskCount <= tasksMax);
        const nonZeroOk = plateCount === 0 ? true : taskCount > 0;
        const phasesMin = Number.isFinite(expect.phasesMin) ? expect.phasesMin : 1;
        const phasesOk = phases.size >= phasesMin;
        const normalizedOk =
          normalizedTaskCount === null
            ? true
            : plateCount === 0
              ? true
              : normalizedTaskCount > 0;
        const warningMax = Number.isFinite(expect.warningsMax) ? expect.warningsMax : 4;
        const warningAfterMax = Number.isFinite(expect.warningsAfterMax) ? expect.warningsAfterMax : 1;
        const warningsOk = warnings === null ? true : warnings <= warningMax;
        const warningsAfterOk = warningsAfter === null ? true : warningsAfter <= warningAfterMax;
        const teamMin = Number.isFinite(expect.teamMin) ? expect.teamMin : null;
        const teamMax = Number.isFinite(expect.teamMax) ? expect.teamMax : null;
        const teamOk =
          teamMin === null && teamMax === null
            ? true
            : (teamMin === null || teamCount >= teamMin) && (teamMax === null || teamCount <= teamMax);
        const processIncludes = Array.isArray(expect.processIncludes) ? expect.processIncludes : [];
        const processOk = processIncludes.every((proc) => processSet.has(proc));
        const resourcesInclude = Array.isArray(expect.resourcesInclude) ? expect.resourcesInclude : [];
        const resourcesOk = resourcesInclude.every((item) => resourceKeys.has(normalizeKey(item)));
        const missingResourcesInclude = Array.isArray(expect.missingResourcesInclude)
          ? expect.missingResourcesInclude
          : [];
        const missingResourcesOk = missingResourcesInclude.every((item) => missingResourceKeys.has(normalizeKey(item)));
        ok =
          platesOk &&
          tasksOk &&
          nonZeroOk &&
          phasesOk &&
          warningsOk &&
          warningsAfterOk &&
          teamOk &&
          processOk &&
          normalizedOk &&
          resourcesOk &&
          missingResourcesOk;
        if (plateCount < platesMin) {
          failures.push(`platesMin expected>=${platesMin} got=${plateCount}`);
        }
        if (platesMax !== null && plateCount > platesMax) {
          failures.push(`platesMax expected<=${platesMax} got=${plateCount}`);
        }
        if (taskCount < tasksMin && plateCount > 0) {
          failures.push(`tasksMin expected>=${tasksMin} got=${taskCount}`);
        }
        if (tasksMax !== null && taskCount > tasksMax) {
          failures.push(`tasksMax expected<=${tasksMax} got=${taskCount}`);
        }
        if (!phasesOk) {
          failures.push(`phasesMin expected>=${phasesMin} got=${phases.size}`);
        }
        if (!warningsOk) {
          failures.push(`warningsMax expected<=${warningMax} got=${warnings}`);
        }
        if (!warningsAfterOk) {
          failures.push(`warningsAfterMax expected<=${warningAfterMax} got=${warningsAfter}`);
        }
        if (!teamOk) {
          failures.push(`team expected min=${teamMin ?? '-'} max=${teamMax ?? '-'} got=${teamCount}`);
        }
        if (!processOk && processIncludes.length) {
          failures.push(`processIncludes expected=${processIncludes.join(',')} got=${Array.from(processSet).join(',') || 'none'}`);
        }
        if (!resourcesOk && resourcesInclude.length) {
          failures.push(`resourcesInclude expected=${resourcesInclude.join(',')} got=${Array.from(resourceKeys).join(',') || 'none'}`);
        }
        if (!missingResourcesOk && missingResourcesInclude.length) {
          failures.push(
            `missingResources expected=${missingResourcesInclude.join(',')} got=${Array.from(missingResourceKeys).join(',') || 'none'}`
          );
        }
        const warnLabel =
          warnings === null
            ? 'warnings n/a'
            : `warnings ${warnings}->${warningsAfter ?? warnings}`;
        const infoLabel = infos === null ? 'infos n/a' : `infos ${infos}->${infosAfter ?? infos}`;
        detail =
          `platos ${plateCount} tareas ${taskCount} equipo ${teamCount} fases ${phases.size} ` +
          `tareas/plato ${tasksPerDishMin}-${tasksPerDishMax} fallback ${fallbackCount} ` +
          `procesos/plato ${procPerDishMin}-${procPerDishMax} ` +
          `${warnLabel} ${infoLabel}` +
          (normalizedTaskCount === null ? '' : ` norm ${normalizedTaskCount}`) +
          (failures.length ? ` | ${failures.join(' | ')}` : '');
      } catch (error) {
        ok = false;
        detail = error && error.message ? error.message : 'error';
        console.groupCollapsed(`[parser_smoke] fixture ${fixture.id} error`);
        if (error?.message) {
          console.error(error.message);
        } else {
          console.error(String(error));
        }
        if (error?.stack) {
          console.error(error.stack);
        }
        console.groupEnd();
        if (fixture.id === 't4_sections' && DEBUG_SMOKE) {
          console.log('t4 FAIL message:', error?.message || String(error));
          console.log('t4 FAIL stack:', error?.stack || '(no stack)');
          if (t4Summary) {
            dumpT4('t4 got summary (on fail)', t4Summary);
          }
          if (t4Expected) {
            dumpT4('t4 expected (on fail)', t4Expected);
          }
        }
      }
      if (!ok) {
        const inputLines = String(fixture.text || '')
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        const sectionInlineMatches = inputLines.filter((line) =>
          /^(entrantes?|principal(?:es)?|postres?|platos?)\s*:\s*/i.test(line)
        );
        const sectionHeaderCandidates = inputLines.filter((line) => isSectionHeaderCandidate(line));
        const draftPlatos = Array.isArray(draftSummary?.nombres) ? draftSummary.nombres : [];
        const draftDetalles = Array.isArray(draftSummary?.detalles) ? draftSummary.detalles : [];
        console.groupCollapsed(`[parser_smoke] fixture ${fixture.id} summary`);
        if (fixture.id === 't4_sections' && DEBUG_SMOKE) {
          const summaryNames = Array.isArray(t4Summary?.gotDishNames) ? t4Summary.gotDishNames : draftPlatos;
          const summarySections = Array.isArray(t4Summary?.gotSections)
            ? t4Summary.gotSections
            : draftDetalles.map((item) => item.categoria || item.section || null);
          const sectionsDetected = Array.from(new Set(summarySections.filter(Boolean)));
          const dishRows = summaryNames.map((name, index) => ({
            name,
            section: summarySections[index] || null,
            tasksCount: planSummary?.tasksByDish?.[name] || 0
          }));
          const expect = fixture.expect || {};
          console.log('fixture.input', inputLines);
          console.log('dishes.length', summaryNames.length);
          console.log('dishes', dishRows);
          console.log('sections', sectionsDetected);
          console.log('sectionInlineMatches', sectionInlineMatches);
          console.log('sectionHeaderCandidates', sectionHeaderCandidates);
          console.log('expectedCounts', {
            expectedDishes: expect.platesMin ?? null,
            gotDishes: plateCount,
            expectedTasks: expect.tasksMin ?? null,
            gotTasks: taskCount
          });
          console.log('expectedRaw', safeStringify(expect));
        } else {
          console.log('lines', inputLines);
          console.log('sectionInlineMatches', sectionInlineMatches);
          console.log('sectionHeaderCandidates', sectionHeaderCandidates);
        }
        console.log('expected', fixture.expect || {});
        console.log('got', {
          platos: plateCount,
          tareas: taskCount,
          fases: phases.size,
          equipo: teamCount,
          recursos: Array.from(resourceKeys),
          missing: Array.from(missingResourceKeys)
        });
        if (failures.length) {
          console.log('failures', failures);
          console.log('mismatch', failures.join(' | '));
        }
        console.log('draft', {
          ...(draftSummary || {}),
          platos: draftPlatos,
          platosDetalle: draftDetalles
        });
        console.log('plan', planSummary || {});
        console.groupEnd();
      }
      results.push({ id: fixture.id, level: fixture.level, ok, detail });
    });
    return results;
  }

  function readStoredRecipes() {
    try {
      const raw =
        localStorage.getItem('JCD_RECIPES_V1') || localStorage.getItem('jcd_recipes_v1') || null;
      const parsed = raw ? JSON.parse(raw) : [];
      return { raw, list: Array.isArray(parsed) ? parsed : [] };
    } catch (error) {
      return { raw: null, list: [] };
    }
  }

  function restoreStoredRecipes(raw) {
    if (raw === null) {
      localStorage.removeItem('JCD_RECIPES_V1');
      localStorage.removeItem('jcd_recipes_v1');
      return;
    }
    localStorage.setItem('JCD_RECIPES_V1', raw);
    localStorage.setItem('jcd_recipes_v1', raw);
  }

  function runLibrarySmoke() {
    if (typeof window.processMenuText !== 'function') {
      return { id: 'library_persistence', level: 0, ok: false, detail: 'processMenuText missing' };
    }
    const planSnapshot = window.__SMOKE_PURE__ ? null : window.plan ? safeClone(window.plan, 'plan') : null;
    const activeRecipeId = window.state?.activeRecipeId || null;
    const unsavedPlan = window.state?.unsavedPlan;
    const activeRecipeKey = localStorage.getItem('jcd_active_recipe_v1');
    const before = readStoredRecipes();
    const beforeCount = before.list.length;

    window.processMenuText('Ensalada mixta\nPollo al horno\nFlan casero', { userTriggered: true, source: 'smoke' });
    const afterInterpret = readStoredRecipes();
    const interpretOk = afterInterpret.list.length === beforeCount;

    const saveFn =
      window.savePlanAsNewRecipe || (typeof savePlanAsNewRecipe === 'function' ? savePlanAsNewRecipe : null);
    const smokeName = `Smoke receta ${Date.now()}`;
    const saved = saveFn ? saveFn(smokeName) : null;
    const afterSave = readStoredRecipes();
    const saveOk = Boolean(saved) && afterSave.list.length === beforeCount + 1;
    const persistOk = afterSave.list.some((item) => item && item.name === smokeName);

    restoreStoredRecipes(before.raw);
    if (typeof loadRecipesFromStorage === 'function') {
      loadRecipesFromStorage();
    }
    if (window.state) {
      window.state.activeRecipeId = activeRecipeId;
      if (typeof unsavedPlan === 'boolean') {
        window.state.unsavedPlan = unsavedPlan;
      }
    }
    if (activeRecipeKey) {
      localStorage.setItem('jcd_active_recipe_v1', activeRecipeKey);
    } else {
      localStorage.removeItem('jcd_active_recipe_v1');
    }
    if (!window.__SMOKE_PURE__ && planSnapshot && typeof window.setPlan === 'function') {
      window.setPlan(planSnapshot, null, '', []);
    }

    return {
      id: 'library_persistence',
      level: 0,
      ok: interpretOk && saveOk && persistOk,
      detail: `interpret ${interpretOk ? 'OK' : 'FAIL'} save ${saveOk ? 'OK' : 'FAIL'} persist ${persistOk ? 'OK' : 'FAIL'}`
    };
  }

  function runMissingResourcesSmoke() {
    if (window.__SMOKE_PURE__) {
      const smokePlan = {
        meta: { titulo: 'Smoke missing resources (pure)' },
        fases: ['MISE_EN_PLACE', 'PREELABORACION', 'SERVICIO'],
        tareas: [
          {
            id: 's1',
            plato: 'Flan',
            fase: 'PREELABORACION',
            proceso: 'BANO_MARIA',
            duracion_min: 20,
            nivel: 2,
            recurso_id: null,
            resourceTypeKey: 'FOGONES'
          },
          {
            id: 's2',
            plato: 'Pasta',
            fase: 'PREELABORACION',
            proceso: 'COCER',
            duracion_min: 15,
            nivel: 1,
            recurso_id: null,
            resourceTypeKey: 'FOGONES'
          },
          {
            id: 's3',
            plato: 'Ensalada',
            fase: 'MISE_EN_PLACE',
            proceso: 'CORTAR',
            duracion_min: 8,
            nivel: 1,
            recurso_id: null,
            resourceTypeKey: 'ESTACION'
          }
        ],
        recursos: [],
        equipo: []
      };
      const missingSet = inferMissingResourceKeys(smokePlan);
      const missingKeys = Array.from(missingSet);
      const dedupeOk = missingKeys.length === new Set(missingKeys).size;
      const existingKeys = new Set(
        (smokePlan.recursos || []).map((resource) => normalizeKey(resource.typeKey || resource.nombre || resource.id))
      );
      let created = 0;
      missingKeys.forEach((key) => {
        if (!key || existingKeys.has(key)) {
          return;
        }
        existingKeys.add(key);
        smokePlan.recursos.push({ id: key, nombre: key, typeKey: key });
        created += 1;
      });
      const afterMissing = inferMissingResourceKeys(smokePlan);
      const afterOk = afterMissing.size === 0;
      return {
        id: 'missing_resources',
        level: 0,
        ok: dedupeOk && afterOk,
        detail: `pure dedupe ${dedupeOk ? 'OK' : 'FAIL'} created ${created} after ${afterMissing.size}`
      };
    }
    if (typeof window.setPlan !== 'function') {
      return { id: 'missing_resources', level: 0, ok: false, detail: 'setPlan missing' };
    }
    if (typeof window.addMissingResourcesFromDiagnostics !== 'function') {
      return { id: 'missing_resources', level: 0, ok: false, detail: 'addMissingResourcesFromDiagnostics missing' };
    }
    const snapshot = window.__SMOKE_PURE__ ? null : window.plan ? safeClone(window.plan, 'plan') : null;
    const ignoreFlag = window.state?.ignoreMissingResources;
    if (window.state) {
      window.state.ignoreMissingResources = false;
    }
    const smokePlan = {
      meta: { titulo: 'Smoke missing resources' },
      fases: ['MISE_EN_PLACE', 'PREELABORACION', 'SERVICIO'],
      tareas: [
        {
          id: 's1',
          plato: 'Flan',
          fase: 'PREELABORACION',
          proceso: 'BANO_MARIA',
          duracion_min: 20,
          nivel: 2,
          recurso_id: null,
          resourceTypeKey: 'FOGONES'
        },
        {
          id: 's2',
          plato: 'Pasta',
          fase: 'PREELABORACION',
          proceso: 'COCER',
          duracion_min: 15,
          nivel: 1,
          recurso_id: null,
          resourceTypeKey: 'FOGONES'
        },
        {
          id: 's3',
          plato: 'Ensalada',
          fase: 'MISE_EN_PLACE',
          proceso: 'CORTAR',
          duracion_min: 8,
          nivel: 1,
          recurso_id: null,
          resourceTypeKey: 'ESTACION'
        }
      ],
      recursos: [],
      equipo: []
    };
    window.setPlan(smokePlan, null, '', []);
    const diagnostics = window.state?.diagnostics || {};
    const missingList = Array.isArray(diagnostics.missingResourceTypeKeys) && diagnostics.missingResourceTypeKeys.length
      ? diagnostics.missingResourceTypeKeys
      : diagnostics.missingResources || [];
    const missingKeys = missingList.map((item) => normalizeKey(item)).filter(Boolean);
    const dedupeOk = missingKeys.length === new Set(missingKeys).size;
    const created = window.addMissingResourcesFromDiagnostics();
    if (typeof window.assignResourcesByHeuristic === 'function') {
      window.assignResourcesByHeuristic({ silent: true });
    }
    const after = window.state?.diagnostics || {};
    const afterMissing = Array.isArray(after.missingResources) ? after.missingResources.length : 0;
    const afterMissingKeys = Array.isArray(after.missingResourceTypeKeys) ? after.missingResourceTypeKeys.length : 0;
    const afterOk = afterMissing === 0 && afterMissingKeys === 0;

    if (window.state) {
      window.state.ignoreMissingResources = ignoreFlag;
    }
    if (snapshot && typeof window.setPlan === 'function') {
      window.setPlan(snapshot, null, '', []);
    }

    return {
      id: 'missing_resources',
      level: 0,
      ok: dedupeOk && afterOk,
      detail: `dedupe ${dedupeOk ? 'OK' : 'FAIL'} created ${created} after ${afterMissing || afterMissingKeys}`
    };
  }

  // NOTE: runParserSmoke is fully isolated from app state.
  // Any future fixture MUST remain pure and side-effect free.
  window.runParserSmoke = function runParserSmoke(options = {}) {
    const snapshot = snapshotCoreState();
    const originalSetPlan = window.setPlan;
    const originalRender = window.render;
    window.__SMOKE_PURE__ = true;
    if (typeof originalSetPlan === 'function') {
      window.setPlan = () => ({ ok: true, skipped: true });
    }
    if (typeof originalRender === 'function') {
      window.render = () => {};
    }
    let results = [];
    if (typeof window.ensureParserFixturesLoaded === 'function') {
      window.ensureParserFixturesLoaded();
    }
    const waitMs = Number.isFinite(options.waitMs) ? options.waitMs : 500;
    if (!Array.isArray(window.PARSER_FIXTURES) || !window.PARSER_FIXTURES.length) {
      waitForFixtures(waitMs);
    }
    const fixtures = Array.isArray(window.PARSER_FIXTURES) ? window.PARSER_FIXTURES : [];
    const fixturesLoaded = fixtures.length > 0;
    if (DEBUG_SMOKE) {
      console.info('[parser_smoke] fixtures source:', fixturesLoaded ? 'window' : 'none', location.protocol);
    }
    try {
      results = fixturesLoaded
        ? runFixtures(fixtures, options)
        : [
            {
              id: 'fixtures',
              level: 'skip',
              ok: 'skipped',
              detail:
                'fixtures not loaded (file:// CORS). Ensure parser_fixtures.js is loaded as a script tag or use a local server.'
            }
          ];
      results.push(runLibrarySmoke());
      results.push(runMissingResourcesSmoke());
      if (options.log !== false) {
        const okCount = results.filter((item) => item.ok === true).length;
        const allOk = results.every((item) => item.ok === true);
        if (allOk) {
          console.info(`[parser_smoke] OK ${okCount}/${results.length}`);
        } else {
          console.log(`[parser_smoke] ${okCount}/${results.length} OK`);
          console.table(results);
        }
      }
    } finally {
      window.__SMOKE_PURE__ = false;
      if (typeof originalSetPlan === 'function') {
        window.setPlan = originalSetPlan;
      }
      if (typeof originalRender === 'function') {
        window.render = originalRender;
      }
      restoreCoreState(snapshot, { allowSetPlan: false });
      if (typeof originalRender === 'function') {
        originalRender();
      }
    }
    return results;
  };
})();
