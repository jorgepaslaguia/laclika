// Stability notes (2026-01):
// - Hash router supports #library/#prep/#kitchen (+ Spanish variants).
// - setView delegates to core setUIMode when available, with fallback classes.
// Product invariants:
// - Interpretar (processMenuText/handleManualText) is the only entry that creates plan from text.
// - Guardar requires explicit name; no implicit autosave on interpret.
// - Navigation/panels never call processMenuText/buildPlanFromDraft/setPlan.
// - runParserSmoke restores state/render and leaves no persistent side effects.
// - Parser pipeline: interpretar does not persist; guardar requires explicit name.
// - data-action shortcuts only change state.ui (read-only outside ops/adv).
(() => {
  'use strict';

  if (window.__APP_INIT__) {
    return;
  }
  window.__APP_INIT__ = true;

  if (window.__KITCHEN_UI_INIT__) {
    return;
  }
  window.__KITCHEN_UI_INIT__ = true;

  // Router minimo: usa location.hash para soportar back/forward del navegador.
  const VIEW_HASH = {
    library: '#library',
    prep: '#prep',
    kitchen: '#kitchen'
  };
  const normalizeHash = (hash) => {
    const clean = String(hash || '').trim().toLowerCase();
    if (clean === '#kitchen' || clean === '#cocina') {
      return 'kitchen';
    }
    if (clean === '#prep' || clean === '#preparacion') {
      return 'prep';
    }
    if (clean === '#library' || clean === '#biblioteca') {
      return 'library';
    }
    return 'library';
  };

  const closeOverlays = (exceptDetails = null) => {
    document.querySelectorAll('details[open]').forEach((details) => {
      if (exceptDetails && details === exceptDetails) {
        return;
      }
      details.open = false;
    });
  };
  const sanitizeStoredPlan = (candidate) => {
    if (!candidate) {
      return null;
    }
    if (typeof sanitizePlanForStorage === 'function') {
      return sanitizePlanForStorage(candidate);
    }
    if (window.sanitizePlanForStorage) {
      return window.sanitizePlanForStorage(candidate);
    }
    return candidate;
  };

  const CORE_REQUIRED = [
    'handlePdfFile',
    'handleManualText',
    'processMenuText',
    'setPlan',
    'render',
    'loadUserSettings',
    'updatePdfStatus'
  ];
  const emptyPlan =
    (typeof window !== 'undefined' && window.EMPTY_PLAN) ||
    (typeof EMPTY_PLAN !== 'undefined' ? EMPTY_PLAN : null) ||
    { tareas: [], recursos: [], equipo: [], isEmpty: true };
  const ensureUiState = () => {
    const rootState = window.state;
    if (!rootState || typeof rootState !== 'object') {
      return;
    }
    if (!rootState.ui || typeof rootState.ui !== 'object') {
      rootState.ui = { panel: 'none', tab: 'resources' };
      return;
    }
    const panel = rootState.ui.panel;
    if (panel !== 'none' && panel !== 'ops' && panel !== 'adv') {
      rootState.ui.panel = 'none';
    }
    const tab = rootState.ui.tab;
    if (tab !== 'resources' && tab !== 'team' && tab !== 'assignments') {
      rootState.ui.tab = 'resources';
    }
  };
  const requestRender = (() => {
    let scheduled = false;
    return () => {
      if (scheduled) {
        return;
      }
      scheduled = true;
      const run = () => {
        scheduled = false;
        if (typeof window.render === 'function') {
          window.render();
        }
      };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(run);
      } else {
        window.setTimeout(run, 0);
      }
    };
  })();
  let renderUiPanels = () => {};
  const wrapRender = () => {
    if (window.__RENDER_WRAPPED__) {
      return;
    }
    const baseRender = window.render;
    window.render = () => {
      ensureUiState();
      const result = typeof baseRender === 'function' ? baseRender() : undefined;
      renderUiPanels();
      return result;
    };
    window.__RENDER_WRAPPED__ = true;
  };

  const getMissingCore = () =>
    CORE_REQUIRED.filter((name) => typeof window[name] !== 'function');

  const renderDomError = (missing) => {
    const message = `Error de interfaz: faltan elementos (${missing.join(', ')})`;
    const status = document.getElementById('pdfStatus');
    const summary = document.getElementById('ai-summary-content');
    const planStatus = document.getElementById('plan-status');
    if (status) {
      status.textContent = message;
    }
    if (summary) {
      summary.textContent = 'Error de interfaz. Revisa el HTML y recarga.';
    }
    if (planStatus) {
      planStatus.textContent = message;
    }
    console.error(message);
  };

  const checkCriticalDom = () => {
    const requiredIds = [
      'view-library',
      'view-prep',
      'view-kitchen',
      'pdfDropZone',
      'pdfInput',
      'pdfStatus',
      'menuTextArea',
      'btnInterpret',
      'mode-library',
      'mode-prep',
      'mode-kitchen'
    ];
    const missing = requiredIds.filter((id) => !document.getElementById(id));
    if (missing.length) {
      renderDomError(missing);
      return false;
    }
    return true;
  };

  const renderBootError = (missing) => {
    const coreLoaded = Boolean(window.__CORE_LOADED__);
    const coreExported = Boolean(window.__CORE_EXPORTED__);
    const message = `Error: core no cargado (${missing.join(', ')}). core.js loaded=${coreLoaded} exported=${coreExported}`;
    const status = document.getElementById('pdfStatus');
    const summary = document.getElementById('ai-summary-content');
    const planStatus = document.getElementById('plan-status');
    if (status) {
      status.textContent = message;
    }
    if (summary) {
      summary.textContent = 'Error de carga. Revisa scripts y vuelve a cargar.';
    }
    if (planStatus) {
      planStatus.textContent = message;
    }
    console.error(message);
  };

  const reportActionError = (error) => {
    const message = error?.message || String(error);
    const planStatus = document.getElementById('plan-status');
    const pdfStatus = document.getElementById('pdfStatus');
    if (planStatus) {
      planStatus.textContent = `Error: ${message}`;
    } else if (pdfStatus) {
      pdfStatus.textContent = `Error: ${message}`;
    }
    console.error(error);
  };

  const updateTopbarHeight = () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) {
      return;
    }
    const height = Math.ceil(topbar.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--topbar-h', `${height}px`);
  };
  const shouldLogUI = () => typeof window !== 'undefined' && window.DEBUG_UI;

  const jumpTo = (el) => {
    if (!el) {
      return;
    }
    el.classList.add('jump-highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => el.classList.remove('jump-highlight'), 1600);
  };


  const setView = (viewKey, opts = {}) => {
    const normalized = viewKey === 'kitchen' ? 'kitchen' : viewKey === 'prep' ? 'prep' : 'library';
    if (typeof state === 'object') {
      state.view = normalized;
      state.uiMode = normalized === 'library' ? 'library' : normalized;
      state.screen = normalized === 'library' ? 'library' : 'plan';
    }
    if (typeof setUIMode === 'function') {
      setUIMode(normalized, opts);
    }
    document.body.classList.toggle('screen-library', normalized === 'library');
    document.body.classList.toggle('screen-plan', normalized !== 'library');
    const libraryScreenEl = document.getElementById('library-screen');
    const planScreenEl = document.getElementById('plan-screen');
    if (libraryScreenEl) {
      libraryScreenEl.hidden = normalized !== 'library';
    }
    if (planScreenEl) {
      planScreenEl.hidden = normalized === 'library';
    }
    const viewLibraryEl = document.getElementById('view-library');
    const viewPrepEl = document.getElementById('view-prep');
    const viewKitchenEl = document.getElementById('view-kitchen');
    if (viewLibraryEl) {
      viewLibraryEl.hidden = normalized !== 'library';
    }
    if (viewPrepEl) {
      viewPrepEl.hidden = normalized !== 'prep';
    }
    if (viewKitchenEl) {
      viewKitchenEl.hidden = normalized !== 'kitchen';
    }
  };

  let isApplyingHash = false;
  const applyHashView = (viewKey) => {
    if (isApplyingHash) {
      return;
    }
    isApplyingHash = true;
    const nextView = viewKey;
    if (nextView === 'prep') {
      setView('prep', { scrollToUpload: true });
    } else if (nextView === 'kitchen') {
      setView('kitchen');
    } else {
      setView('library');
    }
    closeOverlays();
    updateTopbarHeight();
    isApplyingHash = false;
  };

  const navigateTo = (viewKey, { replace = false } = {}) => {
    const nextHash = VIEW_HASH[viewKey] || VIEW_HASH.library;
    if (replace) {
      history.replaceState(null, '', nextHash);
      applyHashView(viewKey);
      return;
    }
    if (location.hash !== nextHash) {
      location.hash = nextHash;
      return;
    }
    applyHashView(viewKey);
  };

  if (typeof window !== 'undefined') {
    window.navigateTo = navigateTo;
    window.applyHashView = applyHashView;
    window.setView = setView;
  }

  const warnDuplicateIds = () => {
    const byId = new Map();
    const planStatusEl = document.getElementById('plan-status');
    document.querySelectorAll('[id]').forEach((el) => {
      const id = el.id;
      if (!id) {
        return;
      }
      const list = byId.get(id) || [];
      list.push(el);
      byId.set(id, list);
    });
    byId.forEach((list, id) => {
      if (list.length > 1) {
        console.warn('ID duplicado detectado:', id, list);
      }
    });
    if (document.querySelectorAll('#pdfDropZone').length > 1) {
      console.warn('Duplicado detectado: #pdfDropZone debe existir una sola vez.');
      if (planStatusEl) {
        planStatusEl.textContent = 'Warning: #pdfDropZone duplicado. Debe existir una sola vez.';
      }
    }
    if (document.querySelectorAll('#pdfInput').length > 1) {
      console.warn('Duplicado detectado: #pdfInput debe existir una sola vez.');
      if (planStatusEl) {
        planStatusEl.textContent = 'Warning: #pdfInput duplicado. Debe existir una sola vez.';
      }
    }
  };

  const bindEvents = () => {
    if (window.__KITCHEN_LISTENERS_BOUND__) {
      return;
    }
    window.__KITCHEN_LISTENERS_BOUND__ = true;

    const byIdAny = (ids) => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          return el;
        }
      }
      return null;
    };

    const on = (el, eventName, handler, options) => {
      if (!el) {
        return;
      }
      if (typeof handler !== 'function') {
        return;
      }
      el.addEventListener(
        eventName,
        (event) => {
          try {
            handler(event);
          } catch (error) {
            reportActionError(error);
          }
        },
        options
      );
    };

    const missing = getMissingCore();
    if (missing.length) {
      renderBootError(missing);
      return;
    }
    if (!checkCriticalDom()) {
      return;
    }
    ensureUiState();

    const planStatusEl = document.getElementById('plan-status');
    const dropZoneEl = document.getElementById('pdfDropZone');
    const pdfInputEl = document.getElementById('pdfInput');
    const parseTextBtn = document.getElementById('btnInterpret');
    const newRecipeBtn = document.getElementById('new-recipe');
    const newRecipeDefaultsEl = document.getElementById('new-recipe-defaults');
    const importRecipeBtn = document.getElementById('import-pdf');
    const backLibraryBtn = document.getElementById('back-library');
    const saveRecipeBtn = document.getElementById('btn-save-recipe');
    const saveAsRecipeBtn = document.getElementById('btn-save-as-new');
    const manualToggleBtn = document.getElementById('manual-toggle');
    const manualTextEl = document.getElementById('menuTextArea');
    const emptyUploadBtn = document.getElementById('empty-upload-btn');
    const emptyPasteBtn = document.getElementById('empty-paste-btn');
    const debugToggleEl = document.getElementById('debug-toggle');
    const expertToggleEl = document.getElementById('expert-toggle');
    const alertsLinesEl = document.getElementById('alerts-lines');
    const alertsDismissBtn = document.getElementById('alerts-dismiss');
    const alertsAddResourcesBtn = document.getElementById('alerts-add-resources');
    const aiSummaryEl = document.getElementById('ai-summary-content');
    const validationListEl = document.getElementById('validation-list');
    const prepIssuesGridEl = document.getElementById('prep-issues-grid');
    const autoAssignBalancedBtn = document.getElementById('auto-assign-balanced');
    const rebalanceTeamBtn = document.getElementById('btn-rebalance-team');
    const recalcRouteBtn = document.getElementById('btn-recalc-route');
    const autoReviewBtn = document.getElementById('auto-review');
    const startServiceBtn = document.getElementById('start-service');
    const goKitchenBtn = document.getElementById('go-kitchen');
    const settingsPanelEl = document.getElementById('settings-panel');
    const settingsIssuesEl = document.getElementById('settings-issues');
    const opsPanelEl = document.getElementById('opsPanel');
    const opsResourcesEl = document.getElementById('opsResources');
    const opsTeamEl = document.getElementById('opsTeam');
    const opsAssignmentsEl = document.getElementById('opsAssignments');
    const advPanelEl = document.getElementById('advPanel');
    const btnFixAll = document.getElementById('btn-fix-all');
    const btnAssignResources = document.getElementById('btn-assign-resources');
    const btnAutoassignBalanced = document.getElementById('btn-autoassign-balanced');
    const btnFillDurations = document.getElementById('btn-fill-durations');
    const btnToggleIssues = document.getElementById('btn-toggle-issues');
    const btnStartService = document.getElementById('btn-start-service');
    const btnContinueSession = document.getElementById('continue-session');
    const btnResetSession = document.getElementById('reset-session');
    const pausePhaseBtn = document.getElementById('pause-phase');
    const finalizePhaseBtn = document.getElementById('finalize-phase');
    const approvePlanBtn = document.getElementById('btn-approve-plan');
    const phasePrevBtn = document.getElementById('btn-phase-prev');
    const phaseNextBtn = document.getElementById('btn-phase-next');
    const phaseSkipBtn = document.getElementById('btn-phase-skip');
    const filterPlatoEl = document.getElementById('filter-plato');
    const filterFaseEl = document.getElementById('filter-fase');
    const filterErrorsEl = document.getElementById('filter-errors');
    const filterNoDurationEl = document.getElementById('filter-no-duration');
    const filterNoResourceEl = document.getElementById('filter-no-resource');
    const compactToggleEl = document.getElementById('toggle-compact');
    const questionsListEl = document.getElementById('questions-list');
    const assignmentListEl = document.getElementById('assignment-list');
    const retryInterpretBtn = document.getElementById('retry-interpret');
    const resourceEditorEl = document.getElementById('resource-editor');
    const teamEditorEl = document.getElementById('team-editor');
    const addResourceBtn = document.getElementById('add-resource');
    const addPersonBtn = document.getElementById('add-person');
    const lineColumnsEl = document.getElementById('line-columns');
    const recipeListEl = document.getElementById('recipe-list');
    const recipeFilterEl = document.getElementById('recipe-filter');

    const modeLibraryBtnEl = byIdAny(['mode-library', 'nav-library', 'btn-library']);
    const modePrepBtnEl = byIdAny(['mode-prep', 'nav-prep', 'btn-prep']);
    const modeKitchenBtnEl = byIdAny(['mode-kitchen', 'nav-kitchen', 'btn-kitchen']);
    renderUiPanels = () => {
      ensureUiState();
      const uiState = window.state?.ui || { panel: 'none', tab: 'resources' };
      const showOps = uiState.panel === 'ops';
      const showAdv = uiState.panel === 'adv';
      if (opsPanelEl) {
        opsPanelEl.classList.toggle('hidden', !showOps);
      }
      if (advPanelEl) {
        advPanelEl.classList.toggle('hidden', !showAdv);
      }
      if (opsResourcesEl) {
        opsResourcesEl.classList.toggle('hidden', !showOps || uiState.tab !== 'resources');
      }
      if (opsTeamEl) {
        opsTeamEl.classList.toggle('hidden', !showOps || uiState.tab !== 'team');
      }
      if (opsAssignmentsEl) {
        opsAssignmentsEl.classList.toggle('hidden', !showOps || uiState.tab !== 'assignments');
      }
      const hideOpsDupes = showOps;
      if (btnAssignResources) {
        btnAssignResources.classList.toggle('hidden', hideOpsDupes);
      }
      if (btnAutoassignBalanced) {
        btnAutoassignBalanced.classList.toggle('hidden', hideOpsDupes);
      }
      if (alertsAddResourcesBtn) {
        alertsAddResourcesBtn.classList.toggle('hidden', hideOpsDupes);
      }
      if (alertsDismissBtn) {
        alertsDismissBtn.classList.toggle('hidden', hideOpsDupes);
      }
    };
    wrapRender();

    const requestRecipeName = (defaultName = '') => {
      const seed = String(defaultName || '').trim();
      const entered = typeof window.prompt === 'function' ? window.prompt('Nombre de la receta', seed) : seed;
      const trimmed = String(entered || '').trim();
      if (!trimmed) {
        if (planStatusEl) {
          planStatusEl.textContent = 'Escribe un nombre para guardar la receta.';
        }
        return null;
      }
      return trimmed;
    };

    const goToLibrary = () => {
      navigateTo('library');
    };

    const goToPrep = () => {
      navigateTo('prep');
    };

    const goToKitchen = () => {
      if (shouldLogUI()) {
        const currentPlan = state?.plan || plan;
        console.info('[ui-debug] go-kitchen', {
          view: state?.view,
          screen: state?.screen,
          tasks: currentPlan?.tareas?.length || 0,
          phases: (currentPlan?.fases || currentPlan?.phases || []).length,
          planReady: state?.planReady,
          approved: state?.approved
        });
      }
      navigateTo('kitchen');
    };

    const warnAction = (action, reason) => {
      if (!action) {
        return;
      }
      const detail = reason ? `: ${reason}` : '';
      console.warn(`[action] ${action}${detail}`);
    };
    const dispatchAction = (action, el) => {
      ensureUiState();
      if (!action) {
        return false;
      }
      const uiState = window.state?.ui;
      if (!uiState) {
        return false;
      }
      const openOps = (tab) => {
        uiState.panel = 'ops';
        uiState.tab = tab || uiState.tab || 'resources';
        if (shouldLogUI()) {
          const currentPlan = state?.plan || plan;
          console.info('[ui-debug] open-ops', {
            tab: uiState.tab,
            resources: currentPlan?.recursos?.length || 0,
            team: currentPlan?.equipo?.length || 0,
            unsavedPlan: state?.unsavedPlan
          });
        }
        requestRender();
        return true;
      };
      const openAdv = () => {
        uiState.panel = 'adv';
        requestRender();
        return true;
      };
      const closePanels = () => {
        uiState.panel = 'none';
        requestRender();
        return true;
      };
      switch (action) {
        case 'open-ops':
          return openOps(uiState.tab || 'resources');
        case 'open-ops-resources':
          return openOps('resources');
        case 'open-ops-team':
          return openOps('team');
        case 'open-ops-assignments':
          return openOps('assignments');
        case 'open-adv':
          return openAdv();
        case 'close-panels':
          return closePanels();
        case 'save-ops-changes':
        case 'save-adv-changes':
          return closePanels();
        default:
          break;
      }
      if (action === 'review') {
        return openAdv();
      }
      if (
        action === 'add-missing-resources' ||
        action === 'assign-missing-resources' ||
        action === 'auto-assign-resources' ||
        action === 'add-resources' ||
        action === 'ignore-missing-resources'
      ) {
        return openOps('resources');
      }
      if (action === 'auto-assign-team' || action === 'auto-assign-tasks' || action === 'distribute-tasks') {
        return openOps('assignments');
      }
      if (action === 'auto-assign-durations') {
        return openAdv();
      }
      return false;
    };
    const getIssueId = (element) => {
      if (!element) {
        return null;
      }
      return element.dataset.issueId || element.closest('[data-issue-id]')?.dataset.issueId || null;
    };
    const getTaskId = (element) => {
      if (!element) {
        return null;
      }
      return element.dataset.taskId || element.closest('[data-task-id]')?.dataset.taskId || null;
    };
    const getRecipeId = (element) => {
      if (!element) {
        return null;
      }
      return element.dataset.recipeId || element.closest('[data-recipe-id]')?.dataset.recipeId || null;
    };
    const handleAction = (action, element) => {
      if (dispatchAction(action, element)) {
        return true;
      }
      if (action === 'retry-interpret') {
        runRetryInterpret();
        return true;
      }
      if (action === 'bulk-duration') {
        const count = fillMissingDurations();
        if (planStatusEl) {
          planStatusEl.textContent = count ? `Duraciones completadas: ${count}.` : '0 tareas actualizadas.';
        }
        render();
        return true;
      }
      if (action === 'bulk-resource') {
        const count = assignResourcesByHeuristic();
        if (planStatusEl) {
          planStatusEl.textContent = count ? `Recursos asignados: ${count}.` : '0 tareas actualizadas.';
        }
        render();
        return true;
      }
      if (action === 'bulk-assign') {
        const result = autoAssignBalanced({ phaseOnly: false, respectLocked: true, onlyUnassigned: true });
        const assigned = result.assignedCount || 0;
        const locked = result.skippedLocked || 0;
        if (planStatusEl) {
          planStatusEl.textContent = assigned
            ? `Autoasignado: ${assigned} tareas. No se tocaron ${locked} tareas fijadas.`
            : '0 tareas actualizadas.';
        }
        render();
        return true;
      }
      if (action === 'remove-resource') {
        const row = element?.closest('[data-resource-id]');
        if (row) {
          removeResource(row.dataset.resourceId);
        }
        return true;
      }
      if (action === 'remove-person') {
        const row = element?.closest('[data-person-id]');
        if (row) {
          removePerson(row.dataset.personId);
        }
        return true;
      }
      if (action === 'finish') {
        const taskId = getTaskId(element);
        if (taskId) {
          handleTaskFinish(taskId);
          render();
        }
        return true;
      }
      if (action === 'toggle') {
        const taskId = getTaskId(element);
        if (taskId) {
          handleTaskToggle(taskId);
          render();
        }
        return true;
      }
      if (
        action === 'start-recipe' ||
        action === 'edit-recipe' ||
        action === 'duplicate-recipe' ||
        action === 'delete-recipe'
      ) {
        const recipeId = getRecipeId(element);
        if (!recipeId) {
          return true;
        }
        if (action === 'start-recipe') {
          setActiveRecipe(recipeId, { mode: 'kitchen', openSettings: false });
          navigateTo('kitchen');
          return true;
        }
        if (action === 'edit-recipe') {
          setActiveRecipe(recipeId, { mode: 'prep', openSettings: true });
          navigateTo('prep');
          return true;
        }
        if (action === 'duplicate-recipe') {
          duplicateRecipe(recipeId);
          render();
          return true;
        }
        if (action === 'delete-recipe') {
          if (!window.confirm('Borrar esta receta?')) {
            return true;
          }
          removeRecipe(recipeId);
          render();
          return true;
        }
      }
      if (action.startsWith('validation-') || action.startsWith('issue-')) {
        handleValidationAction(action, getIssueId(element));
        return true;
      }
      return false;
    };

    const handleAddMissingResources = () => {
      if (state?.ignoreMissingResources) {
        warnAction('add-missing-resources', 'recursos ignorados');
        if (planStatusEl) {
          planStatusEl.textContent = 'Recursos marcados como ignorados. Desactivalo para autoasignar.';
        }
        return;
      }
      if (!plan || plan?.isEmpty) {
        warnAction('add-missing-resources', 'plan vacio');
        return;
      }
      const created =
        typeof addMissingResourcesFromDiagnostics === 'function' ? addMissingResourcesFromDiagnostics() : 0;
      const assigned = typeof assignResourcesByHeuristic === 'function'
        ? assignResourcesByHeuristic({ silent: true })
        : 0;
      if (!created && !assigned) {
        warnAction('add-missing-resources', 'sin recursos pendientes');
      }
      if (planStatusEl) {
        planStatusEl.textContent = 'Recursos creados: ' + created + '. Tareas asignadas: ' + assigned + '.';
      }
      render();
    };

    const handleIgnoreMissingResources = () => {
      setState({ alertsOpen: false });
      if (typeof setIgnoreMissingResources === 'function') {
        setIgnoreMissingResources(true);
        return;
      }
      if (window.state) {
        window.state.ignoreMissingResources = true;
      }
      if (typeof validateAndStore === 'function') {
        validateAndStore();
      }
      render();
    };

    const handleAutoAssignTeam = () => {
      if (typeof autoAssignBalanced !== 'function') {
        warnAction('auto-assign-team', 'autoAssignBalanced missing');
        return;
      }
      const result = autoAssignBalanced({ phaseOnly: false, respectLocked: true, onlyUnassigned: true });
      const assigned = result.assignedCount || 0;
      const locked = result.skippedLocked || 0;
      if (!assigned) {
        warnAction('auto-assign-team', 'sin tareas para asignar');
      }
      if (planStatusEl) {
        planStatusEl.textContent = `Autoasignado: ${assigned} tareas. No se tocaron ${locked} tareas fijadas.`;
      }
      render();
    };

    const handleAutoAssignDurations = () => {
      if (typeof fillMissingDurations !== 'function') {
        warnAction('auto-assign-durations', 'fillMissingDurations missing');
        return;
      }
      const count = fillMissingDurations();
      if (!count) {
        warnAction('auto-assign-durations', 'sin duraciones pendientes');
      }
      if (planStatusEl) {
        planStatusEl.textContent = count ? `Duraciones completadas: ${count}.` : 'No hay duraciones pendientes.';
      }
      render();
    };

    const handleValidationAction = (action, issueId = null) => {
      if (action === 'review') {
        handleAlertAction('review');
        return;
      }
      if (action === 'validation-fix-durations') {
        const count = fillMissingDurations();
        planStatusEl.textContent = count
          ? `Duraciones completadas: ${count}.`
          : 'No hay duraciones pendientes.';
        render();
        return;
      }
      if (action === 'validation-auto-assign') {
        const result = autoAssignBalanced({ phaseOnly: false, respectLocked: true, onlyUnassigned: true });
        const assigned = result.assignedCount || 0;
        const locked = result.skippedLocked || 0;
        planStatusEl.textContent = `Autoasignado: ${assigned} tareas. No se tocaron ${locked} tareas fijadas.`;
        if (state?.debugEnabled) {
          console.debug('[validation-assign] autoassign', { assigned, locked });
        }
        render();
        return;
      }
      if (action === 'validation-assign') {
        const result = resolveAllAutomatically({ durations: true, resources: true, assign: true });
        if (result.errorCount > 0) {
          planStatusEl.textContent = `Quedan ${result.errorCount} problemas que requieren tu decision.`;
        } else if (result.adjustments > 0) {
          planStatusEl.textContent = `Reparto aplicado con ${result.adjustments} ajustes.`;
        } else {
          planStatusEl.textContent = 'No hay ajustes pendientes.';
        }
        if (state?.debugEnabled) {
          console.debug('[validation-assign] resolve-all', result);
        }
        render();
        return;
      }
      if (action === 'validation-add-resources') {
        const createdMissing =
          typeof addMissingResourcesFromDiagnostics === 'function' ? addMissingResourcesFromDiagnostics() : 0;
        const createdSuggested = typeof addSuggestedResources === 'function' ? addSuggestedResources() : 0;
        const assigned = typeof assignResourcesByHeuristic === 'function'
          ? assignResourcesByHeuristic({ silent: true })
          : 0;
        planStatusEl.textContent =
          'Recursos creados: ' + (createdMissing + createdSuggested) + '. Tareas asignadas: ' + assigned + '.';
        render();
        return;
      }
      if (action === 'issue-toggle') {
        state.issuesOpen = !state.issuesOpen;
        renderValidation();
        if (settingsIssuesEl) {
          settingsIssuesEl.classList.toggle('show', state.issuesOpen);
        }
        render();
        return;
      }
      if (action === 'issue-goto' && issueId) {
        scrollToIssue(issueId);
        return;
      }
      if (action === 'issue-fix' && issueId) {
        applyIssueFix(getIssueById(issueId));
        return;
      }
      if (action === 'issue-fix-all') {
        applyAllIssueFixes();
        return;
      }
    };

    const runRetryInterpret = () => {
      const manualValue = manualTextEl ? String(manualTextEl.value || '').trim() : '';
      if (manualValue) {
        processMenuText(manualValue, { userTriggered: true, source: 'retry' });
        return;
      }
      const lastText = typeof appState === 'object' ? String(appState.menuRawText || '').trim() : '';
      if (lastText) {
        processMenuText(lastText, { userTriggered: true, source: 'retry' });
        return;
      }
      if (typeof handleManualText === 'function') {
        handleManualText();
        return;
      }
      if (planStatusEl) {
        planStatusEl.textContent = 'No hay texto para interpretar. Pega un menu o carga un PDF.';
      }
      if (typeof navigateTo === 'function') {
        navigateTo('prep');
      } else if (typeof setUIMode === 'function') {
        setUIMode('prep', { scrollToUpload: true, focusManual: true });
      }
      if (manualToggleBtn) {
        manualToggleBtn.click();
        return;
      }
      if (manualTextEl) {
        manualTextEl.focus();
      }
    };

    on(dropZoneEl, 'click', () => pdfInputEl && pdfInputEl.click());
    on(dropZoneEl, 'dragover', (event) => {
      event.preventDefault();
      dropZoneEl.classList.add('hover');
    });
    on(dropZoneEl, 'dragleave', () => dropZoneEl.classList.remove('hover'));
    on(dropZoneEl, 'drop', (event) => {
      event.preventDefault();
      dropZoneEl.classList.remove('hover');
      const file = event.dataTransfer.files[0];
      handlePdfFile(file);
    });

    on(pdfInputEl, 'change', (event) => handlePdfFile(event.target.files[0]));
    on(parseTextBtn, 'click', handleManualText);
    if (emptyUploadBtn) {
      emptyUploadBtn.addEventListener('click', () => {
        if (pdfInputEl) {
          pdfInputEl.click();
        }
      });
    }
    if (emptyPasteBtn) {
      emptyPasteBtn.addEventListener('click', () => {
        try {
          if (state?.uiMode !== 'prep') {
            if (typeof navigateTo === 'function') {
              navigateTo('prep');
            } else if (typeof setUIMode === 'function') {
              setUIMode('prep', { scrollToUpload: true, focusManual: true });
            }
          }
          if (manualToggleBtn) {
            manualToggleBtn.click();
            return;
          }
          if (typeof setState === 'function') {
            setState({ manualTextOpen: true });
          } else if (state && typeof state === 'object') {
            state.manualTextOpen = true;
          }
          render();
          if (manualTextEl) {
            manualTextEl.focus();
          }
        } catch (error) {
          reportActionError(error);
        }
      });
    }
    if (retryInterpretBtn && !retryInterpretBtn.dataset.action) {
      retryInterpretBtn.addEventListener('click', () => {
        try {
          runRetryInterpret();
        } catch (error) {
          reportActionError(error);
        }
      });
    }
    if (newRecipeBtn) {
      newRecipeBtn.addEventListener('click', () => {
        const useDefaults = Boolean(newRecipeDefaultsEl && newRecipeDefaultsEl.checked);
        const basePlan = useDefaults
          ? (typeof DEFAULT_PLAN !== 'undefined' ? { ...DEFAULT_PLAN, isEmpty: false } : { ...emptyPlan, isEmpty: false })
          : emptyPlan;
        const recipe = addRecipe(createRecipeFromPlan(basePlan, { name: 'Nueva receta' }));
        setActiveRecipe(recipe.id, { mode: 'prep', openSettings: true });
        navigateTo('prep');
      });
    }
    if (importRecipeBtn) {
      importRecipeBtn.addEventListener('click', () => pdfInputEl && pdfInputEl.click());
    }
    if (backLibraryBtn) {
      backLibraryBtn.addEventListener('click', goToLibrary);
    }
    if (saveRecipeBtn) {
      saveRecipeBtn.addEventListener('click', () => {
        try {
          const saved = saveActiveRecipeFromPlan();
          if (saved) {
            planStatusEl.textContent = 'Receta guardada.';
            render();
            return;
          }
          const planName = typeof plan === 'object' && plan ? plan.name || plan?.meta?.titulo : '';
          const requested = requestRecipeName(planName);
          if (!requested) {
            return;
          }
          const recipe = savePlanAsNewRecipe(requested);
          if (recipe) {
            state.activeRecipeId = recipe.id;
            localStorage.setItem(RECIPE_ACTIVE_KEY, recipe.id);
            planStatusEl.textContent = 'Receta guardada en biblioteca.';
            render();
          }
        } catch (error) {
          reportActionError(error);
        }
      });
    }
    if (saveAsRecipeBtn) {
      saveAsRecipeBtn.addEventListener('click', () => {
        try {
          const planName = typeof plan === 'object' && plan ? plan.name || plan?.meta?.titulo : '';
          const requested = requestRecipeName(planName);
          if (!requested) {
            return;
          }
          const recipe = savePlanAsNewRecipe(requested);
          if (recipe) {
            state.activeRecipeId = recipe.id;
            localStorage.setItem(RECIPE_ACTIVE_KEY, recipe.id);
            planStatusEl.textContent = 'Receta guardada como nueva.';
            render();
          }
        } catch (error) {
          reportActionError(error);
        }
      });
    }
    if (manualToggleBtn) {
      manualToggleBtn.addEventListener('click', () => {
        try {
          if (typeof navigateTo === 'function') {
            navigateTo('prep');
          } else if (typeof setUIMode === 'function') {
            setUIMode('prep', { scrollToUpload: true, focusManual: true });
          }
          if (typeof setState === 'function') {
            setState({ manualTextOpen: true });
          } else if (state && typeof state === 'object') {
            state.manualTextOpen = true;
          }
          render();
          if (manualTextEl) {
            manualTextEl.focus();
          }
        } catch (error) {
          if (typeof reportActionError === 'function') {
            reportActionError(error);
          } else {
            console.error(error);
          }
          render();
        }
      });
    }
    on(debugToggleEl, 'change', () => {
      setState({ debugEnabled: debugToggleEl.checked });
      userSettings.debugEnabled = debugToggleEl.checked;
      if (typeof saveUserSettings === 'function') {
        saveUserSettings();
      } else if (window.saveUserSettings) {
        window.saveUserSettings();
      }
      updateDebugText();
    });
    if (expertToggleEl) {
      expertToggleEl.addEventListener('change', () => {
        setState({ expertMode: expertToggleEl.checked });
        render();
      });
    }

    if (!window.__ACTION_DELEGATION_BOUND__) {
      window.__ACTION_DELEGATION_BOUND__ = true;
      document.addEventListener('click', (event) => {
        const target = event.target.closest('[data-action]');
        if (!target || target.disabled) {
          return;
        }
        const action = target.dataset.action;
        if (!action) {
          return;
        }
        try {
          if (handleAction(action, target)) {
            event.preventDefault();
          }
        } catch (error) {
          reportActionError(error);
        }
      });
    }
    if (!document.querySelector('[data-action]')) {
      console.warn('No hay elementos con data-action en el DOM.');
    }

    on(autoAssignBalancedBtn, 'click', () => {
      if (autoAssignBalancedBtn?.dataset?.action) {
        return;
      }
      handleAutoAssignTeam();
    });
    if (rebalanceTeamBtn) {
      rebalanceTeamBtn.addEventListener('click', () => {
        const result = autoAssignBalanced({ phaseOnly: false, respectLocked: true, onlyUnassigned: false });
        const assigned = result.assignedCount || 0;
        const locked = result.skippedLocked || 0;
        planStatusEl.textContent = `Equipo reequilibrado: ${assigned} tareas. No se tocaron ${locked} tareas fijadas.`;
        render();
      });
    }
    on(autoReviewBtn, 'click', () => {
      navigateTo('prep');
      reviewAutomatically();
      render();
    });
    on(startServiceBtn, 'click', () => {
      startService();
      navigateTo('kitchen');
      render();
    });
    on(btnStartService, 'click', () => {
      startService();
      navigateTo('kitchen');
      render();
    });
    if (goKitchenBtn) {
      goKitchenBtn.addEventListener('click', goToKitchen);
    }

    if (settingsPanelEl) {
      settingsPanelEl.addEventListener('toggle', () => {
        closeOverlays(settingsPanelEl);
        setState({ advancedOpen: settingsPanelEl.open });
        if (settingsPanelEl.open) {
          setState({ uiMode: 'prep', screen: 'plan' });
        }
        render();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        const next = !state.expertMode;
        setState({ expertMode: next });
        if (expertToggleEl) {
          expertToggleEl.checked = next;
        }
        render();
      }
    });

    on(pausePhaseBtn, 'click', togglePausePhase);
    on(finalizePhaseBtn, 'click', finalizePhase);
    on(modeLibraryBtnEl, 'click', goToLibrary);
    on(modeKitchenBtnEl, 'click', goToKitchen);
    on(modePrepBtnEl, 'click', goToPrep);

    window.debugHealthCheck = () => {
      const report = {
        ok: true,
        missing: [],
        state: {
          screen: state?.screen,
          uiMode: state?.uiMode,
          approved: state?.approved,
          phaseStatus: state?.phaseStatus
        },
        pdf: {
          hasPdfJs: Boolean(window.pdfjsLib),
          hasMenuRawText: typeof appState?.menuRawText === 'string' ? appState.menuRawText.length : null,
          lastPdfError: appState?.lastPdfError || null
        }
      };

      const requiredIds = [
        'library-screen',
        'plan-screen',
        'upload',
        'pdfDropZone',
        'pdfInput',
        'pdfStatus',
        'menuTextArea',
        'btnInterpret',
        'mode-library',
        'mode-prep',
        'mode-kitchen'
      ];
      requiredIds.forEach((id) => {
        if (!document.getElementById(id)) {
          report.ok = false;
          report.missing.push(id);
        }
      });

      console.groupCollapsed('[debugHealthCheck] ' + (report.ok ? 'OK' : 'FAIL'));
      console.log(report);
      console.groupEnd();
      return report;
    };

    const navBackBtn = document.getElementById('nav-back');
    on(navBackBtn, 'click', () => {
      if (history.length > 1) {
        history.back();
        return;
      }
      const hasPlanTasks =
        typeof plan === 'object' && plan && Array.isArray(plan.tareas) && plan.tareas.length > 0;
      navigateTo(hasPlanTasks ? 'prep' : 'library');
    });

    const healthDetailsBtn = document.getElementById('health-details');
    on(healthDetailsBtn, 'click', () => {
      navigateTo('prep');
      window.setTimeout(() => {
        const target = document.getElementById('prep-issues') || document.getElementById('validation-list');
        jumpTo(target);
      }, 30);
    });

    // Cerrar el menu de "Mas opciones" al hacer click fuera.
    const moreMenuEl = document.getElementById('more-menu');
    document.addEventListener('click', (event) => {
      if (!moreMenuEl || !moreMenuEl.open) {
        return;
      }
      if (moreMenuEl.contains(event.target)) {
        return;
      }
      moreMenuEl.open = false;
    });

    // Hash router.
    window.addEventListener('hashchange', () => {
      applyHashView(normalizeHash(location.hash));
    });

    // Sticky offset robusto (header puede cambiar de altura).
    if ('ResizeObserver' in window) {
      const topbar = document.querySelector('.topbar');
      if (topbar) {
        const ro = new ResizeObserver(() => updateTopbarHeight());
        ro.observe(topbar);
      }
    }
    window.addEventListener('resize', updateTopbarHeight);
    updateTopbarHeight();

    on(approvePlanBtn, 'click', () => {
      if (!calculatePlan({ silent: true })) {
        renderValidation();
        const errorCount = (state.issues || []).filter((issue) => issue.severity === 'error').length;
        planStatusEl.textContent = errorCount
          ? `Hay ${errorCount} problemas que requieren decision.`
          : 'Hay problemas que requieren decision.';
        return;
      }
      state.approved = true;
      resetPhaseTimer();
      render();
      planStatusEl.textContent = 'Plan aprobado.';
    });
    on(recalcRouteBtn, 'click', () => {
      if (calculatePlan()) {
        planStatusEl.textContent = state.lastPlanMessage || 'Ruta optimizada.';
      }
      render();
    });
    on(btnFixAll, 'click', () => {
      if (btnFixAll?.dataset?.action) {
        return;
      }
      const result = resolveAllAutomatically();
      if (result.errorCount > 0) {
        planStatusEl.textContent = `Quedan ${result.errorCount} errores que requieren tu decision.`;
      } else if (result.adjustments > 0) {
        planStatusEl.textContent = `Plan listo con ${result.adjustments} ajustes automaticos.`;
      } else {
        planStatusEl.textContent = 'Listo.';
      }
      render();
    });
    on(btnAssignResources, 'click', () => {
      if (btnAssignResources?.dataset?.action) {
        return;
      }
      handleAddMissingResources();
    });
    on(btnAutoassignBalanced, 'click', () => {
      if (btnAutoassignBalanced?.dataset?.action) {
        return;
      }
      handleAutoAssignTeam();
    });
    on(btnFillDurations, 'click', () => {
      if (btnFillDurations?.dataset?.action) {
        return;
      }
      handleAutoAssignDurations();
      if (state?.debugEnabled) {
        console.debug('[settings] fill-durations');
      }
    });
    on(btnContinueSession, 'click', () => {
      const lastPlan = typeof sanitizeStoredPlan === 'function'
        ? sanitizeStoredPlan(loadLastPlan())
        : loadLastPlan();
      if (lastPlan) {
        setPlan(lastPlan, null, 'Plan recuperado', []);
        if (lastPlan.recipeId) {
          state.activeRecipeId = lastPlan.recipeId;
        }
        if (state?.debugEnabled) {
          console.debug('[session] continue-session', {
            tasks: lastPlan?.tareas?.length || 0,
            recipeId: lastPlan.recipeId || null
          });
        }
      } else {
        planStatusEl.textContent = 'No hay sesion previa guardada.';
        if (state?.debugEnabled) {
          console.debug('[session] continue-session', { tasks: 0 });
        }
        render();
      }
    });
    on(btnResetSession, 'click', () => {
      localStorage.removeItem(LAST_PLAN_KEY);
      localStorage.removeItem(RECIPE_ACTIVE_KEY);
      setPlan(emptyPlan, null, 'Sin menu cargado', []);
      if (typeof resetImportState === 'function') {
        resetImportState();
      }
      if (state?.debugEnabled) {
        console.debug('[session] reset', { cleared: true });
      }
      render();
    });
    on(btnToggleIssues, 'click', () => {
      state.issuesOpen = !state.issuesOpen;
      renderValidation();
      if (settingsIssuesEl) {
        settingsIssuesEl.classList.toggle('show', state.issuesOpen);
      }
      render();
    });

    on(phasePrevBtn, 'click', retreatPhase);
    on(phaseNextBtn, 'click', () => advancePhase(false));
    on(phaseSkipBtn, 'click', skipPrestart);

    on(filterPlatoEl, 'change', (event) => {
      filterState.plato = event.target.value;
      render();
    });
    on(filterFaseEl, 'change', (event) => {
      filterState.fase = event.target.value;
      render();
    });
    on(filterErrorsEl, 'change', (event) => {
      filterState.errors = !event.target.checked;
      render();
    });
    on(filterNoDurationEl, 'change', (event) => {
      filterState.noDuration = event.target.checked;
      render();
    });
    on(filterNoResourceEl, 'change', (event) => {
      filterState.noResource = event.target.checked;
      render();
    });
    on(compactToggleEl, 'change', (event) => {
      setState({ compactMode: event.target.checked });
      render();
    });

    on(questionsListEl, 'change', (event) => {
      const select = event.target.closest('select[data-question-id]');
      if (!select) {
        return;
      }
      applyQuestionAnswer(select.dataset.questionId, select.value);
    });

    on(assignmentListEl, 'change', (event) => {
      const target = event.target;
      const taskId = target.dataset.taskId;
      const field = target.dataset.field;
      if (!taskId || !field) {
        return;
      }
      updateTask(taskId, { [field]: target.value });
    });

    on(resourceEditorEl, 'change', (event) => {
      const target = event.target;
      const row = target.closest('[data-resource-id]');
      if (!row) {
        return;
      }
      const field = target.dataset.field;
      if (!field) {
        return;
      }
      updateResource(row.dataset.resourceId, { [field]: target.value });
    });

    on(teamEditorEl, 'change', (event) => {
      const target = event.target;
      const row = target.closest('[data-person-id]');
      if (!row) {
        return;
      }
      const field = target.dataset.field;
      if (!field) {
        return;
      }
      updatePerson(row.dataset.personId, { [field]: target.value });
    });

    on(addResourceBtn, 'click', () => {
      if (typeof addResource !== 'function') {
        return;
      }
      addResource();
      render();
    });
    on(addPersonBtn, 'click', () => {
      if (typeof addPerson !== 'function') {
        return;
      }
      addPerson();
      render();
    });
    if (recipeFilterEl) {
      recipeFilterEl.addEventListener('change', (event) => {
        setState({ libraryTag: event.target.value });
        render();
      });
    }
  };

  const init = () => {
    warnDuplicateIds();
    const missing = getMissingCore();
    if (missing.length) {
      renderBootError(missing);
      return;
    }
    if (!checkCriticalDom()) {
      return;
    }
    if (typeof loadUserSettings === 'function') {
      loadUserSettings();
    } else if (window.loadUserSettings) {
      window.loadUserSettings();
    }
    loadRecipesFromStorage();
    setPlan(emptyPlan, null, 'Sin menu cargado', []);
    if (typeof resetImportState === 'function') {
      resetImportState();
    }
    if (state?.debugEnabled) {
      console.debug('[init] start clean');
    }
    // Inicio segun hash actual (o biblioteca por defecto).
    const initialView = normalizeHash(location.hash);
    setView('library');
    updatePdfStatus();
    updateTopbarHeight();
    navigateTo(initialView, { replace: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindEvents();
      init();
    }, { once: true });
  } else {
    bindEvents();
    init();
  }
})();




