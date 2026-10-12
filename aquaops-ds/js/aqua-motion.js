/**
 * AquaOps Design System — Kinetic Motion Controller (v5 Enterprise)
 * Drives physics-based segment gliders, tag dismissal animations,
 * drag-and-drop dropzone micro-interactions, and copy button morphing
 */

export class AquaMotion {
  static init() {
    this.initSegmentGliders();
    this.initTagDismissals();
    this.initDropzones();
    this.initCopyMorph();
  }

  /**
   * 1. Physical Segment Glider (Sliding Pill Physics)
   */
  static initSegmentGliders() {
    document.querySelectorAll('.segmented-control').forEach((sc) => {
      // Ensure a physical glider element exists
      let glider = sc.querySelector('.segment-glider');
      if (!glider) {
        glider = document.createElement('div');
        glider.className = 'segment-glider';
        sc.prepend(glider);
      }

      const updateGlider = (activeBtn) => {
        if (!activeBtn) return;
        const scRect = sc.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        const left = btnRect.left - scRect.left;
        const width = btnRect.width;

        glider.style.transform = `translateX(${left - 3}px)`;
        glider.style.width = `${width}px`;
      };

      // Set initial glider position
      const initialActive = sc.querySelector('.segment-btn.active') || sc.querySelector('.segment-btn');
      if (initialActive) {
        initialActive.classList.add('active');
        // Let layout settle
        setTimeout(() => updateGlider(initialActive), 40);
      }

      sc.addEventListener('click', (e) => {
        const btn = e.target.closest('.segment-btn');
        if (!btn) return;
        sc.querySelectorAll('.segment-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        updateGlider(btn);
      });

      // Recalculate on window resize
      window.addEventListener('resize', () => {
        const currentActive = sc.querySelector('.segment-btn.active');
        if (currentActive) updateGlider(currentActive);
      });
    });
  }

  /**
   * 2. Physical Tag Dismissal (Shrink & Evaporate)
   */
  static initTagDismissals() {
    document.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.tag-remove');
      if (!removeBtn) return;
      const tag = removeBtn.closest('.tag');
      if (!tag) return;

      tag.classList.add('tag-dismissing');
      setTimeout(() => tag.remove(), 200);
    });
  }

  /**
   * 3. Drag & Drop Micro-Physics for Dropzones
   */
  static initDropzones() {
    document.querySelectorAll('.dropzone').forEach((dz) => {
      ['dragenter', 'dragover'].forEach((evt) => {
        dz.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dz.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach((evt) => {
        dz.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dz.classList.remove('dragover');
        });
      });

      dz.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          const fileName = files[0].name;
          window.AquaToast?.show(`Uploaded: ${fileName} (Ready for analysis)`, 'teal');
        }
      });
    });
  }

  /**
   * 4. Morphing Copy Button Interaction
   */
  static initCopyMorph() {
    document.querySelectorAll('.prop-copy').forEach((btn) => {
      btn.addEventListener('click', () => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00a4b7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
        btn.style.transform = 'scale(1.15)';
        btn.style.borderColor = 'var(--teal-400)';

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.transform = '';
          btn.style.borderColor = '';
        }, 1200);
      });
    });
  }
}
