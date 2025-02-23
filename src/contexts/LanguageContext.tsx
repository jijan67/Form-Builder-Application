import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es'; // Add more languages as needed

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.templates': 'Templates',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.search': 'Search templates',

    // Home page
    'home.latestTemplates': 'Latest Templates',
    'home.popularTemplates': 'Popular Templates',
    'home.popularTags': 'Popular Tags',

    // Template
    'template.settings': 'Settings',
    'template.questions': 'Questions',
    'template.results': 'Results',
    'template.analytics': 'Analytics',
    'template.title': 'Title',
    'template.description': 'Description',
    'template.topic': 'Topic',
    'template.tags': 'Tags',
    'template.author': 'Author',
    'template.responses': 'Responses',
    'template.by': 'by',
    'template.public': 'Public Template',
    'template.allowedUsers': 'Allowed Users',
    'template.create': 'Create Template',
    'template.edit': 'Edit Template',
    'template.save': 'Save Template',
    'template.confirmDelete': 'Delete Template',
    'template.notFound': 'Template Not Found',
    'template.noAccess': 'No Access to Template',
    'template.actions': 'Actions',
    'template.created': 'Created',

    // Questions
    'question.title': 'Question Title',
    'question.description': 'Question Description',
    'question.type': 'Question Type',
    'question.showInResults': 'Show in Results',
    'question.addText': 'Add Text Question',
    'question.addMultiLine': 'Add Multi-line Question',
    'question.addInteger': 'Add Number Question',
    'question.addCheckbox': 'Add Checkbox Question',
    'question.remove': 'Remove Question',

    // Forms
    'form.submit': 'Submit',
    'form.update': 'Update',
    'form.sendCopy': 'Send me a copy of my responses',

    // Search
    'search.resultsFor': 'Search Results for',
    'search.resultsForTag': 'Templates Tagged',
    'search.noResults': 'No Results Found',

    // Profile
    'profile.myTemplates': 'My Templates',
    'profile.myResponses': 'My Responses',

    // Admin
    'admin.userManagement': 'User Management',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.isAdmin': 'Admin',
    'admin.isBlocked': 'Blocked',
    'admin.actions': 'Actions',
    'admin.lastAdmin': 'Cannot remove admin rights from last administrator',
    'admin.cantBlockLastAdmin': 'Cannot block last administrator',
    'admin.cantDeleteLastAdmin': 'Cannot delete last administrator',
    'admin.confirmDelete': 'Confirm Delete',
    'admin.deleteWarning': 'Are you sure you want to delete {name}?',

    // Common
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.save': 'Save',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.templates': 'Plantillas',
    'nav.profile': 'Perfil',
    'nav.admin': 'Admin',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.search': 'Buscar plantillas',

    // Home page
    'home.latestTemplates': 'Últimas Plantillas',
    'home.popularTemplates': 'Plantillas Populares',
    'home.popularTags': 'Etiquetas Populares',

    // Template
    'template.settings': 'Configuración',
    'template.questions': 'Preguntas',
    'template.results': 'Resultados',
    'template.analytics': 'Análisis',
    'template.title': 'Título',
    'template.description': 'Descripción',
    'template.topic': 'Tema',
    'template.tags': 'Etiquetas',
    'template.author': 'Autor',
    'template.responses': 'Respuestas',
    'template.by': 'por',
    'template.public': 'Plantilla Pública',
    'template.allowedUsers': 'Usuarios Permitidos',
    'template.create': 'Crear Plantilla',
    'template.edit': 'Editar Plantilla',
    'template.save': 'Guardar Plantilla',
    'template.confirmDelete': 'Eliminar Plantilla',
    'template.notFound': 'Plantilla No Encontrada',
    'template.noAccess': 'No Tienes Acceso a Esta Plantilla',
    'template.actions': 'Acciones',
    'template.created': 'Creado',

    // Questions
    'question.title': 'Título de la Pregunta',
    'question.description': 'Descripción de la Pregunta',
    'question.type': 'Tipo de Pregunta',
    'question.showInResults': 'Mostrar en Resultados',
    'question.addText': 'Agregar Pregunta de Texto',
    'question.addMultiLine': 'Agregar Pregunta de Múltiples Líneas',
    'question.addInteger': 'Agregar Pregunta de Número',
    'question.addCheckbox': 'Agregar Pregunta de Casilla de Verificación',
    'question.remove': 'Eliminar Pregunta',

    // Forms
    'form.submit': 'Enviar',
    'form.update': 'Actualizar',
    'form.sendCopy': 'Envíame una copia de mis respuestas',

    // Search
    'search.resultsFor': 'Resultados de Búsqueda para',
    'search.resultsForTag': 'Plantillas Etiquetadas',
    'search.noResults': 'No se encontraron Resultados',

    // Profile
    'profile.myTemplates': 'Mis Plantillas',
    'profile.myResponses': 'Mis Respuestas',

    // Admin
    'admin.userManagement': 'Gestión de Usuarios',
    'admin.name': 'Nombre',
    'admin.email': 'Correo',
    'admin.isAdmin': 'Admin',
    'admin.isBlocked': 'Bloqueado',
    'admin.actions': 'Acciones',
    'admin.lastAdmin': 'No se pueden quitar los derechos de administrador del último administrador',
    'admin.cantBlockLastAdmin': 'No se puede bloquear al último administrador',
    'admin.cantDeleteLastAdmin': 'No se puede eliminar al último administrador',
    'admin.confirmDelete': 'Confirmar Eliminación',
    'admin.deleteWarning': '¿Está seguro de que desea eliminar a {name}?',

    // Common
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.save': 'Guardar',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, any>): string => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, String(value));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 