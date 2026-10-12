/**
 * AquaOps Design System — Data Visualizations & Telemetry Engine
 * Complete interactive charts with cursor tooltips, touch scrubbing, spring bloom, and telemetry inspection
 */

export class AquaCharts {
  /**
   * Vertical Bars with dynamic spring hover tooltip and touch inspection
   */
  static renderBars(containerId, data, threshold = 85) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';

    const hudSub = document.getElementById('barsHudSub');

    data.forEach((d, i) => {
      const c = document.createElement('div');
      c.className = 'c';
      c.dataset.day = d.l;
      c.dataset.val = d.v;

      const b = document.createElement('div');
      b.className = 'b' + (d.v >= threshold ? ' hi' : '');
      b.style.height = '0%';
      b.style.position = 'relative';
      
      // Floating Tooltip Bubble attached directly to bar top
      const bubble = document.createElement('div');
      bubble.className = 'chart-tooltip-bubble';
      bubble.textContent = `${d.l}: ${d.v} kg`;

      const x = document.createElement('div');
      x.className = 'x';
      x.textContent = d.l;

      b.appendChild(bubble);
      c.append(b, x);
      
      const activate = () => {
        el.querySelectorAll('.c').forEach(item => item.classList.remove('touch-active'));
        c.classList.add('touch-active');
        if (hudSub) {
          hudSub.innerHTML = `Daily Feed: <b>${d.l} · ${d.v} kg</b> ${d.v >= threshold ? '<span style="color:var(--teal-700)">(Optimal Target Met)</span>' : '<span style="color:var(--muted)">(Under Benchmark)</span>'}`;
        }
      };

      const deactivate = () => {
        c.classList.remove('touch-active');
        if (hudSub) {
          hudSub.textContent = 'Daily feed consumption (kg) · Hover bars for telemetry';
        }
      };

      c.addEventListener('mouseenter', activate);
      c.addEventListener('mouseleave', deactivate);

      // Mobile Touch Handling
      c.addEventListener('touchstart', (e) => {
        activate();
      }, { passive: true });

      c.addEventListener('click', () => {
        window.AquaToast?.show(`${d.l} Biomass Harvest: ${d.v} kg logged`, 'teal');
      });

      el.appendChild(c);
      setTimeout(() => (b.style.height = `${d.v}%`), 60 * i);
    });
  }

  /**
   * SVG Line & Area Chart with touch scrubbing, crosshairs, full-column hitzones, and telemetry tooltips
   */
  static renderLine(pathId, areaId, dotsId, values, W = 400, H = 190, P = 20) {
    const cPath = document.getElementById(pathId);
    const cArea = document.getElementById(areaId);
    const cDots = document.getElementById(dotsId);
    if (!cPath || !cArea || !cDots) return;

    const svg = cPath.closest('svg');
    const hudSub = document.getElementById('lineHudSub');
    const scrubber = document.getElementById('cLineScrubber');
    const hitZones = document.getElementById('cHitZones');

    const mx = Math.max(...values);
    const mn = Math.min(...values);
    const pts = values.map((v, i) => ({
      x: P + (i / (values.length - 1)) * (W - P * 2),
      y: H - P - ((v - mn) / (mx - mn)) * (H - P * 2),
      val: (v / 10).toFixed(1),
      rawVal: v,
      time: `${String(i * 3).padStart(2, '0')}:00`
    }));

    cPath.setAttribute('points', pts.map((p) => `${p.x},${p.y}`).join(' '));
    cArea.setAttribute('points', `${P},${H} ${pts.map((p) => `${p.x},${p.y}`).join(' ')} ${W - P},${H}`);

    // Tooltip overlay container (contained within canvas wrapper)
    const canvasWrap = svg.parentElement;
    let tipBubble = canvasWrap.querySelector('.chart-point-tooltip');
    if (!tipBubble) {
      tipBubble = document.createElement('div');
      tipBubble.className = 'chart-point-tooltip';
      canvasWrap.appendChild(tipBubble);
    }

    cDots.innerHTML = '';
    if (hitZones) hitZones.innerHTML = '';

    const colWidth = (W - P * 2) / (pts.length - 1);

    pts.forEach((p, idx) => {
      // Data Point Circle
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('class', 'p');
      c.setAttribute('cx', p.x);
      c.setAttribute('cy', p.y);
      c.setAttribute('r', 4);
      c.setAttribute('data-idx', idx);
      cDots.appendChild(c);

      // Full-Height Column Hit Zone
      if (hitZones) {
        const hit = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hit.setAttribute('x', Math.max(0, p.x - colWidth / 2));
        hit.setAttribute('y', 0);
        hit.setAttribute('width', colWidth);
        hit.setAttribute('height', H);
        hit.setAttribute('fill', 'transparent');
        hit.setAttribute('style', 'cursor: pointer;');
        hit.setAttribute('data-idx', idx);

        hit.addEventListener('mouseenter', () => activateIndex(idx));
        hit.addEventListener('mouseleave', deactivate);
        c.addEventListener('mouseenter', () => activateIndex(idx));
        c.addEventListener('mouseleave', deactivate);

        hit.addEventListener('click', () => {
          window.AquaToast?.show(`Telemetry ${p.time}: ${p.val} mg/L Dissolved Oxygen`, 'teal');
        });
        c.addEventListener('click', () => {
          window.AquaToast?.show(`Telemetry ${p.time}: ${p.val} mg/L Dissolved Oxygen`, 'teal');
        });

        hitZones.appendChild(hit);
      }
    });

    const activateIndex = (idx) => {
      const p = pts[idx];
      if (!p) return;

      tipBubble.innerHTML = `<b>${p.time}</b> · <span style="color:var(--teal-300)">${p.val} mg/L DO</span>`;
      tipBubble.style.opacity = '1';
      tipBubble.style.left = `${(p.x / W) * 100}%`;
      tipBubble.style.top = `${(p.y / H) * 100}%`;

      cDots.querySelectorAll('.p').forEach((dot, i) => {
        if (i == idx) {
          dot.setAttribute('r', 6.5);
          dot.setAttribute('stroke-width', 3.5);
        } else {
          dot.setAttribute('r', 4);
          dot.setAttribute('stroke-width', 2.5);
        }
      });

      if (scrubber) {
        scrubber.setAttribute('x1', p.x);
        scrubber.setAttribute('x2', p.x);
        scrubber.style.opacity = '1';
      }

      if (hudSub) {
        hudSub.innerHTML = `24h Dissolved Oxygen · Shift <b>${p.time}</b>: <span style="color:var(--teal-700);font-weight:700">${p.val} mg/L</span> (${p.val >= 6.5 ? 'Optimal Saturation' : 'Safe Benchmark'})`;
      }
    };

    const deactivate = () => {
      tipBubble.style.opacity = '0';
      cDots.querySelectorAll('.p').forEach((dot) => {
        dot.setAttribute('r', 4);
        dot.setAttribute('stroke-width', 2.5);
      });
      if (scrubber) scrubber.style.opacity = '0';
      if (hudSub) hudSub.textContent = '24h Dissolved Oxygen curve · Hover data points';
    };

    // Mobile Touch Scrubbing Event
    const handleTouch = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = svg.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const relX = (touchX / rect.width) * W;

      let closestIdx = 0;
      let minDist = Infinity;
      pts.forEach((p, idx) => {
        const dist = Math.abs(p.x - relX);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      activateIndex(closestIdx);
    };

    svg.addEventListener('touchstart', handleTouch, { passive: true });
    svg.addEventListener('touchmove', handleTouch, { passive: true });
    svg.addEventListener('touchend', () => {
      setTimeout(deactivate, 800);
    }, { passive: true });
  }

  /**
   * Horizontal Breakdown with world-class row cards, stats, and gradient tracks
   */
  static renderHorizontal(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';

    const list = document.createElement('div');
    list.className = 'hbar-list';

    data.forEach((d, i) => {
      const kgVal = d.kg || Math.round(d.v * 365);
      const row = document.createElement('div');
      row.className = 'hbar-row';
      row.title = `${d.l}: ${d.v}% capacity (${kgVal.toLocaleString()} kg)`;
      row.innerHTML = `
        <div class="hbar-top">
          <span class="hbar-name">${d.l}</span>
          <div class="hbar-stats">
            <span>${kgVal.toLocaleString()} kg</span>
            <b>${d.v}%</b>
          </div>
        </div>
        <div class="hbar-track">
          <div class="hbar-fill" style="width:0%"></div>
        </div>
      `;

      row.addEventListener('click', () => {
        window.AquaToast?.show(`${d.l} Biomass: ${kgVal.toLocaleString()} kg (${d.v}% target)`, 'teal');
      });

      list.appendChild(row);
      setTimeout(() => {
        const fill = row.querySelector('.hbar-fill');
        if (fill) fill.style.width = `${d.v}%`;
      }, 60 * i);
    });

    el.appendChild(list);
  }

  /**
   * Interactive Coldstore Donut Chart with HUD Center and Legend Synchrony
   */
  static renderDonut(svgId, centerValueId = 'cDonutVal', centerLabelId = 'cDonutSub') {
    const svgEl = document.getElementById(svgId);
    if (!svgEl) return;

    const bgCircle = svgEl.querySelector('circle:not([data-v])');
    const R = bgCircle ? parseFloat(bgCircle.getAttribute('r')) : 46;
    const C = 2 * Math.PI * R;
    let o = 0;

    // Center display resolution (supports both HTML hud and SVG text)
    const centerVal = document.getElementById(centerValueId) || svgEl.querySelector('text:first-of-type');
    const centerSub = document.getElementById(centerLabelId) || svgEl.querySelector('text:last-of-type');
    const defaultVal = centerVal ? centerVal.textContent : '3,420';
    const defaultSub = centerSub ? centerSub.textContent : 'TOTAL PALLETS';

    const segments = svgEl.querySelectorAll('circle[data-v]');
    const container = svgEl.closest('.viz-card, .donut-card-inner, .donutrow, .panel') || document;
    const legendItems = container.querySelectorAll('.donut-legend-item, .lg');

    segments.forEach((c, idx) => {
      const v = +c.dataset.v;
      const label = c.dataset.label || 'Occupied';
      const l = (v / 100) * C;
      c.setAttribute('r', R);
      c.setAttribute('stroke-dasharray', `${l} ${C - l}`);
      c.setAttribute('stroke-dashoffset', -o);
      o += l;

      const highlight = () => {
        if (centerVal) centerVal.textContent = `${v}%`;
        if (centerSub) centerSub.textContent = label.toUpperCase();
        legendItems.forEach((item, i) => {
          item.classList.toggle('active', i === idx);
        });
      };

      const reset = () => {
        if (centerVal) centerVal.textContent = defaultVal;
        if (centerSub) centerSub.textContent = defaultSub;
        legendItems.forEach((item) => {
          item.classList.remove('active');
        });
      };

      c.addEventListener('mouseenter', highlight);
      c.addEventListener('mouseleave', reset);
      c.addEventListener('touchstart', highlight, { passive: true });

      c.addEventListener('click', () => {
        window.AquaToast?.show(`${label}: ${v}% Coldstore allocation (${Math.round(3420 * (v / 100))} pallets)`, 'teal');
      });
    });

    legendItems.forEach((lg, i) => {
      lg.addEventListener('mouseenter', () => {
        if (segments[i]) {
          segments[i].dispatchEvent(new Event('mouseenter'));
          segments[i].style.strokeWidth = '18';
        }
      });
      lg.addEventListener('mouseleave', () => {
        if (segments[i]) {
          segments[i].dispatchEvent(new Event('mouseleave'));
          segments[i].style.strokeWidth = '';
        }
      });
      lg.addEventListener('click', () => {
        if (segments[i]) segments[i].dispatchEvent(new Event('click'));
      });
    });
  }

  /**
   * Multi-Parameter Radial Water Quality Gauge (Seamless Geometry & Thresholds)
   */
  static renderGauge(containerId, score = 94.2) {
    const el = document.getElementById(containerId);
    if (!el) return;
    
    // Half-circle arc geometry: center (110, 108), radius 76
    // Arc path from (34, 108) to (186, 108)
    const R = 76;
    const arcLength = Math.PI * R; // ~238.76
    const fillLength = (score / 100) * arcLength;

    // Knob tip coordinates: angle for score
    const theta = Math.PI * (1 - score / 100);
    const knobX = (110 + R * Math.cos(theta)).toFixed(1);
    const knobY = (108 - R * Math.sin(theta)).toFixed(1);

    el.innerHTML = `
      <div class="gauge-card-inner">
        <!-- Dedicated Dial Container (Insulates Center Score from Footer Elements) -->
        <div class="gauge-dial-wrap">
          <svg class="gauge-svg-frame" viewBox="0 0 220 132">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#4fcfe0" />
                <stop offset="50%" stop-color="#00a4b7" />
                <stop offset="100%" stop-color="#006c7a" />
              </linearGradient>
            </defs>
            
            <!-- Soft Tinted Background Track -->
            <path d="M 34 108 A 76 76 0 0 1 186 108" fill="none" stroke="rgba(0, 164, 183, 0.12)" stroke-width="10" stroke-linecap="round" />
            
            <!-- Animated Gradient Fill Track -->
            <path id="gaugePath" d="M 34 108 A 76 76 0 0 1 186 108" fill="none" stroke="url(#gaugeGrad)" stroke-width="12" stroke-linecap="round"
                  stroke-dasharray="${arcLength}" stroke-dashoffset="${arcLength}" />
            
            <!-- Precision Dial Indicator Knob -->
            <circle id="gaugeKnob" cx="${knobX}" cy="${knobY}" r="5.5" fill="#ffffff" stroke="#006c7a" stroke-width="2.5" style="opacity:0;transition:opacity 0.4s" />
            
            <!-- Benchmark Ticks with Generous Margin -->
            <text x="34" y="124" text-anchor="middle" font-size="9" font-weight="700" fill="#8e8e93" font-family="'Noto Sans', sans-serif">0</text>
            <text x="110" y="18" text-anchor="middle" font-size="9" font-weight="700" fill="#006c7a" font-family="'Noto Sans', sans-serif">OPTIMAL ZONE (&gt;85)</text>
            <text x="186" y="124" text-anchor="middle" font-size="9" font-weight="700" fill="#8e8e93" font-family="'Noto Sans', sans-serif">100</text>
          </svg>

          <div class="gauge-center-badge">
            <span class="gauge-score">${score}</span>
            <span class="gauge-title-label">WATER HEALTH INDEX</span>
          </div>
        </div>

        <!-- Flow Badge Row (Clean Vertical Flow, Zero Overlap) -->
        <div class="gauge-badge-row">
          <span class="badge badge-teal" style="font-size:11px;padding:3px 10px">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px"><path d="M20 6 9 17l-5-5"/></svg>Optimal Grade · Top 5% Biosecurity
          </span>
        </div>

        <!-- Flow Footer Meta Row (Clean Top Border, No Masking) -->
        <div class="gauge-footer-meta">
          <span>DO: <b>6.84 mg/L</b></span>
          <span>ORP: <b>+225 mV</b></span>
          <span>pH: <b>7.82 Opt</b></span>
        </div>
      </div>
    `;

    const gaugePath = el.querySelector('#gaugePath');
    const gaugeKnob = el.querySelector('#gaugeKnob');
    const wrapper = el.querySelector('.gauge-card-inner');

    wrapper.addEventListener('click', () => {
      window.AquaToast?.show(`Water Quality Score: ${score}/100 · All 8 sensors within safe biological parameters`, 'teal');
    });

    setTimeout(() => {
      if (gaugePath) {
        gaugePath.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)';
        gaugePath.style.strokeDashoffset = `${arcLength - fillLength}`;
      }
      if (gaugeKnob) {
        gaugeKnob.style.opacity = '1';
      }
    }, 120);
  }

  /**
   * 24-Hour Thermal & DO Heatmap Matrix with Responsive Inertia Scroll
   */
  static renderHeatmap(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const ponds = ['Pond 101', 'Pond 102', 'Pond 103', 'Pond 104', 'Pond 105', 'Pond 106'];
    const times = ['04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    
    // Sample readings: [temp °C, DO mg/L]
    const matrix = [
      [[27.8, 6.8], [28.2, 6.6], [29.5, 6.2], [30.1, 5.9], [28.9, 6.4], [28.1, 6.7]],
      [[27.5, 7.1], [28.0, 6.8], [29.2, 6.5], [29.8, 6.3], [28.7, 6.7], [27.9, 7.0]],
      [[28.1, 4.2], [28.5, 4.4], [30.4, 3.8], [31.2, 3.5], [29.8, 4.1], [28.6, 4.3]], // Pond 103 warning
      [[27.9, 6.7], [28.3, 6.5], [29.4, 6.1], [30.0, 5.8], [28.8, 6.3], [28.0, 6.6]],
      [[27.6, 6.9], [28.1, 6.7], [29.1, 6.4], [29.7, 6.2], [28.6, 6.5], [27.8, 6.8]],
      [[27.4, 7.0], [27.9, 6.9], [28.9, 6.6], [29.5, 6.4], [28.4, 6.7], [27.7, 6.9]],
    ];

    let html = `
      <div class="heatmap-table-wrap">
        <div class="heatmap-table">
          <div class="heatmap-row header-row">
            <div class="heatmap-label">POND</div>
            ${times.map(t => `<div class="heatmap-header">${t}</div>`).join('')}
          </div>
    `;

    ponds.forEach((pName, rIdx) => {
      html += `<div class="heatmap-row"><div class="heatmap-label">${pName}</div>`;
      times.forEach((tName, cIdx) => {
        const [temp, doVal] = matrix[rIdx][cIdx];
        let colorClass = 'cell-opt';
        let status = 'Optimal';
        if (doVal < 4.0) {
          colorClass = 'cell-crit';
          status = 'Critical Low DO';
        } else if (temp > 30.0) {
          colorClass = 'cell-warn';
          status = 'Thermal Stress';
        }
        
        html += `
          <div class="heatmap-cell ${colorClass}" data-pond="${pName}" data-time="${tName}" data-temp="${temp}" data-do="${doVal}" data-status="${status}">
            <span>${temp}°</span>
            <div class="chart-tooltip-bubble cell-tip">${pName} · ${tName}<br/>Temp: ${temp}°C · DO: ${doVal} mg/L (${status})</div>
          </div>
        `;
      });
      html += `</div>`;
    });

    html += `</div></div>`;
    el.innerHTML = html;

    // Attach click & touch events
    el.querySelectorAll('.heatmap-cell').forEach(cell => {
      const showCellToast = () => {
        const { pond, time, temp, do: doVal, status } = cell.dataset;
        window.AquaToast?.show(`${pond} at ${time}: ${temp}°C, DO ${doVal} mg/L — ${status}`, status === 'Optimal' ? 'teal' : 'dark');
      };
      cell.addEventListener('click', showCellToast);
      cell.addEventListener('touchstart', showCellToast, { passive: true });
    });
  }

  /**
   * Dual-Series Real-Time Aerator Telemetry with Touch Scrubbing & Live Card HUD
   */
  static renderDualLine(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const data = [
      { time: '00:00', rpm: 1200, kw: 6.2 },
      { time: '04:00', rpm: 1450, kw: 8.1 },
      { time: '08:00', rpm: 1300, kw: 7.0 },
      { time: '12:00', rpm: 1100, kw: 5.5 },
      { time: '16:00', rpm: 1550, kw: 8.9 },
      { time: '20:00', rpm: 1480, kw: 8.4 },
      { time: '24:00', rpm: 1350, kw: 7.4 },
    ];

    const W = 420;
    const H = 160;
    const P = 24;

    const maxRpm = 1800;
    const minRpm = 1000;
    const maxKw = 10.0;
    const minKw = 4.0;

    const colWidth = (W - P * 2) / (data.length - 1);

    const rpmPts = data.map((d, i) => ({
      x: P + (i / (data.length - 1)) * (W - P * 2),
      y: H - P - ((d.rpm - minRpm) / (maxRpm - minRpm)) * (H - P * 2),
      ...d
    }));

    const kwPts = data.map((d, i) => ({
      x: P + (i / (data.length - 1)) * (W - P * 2),
      y: H - P - ((d.kw - minKw) / (maxKw - minKw)) * (H - P * 2),
      ...d
    }));

    el.innerHTML = `
      <div class="dual-card-hud" id="dualHud">
        <span class="hud-time">Hover or drag to scrub</span>
        <span class="hud-rpm">Aerator: 1,550 RPM</span>
        <span class="hud-kw">Power: 8.9 kW</span>
      </div>

      <div class="dual-svg-wrapper">
        <div class="dual-chart-canvas" style="position:relative;width:100%;height:${H}px">
          <svg class="dual-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <!-- Subtle Horizontal Grid Lines & Y Markers -->
            <line class="g" x1="${P}" y1="${P}" x2="${W - P}" y2="${P}" stroke="#f0f0f4" stroke-dasharray="3 4"/>
            <text x="${P + 2}" y="${P - 6}" font-size="8.5" font-weight="600" fill="#a1a1a6" font-family="'Noto Sans'">1,800 RPM · 10.0 kW</text>

            <line class="g" x1="${P}" y1="${H / 2}" x2="${W - P}" y2="${H / 2}" stroke="#f0f0f4" stroke-dasharray="3 4"/>
            <text x="${P + 2}" y="${H / 2 - 6}" font-size="8.5" font-weight="600" fill="#a1a1a6" font-family="'Noto Sans'">1,400 RPM · 7.0 kW</text>

            <line class="g" x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#f0f0f4" stroke-dasharray="3 4"/>
            <text x="${P + 2}" y="${H - P - 6}" font-size="8.5" font-weight="600" fill="#a1a1a6" font-family="'Noto Sans'">1,000 RPM · 4.0 kW</text>

            <!-- RPM Curve (Teal 600) -->
            <polyline class="l" points="${rpmPts.map(p => `${p.x},${p.y}`).join(' ')}" style="fill:none;stroke:var(--teal-600);stroke-width:2.5;stroke-linecap:round" />
            
            <!-- KW Curve (Dark Ink Dashed) -->
            <polyline class="l" points="${kwPts.map(p => `${p.x},${p.y}`).join(' ')}" style="fill:none;stroke:var(--black);stroke-width:2;stroke-dasharray:4 4;stroke-linecap:round" />

            <!-- Interactive Data Points -->
            ${rpmPts.map((p, i) => `
              <circle class="p rpm-pt" cx="${p.x}" cy="${p.y}" r="3.5" data-idx="${i}" />
              <circle class="p kw-pt" cx="${kwPts[i].x}" cy="${kwPts[i].y}" r="3.5" data-idx="${i}" />
            `).join('')}

            <!-- Crosshair Vertical Scrubber Line -->
            <line id="dualScrubberLine" x1="0" y1="${P}" x2="0" y2="${H - P}" stroke="var(--teal-600)" stroke-width="1.5" stroke-dasharray="3 3" style="opacity:0;transition:opacity 0.15s" />

            <!-- Full-Height Column Hit Zones -->
            ${rpmPts.map((p, i) => `
              <rect class="dual-hitzone" x="${Math.max(0, p.x - colWidth / 2)}" y="0" width="${colWidth}" height="${H}" fill="transparent" style="cursor:pointer" data-idx="${i}" />
            `).join('')}
          </svg>

          <!-- Floating Non-Colliding Tooltip Toast -->
          <div id="dualToast" class="chart-floating-toast"></div>
        </div>

        <!-- Clean X-Axis Time Row -->
        <div class="dual-x-labels">
          ${data.map(d => `<span>${d.time}</span>`).join('')}
        </div>
      </div>

      <div class="dual-chart-legend" style="display:flex;gap:18px;justify-content:flex-end;margin-top:12px;font-size:11px;font-weight:600;flex-wrap:wrap">
        <span style="display:flex;align-items:center;gap:6px"><i style="width:12px;height:3px;background:var(--teal-600);border-radius:2px;display:inline-block"></i>Paddlewheel Speed (RPM)</span>
        <span style="display:flex;align-items:center;gap:6px"><i style="width:12px;height:2px;background:var(--black);border-top:1px dashed #000;display:inline-block"></i>Motor Power (kW)</span>
      </div>
    `;

    const hud = el.querySelector('#dualHud');
    const toast = el.querySelector('#dualToast');
    const scrubber = el.querySelector('#dualScrubberLine');
    const svg = el.querySelector('.dual-svg');

    const activateIndex = (idx) => {
      const pt = rpmPts[idx];
      const kwPt = kwPts[idx];
      if (!pt || !kwPt) return;

      // 1. Live HUD update in card header
      if (hud) {
        hud.querySelector('.hud-time').textContent = `Shift: ${pt.time}`;
        hud.querySelector('.hud-rpm').textContent = `${pt.rpm.toLocaleString()} RPM`;
        hud.querySelector('.hud-kw').textContent = `${kwPt.kw} kW`;
      }

      // 2. Vertical crosshair positioning
      if (scrubber) {
        scrubber.setAttribute('x1', pt.x);
        scrubber.setAttribute('x2', pt.x);
        scrubber.style.opacity = '1';
      }

      // 3. Floating tooltip pill positioned cleanly above
      if (toast) {
        toast.innerHTML = `<b>${pt.time}</b> · <span style="color:var(--teal-300)">${pt.rpm} RPM</span> · ${kwPt.kw} kW`;
        toast.style.opacity = '1';
        toast.style.left = `${(pt.x / W) * 100}%`;
        toast.style.top = `${(Math.min(pt.y, kwPt.y) / H) * 100 - 10}%`;
      }
    };

    const deactivate = () => {
      if (toast) toast.style.opacity = '0';
      if (scrubber) scrubber.style.opacity = '0';
      if (hud) {
        hud.querySelector('.hud-time').textContent = 'Hover or drag to scrub';
        hud.querySelector('.hud-rpm').textContent = 'Aerator: 1,550 RPM';
        hud.querySelector('.hud-kw').textContent = 'Power: 8.9 kW';
      }
    };

    svg.querySelectorAll('.dual-hitzone, .p').forEach(target => {
      target.addEventListener('mouseenter', () => {
        activateIndex(target.dataset.idx);
      });
      target.addEventListener('mouseleave', deactivate);
      target.addEventListener('click', () => {
        const idx = target.dataset.idx;
        window.AquaToast?.show(`Telemetry ${rpmPts[idx].time}: ${rpmPts[idx].rpm} RPM · Energy Draw ${kwPts[idx].kw} kW`, 'teal');
      });
    });

    // Mobile Touch Scrubbing Event
    const handleDualTouch = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = svg.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const relX = (touchX / rect.width) * W;

      let closestIdx = 0;
      let minDist = Infinity;
      data.forEach((d, i) => {
        const xPos = P + (i / (data.length - 1)) * (W - P * 2);
        const dist = Math.abs(xPos - relX);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      });
      activateIndex(closestIdx);
    };

    svg.addEventListener('touchstart', handleDualTouch, { passive: true });
    svg.addEventListener('touchmove', handleDualTouch, { passive: true });
    svg.addEventListener('touchend', () => {
      setTimeout(deactivate, 800);
    }, { passive: true });
  }
}
