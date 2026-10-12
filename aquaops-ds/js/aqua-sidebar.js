/**
 * AquaOps Design System — Floating Sidebar Component
 * Features: Expand/Collapse toggle (270px -> 76px), accordion submenus, clean text highlighting
 */

export class AquaSidebar {
  constructor(element) {
    this.el = element;
    this.toggleBtn = document.getElementById('demoSidebarToggle');
    this.groupButtons = this.el.querySelectorAll('.f-sb-grp-btn');
    this.subLinks = this.el.querySelectorAll('.f-sb-sub-link');

    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleCollapse());
    }

    // Submenu Accordion toggles
    this.groupButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.el.classList.contains('collapsed')) {
          this.el.classList.remove('collapsed');
        }
        const grp = btn.closest('.f-sb-grp');
        grp.classList.toggle('open');
      });
    });

    // Submenu links active text highlight
    this.subLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.subLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        this.el.dispatchEvent(
          new CustomEvent('aqua-navigate', {
            detail: { label: link.textContent.trim() },
            bubbles: true,
          })
        );
      });
    });
  }

  toggleCollapse() {
    const isCollapsed = this.el.classList.toggle('collapsed');
    this.el.dispatchEvent(
      new CustomEvent('aqua-sidebar-toggle', {
        detail: { collapsed: isCollapsed },
        bubbles: true,
      })
    );
  }
}
