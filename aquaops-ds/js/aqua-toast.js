/**
 * AquaOps Design System — Toast Notification Engine
 * High-performance notification toasts with scoped Lucide icon rendering
 */

export class AquaToast {
  static show(message, variant = '') {
    const container = document.getElementById('toasts') || AquaToast.createContainer();
    const toastEl = document.createElement('div');
    toastEl.className = `toast ${variant}`;
    toastEl.innerHTML = `<i data-lucide="check"></i><span>${message}</span>`;
    container.appendChild(toastEl);

    if (window.lucide) {
      window.lucide.createIcons({ root: toastEl });
    }

    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      toastEl.style.transition = 'all 0.25s var(--ease)';
      setTimeout(() => toastEl.remove(), 260);
    }, 2800);
  }

  static createContainer() {
    const c = document.createElement('div');
    c.id = 'toasts';
    document.body.appendChild(c);
    return c;
  }
}
