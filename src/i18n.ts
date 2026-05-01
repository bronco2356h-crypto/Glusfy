import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      header: {
        startFree: "Empieza gratis"
      },
      hero: {
        title: "Tu reforma. Antes de empezar, ya la verás.",
        subtitle: "Diseña tu baño o cocina, visualiza el resultado al instante, y paga a plazos desde 275€/mes.",
        cta: "Ver cómo quedaría"
      },
      howItWorks: {
        title: "Cómo funciona",
        step1: "Sube una foto de tu espacio",
        step2: "Elige tu estilo",
        step3: "Visualiza el resultado",
        step4: "Paga y reservamos fecha"
      },
      configurator: {
        step1Title: "Elige tu espacio",
        bathroom: "Baño",
        kitchen: "Cocina",
        step2Title: "Elige tu nivel",
        essential: "Esencial",
        premium: "Premium",
        mostChosen: "Más elegido",
        fromMonthly: "desde {{price}}€/mes",
        priceDisclaimer: "Precio cerrado. Sin sorpresas. Financiación a 36 meses sujeta a aprobación.",
        step3Title: "Sube tu foto",
        dragDrop: "Arrastra tu foto aquí o haz clic para seleccionar",
        uploadDisclaimer: "Usaremos esta foto para mostrarte el resultado real de tu reforma.",
        step4Title: "Elige tu paleta",
        step5Title: "Diseñando tu nuevo espacio",
        generatingText: "Estamos creando tu simulación personalizada...",
        step6Title: "Tu nueva realidad",
        payAndBook: "Pagar y reservar fecha",
        bookVisitFirst: "Reservar visita gratuita primero",
        legalNote: "La imagen es una simulación orientativa. Los acabados finales se confirman en la visita técnica.",
        estimatedStart: "Podríamos empezar el {{date}}"
      },
      catalog: {
        configureThis: "Configurar este espacio",
        includes: "Qué incluye",
        notIncludes: "Qué no incluye"
      },
      guarantees: {
        fixedPriceTitle: "Precio cerrado",
        fixedPriceDesc: "Lo que presupuestamos es lo que pagas. Sin letra pequeña.",
        guaranteedDateTitle: "Fecha garantizada",
        guaranteedDateDesc: "Entregamos en el plazo acordado o te descontamos 150€/día de retraso.",
        aiRenderTitle: "Vista previa real",
        aiRenderDesc: "Ves el resultado final antes de empezar. Sin comprometerte a nada."
      },
      footer: {
        legal: "Aviso legal",
        privacy: "Política de privacidad",
        cookies: "Política de cookies",
        rights: "© 2025 Glusfy. Todos los derechos reservados."
      }
    }
  },
  ca: {
    translation: {
      header: {
        startFree: "Comença gratis"
      },
      hero: {
        title: "La teva reforma. Abans de començar, ja la veuràs.",
        subtitle: "Dissenya el teu bany o cuina, visualitza el resultat a l'instant, i paga a terminis des de 275€/mes.",
        cta: "Veure com quedaria"
      },
      howItWorks: {
        title: "Com funciona",
        step1: "Puja una foto del teu espai",
        step2: "Tria el teu estil",
        step3: "Visualitza el resultat",
        step4: "Paga i reservem data"
      },
      configurator: {
        step1Title: "Tria el teu espai",
        bathroom: "Bany",
        kitchen: "Cuina",
        step2Title: "Tria el teu nivell",
        essential: "Essencial",
        premium: "Premium",
        mostChosen: "Més triat",
        fromMonthly: "des de {{price}}€/mes",
        priceDisclaimer: "Preu tancat. Sense sorpreses. Finançament a 36 mesos subjecte a aprovació.",
        step3Title: "Puja la teva foto",
        dragDrop: "Arrossega la teva foto aquí o fes clic per seleccionar",
        uploadDisclaimer: "Utilitzarem aquesta foto per mostrar-te el resultat real de la teva reforma.",
        step4Title: "Tria la teva paleta",
        step5Title: "Dissenyant el teu nou espai",
        generatingText: "Estem creant la teva simulació personalitzada...",
        step6Title: "La teva nova realitat",
        payAndBook: "Pagar i reservar data",
        bookVisitFirst: "Reservar visita gratuïta primer",
        legalNote: "La imatge és una simulació orientativa. Els acabats finals es confirmen a la visita tècnica.",
        estimatedStart: "Podríem començar el {{date}}"
      },
      catalog: {
        configureThis: "Configurar aquest espai",
        includes: "Què inclou",
        notIncludes: "Què no inclou"
      },
      guarantees: {
        fixedPriceTitle: "Preu tancat",
        fixedPriceDesc: "El que pressupostem és el que pagues. Sense lletra petita.",
        guaranteedDateTitle: "Data garantida",
        guaranteedDateDesc: "Lliurem en el termini acordat o et descomptem 150€/dia de retard.",
        aiRenderTitle: "Vista prèvia real",
        aiRenderDesc: "Veus el resultat final abans de començar. Sense comprometre't a res."
      },
      footer: {
        legal: "Avís legal",
        privacy: "Política de privacitat",
        cookies: "Política de cookies",
        rights: "© 2025 Glusfy. Tots els drets reservats."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // default language
    fallbackLng: "es",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
