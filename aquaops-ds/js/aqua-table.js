/**
 * AquaOps Design System — Data Table & Pagination Module
 * Selectable rows, floating bulk actions bar, column sorting, master-detail rows, density controls
 */

export class AquaTable {
  constructor(tableElement, bulkElement) {
    this.table = tableElement;
    this.bulk = bulkElement;
    this.checkAll = this.table ? this.table.querySelector('.ck-all') || document.getElementById('ckAll') : null;
    this.rowChecks = Array.from(this.table ? this.table.querySelectorAll('.ck') : []);
    this.bulkCount = document.getElementById('bulkN') || (this.bulk ? this.bulk.querySelector('.bulk-count') : null);

    this.init();
    this.initSorting();
    this.initDetailRows();
  }

  init() {
    if (!this.table) return;

    this.rowChecks.forEach((chk) => {
      chk.addEventListener('change', () => this.sync());
    });

    if (this.checkAll) {
      this.checkAll.addEventListener('change', (e) => {
        this.rowChecks.forEach((chk) => {
          chk.checked = e.target.checked;
        });
        this.sync();
      });
    }
  }

  sync() {
    let count = 0;
    this.rowChecks.forEach((chk) => {
      chk.closest('tr').classList.toggle('sel', chk.checked);
      if (chk.checked) count++;
    });

    if (this.bulk) {
      this.bulk.classList.toggle('show', count > 0);
    }
    if (this.bulkCount) {
      this.bulkCount.textContent = `${count} selected`;
    }
  }

  initSorting() {
    if (!this.table) return;
    const headers = this.table.querySelectorAll('th.sortable');
    headers.forEach((th, colIdx) => {
      th.addEventListener('click', () => {
        const isAsc = th.dataset.order === 'asc';
        headers.forEach((h) => {
          h.classList.remove('sorted');
          delete h.dataset.order;
        });

        th.classList.add('sorted');
        th.dataset.order = isAsc ? 'desc' : 'asc';

        const tbody = this.table.querySelector('tbody');
        if (!tbody) return;

        // Sort primary data rows (ignore detail subrows)
        const rows = Array.from(tbody.querySelectorAll('tr:not(.detail-row)'));
        rows.sort((a, b) => {
          const aVal = a.children[colIdx]?.textContent?.trim() || '';
          const bVal = b.children[colIdx]?.textContent?.trim() || '';
          const aNum = parseFloat(aVal.replace(/[^0-9.-]+/g, ''));
          const bNum = parseFloat(bVal.replace(/[^0-9.-]+/g, ''));

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? bNum - aNum : aNum - bNum;
          }
          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        rows.forEach((r) => {
          tbody.appendChild(r);
          const detailRowId = r.dataset.detailId;
          if (detailRowId) {
            const detailRow = document.getElementById(detailRowId);
            if (detailRow) tbody.appendChild(detailRow);
          }
        });

        window.AquaToast?.show(`Sorted by ${th.textContent.trim()} (${isAsc ? 'Descending' : 'Ascending'})`, 'teal');
      });
    });
  }

  initDetailRows() {
    if (!this.table) return;
    this.table.querySelectorAll('.detail-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tr = btn.closest('tr');
        const detailId = tr.dataset.detailId;
        const detailRow = detailId ? document.getElementById(detailId) : tr.nextElementSibling;
        if (detailRow && detailRow.classList.contains('detail-row')) {
          tr.classList.toggle('expanded');
          detailRow.classList.toggle('open');
        }
      });
    });
  }
}

export class AquaPager {
  constructor(pagerElement) {
    this.el = pagerElement;
    this.init();
  }

  init() {
    if (!this.el) return;

    this.el.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const pages = Array.from(this.el.querySelectorAll('button:not(.p-prev):not(.p-next)'));
      let curIdx = pages.findIndex((p) => p.classList.contains('active'));

      if (btn.classList.contains('p-prev')) {
        if (curIdx > 0) {
          pages[curIdx].classList.remove('active');
          pages[curIdx - 1].classList.add('active');
        }
      } else if (btn.classList.contains('p-next')) {
        if (curIdx < pages.length - 1) {
          pages[curIdx].classList.remove('active');
          pages[curIdx + 1].classList.add('active');
        }
      } else {
        pages.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  }
}
