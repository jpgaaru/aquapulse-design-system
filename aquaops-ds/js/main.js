/**
 * AquaOps Design System — Main Controller & Component Registry
 * Initializes and coordinates all Atomic components across the application
 */

import { AquaSelect } from './aqua-select.js';
import { AquaSidebar } from './aqua-sidebar.js';
import { AquaToast } from './aqua-toast.js';
import { AquaTable, AquaPager } from './aqua-table.js';
import { AquaCharts } from './aqua-charts.js';
import { AquaDrawer } from './aqua-drawer.js';
import { AquaMotion } from './aqua-motion.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1b. Initialize Kinetic Motion & Micro-Physics
  AquaMotion.init();

  // 2. Component: Rich Select Dropdowns
  document.querySelectorAll('.rich-select').forEach((el) => {
    new AquaSelect(el);
  });

  // Rich Select Change Handlers & Toasts
  document.getElementById('richSpeciesSelect')?.addEventListener('aqua-change', (e) => {
    AquaToast.show(`Active species updated: ${e.detail.value}`, 'teal');
  });

  document.getElementById('richTargetSelect')?.addEventListener('aqua-change', (e) => {
    AquaToast.show(`Harvest target set: ${e.detail.value}`, 'teal');
  });

  document.getElementById('richMultiPondSelect')?.addEventListener('aqua-change', (e) => {
    const count = e.detail.values?.length || 0;
    AquaToast.show(`Monitored ponds updated (${count} selected)`, 'teal');
  });

  document.getElementById('richMetricSelect')?.addEventListener('aqua-change', (e) => {
    AquaToast.show(`Telemetry focus: ${e.detail.value}`, 'teal');
  });

  document.getElementById('entRowsSelect')?.addEventListener('aqua-change', (e) => {
    AquaToast.show(`Page size set to ${e.detail.value}`, 'teal');
  });

  document.getElementById('tblClusterSelect')?.addEventListener('aqua-change', (e) => {
    const val = e.detail.value;
    AquaToast.show(`Filtered table to ${val}`, 'teal');
    const targetTable = document.getElementById('enterpriseTable');
    if (!targetTable) return;
    targetTable.querySelectorAll('tbody tr:not(.detail-row)').forEach((row) => {
      const text = row.textContent;
      if (val === 'All Clusters' || 
         (val === 'Cluster Alpha' && (text.includes('POND-101') || text.includes('POND-102') || text.includes('POND-103') || text.includes('POND-104'))) || 
         (val === 'Cluster Delta' && (text.includes('POND-105') || text.includes('POND-106')))) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // 3. Component: Floating Sidebar
  const sidebarEl = document.getElementById('demoSidebar');
  if (sidebarEl) {
    new AquaSidebar(sidebarEl);
  }

  // 4. Component: Data Tables & Pagination
  document.querySelectorAll('table.tbl').forEach((table) => {
    const bulk = table.closest('.table-wrap')?.querySelector('.bulk') || document.getElementById('bulk');
    new AquaTable(table, bulk);
  });

  const specPagerEl = document.getElementById('specPager');
  if (specPagerEl) {
    new AquaPager(specPagerEl);
  }
  const entPagerEl = document.getElementById('entPager');
  if (entPagerEl) {
    new AquaPager(entPagerEl);
  }

  // Table Density Switcher
  document.querySelectorAll('[data-density]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const density = btn.dataset.density;
      const targetTable = document.getElementById('enterpriseTable');
      if (!targetTable) return;
      targetTable.classList.remove('tbl-compact', 'tbl-standard', 'tbl-spacious');
      targetTable.classList.add(`tbl-${density}`);
      btn.parentElement.querySelectorAll('[data-density]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Table Filter Tabs
  document.querySelectorAll('[data-tbl-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.tblFilter;
      const targetTable = document.getElementById('enterpriseTable');
      if (!targetTable) return;
      btn.parentElement.querySelectorAll('[data-tbl-filter]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      targetTable.querySelectorAll('tbody tr:not(.detail-row)').forEach((row) => {
        const status = row.dataset.status || '';
        if (filter === 'all' || status === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
          const detailId = row.dataset.detailId;
          if (detailId) {
            const detailRow = document.getElementById(detailId);
            if (detailRow) detailRow.style.display = 'none';
          }
        }
      });
    });
  });

  // 5. Component: Charts & Telemetry (Interactive World-Class Visualizations)
  AquaCharts.renderBars('cBars', [
    { l: 'Mon', v: 52 }, { l: 'Tue', v: 68 }, { l: 'Wed', v: 61 },
    { l: 'Thu', v: 84 }, { l: 'Fri', v: 72 }, { l: 'Sat', v: 92 }, { l: 'Sun', v: 66 },
  ], 85);

  AquaCharts.renderBars('pBars', [
    { l: 'Mon', v: 44 }, { l: 'Tue', v: 62 }, { l: 'Wed', v: 58 },
    { l: 'Thu', v: 80 }, { l: 'Fri', v: 66 }, { l: 'Sat', v: 90 }, { l: 'Sun', v: 60 },
  ], 85);

  AquaCharts.renderHorizontal('cH', [
    { l: 'Vannamei', v: 78, kg: 28450 }, { l: 'Monodon', v: 52, kg: 14800 },
    { l: 'Tilapia', v: 34, kg: 9200 }, { l: 'Scampi', v: 61, kg: 17200 }, { l: 'Nursery', v: 22, kg: 5400 },
  ]);

  AquaCharts.renderLine('cPath', 'cArea', 'cDots', [30, 45, 38, 62, 55, 78, 70, 85, 72, 90]);
  AquaCharts.renderDonut('cDonut');
  AquaCharts.renderDonut('pDonut', 'pDonutVal', 'pDonutSub');

  // New Data Visualizations
  AquaCharts.renderGauge('cGauge', 94.2);
  AquaCharts.renderHeatmap('cHeatmap');
  AquaCharts.renderDualLine('cDualLine');

  // 6. Tabs Molecule
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      group.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 7. Searchbar Clear Molecule
  const clearBtn = document.getElementById('sClear');
  const sInput = document.getElementById('sInput');
  if (clearBtn && sInput) {
    clearBtn.addEventListener('click', () => {
      sInput.value = '';
      sInput.focus();
    });
  }

  // 8. Action Dropdown Menu Molecule
  const dd = document.getElementById('dd');
  const ddBtn = document.getElementById('ddBtn');
  if (dd && ddBtn) {
    ddBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.toggle('open');
    });
    dd.querySelectorAll('.menu button').forEach((btn) => {
      btn.addEventListener('click', () => {
        dd.classList.remove('open');
        AquaToast.show(`Action executed: ${btn.textContent.trim()}`, 'teal');
      });
    });
    document.addEventListener('click', () => dd.classList.remove('open'));
  }

  // 9. Toast Triggers
  document.getElementById('toastTealBtn')?.addEventListener('click', () => {
    AquaToast.show('Sensor calibration threshold saved', 'teal');
  });
  document.getElementById('toastDarkBtn')?.addEventListener('click', () => {
    AquaToast.show('Automated aerator override dispatched', '');
  });

  // 10. Accordion Organism
  document.querySelectorAll('#acc .acc-h').forEach((h) => {
    h.addEventListener('click', () => {
      h.closest('.acc-item').classList.toggle('open');
    });
  });

  // 11. Modal Dialog Organism
  const ov = document.getElementById('ov');
  document.getElementById('openModal')?.addEventListener('click', () => ov?.classList.add('show'));
  document.getElementById('mCancel')?.addEventListener('click', () => ov?.classList.remove('show'));
  document.getElementById('mOk')?.addEventListener('click', () => {
    ov?.classList.remove('show');
    AquaToast.show('Intake confirmed & biosecurity ledger updated', 'teal');
  });
  ov?.addEventListener('click', (e) => {
    if (e.target === ov) ov.classList.remove('show');
  });

  // 12. Stepper Molecule
  // 12. Stepper Molecule
  const steps = ['Stocking', 'Grow-out', 'Lab QC', 'Intake'];
  let curStep = 1;
  const stepperEl = document.getElementById('stepper');
  function drawSteps() {
    if (!stepperEl) return;
    stepperEl.innerHTML = '';
    steps.forEach((s, i) => {
      const d = document.createElement('div');
      d.className = `step ${i < curStep ? 'done' : i === curStep ? 'now' : ''}`;
      d.innerHTML = `<i>${
        i < curStep
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
          : i + 1
      }</i><span>${s}</span>`;
      stepperEl.appendChild(d);
      if (i < steps.length - 1) {
        const l = document.createElement('div');
        l.className = 'step-line';
        stepperEl.appendChild(l);
      }
    });
  }
  document.getElementById('stNext')?.addEventListener('click', () => {
    if (curStep < steps.length - 1) {
      curStep++;
      drawSteps();
    }
  });
  document.getElementById('stBack')?.addEventListener('click', () => {
    if (curStep > 0) {
      curStep--;
      drawSteps();
    }
  });
  drawSteps();

  // 13. Enterprise Organism: Inspector Drawer
  const inspectorDrawer = new AquaDrawer('inspectorDrawer');
  document.querySelectorAll('[data-open-drawer]').forEach((btn) => {
    btn.addEventListener('click', () => inspectorDrawer.open());
  });

  // 14. Enterprise Atom: Segmented Controls
  document.querySelectorAll('.segmented-control').forEach((sc) => {
    sc.addEventListener('click', (e) => {
      const btn = e.target.closest('.segment-btn');
      if (!btn) return;
      sc.querySelectorAll('.segment-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 15. Enterprise Molecule: Filter Clear All
  document.querySelectorAll('.filter-clear-all').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bar = btn.closest('.filter-bar');
      if (bar) {
        bar.querySelectorAll('.tag').forEach((t) => {
          t.classList.add('tag-dismissing');
          setTimeout(() => t.remove(), 200);
        });
        AquaToast.show('All query filters reset', 'teal');
      }
    });
  });

  // 15b. Enterprise Molecule: Command Palette (⌘K)
  const triggerCmdK = () => {
    AquaToast.show('⌘K Quick Jump active: Type pond, probe, or batch ID to jump', 'teal');
  };
  document.getElementById('demoCmdK')?.addEventListener('click', triggerCmdK);
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      triggerCmdK();
    }
  });

  // 15c. Enterprise Molecule: Lab QC Dropzone Click
  document.getElementById('demoDropzone')?.addEventListener('click', () => {
    AquaToast.show('Dropzone active: Select or drag CSV / PDF lab screening file', 'teal');
  });

  // 16. Enterprise Molecule: Property Copy Buttons
  document.querySelectorAll('.prop-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.copy || btn.closest('.prop-row')?.querySelector('.prop-val')?.textContent?.trim();
      if (val) {
        navigator.clipboard?.writeText(val);
        AquaToast.show(`Copied to clipboard: ${val}`, 'teal');
      }
    });
  });

  // 17. Re-initialize Lucide Icons for dynamic additions
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Export globally for inline triggers if needed
window.AquaToast = AquaToast;

