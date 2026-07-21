const searchInput = document.querySelector('#insight-search');
const filterButtons = document.querySelectorAll('.filter-button');
const insightCards = document.querySelectorAll('.insight-card');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
let activeFilter = 'all';

function filterInsights() {
  const query = (searchInput?.value || '').trim().toLowerCase();
  let visible = 0;
  insightCards.forEach((card) => {
    const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
    const searchMatches = !query || `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'artikel' : 'artikels'}`;
  if (emptyState) emptyState.hidden = visible !== 0;
}

searchInput?.addEventListener('input', filterInsights);
filterButtons.forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle('active', item === button));
  filterInsights();
}));
