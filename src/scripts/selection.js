/**
 * selection.js — Which styles are selected, and whether the lists are in selection mode.
 * No DOM here: the cards and the action bar listen to it.
 */

const selected = new Set();
const listeners = new Set();
let active = false;

const notify = () => listeners.forEach((listener) => listener());

export const onSelectionChange = (listener) => {
  listeners.add(listener);
};

export const isSelecting = () => active;
export const isSelected = (id) => selected.has(id);
export const selectedIds = () => [...selected];

export function setSelecting(value) {
  active = Boolean(value);
  notify();
}

export function setSelected(id, value) {
  if (value) selected.add(id);
  else selected.delete(id);
  notify();
}

export function toggleSelected(id) {
  setSelected(id, !selected.has(id));
}

export function selectMany(ids) {
  ids.forEach((id) => selected.add(id));
  notify();
}

export function clearSelection() {
  selected.clear();
  notify();
}
