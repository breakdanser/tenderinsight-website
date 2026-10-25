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
    'Tender Insight Academy': 'Tender Insight Académie', 'Geen generieke theorie, maar een gemeenschappelijke taal, toepasbare methoden en oefeningen rond echte ICT-aankoopvraagstukken.': 'Pas de théorie générique, mais un langage commun, des méthodes applicables et des exercices basés sur de véritables enjeux d’achat ICT.',
    '01 · Directie': '01 · Direction', '02 · Professionals': '02 · Professionnels', '03 · Toepassing': '03 · Mise en pratique',
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
    'Behoefte- en stakeholderanalyse': 'Analyse des besoins et des parties prenantes', 'Selectie- en gunningscriteria': 'Critères de sélection et d’attribution', 'Procedure- en documentstrategie': 'Stratégie de procédure et de documentation', 'Marktconsultatie': 'Consultation du marché', 'TCO en prijsmodellen': 'TCO et modèles de prix', 'Vendor lock-in en exit': 'Dépendance fournisseur et sortie', "SLA's en KPI's": 'SLA et KPI', 'Governance en escalatie': 'Gouvernance et escalade', 'Wijzigings- en claimbeheer': 'Gestion des changements et réclamations',
    'Directie': 'Direction', 'Professionals': 'Professionnels', 'Toepassing': 'Mise en pratique', 'Aankopers & ICT-experts': 'Acheteurs & experts ICT', 'Business, aankoop & ICT': 'Métier, achats & ICT',
    'Een gedeeld kader voor ICT-procurement, governance en investeringsbeslissingen.': 'Un cadre commun pour les achats ICT, la gouvernance et les décisions d’investissement.',
    'Een consistente methode voor voorbereiding, plaatsing en contractering.': 'Une méthode cohérente pour la préparation, la passation et la contractualisation.',
    'Multidisciplinaire workshops op een concrete case van de organisatie.': 'Des ateliers multidisciplinaires appliqués à un cas concret de l’organisation.',
    "Strategische keuzes en risico's": 'Choix stratégiques et risques', 'Besluitvorming en governance': 'Décision et gouvernance', 'Sturen op publieke waarde': 'Pilotage de la valeur publique',
    'Functionele specificaties': 'Spécifications fonctionnelles', 'Selectie en gunning': 'Sélection et attribution', 'SLA, TCO en exit': 'SLA, TCO et sortie',
    'Stakeholders en behoefte': 'Parties prenantes et besoin', 'Markt en oplossingsruimte': 'Marché et espace de solutions', 'Van keuzes naar bestek': 'Des choix au cahier des charges',
    'Bespreek een leertraject': 'Discuter d’un parcours', 'Tender Insights tarieven': 'Tarifs Tender Insights', 'Offerte aanvragen': 'Demander une offre', 'Meest gekozen': 'Le plus choisi',
    'Basis': 'Base', 'Professioneel': 'Professionnel', 'Eenmalige opstart': 'Démarrage unique', 'In elk pakket': 'Dans chaque formule', 'Onbeperkt gebruikers': 'Utilisateurs illimités',
    'Nederlands, Frans en Engels': 'Néerlandais, français et anglais', 'Alle updates zonder meerprijs': 'Toutes les mises à jour sans supplément',
    'Voor organisaties met een beperkte contractportefeuille en een duidelijke behoefte aan centrale opvolging.': 'Pour les organisations disposant d’un portefeuille contractuel limité et ayant besoin d’un suivi centralisé.',
    "Voor organisaties die meerdere contracten actief sturen op prestaties, risico's en leverancierswaarde.": 'Pour les organisations qui pilotent activement plusieurs contrats sur la performance, les risques et la valeur fournisseur.',
    'Voor organisaties met een omvangrijke contractportefeuille, meerdere teams en uitgebreide integratiebehoeften.': 'Pour les organisations avec un vaste portefeuille contractuel, plusieurs équipes et des besoins d’intégration avancés.',
    'Praktische informatie': 'Informations pratiques', 'Veelgestelde vragen': 'Questions fréquentes', 'Alles wat u wilt weten over licenties, implementatie, gegevens en ondersteuning.': 'Tout ce que vous devez savoir sur les licences, la mise en œuvre, les données et le support.',
    'Betalen we per gebruiker?': 'Payons-nous par utilisateur ?', 'Waar worden onze gegevens bewaard?': 'Où nos données sont-elles conservées ?', 'Wat omvat de eenmalige opstart?': 'Que comprend le démarrage initial ?', 'Kunnen we bestaande contractgegevens importeren?': 'Pouvons-nous importer nos contrats existants ?', 'Kunnen we later van pakket veranderen?': 'Pouvons-nous changer de formule ultérieurement ?', 'Werkt Tender Insights met ons ERP- of ticketsysteem?': 'Tender Insights fonctionne-t-il avec notre ERP ou outil de ticketing ?', "Hoe worden SLA's en KPI's opgevolgd?": 'Comment les SLA et KPI sont-ils suivis ?', 'Welke ondersteuning is inbegrepen?': 'Quel support est inclus ?', 'Wat gebeurt er met onze gegevens bij het einde van de samenwerking?': 'Que deviennent nos données à la fin de la collaboration ?',
    'Benieuwd hoe Tender Insights werkt met uw contracten?': 'Envie de voir Tender Insights à l’œuvre sur vos contrats ?', 'Vraag een demonstratie aan of bespreek welk pakket aansluit bij uw contractportfolio.': 'Demandez une démonstration ou identifiez la formule adaptée à votre portefeuille.', 'Demo aanvragen': 'Demander une démo'
    ,'Tot 10 lopende contracten': 'Jusqu’à 10 contrats actifs', 'Tot 25 lopende contracten': 'Jusqu’à 25 contrats actifs', 'Onbeperkt contracten': 'Contrats illimités', 'Alles uit Basis': 'Tout le plan Base', 'Alles uit Professioneel': 'Tout le plan Professionnel', 'Looptijd, verlengingen en beslissingsmomenten': 'Durées, prolongations et moments de décision', 'Verbruik tegenover het maximum, met voorspelling': 'Consommation par rapport au plafond, avec prévision', 'Signalen en acties met opvolging': 'Signaux et actions avec suivi', 'Invoer via formulier en Excel': 'Saisie via formulaire et Excel', 'Support per mail binnen 2 werkdagen': 'Support par e-mail sous 2 jours ouvrables', "SLA's zelf berekend en leveranciersrapporten gecontroleerd": 'SLA calculés et rapports fournisseurs vérifiés', "KPI's, leveranciersevaluatie en beslissingsfiche": 'KPI, évaluation fournisseur et fiche de décision', 'Prijsindexatie en controle van factuurprijzen': 'Indexation et contrôle des prix facturés', '1 koppeling met ERP of ticketsysteem': '1 intégration ERP ou ticketing', 'Opleiding van een halve dag': 'Formation d’une demi-journée', 'Volledige eigen huisstijl': 'Identité visuelle complète', 'Opleiding van één dag en opvolgmoment': 'Formation d’une journée et session de suivi', 'Prioritaire support binnen 4 werkuren': 'Support prioritaire sous 4 heures ouvrables',
    'Hosting in de EU, gegevens per organisatie gescheiden': 'Hébergement dans l’UE, données séparées par organisation', 'Dagelijkse versleutelde back-up en herstel': 'Sauvegarde chiffrée quotidienne et restauration', 'Bij elk cijfer de bron, datum en wijzigingshistoriek': 'Source, date et historique pour chaque chiffre',
    'Nee. U betaalt per organisatie en elk pakket bevat onbeperkt gebruikers. Zo kunnen alle betrokken diensten samenwerken zonder bijkomende licentiekosten per persoon.': 'Non. Vous payez par organisation et chaque formule comprend un nombre illimité d’utilisateurs. Tous les services concernés peuvent collaborer sans coût de licence supplémentaire par personne.',
    'De toepassing wordt gehost in de Europese Unie. Gegevens worden per organisatie logisch gescheiden, dagelijkse back-ups worden versleuteld bewaard en toegang wordt volgens rollen en rechten beheerd.': 'L’application est hébergée dans l’Union européenne. Les données sont séparées par organisation, les sauvegardes quotidiennes sont chiffrées et les accès sont gérés par rôles et autorisations.',
    'We richten uw omgeving in, configureren gebruikers en basisrechten en begeleiden de eerste gegevensimport. Afhankelijk van het pakket worden koppelingen en huisstijl ingesteld. De opstart wordt afgerond met een opleiding.': 'Nous configurons votre environnement, les utilisateurs et les droits de base et accompagnons le premier import. Selon la formule, les intégrations et l’identité visuelle sont configurées. Une formation clôture le démarrage.',
    'Ja. Contractgegevens kunnen via een afgesproken Excelmodel worden aangeleverd. Bij Professioneel en Enterprise kunnen daarnaast gegevensstromen of koppelingen worden geconfigureerd.': 'Oui. Les données contractuelles peuvent être fournies via un modèle Excel convenu. Les formules Professionnel et Enterprise permettent également de configurer des flux ou intégrations.',
    'Ja. Opschalen kan wanneer uw contractportefeuille, rapportagebehoefte of integratielandschap groeit. We bekijken vooraf welke bijkomende configuratie of opleiding nodig is.': 'Oui. Vous pouvez évoluer lorsque votre portefeuille, vos besoins de reporting ou vos intégrations se développent. Nous déterminons préalablement la configuration ou la formation supplémentaire nécessaire.',
    'Professioneel bevat één koppeling. Enterprise ondersteunt meerdere koppelingen met onder meer Microsoft Dynamics 365, Business Central, SAP, Adfinity, Jira Service Management en ServiceNow. Andere systemen kunnen via beveiligde gegevensuitwisseling of periodieke import worden aangesloten.': 'Professionnel comprend une intégration. Enterprise prend en charge plusieurs intégrations, notamment Microsoft Dynamics 365, Business Central, SAP, Adfinity, Jira Service Management et ServiceNow. D’autres systèmes peuvent être connectés par échange sécurisé ou import périodique.',
    'Tender Insights registreert contractuele normen, meetresultaten en rapportageperiodes. Berekende prestaties kunnen worden vergeleken met leveranciersrapporten. Afwijkingen kunnen rechtstreeks tot een signaal of actie leiden.': 'Tender Insights enregistre les normes contractuelles, les mesures et les périodes de reporting. Les performances calculées peuvent être comparées aux rapports fournisseurs et les écarts peuvent générer directement un signal ou une action.',
    'Elk pakket omvat functionele ondersteuning en productupdates. De reactietijd en begeleidingsvorm verschillen per pakket. Enterprise bevat prioritaire ondersteuning en een vast contactpunt.': 'Chaque formule comprend le support fonctionnel et les mises à jour. Le délai de réponse et l’accompagnement varient selon la formule. Enterprise inclut un support prioritaire et un contact dédié.',
    'U kunt uw contract- en opvolgingsgegevens exporteren in een bruikbaar formaat. Overdracht, bewaartermijnen en veilige verwijdering worden vooraf duidelijk afgesproken.': 'Vous pouvez exporter vos données contractuelles et de suivi dans un format exploitable. Le transfert, la conservation et la suppression sécurisée sont convenus clairement à l’avance.'
  },
  en: {
    'Tender Insight Academy': 'Tender Insight Academy', 'Geen generieke theorie, maar een gemeenschappelijke taal, toepasbare methoden en oefeningen rond echte ICT-aankoopvraagstukken.': 'No generic theory, but a shared language, practical methods and exercises based on real ICT procurement challenges.',
    '01 · Directie': '01 · Leadership', '02 · Professionals': '02 · Professionals', '03 · Toepassing': '03 · Application',
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
    'Behoefte- en stakeholderanalyse': 'Needs and stakeholder analysis', 'Selectie- en gunningscriteria': 'Selection and award criteria', 'Procedure- en documentstrategie': 'Procedure and document strategy', 'Marktconsultatie': 'Market consultation', 'TCO en prijsmodellen': 'TCO and pricing models', 'Vendor lock-in en exit': 'Vendor lock-in and exit', "SLA's en KPI's": 'SLAs and KPIs', 'Governance en escalatie': 'Governance and escalation', 'Wijzigings- en claimbeheer': 'Change and claims management',
    'Directie': 'Leadership', 'Professionals': 'Professionals', 'Toepassing': 'Application', 'Aankopers & ICT-experts': 'Buyers & ICT experts', 'Business, aankoop & ICT': 'Business, procurement & ICT',
    'Een gedeeld kader voor ICT-procurement, governance en investeringsbeslissingen.': 'A shared framework for ICT procurement, governance and investment decisions.',
    'Een consistente methode voor voorbereiding, plaatsing en contractering.': 'A consistent method for preparation, procurement and contracting.',
    'Multidisciplinaire workshops op een concrete case van de organisatie.': 'Multidisciplinary workshops applied to a real organisational case.',
    "Strategische keuzes en risico's": 'Strategic choices and risks', 'Besluitvorming en governance': 'Decision-making and governance', 'Sturen op publieke waarde': 'Managing for public value',
    'Functionele specificaties': 'Functional specifications', 'Selectie en gunning': 'Selection and award', 'SLA, TCO en exit': 'SLA, TCO and exit',
    'Stakeholders en behoefte': 'Stakeholders and needs', 'Markt en oplossingsruimte': 'Market and solution space', 'Van keuzes naar bestek': 'From choices to specifications',
    'Bespreek een leertraject': 'Discuss a learning path', 'Tender Insights tarieven': 'Tender Insights pricing', 'Offerte aanvragen': 'Request a quote', 'Meest gekozen': 'Most popular',
    'Basis': 'Basic', 'Professioneel': 'Professional', 'Eenmalige opstart': 'One-time setup', 'In elk pakket': 'Included in every plan', 'Onbeperkt gebruikers': 'Unlimited users',
    'Nederlands, Frans en Engels': 'Dutch, French and English', 'Alle updates zonder meerprijs': 'All updates included',
    'Voor organisaties met een beperkte contractportefeuille en een duidelijke behoefte aan centrale opvolging.': 'For organisations with a limited contract portfolio and a clear need for centralised follow-up.',
    "Voor organisaties die meerdere contracten actief sturen op prestaties, risico's en leverancierswaarde.": 'For organisations actively managing multiple contracts for performance, risk and supplier value.',
    'Voor organisaties met een omvangrijke contractportefeuille, meerdere teams en uitgebreide integratiebehoeften.': 'For organisations with a large contract portfolio, multiple teams and advanced integration needs.',
    'Praktische informatie': 'Practical information', 'Veelgestelde vragen': 'Frequently asked questions', 'Alles wat u wilt weten over licenties, implementatie, gegevens en ondersteuning.': 'Everything you need to know about licensing, implementation, data and support.',
    'Betalen we per gebruiker?': 'Do we pay per user?', 'Waar worden onze gegevens bewaard?': 'Where is our data stored?', 'Wat omvat de eenmalige opstart?': 'What is included in the one-time setup?', 'Kunnen we bestaande contractgegevens importeren?': 'Can we import existing contract data?', 'Kunnen we later van pakket veranderen?': 'Can we change plans later?', 'Werkt Tender Insights met ons ERP- of ticketsysteem?': 'Does Tender Insights work with our ERP or ticketing system?', "Hoe worden SLA's en KPI's opgevolgd?": 'How are SLAs and KPIs monitored?', 'Welke ondersteuning is inbegrepen?': 'What support is included?', 'Wat gebeurt er met onze gegevens bij het einde van de samenwerking?': 'What happens to our data when the service ends?',
    'Benieuwd hoe Tender Insights werkt met uw contracten?': 'Want to see Tender Insights working with your contracts?', 'Vraag een demonstratie aan of bespreek welk pakket aansluit bij uw contractportfolio.': 'Request a demonstration or discuss which plan fits your contract portfolio.', 'Demo aanvragen': 'Request a demo'
    ,'Tot 10 lopende contracten': 'Up to 10 active contracts', 'Tot 25 lopende contracten': 'Up to 25 active contracts', 'Onbeperkt contracten': 'Unlimited contracts', 'Alles uit Basis': 'Everything in Basic', 'Alles uit Professioneel': 'Everything in Professional', 'Looptijd, verlengingen en beslissingsmomenten': 'Terms, extensions and decision points', 'Verbruik tegenover het maximum, met voorspelling': 'Spend against the maximum, with forecast', 'Signalen en acties met opvolging': 'Signals and actions with follow-up', 'Invoer via formulier en Excel': 'Data entry through forms and Excel', 'Support per mail binnen 2 werkdagen': 'Email support within 2 business days', "SLA's zelf berekend en leveranciersrapporten gecontroleerd": 'SLAs calculated and supplier reports verified', "KPI's, leveranciersevaluatie en beslissingsfiche": 'KPIs, supplier evaluation and decision sheet', 'Prijsindexatie en controle van factuurprijzen': 'Price indexation and invoice price checks', '1 koppeling met ERP of ticketsysteem': '1 ERP or ticketing integration', 'Opleiding van een halve dag': 'Half-day training', 'Volledige eigen huisstijl': 'Full custom branding', 'Opleiding van één dag en opvolgmoment': 'One-day training and follow-up session', 'Prioritaire support binnen 4 werkuren': 'Priority support within 4 business hours',
    'Hosting in de EU, gegevens per organisatie gescheiden': 'EU hosting with data separated by organisation', 'Dagelijkse versleutelde back-up en herstel': 'Daily encrypted backup and recovery', 'Bij elk cijfer de bron, datum en wijzigingshistoriek': 'Source, date and change history for every figure',
    'Nee. U betaalt per organisatie en elk pakket bevat onbeperkt gebruikers. Zo kunnen alle betrokken diensten samenwerken zonder bijkomende licentiekosten per persoon.': 'No. You pay per organisation and every plan includes unlimited users, so all relevant teams can collaborate without additional per-user licence fees.',
    'De toepassing wordt gehost in de Europese Unie. Gegevens worden per organisatie logisch gescheiden, dagelijkse back-ups worden versleuteld bewaard en toegang wordt volgens rollen en rechten beheerd.': 'The application is hosted in the European Union. Data is logically separated by organisation, daily backups are encrypted and access is managed through roles and permissions.',
    'We richten uw omgeving in, configureren gebruikers en basisrechten en begeleiden de eerste gegevensimport. Afhankelijk van het pakket worden koppelingen en huisstijl ingesteld. De opstart wordt afgerond met een opleiding.': 'We configure your environment, users and basic permissions and guide the first data import. Depending on the plan, integrations and branding are configured. The setup concludes with training.',
    'Ja. Contractgegevens kunnen via een afgesproken Excelmodel worden aangeleverd. Bij Professioneel en Enterprise kunnen daarnaast gegevensstromen of koppelingen worden geconfigureerd.': 'Yes. Contract data can be supplied through an agreed Excel template. Professional and Enterprise can also include configured data flows or integrations.',
    'Ja. Opschalen kan wanneer uw contractportefeuille, rapportagebehoefte of integratielandschap groeit. We bekijken vooraf welke bijkomende configuratie of opleiding nodig is.': 'Yes. You can scale up as your portfolio, reporting needs or integration landscape grows. We first determine any additional configuration or training required.',
    'Professioneel bevat één koppeling. Enterprise ondersteunt meerdere koppelingen met onder meer Microsoft Dynamics 365, Business Central, SAP, Adfinity, Jira Service Management en ServiceNow. Andere systemen kunnen via beveiligde gegevensuitwisseling of periodieke import worden aangesloten.': 'Professional includes one integration. Enterprise supports multiple integrations including Microsoft Dynamics 365, Business Central, SAP, Adfinity, Jira Service Management and ServiceNow. Other systems can connect through secure data exchange or scheduled imports.',
    'Tender Insights registreert contractuele normen, meetresultaten en rapportageperiodes. Berekende prestaties kunnen worden vergeleken met leveranciersrapporten. Afwijkingen kunnen rechtstreeks tot een signaal of actie leiden.': 'Tender Insights records contractual targets, measurements and reporting periods. Calculated performance can be compared with supplier reports, and deviations can directly trigger a signal or action.',
    'Elk pakket omvat functionele ondersteuning en productupdates. De reactietijd en begeleidingsvorm verschillen per pakket. Enterprise bevat prioritaire ondersteuning en een vast contactpunt.': 'Every plan includes functional support and product updates. Response time and guidance vary by plan. Enterprise includes priority support and a dedicated contact.',
    'U kunt uw contract- en opvolgingsgegevens exporteren in een bruikbaar formaat. Overdracht, bewaartermijnen en veilige verwijdering worden vooraf duidelijk afgesproken.': 'You can export contract and follow-up data in a usable format. Transfer, retention periods and secure deletion are agreed clearly in advance.'
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
    document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main span, main summary').forEach((element) => {
      if (element.children.length) return;
      const source = element.textContent.trim();
      if (!element.dataset.nlSource) element.dataset.nlSource = source;
      const translated = translations[element.dataset.nlSource];
      if (translated) element.textContent = translated;
    });
  } else {
    document.querySelectorAll('[data-nl-source]').forEach((element) => { element.textContent = element.dataset.nlSource; });
  }
  document.querySelectorAll('.price small').forEach((element) => { element.textContent = siteLanguage === 'fr' ? '/ an' : siteLanguage === 'en' ? '/ year' : '/ jaar'; });
  document.querySelectorAll('.setup').forEach((element) => {
    if (!element.dataset.nlSource) element.dataset.nlSource = element.textContent.trim();
    if (siteLanguage === 'nl') element.textContent = element.dataset.nlSource;
    else element.textContent = element.dataset.nlSource.replace('eenmalige opstart', siteLanguage === 'fr' ? 'démarrage unique' : 'one-time setup');
  });
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
