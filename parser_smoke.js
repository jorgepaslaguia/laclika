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
