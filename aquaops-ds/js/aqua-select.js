/**
 * AquaOps Design System — Enterprise Rich Select & Combobox Controller
 * Implements accessible, searchable, single-select and multi-select dropdowns.
 * Conforms to ASD-STE100 guidelines and Apple/Airbnb design patterns.
 */

export class AquaSelect {
  constructor(element) {
    this.el = element;
    this.trigger = this.el.querySelector('.rs-trigger');
    this.currentSpan = this.el.querySelector('.rs-current span');
    this.currentIcon = this.el.querySelector('.rs-current > i, .rs-current > svg');
    this.searchInput = this.el.querySelector('.rs-search-input');
    this.options = Array.from(this.el.querySelectorAll('.rs-option'));
    this.menu = this.el.querySelector('.rs-menu');
    this.emptyMsg = this.el.querySelector('.rs-empty-msg');
    this.hiddenInput = this.el.querySelector('input[type="hidden"]');
    
    // Check mode
    this.isMulti = this.el.classList.contains('multi-select');
    this.isCompact = this.el.classList.contains('compact');
    this.isDropUp = this.el.classList.contains('drop-up');
    
    this.focusedIndex = -1;
    this.selectedValues = new Set();

    this.init();
  }

  init() {
    if (!this.trigger) return;

    // Initialize initial values
    this.options.forEach((opt, idx) => {
      if (opt.classList.contains('selected')) {
        const val = opt.dataset.value || opt.textContent.trim();
        this.selectedValues.add(val);
      }
      opt.dataset.index = idx;
    });

    // Make trigger keyboard accessible
    if (!this.trigger.hasAttribute('tabindex')) {
      this.trigger.setAttribute('tabindex', '0');
    }
    this.trigger.setAttribute('role', 'combobox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-haspopup', 'listbox');

    // Toggle dropdown on trigger click
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Keyboard navigation on trigger
    this.trigger.addEventListener('keydown', (e) => {
      this.handleTriggerKey(e);
    });

    // Live search filter
    if (this.searchInput) {
      this.searchInput.addEventListener('click', (e) => e.stopPropagation());
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.focusNextVisibleOption(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.focusNextVisibleOption(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.selectFocusedOption();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
          this.trigger.focus();
        }
      });

      this.searchInput.addEventListener('input', (e) => {
        this.filterOptions(e.target.value);
      });
    }

    // Option interactions
    this.options.forEach((opt) => {
      opt.setAttribute('role', 'option');
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleOptionClick(opt);
      });

