export const TRAMOS_PRECIOS = {
  pequeno: 2800,
  mediano: 4500,
  grande: 7500,
  xl: 12000
};

export const ALCANCE_MULTIPLIERS = {
  completa: 2.0, // +100%
  parcial: 1.6,  // +60%
  acabados: 1.3   // +30%
};

export const CALIDAD_MULTIPLIERS = {
  basico: 1.0,
  estandar: 1.4,
  premium: 2.0
};

export const ACCESO_OPTIONS = [
  { id: 'facil', label: 'Fácil (ascensor o planta baja)', multiplier: 1.0 },
  { id: 'escaleras', label: 'Escaleras sin ascensor', multiplier: 1.1 },
  { id: 'complicado', label: 'Acceso complicado', multiplier: 1.2 }
];

export const ESTILOS = [
  { 
    id: 'moderno', 
    name: 'Moderno', 
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=1000&auto=format&fit=crop',
    desc: 'Líneas limpias y minimalismo'
  },
  { 
    id: 'nordico', 
    name: 'Nórdico', 
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
    desc: 'Funcionalidad, luz y madera clara'
  },
  { 
    id: 'mediterraneo', 
    name: 'Mediterráneo', 
    image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=1000&auto=format&fit=crop',
    desc: 'Calidez, texturas y tonos tierra'
  },
  { 
    id: 'industrial', 
    name: 'Industrial', 
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1000&auto=format&fit=crop',
    desc: 'Metal, ladrillo y carácter'
  },
  { 
    id: 'clasico', 
    name: 'Clásico', 
    image: 'https://images.unsplash.com/photo-1556909212-d5b6043bc624?q=80&w=1000&auto=format&fit=crop',
    desc: 'Elegancia atemporal y detalles'
  }
];

export const CALIDADES = [
  { 
    id: 'basico', 
    name: 'Básico', 
    desc: 'Materiales funcionales, buena relación calidad-precio',
    multiplier: 1.0 
  },
  { 
    id: 'estandar', 
    name: 'Estándar', 
    desc: 'Acabados de calidad media-alta, los más solicitados',
    multiplier: 1.4 
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    desc: 'Materiales de alta gama, marcas reconocidas',
    multiplier: 2.0 
  }
];

export const EXTRAS_FIJOS = {
  residuos: 250,
  licencia: 400
};
