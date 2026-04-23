/**
 * i18n.js — Internationalization manager
 */

export const translations = {
  en: {
    heroTitle: "Premium Styles for NotebookLM",
    heroSub: "curated YAML prompts for NotebookLM",
    navAll: "All Styles",
    "nav-brand-inspired": "Brand Inspired",
    "nav-minimalist": "Minimalist",
    "nav-creative": "Creative",
    "nav-about": "About",
    favBadge: "Favorites",
    favEmpty: "You haven't saved any styles yet.",
    searchPlaceholder: "Search styles...",
    shareTitle: "Connect & Share",
    copyLink: "Copy Link",
    copied: "Copied!",
    loadMore: "Load More",
    emptyState: "No styles found for this category.",
    sheetTitle: "Style YAML",
    sheetCopy: "Copy YAML",
    faqTitle: "Frequently Asked Questions",
    faqSub: "Everything you need to know about using NotebookLM Styles.",
    footerDesc: "A curated collection of visual design styles to transform your NotebookLM slide generation.",
    footerExplore: "Explore",
    footerProject: "Project",
    footerCredits: "Credits",
    footerAbout: "About the Project",
    footerReport: "Report Issue",
    footerCopy: "Images are generated using NotebookLM's Slide Decks feature.",
    footerText: "Made for the NotebookLM community."
  },
  es: {
    heroTitle: "Estilos Premium para NotebookLM",
    heroSub: "prompts de diseño visual para NotebookLM",
    navAll: "Todos",
    "nav-brand-inspired": "Inspiración de Marca",
    "nav-minimalist": "Minimalistas",
    "nav-creative": "Creativos",
    "nav-about": "Acerca de",
    favBadge: "Favoritos",
    favEmpty: "Aún no has guardado ningún estilo.",
    searchPlaceholder: "Buscar estilos...",
    shareTitle: "Conectar y Compartir",
    copyLink: "Copiar Enlace",
    copied: "¡Copiado!",
    loadMore: "Cargar Más",
    emptyState: "No se encontraron estilos en esta categoría.",
    sheetTitle: "YAML del Estilo",
    sheetCopy: "Copiar YAML",
    faqTitle: "Preguntas Frecuentes",
    faqSub: "Todo lo que necesitas saber sobre el uso de estilos de NotebookLM.",
    footerDesc: "Una colección curada de temas de diseño visual para transformar la generación de diapositivas en NotebookLM.",
    footerExplore: "Explorar",
    footerProject: "Proyecto",
    footerCredits: "Créditos",
    footerAbout: "Acerca del Proyecto",
    footerReport: "Reportar Problema",
    footerCopy: "Las imágenes son generadas usando la función Slide Decks de NotebookLM.",
    footerText: "Creado para la comunidad de NotebookLM."
  },
  pt: {
    heroTitle: "Estilos Premium para NotebookLM",
    heroSub: "prompts de design visual para NotebookLM",
    navAll: "Todos",
    "nav-brand-inspired": "Inspiração de Marca",
    "nav-minimalist": "Minimalistas",
    "nav-creative": "Criativos",
    "nav-about": "Sobre",
    favBadge: "Favoritos",
    favEmpty: "Você ainda não salvou nenhum estilo.",
    searchPlaceholder: "Buscar estilos...",
    shareTitle: "Conectar e Compartilhar",
    copyLink: "Copiar Link",
    copied: "Copiado!",
    loadMore: "Carregar Mais",
    emptyState: "Nenhum estilo encontrado nesta categoria.",
    sheetTitle: "YAML do Estilo",
    sheetCopy: "Copiar YAML",
    faqTitle: "Perguntas Frequentes",
    faqSub: "Tudo o que você precisa saber sobre o uso de estilos do NotebookLM.",
    footerDesc: "Uma coleção selecionada de temas de design visual para transformar a geração de slides no NotebookLM.",
    footerExplore: "Explorar",
    footerProject: "Projeto",
    footerCredits: "Créditos",
    footerAbout: "Sobre o Projeto",
    footerReport: "Reportar Problema",
    footerCopy: "As imagens são geradas usando o recurso Slide Decks do NotebookLM.",
    footerText: "Criado para a comunidade do NotebookLM."
  }
};

let currentLang = localStorage.getItem('preferred-lang') || 'en';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('preferred-lang', lang);
    applyTranslations();
    return true;
  }
  return false;
}

export function t(key) {
  return translations[currentLang][key] || key;
}

export function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    
    if (el.tagName === 'INPUT' && el.placeholder) {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });

  const ariaElements = document.querySelectorAll('[data-i18n-aria]');
  ariaElements.forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const translation = t(key);
    el.setAttribute('aria-label', translation);
  });

  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
}