      opt.addEventListener('mouseenter', () => {
        this.setFocusedOption(opt);
      });
    });

    // Tag removal clicks (for multi-select)
    this.el.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.rs-tag-remove');
      if (removeBtn) {
        e.stopPropagation();
        const val = removeBtn.dataset.value;
        if (val) {
          this.removeValue(val);
        }
      }
    });

    // Clear all button if present
    const clearBtn = this.el.querySelector('.rs-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearAll();
      });
    }

    // Outside click dismiss
    document.addEventListener('click', (e) => {
      if (!this.el.contains(e.target)) {
        this.close();
      }
    });
  }

  handleTriggerKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this.isOpen()) {
        this.open();
      }
      this.focusNextVisibleOption(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isOpen()) {
        this.open();
      }
      this.focusNextVisibleOption(-1);
    } else if (e.key === 'Escape') {
      if (this.isOpen()) {
        e.preventDefault();
        this.close();
      }
    }
  }

  isOpen() {
    return this.el.classList.contains('open');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    // Close other open selects
    document.querySelectorAll('.rich-select.open').forEach((other) => {
      if (other !== this.el) {
        other.classList.remove('open');
        const trig = other.querySelector('.rs-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      }
    });

    // Detect if we should flip upward automatically (smart placement)
    this.checkPlacement();

    this.el.classList.add('open');
    this.trigger.setAttribute('aria-expanded', 'true');

    // Reset filter
    if (this.searchInput) {
      this.searchInput.value = '';
      this.filterOptions('');
      setTimeout(() => this.searchInput.focus(), 60);
    }

    // Set focus to selected option
    const firstSelected = this.options.find((o) => o.classList.contains('selected'));
    if (firstSelected) {
      this.setFocusedOption(firstSelected);
      this.scrollOptionIntoView(firstSelected);
    } else {
      this.focusNextVisibleOption(1);
    }
  }

  close() {
    this.el.classList.remove('open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.clearFocusedState();
  }

  checkPlacement() {
    if (this.isDropUp) {
      this.el.classList.add('drop-up');
      return;
    }

    const rect = this.trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If space below is under 260px and space above is larger, flip up
    if (spaceBelow < 260 && spaceAbove > spaceBelow) {
      this.el.classList.add('auto-drop-up');
    } else {
      this.el.classList.remove('auto-drop-up');
    }
  }

  filterOptions(query) {
    const term = query.toLowerCase().trim();
    let visibleCount = 0;

    this.options.forEach((opt) => {
      const text = opt.textContent.toLowerCase();
      const isVisible = text.includes(term);
      opt.style.display = isVisible ? 'flex' : 'none';
      if (isVisible) visibleCount++;
    });

    // Show/hide empty state
    if (this.emptyMsg) {
      this.emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    this.clearFocusedState();
    if (visibleCount > 0) {
      this.focusNextVisibleOption(1);
    }
  }

  getVisibleOptions() {
    return this.options.filter((opt) => opt.style.display !== 'none');
  }

  focusNextVisibleOption(direction) {
    const visible = this.getVisibleOptions();
    if (visible.length === 0) return;

    let currentVisibleIndex = visible.findIndex((o) => o.classList.contains('focused'));
    if (currentVisibleIndex === -1) {
      currentVisibleIndex = direction > 0 ? -1 : 0;
    }

    let nextIndex = currentVisibleIndex + direction;
    if (nextIndex >= visible.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = visible.length - 1;

    const targetOpt = visible[nextIndex];
    if (targetOpt) {
      this.setFocusedOption(targetOpt);
      this.scrollOptionIntoView(targetOpt);
    }
  }

  setFocusedOption(opt) {
    this.clearFocusedState();
    opt.classList.add('focused');
  }

  clearFocusedState() {
    this.options.forEach((o) => o.classList.remove('focused'));
  }

  selectFocusedOption() {
    const focused = this.options.find((o) => o.classList.contains('focused'));
    if (focused) {
      this.handleOptionClick(focused);
    }
  }

  scrollOptionIntoView(opt) {
    const list = this.el.querySelector('.rs-list');
    if (!list || !opt) return;

    const listRect = list.getBoundingClientRect();
    const optRect = opt.getBoundingClientRect();

    if (optRect.bottom > listRect.bottom) {
      list.scrollTop += optRect.bottom - listRect.bottom;
    } else if (optRect.top < listRect.top) {
      list.scrollTop -= listRect.top - optRect.top;
    }
  }

  handleOptionClick(opt) {
    const val = opt.dataset.value || opt.textContent.trim();

    if (this.isMulti) {
      // Toggle value in set
      if (this.selectedValues.has(val)) {
        this.selectedValues.delete(val);
        opt.classList.remove('selected');
      } else {
        this.selectedValues.add(val);
        opt.classList.add('selected');
      }
      this.updateMultiDisplay();
      this.dispatchChangeEvent();
    } else {
      // Single select
      this.options.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      this.selectedValues.clear();
      this.selectedValues.add(val);

      this.updateSingleDisplay(opt);
      this.close();
      this.trigger.focus();
      this.dispatchChangeEvent();
    }
  }

  updateSingleDisplay(opt) {
    const titleEl = opt.querySelector('.rs-opt-title');
    const label = titleEl ? titleEl.textContent.trim() : (opt.dataset.value || opt.textContent.trim());

    if (this.currentSpan) {
      this.currentSpan.textContent = label;
    }

    // Sync icon if present
    const optIcon = opt.querySelector('i[data-lucide], svg');
    if (optIcon && this.currentIcon) {
      const iconName = optIcon.getAttribute('data-lucide');
      if (iconName) {
        this.currentIcon.setAttribute('data-lucide', iconName);
        if (window.lucide) window.lucide.createIcons();
      }
    }

    if (this.hiddenInput) {
      this.hiddenInput.value = opt.dataset.value || label;
    }
  }

  updateMultiDisplay() {
    const tagsWrap = this.el.querySelector('.rs-tags-container');
    const countSpan = this.el.querySelector('.rs-count-badge');

    if (tagsWrap) {
      tagsWrap.innerHTML = '';
      if (this.selectedValues.size === 0) {
        const placeholder = this.el.dataset.placeholder || 'Select options...';
        tagsWrap.innerHTML = `<span class="rs-placeholder">${placeholder}</span>`;
      } else {
        this.selectedValues.forEach((val) => {
          const tag = document.createElement('span');
          tag.className = 'rs-pill-tag';
          tag.innerHTML = `<span>${val}</span><button type="button" class="rs-tag-remove" data-value="${val}" aria-label="Remove ${val}">×</button>`;
          tagsWrap.appendChild(tag);
        });
      }
    }

    if (countSpan) {
      countSpan.textContent = `${this.selectedValues.size} selected`;
      countSpan.style.display = this.selectedValues.size > 0 ? 'inline-flex' : 'none';
    }

    if (this.hiddenInput) {
      this.hiddenInput.value = Array.from(this.selectedValues).join(',');
    }
  }

  removeValue(val) {
    this.selectedValues.delete(val);
    this.options.forEach((opt) => {
      if ((opt.dataset.value || opt.textContent.trim()) === val) {
        opt.classList.remove('selected');
      }
    });
    this.updateMultiDisplay();
    this.dispatchChangeEvent();
  }

  clearAll() {
    this.selectedValues.clear();
    this.options.forEach((opt) => opt.classList.remove('selected'));
    if (this.isMulti) {
      this.updateMultiDisplay();
    } else {
      if (this.currentSpan) {
        this.currentSpan.textContent = this.el.dataset.placeholder || 'Select option...';
      }
    }
    this.dispatchChangeEvent();
  }

  dispatchChangeEvent() {
    const valuesArray = Array.from(this.selectedValues);
    const detail = {
      value: valuesArray.length > 0 ? valuesArray[0] : '',
      values: valuesArray,
    };

    this.el.dispatchEvent(new CustomEvent('aqua-change', { detail, bubbles: true }));

    // Also trigger native change event on hidden input if present
    if (this.hiddenInput) {
      this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
