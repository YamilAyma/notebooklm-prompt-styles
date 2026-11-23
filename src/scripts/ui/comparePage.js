/**
 * comparePage.js — The /compare/ page: up to three styles side by side
 */

import { parseCompareIds, compareSearch, MAX_COMPARE } from '../../lib/compare.js';
import { getPalette, stylePath } from '../../lib/stylePage.js';
import { copyToClipboard } from '../utils.js';
import { t } from '../i18n.js';

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export function initComparePage(categories) {
  const page = document.getElementById('compare-page');
  const grid = document.getElementById('compare-grid');
  const slots = [...document.querySelectorAll('select[data-compare-slot]')];
  if (!page || !grid || slots.length === 0) return;

  const byId = new Map(categories.flatMap((c) => c.styles).map((s) => [s.id, s]));
  let ids = parseCompareIds(window.location.search, [...byId.keys()]);

  for (const select of slots) {
    select.replaceChildren(el('option', '', t('compareNone')));
    select.firstChild.value = '';
    select.firstChild.setAttribute('data-i18n', 'compareNone');
    for (const category of categories) {
      const group = el('optgroup');
      group.label = category.name;
      for (const style of category.styles) {
        const option = el('option', '', style.name);
        option.value = style.id;
        group.append(option);
      }
      select.append(group);
    }
    select.addEventListener('change', () => {
      ids = [...new Set(slots.map((s) => s.value).filter(Boolean))].slice(0, MAX_COMPARE);
      history.replaceState(null, '', window.location.pathname + compareSearch(ids));
      render();
    });
  }

  function render() {
    slots.forEach((select, i) => (select.value = ids[i] ?? ''));
    grid.replaceChildren(...ids.map((id) => column(byId.get(id))));
    grid.style.setProperty('--compare-columns', Math.max(ids.length, 1));
    document.getElementById('compare-hint').hidden = ids.length >= 2;
  }

  function column(style) {
    const box = el('article', 'compare-col');

    const title = el('h2', 'compare-col__title');
    const link = el('a', '', style.name);
    link.href = stylePath(style.id);
    title.append(link);
    box.append(title);

    box.append(el('p', 'compare-col__summary', style.description || style.theme));

    const img = el('img', 'compare-col__image');
    img.src = style.previews[0];
    img.alt = `${style.name} — slide style preview`;
    img.width = 1376;
    img.height = 768;
    img.loading = 'lazy';
    box.append(img);

    const palette = getPalette(style.colors);
    if (palette.length > 0) {
      const list = el('ul', 'compare-col__swatches');
      for (const swatch of palette) {
        const item = el('li');
        const dot = el('span', 'style-page__swatch');
        dot.style.backgroundColor = swatch.hex;
        item.append(dot, el('span', '', swatch.label), el('code', '', swatch.hex.toUpperCase()));
        list.append(item);
      }
      box.append(el('h3', '', t('pagePalette')), list);
    }

    const fonts = Object.entries(style.typography ?? {}).filter(([, v]) => typeof v === 'string');
    if (fonts.length > 0) {
      const list = el('dl', 'style-page__typography');
      for (const [key, value] of fonts)
        list.append(el('dt', '', key.replace(/_/g, ' ')), el('dd', '', value));
      box.append(el('h3', '', t('pageTypography')), list);
    }

    if (style.keyElements.length > 0) {
      const list = el('ul', 'style-page__elements');
      for (const item of style.keyElements) list.append(el('li', '', item));
      box.append(el('h3', '', t('pageElements')), list);
    }

    const copy = el('button', 'chip chip--primary', t('sheetCopy'));
    copy.type = 'button';
    copy.addEventListener('click', () => copyToClipboard(style.yamlContent, 'YAML Copied!'));
    const details = el('details', 'compare-col__yaml');
    details.append(el('summary', '', 'YAML'), el('pre', 'style-page__code', style.yamlContent));
    box.append(copy, details);

    return box;
  }

  render();
}
