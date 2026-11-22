/**
 * selectionBar.js — "Select" mode of the style lists: pick several styles and copy their YAML
 */

import {
  isSelecting,
  setSelecting,
  selectedIds,
  selectMany,
  clearSelection,
  onSelectionChange,
} from '../selection.js';
import { syncCardSelection } from './card.js';
import { buildYamlBundle } from '../../lib/bundle.js';
import { copyToClipboard } from '../utils.js';
import { t } from '../i18n.js';

/**
 * @param {Map<string, object>} stylesById every style of the catalog
 * @param {() => object[]} getVisibleStyles styles currently shown (for "select all")
 */
export function initSelection(stylesById, getVisibleStyles) {
  const toggle = document.getElementById('select-toggle');
  const bar = document.getElementById('selection-bar');
  if (!toggle || !bar) return;

  const count = document.getElementById('selection-count');
  const copyBtn = document.getElementById('selection-copy');

  const render = () => {
    const ids = selectedIds();
    document.body.toggleAttribute('data-selecting', isSelecting());
    toggle.setAttribute('aria-pressed', String(isSelecting()));
    bar.hidden = !isSelecting();
    count.textContent = t('selectionCount').replace('{n}', ids.length);
    copyBtn.disabled = ids.length === 0;
    document.querySelectorAll('.style-card[data-style-id]').forEach(syncCardSelection);
  };

  onSelectionChange(render);
  // Cards created later (pagination, filters) start in sync
  new MutationObserver(render).observe(document.getElementById('styles-grid') ?? document.body, {
    childList: true,
  });

  toggle.addEventListener('click', () => setSelecting(!isSelecting()));
  document.getElementById('selection-done').addEventListener('click', () => {
    clearSelection();
    setSelecting(false);
  });
  document.getElementById('selection-clear').addEventListener('click', clearSelection);
  document
    .getElementById('selection-all')
    .addEventListener('click', () => selectMany(getVisibleStyles().map((s) => s.id)));

  copyBtn.addEventListener('click', async () => {
    const styles = selectedIds()
      .map((id) => stylesById.get(id))
      .filter(Boolean);
    if (styles.length === 0) return;
    await copyToClipboard(
      buildYamlBundle(styles),
      t('selectionCopied').replace('{n}', styles.length),
    );
  });

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === 'Escape' && isSelecting() && !typing) {
      clearSelection();
      setSelecting(false);
    }
  });

  render();
}
