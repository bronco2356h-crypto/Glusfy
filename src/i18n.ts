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
        step1Title: "¿Qué reformamos?",
        step1Subtitle: "Elige el espacio para empezar.",
        bathroom: "Baño",
        bathroomDesc: "Completo o parcial – azulejos, sanitarios, instalación",
        kitchen: "Cocina",
        kitchenDesc: "Mobiliario, encimera, electrodomésticos y más",
        step2Title: "Cuéntanos tu espacio",
        step2Subtitle: "Necesitamos esto para calcular tu presupuesto.",
        m2Label: "¿Cuántos m² tiene?",
        estadoLabel: "Estado actual",
        accesoLabel: "Acceso a la vivienda",
        step3Title: "Ahora la magia.",
        step3Subtitle: "Sube una foto de tu {{space}} actual – como está, sin ordenar – y la simulación lo transformará delante de tus ojos.",
        dragDrop: "Toca para añadir foto",
        uploadDisclaimer: "Cuanta más luz natural, mejor resultado. No hace falta que esté ordenado.",
        step4Title: "¿Cómo lo imaginas?",
        step4Subtitle: "Elige el ambiente que más te gusta. La simulación aplicará estos materiales y colores a la foto real de tu {{space}}.",
        generateBtn: "Generar mi simulación",
        step5Title: "Diseñando tu nuevo espacio",
        generatingText: "Estamos creando tu simulación personalizada...",
        step6Title: "Así quedará tu {{space}}.",
        wowTitle: "Esto no es un catálogo. Es tu espacio, transformado.",
        wowDesc: "Nuestra tecnología ha aplicado tu paleta elegida sobre la foto real de tu {{space}}. Lo que ves es lo que haremos — con precio cerrado y fecha garantizada.",
        wantThisResult: "Quiero este resultado →",
        viewPrices: "Ver precios directamente",
        step7Title: "¿Por qué Glusfy?",
        benefits: {
          time: "3-4 sem. duración media",
          price: "100% precio cerrado",
          rating: "4.9★ satisfacción"
        },
        step8Title: "Elige tu plan",
        confort: "Confort",
        step9Title: "Último paso",
        step9Subtitle: "Déjanos tu contacto para enviarte el presupuesto detallado y reservar tu visita técnica gratuita.",
        fullName: "Nombre completo",
        phone: "Teléfono",
        sendRequest: "Enviar solicitud",
        successTitle: "¡Solicitud recibida!",
        successSubtitle: "Un asesor técnico te contactará en menos de 24h para confirmar los detalles.",
        fromMonthly: "desde {{price}}€/mes",
        legalNote: "La imagen es una simulación orientativa. Los acabados finales se confirman en la visita técnica."
      },
      catalog: {
        configureThis: "Configurar este espacio",
        includes: "Qué incluye",
        notIncludes: "Qué no incluye"
      },
      guarantees: {
        fixedPriceTitle: "Precio cerrado",
        fixedPriceDesc: "Lo que presupuestamos es lo que pagas. Sin letra pequeña ni costes ocultos.",
        guaranteedDateTitle: "Fecha garantizada",
        guaranteedDateDesc: "Te damos una fecha de inicio y entrega y la cumplimos. Si hay cualquier imprevisto, te avisamos con antelación.",
        aiRenderTitle: "Vista previa real",
        aiRenderDesc: "Ves el resultado final antes de empezar. Sin comprometerte a nada.",
        warrantyTitle: "Garantía 2 años",
        warrantyDesc: "Toda nuestra obra tiene garantía de 2 años sobre mano de obra y materiales. Si algo falla por nuestra ejecución, volvemos sin coste adicional."
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
