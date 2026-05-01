export const RATES = {
  baño: 1100,
  cocina: 1480
};

export const PLAN_MULTIPLIERS = {
  esencial: 1,
  confort: 1.45,
  premium: 1.9
};

export const M2_OPTIONS = [
  { label: 'Menos de 5m²', value: 4 },
  { label: '5-8m²', value: 6 },
  { label: '8-12m²', value: 10 },
  { label: 'Más de 12m²', value: 14 }
];

export const ESTADO_OPTIONS = [
  { id: 'total', label: 'Necesita reforma total', multiplier: 1 },
  { id: 'acabados', label: 'Solo acabados', multiplier: 0.7 },
  { id: 'parcial', label: 'Reforma parcial', multiplier: 0.85 }
];

export const ACCESO_OPTIONS = [
  { id: 'facil', label: 'Fácil acceso (planta baja / ascensor)', extra: 0 },
  { id: 'escaleras', label: 'Escaleras sin ascensor', extra: 0.05 },
  { id: 'complicado', label: 'Acceso complicado', extra: 0.08 }
];

export const PALETTES = {
  baño: {
    esencial: [
      { id: 'b_e_1', name: 'Blanco nórdico', desc: 'Porcelana blanca, mueble roble claro, grifo cromado', colors: ['#F5F0EB', '#C8B89A', '#B0B0B0'] },
      { id: 'b_e_2', name: 'Gris industrial', desc: 'Cemento gris, mueble negro mate, grifo negro', colors: ['#8C8C8C', '#2C2C2C', '#1A1A1A'] },
      { id: 'b_e_3', name: 'Terroso mediterráneo', desc: 'Terracota, mueble madera oscura, grifo dorado', colors: ['#C4662A', '#6B3E26', '#C9A84C'] }
    ],
    premium: [
      { id: 'b_p_1', name: 'Calacatta luxe', desc: 'Mármol blanco veteado, mueble lacado blanco, grifo dorado', colors: ['#F0EDE8', '#E8E0D5', '#C9A84C'] },
      { id: 'b_p_2', name: 'Verde esmeralda', desc: 'Porcelana verde botella, mueble nogal, grifo negro mate', colors: ['#2D5016', '#5C3D1E', '#1A1A1A'] },
      { id: 'b_p_3', name: 'Cemento couture', desc: 'Microcemento gris perla, mueble roble ahumado, grifo cepillado', colors: ['#B8B5AF', '#7A6A5A', '#9E9E9E'] }
    ]
  },
  cocina: {
    esencial: [
      { id: 'c_e_1', name: 'Blanco natural', desc: 'Muebles blancos, encimera laminada gris, tiradores cromo', colors: ['#F5F5F5', '#9E9E9E', '#B0B0B0'] },
      { id: 'c_e_2', name: 'Verde salvia', desc: 'Muebles verde salvia, encimera roble, tiradores latón', colors: ['#7D9E7D', '#C8A96E', '#C9A84C'] },
      { id: 'c_e_3', name: 'Antracita', desc: 'Muebles gris antracita, encimera blanca, tiradores negro', colors: ['#3C3C3C', '#F5F5F5', '#1A1A1A'] }
    ],
    premium: [
      { id: 'c_p_1', name: 'Roble y cuarzo', desc: 'Muebles roble natural, silestone blanco, grifo latón', colors: ['#C8A96E', '#F0EDE8', '#C9A84C'] },
      { id: 'c_p_2', name: 'Negro absoluto', desc: 'Muebles negro mate, cuarzo negro, acero inoxidable', colors: ['#1A1A1A', '#2C2C2C', '#8C8C8C'] },
      { id: 'c_p_3', name: 'Arcilla y lino', desc: 'Muebles arcilla mate, encimera porcelana beige, tiradores cuero', colors: ['#C4855A', '#E8DDD0', '#8B6347'] }
    ]
  }
};
