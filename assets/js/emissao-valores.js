/* =========================================================
   FinPay — script.js
   1) Highlights the current page in the bottom navigation
   2) "Copiar código Pix" button on the payments page
   3) Staggered entrance animation for cards/services
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNavLink();
  setupPixCopyButton();
  staggerCardEntrance();
  setupCardTapFeedback();
});

/**
 * 1) Active state on the bottom navigation.
 * Compares each nav link's href against the current file name
 * and toggles the `.active` class accordingly, instead of relying
 * on a hard-coded class in the HTML.
 */
function highlightActiveNavLink() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll(
    '.bottom-nav-bar .link, .tabbar .tab'
  );

  navLinks.forEach((link) => {
    link.classList.remove('active');

    const href = link.getAttribute('href');
    if (href && href === currentFile) {
      link.classList.add('active');
    }
  });

  // Fallback for the home tabbar on index.html, which uses <div class="tab">
  // without href attributes — keep the first tab active there only.
  if (currentFile === 'index.html' || currentFile === '') {
    const firstTab = document.querySelector('.tabbar .tab');
    if (firstTab) firstTab.classList.add('active');
  }
}

/**
 * 2) "Copiar código Pix" button.
 * Looks for an element with [data-pix-code] (the code itself) and a
 * button with [data-pix-copy] (the trigger). Copies the code to the
 * clipboard and flips the button label to "Copiado!" for 2 seconds.
 */
function setupPixCopyButton() {
  const copyButton = document.querySelector('[data-pix-copy]');
  const codeElement = document.querySelector('[data-pix-code]');
  if (!copyButton || !codeElement) return;

  const originalLabel = copyButton.innerHTML;
  const pixCode = codeElement.textContent.trim();

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
    } catch (err) {
      // Fallback for browsers/contexts without Clipboard API support
      const textarea = document.createElement('textarea');
      textarea.value = pixCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    copyButton.classList.add('copied');
    copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';

    clearTimeout(copyButton._resetTimer);
    copyButton._resetTimer = setTimeout(() => {
      copyButton.classList.remove('copied');
      copyButton.innerHTML = originalLabel;
    }, 2000);
  });
}

/**
 * 3) Staggered fade/slide-in for grids of cards when the page loads,
 * so lists of services, guides and pending items feel less static.
 */
function staggerCardEntrance() {
  const groups = [
    '.services .service',
    '.pend .pend-item',
    '.guide-list .guide-card',
    '.emissao-options .option-card',
    '.quick .qcard',
  ];

  groups.forEach((selector) => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 60 * index);
    });
  });
}

/**
 * Small tactile feedback when tapping interactive cards/options
 * that aren't plain links (so taps feel acknowledged on mobile).
 */
function setupCardTapFeedback() {
  const tappable = document.querySelectorAll(
    '.option-card, .service, .qcard, .pend-item'
  );

  tappable.forEach((el) => {
    el.addEventListener('pointerdown', () => {
      el.style.transform = 'scale(0.97)';
    });
    el.addEventListener('pointerup', () => {
      el.style.transform = '';
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  // Selecting a tax/bill-type option on the "emissão" page
  const optionCards = document.querySelectorAll('.option-card');
  optionCards.forEach((card) => {
    card.addEventListener('click', () => {
      optionCards.forEach((c) => {
        c.classList.remove('selected');
        const check = c.querySelector('.option-card-check');
        if (check) check.remove();
      });
      card.classList.add('selected');
      if (!card.querySelector('.option-card-check')) {
        const check = document.createElement('span');
        check.className = 'option-card-check';
        check.setAttribute('aria-hidden', 'true');
        check.innerHTML = '<i class="fa-solid fa-check"></i>';
        card.appendChild(check);
      }
    });
  });
}