const searchInput = document.querySelector('#insight-search');
const searchForm = document.querySelector('#insight-search-form');
const filterButtons = document.querySelectorAll('.filter-button');
const insightCards = document.querySelectorAll('.insight-card');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const clearSearch = document.querySelector('#clear-search');
let activeFilter = 'all';

function normalizeSearch(value) {
  return value.toLocaleLowerCase('nl-BE').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterInsights() {
  const query = normalizeSearch((searchInput?.value || '').trim());
  let visible = 0;
  insightCards.forEach((card) => {
    const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
    const searchableText = normalizeSearch(`${card.dataset.search || ''} ${card.textContent || ''}`);
    const searchMatches = !query || searchableText.includes(query);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'artikel' : 'artikels'}`;
  if (emptyState) emptyState.hidden = visible !== 0;
  if (clearSearch) clearSearch.hidden = !query && activeFilter === 'all';
}

searchInput?.addEventListener('input', filterInsights);
searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  filterInsights();
});
filterButtons.forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle('active', item === button));
  filterInsights();
}));

clearSearch?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  activeFilter = 'all';
  filterButtons.forEach((button) => button.classList.toggle('active', button.dataset.filter === 'all'));
  filterInsights();
  searchInput?.focus();
});
