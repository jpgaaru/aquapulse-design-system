/**
 * AquaOps Design System — Slide-Over Inspector Drawer Component
 * Handles opening, closing, keyboard escape dismissal, and outside click
 */

export class AquaDrawer {
  constructor(backdropId = 'inspectorDrawer') {
    this.backdrop = document.getElementById(backdropId);
    this.closeBtn = this.backdrop?.querySelector('.drawer-close');
    this.init();
  }

  init() {
    if (!this.backdrop) return;

    this.closeBtn?.addEventListener('click', () => this.close());
    
    // Outside backdrop click
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Keyboard ESC key dismissal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdrop.classList.contains('open')) {
        this.close();
      }
    });
  }

  open() {
    if (!this.backdrop) return;
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.backdrop) return;
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}
