/* ── Sidebar toggle ── */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('collapsed');
  // Persist state
  localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

// Restore sidebar state on load
(function () {
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    document.querySelector('.sidebar').classList.add('collapsed');
  }
})();

/* ── Sidebar nav active state ── */
function setActive(btn) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
}

/* ── Filter chips + card visibility ── */
function toggleChip(chip) {
  // Update active chip
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  const filter = chip.dataset.filter; // 'tutti' | 'fondamenta' | 'struttura' | 'micro' | 'audit'
  const cards = document.querySelectorAll('.card');
  const emptyEl = document.querySelector('.empty-state');
  let visible = 0;

  cards.forEach(card => {
    const cat = card.dataset.category; // matches filter values
    const show = filter === 'tutti' || cat === filter;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  // Update result count
  const countEl = document.querySelector('.result-count');
  if (countEl) {
    countEl.textContent = `${visible} risultat${visible === 1 ? 'o' : 'i'}`;
  }

  // Empty state
  if (emptyEl) {
    emptyEl.classList.toggle('visible', visible === 0);
  }
}

/* ── Snippet expand/collapse ── */
function toggleSnippet(id, btn) {
  const snippet = document.getElementById(id).closest('.card-snippet');
  const textSpan = btn.querySelector('span:first-child');
  const iconSpan = btn.querySelector('.card-expand-icon');

  if (snippet.style.maxHeight && snippet.style.maxHeight !== '80px') {
    snippet.style.maxHeight = '80px';
    snippet.style.overflow = 'hidden';
    if (textSpan) textSpan.textContent = 'Espandi';
    if (iconSpan) iconSpan.textContent = '↓';
    snippet.querySelector('.card-snippet-fade').style.opacity = '1';
  } else {
    snippet.style.maxHeight = '300px';
    snippet.style.overflow = 'auto';
    if (textSpan) textSpan.textContent = 'Comprimi';
    if (iconSpan) iconSpan.textContent = '↑';
    snippet.querySelector('.card-snippet-fade').style.opacity = '0';
  }
}

/* ── Copy to clipboard ── */
function copyPrompt(id, btn) {
  const text = document.getElementById(id).textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M2 7 l3 3 6-6"/>
      </svg>
      Copiato!`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
    }, 2000);
  }).catch(() => {
    /* fallback per browser senza clipboard API */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}
