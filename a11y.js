/**
 * a11y.js — Painel de Acessibilidade
 * Implementa os itens 5.11 (uso de cores) e 5.12 (conteúdo textual)
 * da ABNT NBR 17225 para o projeto Ensina+.
 *
 * Preferências são persistidas em localStorage para manter
 * a configuração entre sessões.
 */

(function () {
  'use strict';

  /* ── Constantes de chave de armazenamento ── */
  const KEY_THEME   = 'a11y-theme';
  const KEY_FONT    = 'a11y-font-size';
  const KEY_SPACING = 'a11y-spacing';

  /* ── Passos de tamanho de fonte (§5.12) ── */
  const FONT_STEPS   = ['sm', 'md', 'lg', 'xl', 'xxl'];
  const FONT_DEFAULT = 'md'; // índice 1

  /* ── Referências de DOM ── */
  const trigger   = document.getElementById('a11y-trigger');
  const panel     = document.getElementById('a11y-panel');
  const closeBtn  = document.getElementById('a11y-close');
  const resetAll  = document.getElementById('a11y-reset-all');

  const btnFontDec  = document.getElementById('font-decrease');
  const btnFontRes  = document.getElementById('font-reset');
  const btnFontInc  = document.getElementById('font-increase');

  const btnSpNormal  = document.getElementById('spacing-normal');
  const btnSpRelaxed = document.getElementById('spacing-relaxed');
  const btnSpLoose   = document.getElementById('spacing-loose');

  const colorBtns = document.querySelectorAll('.a11y-color-btn');

  /* ────────────────────────────────────────────────
     Estado atual
  ──────────────────────────────────────────────── */
  let state = {
    theme:   localStorage.getItem(KEY_THEME)   || 'default',
    font:    localStorage.getItem(KEY_FONT)    || FONT_DEFAULT,
    spacing: localStorage.getItem(KEY_SPACING) || 'normal',
  };

  /* ────────────────────────────────────────────────
     Aplicar estado
  ──────────────────────────────────────────────── */
  function applyTheme(theme) {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    colorBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    state.theme = theme;
    localStorage.setItem(KEY_THEME, theme);
  }

  function applyFont(size) {
    document.documentElement.setAttribute('data-font-size', size);

    // Atualiza estado visual dos botões de fonte
    const idx = FONT_STEPS.indexOf(size);
    btnFontDec.disabled  = idx <= 0;
    btnFontInc.disabled  = idx >= FONT_STEPS.length - 1;
    btnFontDec.classList.toggle('active', false);
    btnFontRes.classList.toggle('active', size === FONT_DEFAULT);
    btnFontInc.classList.toggle('active', false);

    state.font = size;
    localStorage.setItem(KEY_FONT, size);
  }

  function applySpacing(sp) {
    document.documentElement.setAttribute('data-spacing', sp);
    [btnSpNormal, btnSpRelaxed, btnSpLoose].forEach(btn => {
      btn.classList.toggle('active', btn.id === 'spacing-' + sp);
    });
    state.spacing = sp;
    localStorage.setItem(KEY_SPACING, sp);
  }

  /* ── Carga inicial: restaura preferências salvas ── */
  function restoreAll() {
    applyTheme(state.theme);
    applyFont(state.font);
    applySpacing(state.spacing);
  }

  /* ── Reset geral ── */
  function resetEverything() {
    applyTheme('default');
    applyFont(FONT_DEFAULT);
    applySpacing('normal');
  }

  /* ────────────────────────────────────────────────
     Controle do painel (abrir / fechar)
  ──────────────────────────────────────────────── */
  function openPanel() {
    panel.hidden = false;
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closePanel() {
    panel.hidden = true;
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  function togglePanel() {
    panel.hidden ? openPanel() : closePanel();
  }

  /* ────────────────────────────────────────────────
     Eventos
  ──────────────────────────────────────────────── */

  // Botão flutuante
  trigger.addEventListener('click', togglePanel);
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); }
  });

  // Fechar
  closeBtn.addEventListener('click', closePanel);

  // Fechar com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  // Fechar ao clicar fora do painel
  document.addEventListener('click', e => {
    if (!panel.hidden &&
        !panel.contains(e.target) &&
        e.target !== trigger &&
        !trigger.contains(e.target)) {
      closePanel();
    }
  });

  /* ── Fonte (§5.12) ── */
  btnFontDec.addEventListener('click', () => {
    const idx = FONT_STEPS.indexOf(state.font);
    if (idx > 0) applyFont(FONT_STEPS[idx - 1]);
  });

  btnFontRes.addEventListener('click', () => applyFont(FONT_DEFAULT));

  btnFontInc.addEventListener('click', () => {
    const idx = FONT_STEPS.indexOf(state.font);
    if (idx < FONT_STEPS.length - 1) applyFont(FONT_STEPS[idx + 1]);
  });

  /* ── Espaçamento (§5.12) ── */
  btnSpNormal.addEventListener('click',  () => applySpacing('normal'));
  btnSpRelaxed.addEventListener('click', () => applySpacing('relaxed'));
  btnSpLoose.addEventListener('click',   () => applySpacing('loose'));

  /* ── Temas de cor (§5.11) ── */
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });

  /* ── Reset total ── */
  resetAll.addEventListener('click', resetEverything);

  /* ── Inicializa ── */
  restoreAll();

  // Acessibilidade: anuncia o painel para leitores de tela
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'a11y-panel');

})();
