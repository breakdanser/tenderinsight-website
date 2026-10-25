const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const menuLabel = menuButton?.querySelector('.sr-only');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.classList.remove('active');
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (menuLabel) menuLabel.textContent = 'Menu openen';
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.classList.toggle('active', !isOpen);
  navigation.classList.toggle('open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  if (menuLabel) menuLabel.textContent = isOpen ? 'Menu openen' : 'Menu sluiten';
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();

// Sitebrede routes en taalkeuze. De browser-/Windows-taal geldt bij het eerste bezoek.
const supportedLanguages = ['nl', 'fr', 'en'];
const detectedLanguage = (navigator.language || 'nl').slice(0, 2).toLowerCase();
let siteLanguage = localStorage.getItem('tenderInsightLanguage') || (supportedLanguages.includes(detectedLanguage) ? detectedLanguage : 'en');

const pagePrefix = window.location.pathname.includes('/insights/') ? '../' : '';
const mainRoutes = {
  Producten: `${pagePrefix}producten.html`,
  'Consultancy & Advisory': `${pagePrefix}consultancy-advisory.html`,
  Academy: `${pagePrefix}academy.html`,
  Insights: `${pagePrefix}insights.html`,
  'Over ons': `${pagePrefix}over-ons.html`,
  Contact: `${pagePrefix}contact.html`
};

const navigationLabels = {
  nl: { products: 'Producten', consultancy: 'Consultancy & Advisory', academy: 'Academy', insights: 'Insights', about: 'Over ons', contact: 'Contact' },
  fr: { products: 'Produits', consultancy: 'Conseil & Advisory', academy: 'Académie', insights: 'Analyses', about: 'À propos', contact: 'Contact' },
  en: { products: 'Products', consultancy: 'Consultancy & Advisory', academy: 'Academy', insights: 'Insights', about: 'About us', contact: 'Contact' }
};

const pageTranslations = {
  fr: {
    'Van contract naar resultaat': 'Du contrat au résultat',
    'Tender Insights verbindt afspraken met de dagelijkse uitvoering. Het platform signaleert afwijkingen, bewaakt termijnen en maakt duidelijk waar actie nodig is.': 'Tender Insights relie les engagements à leur exécution quotidienne. La plateforme signale les écarts, surveille les échéances et indique clairement où une action est requise.',
    'Bekijk alle functionaliteiten': 'Voir toutes les fonctionnalités', 'Bekijk tarieven': 'Voir les tarifs',
    'Zes samenhangende modules': 'Six modules intégrés', 'Van overzicht tot gerichte opvolging': 'De la vue d’ensemble au suivi ciblé',
    'Contracten & agenda': 'Contrats & calendrier', 'SLA & performance': 'SLA & performance', 'Leveranciers': 'Fournisseurs', 'Verbruik': 'Consommation', 'Signalen': 'Signaux', 'Acties': 'Actions',
    'Verplichtingen, looptijden, verlengingen en beslismomenten centraal opvolgen.': 'Suivez centralement les obligations, durées, prolongations et moments de décision.',
    "Normen, KPI's en leveranciersrapporten objectief vergelijken.": 'Comparez objectivement les normes, KPI et rapports fournisseurs.',
    'Periodiek en consistent evalueren met scores en verbeterplannen.': 'Évaluez périodiquement et de manière cohérente avec des scores et plans d’amélioration.',
    'Bestedingen en resterende contractruimte transparant bewaken.': 'Surveillez en toute transparence les dépenses et la marge contractuelle restante.',
    "Afwijkingen en risico's vroeg herkennen en onderbouwen.": 'Identifiez et documentez rapidement les écarts et les risques.',
    'Elk aandachtspunt voorzien van eigenaar, deadline en status.': 'Attribuez à chaque point d’attention un responsable, une échéance et un statut.',
    'Onafhankelijk advies': 'Conseil indépendant', 'Van voorbereiding tot uitvoering': 'De la préparation à l’exécution', 'Expertise op de momenten die het verschil maken': 'Une expertise aux moments décisifs',
    'ICT-overheidsopdrachten': 'Marchés publics ICT', 'Strategische sourcing': 'Sourcing stratégique', 'Contract & leveranciers': 'Contrats & fournisseurs',
    'Behoefte, sourcingstrategie, marktbenadering, bestek, evaluatie en gunning.': 'Besoin, stratégie de sourcing, approche du marché, cahier des charges, évaluation et attribution.',
    'Scope, marktwerking, commerciële modellen en afhankelijkheden bewust kiezen.': 'Choisissez consciemment le périmètre, la dynamique du marché, les modèles commerciaux et les dépendances.',
    'Na de gunning prestaties, risico\'s en samenwerking bestuurbaar maken.': 'Après l’attribution, pilotez les performances, les risques et la collaboration.',
    'Bespreek uw dossier': 'Discuter de votre dossier', 'Drie pijlers': 'Trois piliers', 'Leertrajecten op maat van rol en maturiteit': 'Des parcours adaptés au rôle et à la maturité',
    'Directie': 'Direction', 'Professionals': 'Professionnels', 'Toepassing': 'Mise en pratique', 'Aankopers & ICT-experts': 'Acheteurs & experts ICT', 'Business, aankoop & ICT': 'Métier, achats & ICT',
    'Bespreek een leertraject': 'Discuter d’un parcours', 'Tender Insights tarieven': 'Tarifs Tender Insights', 'Offerte aanvragen': 'Demander une offre', 'Meest gekozen': 'Le plus choisi',
    'Basis': 'Base', 'Professioneel': 'Professionnel', 'Eenmalige opstart': 'Démarrage unique', 'In elk pakket': 'Dans chaque formule', 'Onbeperkt gebruikers': 'Utilisateurs illimités',
    'Nederlands, Frans en Engels': 'Néerlandais, français et anglais', 'Alle updates zonder meerprijs': 'Toutes les mises à jour sans supplément'
  },
  en: {
    'Van contract naar resultaat': 'From contract to outcome',
    'Tender Insights verbindt afspraken met de dagelijkse uitvoering. Het platform signaleert afwijkingen, bewaakt termijnen en maakt duidelijk waar actie nodig is.': 'Tender Insights connects commitments to day-to-day delivery. The platform flags deviations, monitors deadlines and shows where action is required.',
    'Bekijk alle functionaliteiten': 'Explore all features', 'Bekijk tarieven': 'View pricing', 'Zes samenhangende modules': 'Six integrated modules', 'Van overzicht tot gerichte opvolging': 'From overview to focused follow-up',
    'Contracten & agenda': 'Contracts & calendar', 'SLA & performance': 'SLA & performance', 'Leveranciers': 'Suppliers', 'Verbruik': 'Spend', 'Signalen': 'Signals', 'Acties': 'Actions',
    'Verplichtingen, looptijden, verlengingen en beslismomenten centraal opvolgen.': 'Track obligations, terms, extensions and decision points centrally.',
    "Normen, KPI's en leveranciersrapporten objectief vergelijken.": 'Objectively compare targets, KPIs and supplier reports.',
    'Periodiek en consistent evalueren met scores en verbeterplannen.': 'Evaluate consistently with scores and improvement plans.',
    'Bestedingen en resterende contractruimte transparant bewaken.': 'Transparently monitor spend and remaining contract capacity.',
    "Afwijkingen en risico's vroeg herkennen en onderbouwen.": 'Identify and substantiate deviations and risks early.',
    'Elk aandachtspunt voorzien van eigenaar, deadline en status.': 'Give every issue an owner, deadline and status.',
    'Onafhankelijk advies': 'Independent advice', 'Van voorbereiding tot uitvoering': 'From preparation to delivery', 'Expertise op de momenten die het verschil maken': 'Expertise at the moments that matter',
    'ICT-overheidsopdrachten': 'ICT public procurement', 'Strategische sourcing': 'Strategic sourcing', 'Contract & leveranciers': 'Contracts & suppliers',
    'Behoefte, sourcingstrategie, marktbenadering, bestek, evaluatie en gunning.': 'Needs, sourcing strategy, market approach, specifications, evaluation and award.',
    'Scope, marktwerking, commerciële modellen en afhankelijkheden bewust kiezen.': 'Make deliberate choices about scope, market dynamics, commercial models and dependencies.',
    'Na de gunning prestaties, risico\'s en samenwerking bestuurbaar maken.': 'After award, make performance, risks and collaboration manageable.',
    'Bespreek uw dossier': 'Discuss your project', 'Drie pijlers': 'Three pillars', 'Leertrajecten op maat van rol en maturiteit': 'Learning paths tailored to role and maturity',
    'Directie': 'Leadership', 'Professionals': 'Professionals', 'Toepassing': 'Application', 'Aankopers & ICT-experts': 'Buyers & ICT experts', 'Business, aankoop & ICT': 'Business, procurement & ICT',
    'Bespreek een leertraject': 'Discuss a learning path', 'Tender Insights tarieven': 'Tender Insights pricing', 'Offerte aanvragen': 'Request a quote', 'Meest gekozen': 'Most popular',
    'Basis': 'Basic', 'Professioneel': 'Professional', 'Eenmalige opstart': 'One-time setup', 'In elk pakket': 'Included in every plan', 'Onbeperkt gebruikers': 'Unlimited users',
    'Nederlands, Frans en Engels': 'Dutch, French and English', 'Alle updates zonder meerprijs': 'All updates included'
  }
};

function applyLanguage(language) {
  siteLanguage = supportedLanguages.includes(language) ? language : 'en';
  localStorage.setItem('tenderInsightLanguage', siteLanguage);
  document.documentElement.lang = siteLanguage;
  document.querySelectorAll('[data-nl][data-fr][data-en]').forEach((element) => {
    element.textContent = element.dataset[siteLanguage];
  });
  if (siteLanguage !== 'nl') {
    const translations = pageTranslations[siteLanguage];
    document.querySelectorAll('main h2, main h3, main p, main li, main a, main span').forEach((element) => {
      if (element.children.length) return;
      const source = element.textContent.trim();
      if (!element.dataset.nlSource) element.dataset.nlSource = source;
      const translated = translations[element.dataset.nlSource];
      if (translated) element.textContent = translated;
    });
  } else {
    document.querySelectorAll('[data-nl-source]').forEach((element) => { element.textContent = element.dataset.nlSource; });
  }
  const labels = navigationLabels[siteLanguage];
  document.querySelectorAll('.primary-nav > a').forEach((link) => {
    const original = link.textContent.trim();
    const key = original.match(/Product|Produit/) ? 'products' : original.match(/Consult|Conseil/) ? 'consultancy' : original.match(/Academ|Acad/) ? 'academy' : original.match(/Insight|Analyse/) ? 'insights' : original.match(/Over ons|About us|À propos/) ? 'about' : original.match(/Contact/) ? 'contact' : null;
    if (key) link.textContent = labels[key];
  });
  const selector = document.querySelector('#site-language');
  if (selector) selector.value = siteLanguage;
}

document.querySelectorAll('.primary-nav > a').forEach((link) => {
  const label = link.textContent.trim();
  if (mainRoutes[label]) link.href = mainRoutes[label];
});

if (navigation) {
  const picker = document.createElement('div');
  picker.className = 'language-picker';
  picker.innerHTML = '<label for="site-language">Taal</label><select id="site-language" aria-label="Kies uw taal"><option value="nl">NL</option><option value="fr">FR</option><option value="en">EN</option></select>';
  navigation.appendChild(picker);
  picker.querySelector('select').addEventListener('change', (event) => applyLanguage(event.target.value));
}

applyLanguage(siteLanguage);
