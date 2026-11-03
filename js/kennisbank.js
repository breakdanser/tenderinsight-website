const kbSearch = document.querySelector('#kb-search');
const kbClear = document.querySelector('#kb-clear');
const kbResult = document.querySelector('#kb-results');
const kbSections = [...document.querySelectorAll('[data-search-section]')];
const kbEmpty = document.querySelector('.kb-empty');

function normalize(value) {
  return value.toLocaleLowerCase('nl').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterKnowledgeBase() {
  const query = normalize(kbSearch.value.trim());
  let visible = 0;
  kbSections.forEach((section) => {
    const matches = !query || normalize(section.textContent).includes(query);
    section.hidden = !matches;
    if (matches) visible += 1;
  });
  kbEmpty.hidden = visible !== 0;
  kbResult.textContent = query ? `${visible} ${visible === 1 ? 'hoofdstuk gevonden' : 'hoofdstukken gevonden'}` : `${kbSections.length} hoofdstukken`;
}

kbSearch?.addEventListener('input', filterKnowledgeBase);
kbClear?.addEventListener('click', () => {
  kbSearch.value = '';
  filterKnowledgeBase();
  kbSearch.focus();
});

filterKnowledgeBase();
