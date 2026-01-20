(function () {
  if (typeof window === 'undefined') {
    return;
  }

  function runFixtures(fixtures) {
    const results = [];
    fixtures.forEach((fixture) => {
      let ok = true;
      let detail = '';
      try {
        const menuIR = window.buildMenuIRFromRawText
          ? window.buildMenuIRFromRawText(fixture.text || '', { source: 'fixture', id: fixture.id })
          : null;
        const built = menuIR && window.menuIRToPlan ? window.menuIRToPlan(menuIR, [], []) : null;
        let planBuilt = built?.plan || null;
        let plateCount = menuIR?.platos?.length || 0;
        if ((!plateCount || !(planBuilt?.tareas || []).length) && window.parseMenuDraft && window.buildPlanFromDraft) {
          const draft = window.parseMenuDraft(fixture.text || '');
          const fallback = window.buildPlanFromDraft(draft);
          planBuilt = fallback?.plan || planBuilt;
          plateCount = draft?.platos?.length || plateCount;
        }
        const taskCount = planBuilt?.tareas?.length || 0;
        const teamCount = planBuilt?.equipo?.length || planBuilt?.team?.length || 0;
        const phases = new Set((planBuilt?.tareas || []).map((task) => task.fase));
        const tasksByDish = {};
        const processesByDish = {};
        (planBuilt?.tareas || []).forEach((task) => {
          const dish = task.plato || task.dish || 'Plato';
          if (!tasksByDish[dish]) {
            tasksByDish[dish] = 0;
          }
          tasksByDish[dish] += 1;
          if (!processesByDish[dish]) {
            processesByDish[dish] = new Set();
          }
          if (task.proceso) {
            processesByDish[dish].add(task.proceso);
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
        if (window.setPlan && window.state) {
          const snapshot = window.plan ? JSON.parse(JSON.stringify(window.plan)) : window.EMPTY_PLAN || null;
          window.setPlan(planBuilt, null, '', []);
          warnings = (window.state.issues || []).filter((issue) => issue.severity === 'warning').length;
          infos = (window.state.issues || []).filter((issue) => issue.severity === 'info').length;
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
        }
        const expect = fixture.expect || {};
        const platesOk = plateCount >= (expect.platesMin || 1);
        const tasksOk = taskCount >= (expect.tasksMin || 1);
        const phasesOk = phases.size >= (expect.phasesMin || 1);
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
        ok = platesOk && tasksOk && phasesOk && warningsOk && warningsAfterOk && teamOk;
        const warnLabel =
          warnings === null
            ? 'warnings n/a'
            : `warnings ${warnings}→${warningsAfter ?? warnings}`;
        const infoLabel = infos === null ? 'infos n/a' : `infos ${infos}→${infosAfter ?? infos}`;
        detail =
          `platos ${plateCount} tareas ${taskCount} equipo ${teamCount} fases ${phases.size} ` +
          `tareas/plato ${tasksPerDishMin}-${tasksPerDishMax} ` +
          `procesos/plato ${procPerDishMin}-${procPerDishMax} ` +
          `${warnLabel} ${infoLabel}`;
      } catch (error) {
        ok = false;
        detail = error && error.message ? error.message : 'error';
      }
      results.push({ id: fixture.id, level: fixture.level, ok, detail });
    });
    return results;
  }

  window.runParserSmoke = function runParserSmoke(options = {}) {
    if (typeof window.ensureParserFixturesLoaded === 'function') {
      window.ensureParserFixturesLoaded();
    }
    const fixtures = Array.isArray(window.PARSER_FIXTURES) ? window.PARSER_FIXTURES : [];
    const results = fixtures.length ? runFixtures(fixtures) : [{ id: 'fixtures', ok: false, detail: 'sin fixtures' }];
    if (options.log !== false) {
      const okCount = results.filter((item) => item.ok).length;
      console.log(`[parser_smoke] ${okCount}/${results.length} OK`);
      console.table(results);
    }
    return results;
  };
})();
