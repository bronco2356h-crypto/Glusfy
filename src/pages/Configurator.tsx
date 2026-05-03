import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  Truck,
  Info
} from 'lucide-react';
import {
  TRAMOS_PRECIOS,
  ALCANCE_MULTIPLIERS,
  CALIDAD_MULTIPLIERS,
  ACCESO_OPTIONS,
  ESTILOS,
  CALIDADES,
  EXTRAS_FIJOS
} from '../lib/constants';
import { saveLead } from '../lib/firebase';

type ConfigState = {
  codigoPostal: string;
  espacio: 'cocina' | 'bano' | 'ambos' | null;
  largo: number;
  ancho: number;
  alto: number;
  forma: 'rectangular' | 'irregular' | null;
  fotoUrl: string | null;
  alcance: 'completa' | 'parcial' | 'acabados' | null;
  antiguedad: string;
  humedades: boolean;
  demolidos: boolean;
  enUso: boolean;
  tipoAcceso: string;
  cargaDescarga: boolean;
  planta: number;
  urgencia: string;
  estilo: string | null;
  calidad: string | null;
  renderUrl: string | null;
  nombre: string;
  telefono: string;
};

const ESPACIO_LABEL: Record<string, string> = {
  cocina: 'cocina',
  bano: 'baño',
  ambos: 'espacio',
};

const STEP_MOOD: Record<number, string> = {
  0: 'Empezamos — menos de 3 minutos.',
  1: 'Paso 1 — Rápido y sin compromiso.',
  2: 'Paso 2 — Lo más técnico, ya casi está.',
  3: 'Paso 3 — Vas bien.',
  4: 'Paso 4 — Vas a la mitad. Sigues genial.',
  5: 'Paso 5 — Casi terminamos.',
  6: 'Paso 6 — Aquí viene lo divertido.',
  7: 'Último paso — Mira cómo queda.',
};

export default function Configurator() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<ConfigState>({
    codigoPostal: '',
    espacio: null,
    largo: 4,
    ancho: 3,
    alto: 2.5,
    forma: 'rectangular',
    fotoUrl: null,
    alcance: null,
    antiguedad: '5-15',
    humedades: false,
    demolidos: false,
    enUso: true,
    tipoAcceso: 'facil',
    cargaDescarga: true,
    planta: 0,
    urgencia: 'flexible',
    estilo: null,
    calidad: null,
    renderUrl: null,
    nombre: '',
    telefono: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const espacioLabel = config.espacio ? ESPACIO_LABEL[config.espacio] : 'espacio';

  const prices = useMemo(() => {
    const area = config.largo * config.ancho;
    let tramoBase = TRAMOS_PRECIOS.pequeno;
    if (area >= 8 && area < 15) tramoBase = TRAMOS_PRECIOS.mediano;
    else if (area >= 15 && area < 25) tramoBase = TRAMOS_PRECIOS.grande;
    else if (area >= 25) tramoBase = TRAMOS_PRECIOS.xl;

    const multAlcance = config.alcance ? ALCANCE_MULTIPLIERS[config.alcance] : 1;
    const multCalidad = config.calidad ? CALIDAD_MULTIPLIERS[config.calidad as keyof typeof CALIDAD_MULTIPLIERS] : 1;
    const accesoObj = ACCESO_OPTIONS.find(o => o.id === config.tipoAcceso);
    const multAcceso = (accesoObj?.multiplier || 1) + (config.planta > 1 && config.tipoAcceso === 'escaleras' ? (config.planta - 1) * 0.05 : 0);
    const multEstado = config.humedades ? 1.15 : 1;
    const multUrgencia = config.urgencia === 'urgente' ? 1.15 : 1;

    let subtotal = tramoBase * multAlcance * multCalidad * multAcceso * multEstado * multUrgencia;
    if (config.espacio === 'ambos') subtotal *= 1.8;

    const total = subtotal + EXTRAS_FIJOS.residuos + EXTRAS_FIJOS.licencia;
    const round = (n: number) => Math.round(n / 50) * 50;

    const area2 = config.largo * config.ancho;
    let categoria = 'Pequeño';
    let categoriaColor = 'bg-blue-100 text-blue-700';
    if (area2 >= 8 && area2 < 15) { categoria = 'Mediano'; categoriaColor = 'bg-green-100 text-green-700'; }
    else if (area2 >= 15 && area2 < 25) { categoria = 'Grande'; categoriaColor = 'bg-orange-100 text-orange-700'; }
    else if (area2 >= 25) { categoria = 'XL'; categoriaColor = 'bg-purple-100 text-purple-700'; }

    return {
      total: round(total),
      area: Math.round(area2 * 10) / 10,
      categoria,
      categoriaColor
    };
  }, [config]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setConfig(c => ({ ...c, fotoUrl: url }));
      nextStep();
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(res => setTimeout(res, 4000));
    const mockImages: Record<string, string> = {
      moderno: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=1200&auto=format&fit=crop',
      nordico: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
      mediterraneo: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=1200&auto=format&fit=crop',
      industrial: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1200&auto=format&fit=crop',
      clasico: 'https://images.unsplash.com/photo-1556909212-d5b6043bc624?q=80&w=1200&auto=format&fit=crop'
    };
    setConfig(c => ({ ...c, renderUrl: mockImages[c.estilo || 'moderno'] }));
    setIsGenerating(false);
    nextStep();
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveLead({
        nombre: config.nombre,
        email: `${config.telefono}@glusfy-customer.com`,
        telefono: config.telefono,
        espacio: (config.espacio === 'ambos' || config.espacio === 'cocina') ? 'cocina' : 'baño',
        nivel: config.calidad === 'premium' ? 'premium' : 'esencial',
        paletaElegida: config.estilo || 'default',
        url_foto_subida: config.fotoUrl || '',
        url_render_generado: config.renderUrl || '',
        precio_total: prices.total
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Live room preview dimensions
  const previewW = Math.min(200, config.largo * 16);
  const previewH = Math.min(140, config.ancho * 16);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-brand-dark">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-brand-bg sticky top-0 z-50">
        <div className="h-full bg-brand-accent transition-all duration-500" style={{ width: `${(step / 8) * 100}%` }} />
      </div>

      <div className="flex-grow flex flex-col items-center p-4 w-full max-w-4xl mx-auto relative pt-12">
        {step > 0 && !isGenerating && !isSubmitted && (
          <button onClick={prevStep} className="absolute top-4 left-4 p-2 text-brand-muted hover:text-brand-dark transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">

          {/* PASO 0: UBICACIÓN */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center max-w-md">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm">{STEP_MOOD[0]}</div>
              <h2 className="text-4xl font-display font-bold mb-3">¿Dónde es la reforma?</h2>
              <p className="text-brand-muted mb-10">
                Usamos tu código postal para calcular costes de materiales y mano de obra en tu zona.
              </p>
              <div className="relative mb-6">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent w-6 h-6" />
                <input
                  type="text"
                  placeholder="Ej: 08001"
                  maxLength={5}
                  className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-2xl font-bold transition-all"
                  value={config.codigoPostal}
                  onChange={e => setConfig({ ...config, codigoPostal: e.target.value.replace(/\D/g, '') })}
                />
              </div>
              <button
                onClick={nextStep}
                disabled={config.codigoPostal.length < 5}
                className={`w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-xl ${config.codigoPostal.length === 5 ? 'bg-brand-accent text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Empezar Configuración
              </button>
              <p className="text-xs text-brand-muted mt-4">Sin registro. Sin compromiso. Gratis.</p>
            </motion.div>
          )}

          {/* PASO 1: ESPACIO */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm">{STEP_MOOD[1]}</div>
              <h2 className="text-4xl font-display font-bold mb-3">{t('configurator.step1Title')}</h2>
              <p className="text-brand-muted mb-10">
                {t('configurator.step1Subtitle')}
                <span className="block text-xs mt-1">Puedes cambiar tu selección en cualquier momento.</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { id: 'bano', label: t('configurator.bathroom'), icon: '🛁', desc: t('configurator.bathroomDesc') },
                  { id: 'cocina', label: t('configurator.kitchen'), icon: '🍳', desc: t('configurator.kitchenDesc') },
                  { id: 'ambos', label: 'Cocina + Baño', icon: '✨', desc: 'Reforma integral — ahorra combinando' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setConfig({ ...config, espacio: opt.id as ConfigState['espacio'] }); nextStep(); }}
                    className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${config.espacio === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-2xl">{opt.icon}</div>
                    <div>
                      <div className="text-2xl font-bold">{opt.label}</div>
                      <div className="text-brand-muted text-sm leading-tight">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 2: MEDIDAS */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-2xl">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm text-center">{STEP_MOOD[2]}</div>

              <div className="flex flex-col items-center mb-8">
                <div className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  {config.espacio === 'cocina' ? '🍳 Cocina' : config.espacio === 'bano' ? '🛁 Baño' : '✨ Cocina + Baño'}
                </div>
                <h2 className="text-4xl font-display font-bold mb-2 text-center">Danos las medidas</h2>
                <p className="text-brand-muted text-center text-balance max-w-lg text-sm">
                  Calculamos cuánto material y trabajo necesitamos según las dimensiones reales.
                  No te preocupes por la precisión exacta — el técnico lo confirmará en la visita.
                </p>
              </div>

              <div className="space-y-10">
                {/* Sliders + live preview */}
                <div className="bg-brand-bg rounded-3xl border border-brand-border p-6 space-y-6">
                  <RangeInput
                    label="Largo (m)"
                    value={config.largo}
                    min={1} max={15} step={0.5}
                    hint="Una cocina típica mide entre 3 y 5 m. Una cama doble mide 2 m."
                    onChange={(v: number) => setConfig({ ...config, largo: v })}
                  />
                  <RangeInput
                    label="Ancho (m)"
                    value={config.ancho}
                    min={1} max={10} step={0.5}
                    hint="El paso cómodo entre muebles es 1,2 m. Una puerta estándar mide 0,9 m."
                    onChange={(v: number) => setConfig({ ...config, ancho: v })}
                  />
                  <RangeInput
                    label="Alto (m)"
                    value={config.alto}
                    min={2} max={4} step={0.1}
                    hint="Lo estándar son 2,5 m. Pisos anteriores a 1980 suelen tener 2,8–3 m."
                    onChange={(v: number) => setConfig({ ...config, alto: v })}
                  />

                  {/* Live room preview */}
                  <div className="flex flex-col items-center gap-3 pt-2 border-t border-brand-border">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">Vista de planta (aproximada)</span>
                    <div className="flex items-end justify-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          width={Math.max(previewW, 60)}
                          height={Math.max(previewH, 40)}
                          className="transition-all duration-300"
                        >
                          <rect
                            x="2" y="2"
                            width={Math.max(previewW - 4, 56)}
                            height={Math.max(previewH - 4, 36)}
                            rx="4"
                            fill="#FEF3ED"
                            stroke="#C4622D"
                            strokeWidth="2"
                          />
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#C4622D" fontWeight="bold">
                            {prices.area} m²
                          </text>
                        </svg>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${prices.categoriaColor}`}>
                        Categoría {prices.categoria}
                        {prices.categoria === 'Mediano' && ' — lo más habitual'}
                        {prices.categoria === 'Pequeño' && ' — compacto y eficiente'}
                        {prices.categoria === 'Grande' && ' — amplio, valoramos bien'}
                        {prices.categoria === 'XL' && ' — espacio excepcional'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forma */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <label className="block text-sm font-bold uppercase tracking-widest text-brand-muted">Forma del espacio</label>
                    <Tooltip text="La forma afecta al coste de instalación y el número de cortes de material." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setConfig({ ...config, forma: 'rectangular' })}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${config.forma === 'rectangular' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' : 'border-brand-border bg-white hover:border-brand-accent/30 text-brand-muted'}`}
                    >
                      <svg viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-7">
                        <rect x="2" y="2" width="36" height="24" rx="2" />
                      </svg>
                      <div className="text-center">
                        <div className="font-bold">Rectangular</div>
                        <div className="text-xs opacity-70 mt-0.5">Las cuatro paredes forman un rectángulo</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, forma: 'irregular' })}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${config.forma === 'irregular' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' : 'border-brand-border bg-white hover:border-brand-accent/30 text-brand-muted'}`}
                    >
                      <svg viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-7">
                        <path d="M2 2h20v12h16v12H2z" />
                      </svg>
                      <div className="text-center">
                        <div className="font-bold">Forma L o U</div>
                        <div className="text-xs opacity-70 mt-0.5">Hay un saliente, columna o forma irregular</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Foto */}
                <div className="pt-2">
                  <div className="flex flex-col mb-4">
                    <label className="block text-sm font-bold uppercase tracking-widest text-brand-muted">📷 Una foto = presupuesto más exacto</label>
                    <p className="text-xs text-brand-muted mt-1">
                      Opcional, pero recomendado — solo tarda 5 segundos. Cualquier foto vale, no tiene que ser profesional.
                    </p>
                  </div>
                  <div {...getRootProps()} className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${config.fotoUrl ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-brand-bg hover:border-brand-accent/50'}`}>
                    <input {...getInputProps()} />
                    {config.fotoUrl ? (
                      <div className="flex items-center gap-4">
                        <img src={config.fotoUrl} className="w-20 h-20 object-cover rounded-lg" />
                        <span className="text-brand-accent font-bold">¡Foto cargada! Toca para cambiar</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <UploadCloud className="w-10 h-10 text-brand-muted mb-2 mx-auto" />
                        <p className="font-bold">Sube una foto de tu {espacioLabel}</p>
                        <p className="text-xs text-brand-muted mt-1">JPG, PNG o HEIC · máx. 10 MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={nextStep} className="w-full mt-10 bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                Continuar
              </button>
              <p className="text-xs text-center text-brand-muted mt-3">Las medidas son aproximadas — el técnico las ajustará en la visita.</p>
            </motion.div>
          )}

          {/* PASO 3: ALCANCE */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center max-w-4xl">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm">{STEP_MOOD[3]}</div>
              <h2 className="text-4xl font-display font-bold mb-3">¿Hasta dónde quieres llegar?</h2>
              <p className="text-brand-muted mb-10 max-w-xl mx-auto text-sm">
                Esto ajusta el alcance del trabajo y el presupuesto.
                Si no tienes claro, el técnico puede ayudarte a decidir en la visita gratuita.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  {
                    id: 'completa',
                    label: 'Reforma Completa',
                    desc: 'Todo desde cero: distribución, fontanería, electricidad y acabados.',
                    icon: '🏗️',
                    tooltip: 'Incluye picar paredes, rehacer toda la fontanería y el cableado, nueva distribución de espacios y todos los acabados.',
                    social: 'El 68% la elige para reformas de más de 10 años'
                  },
                  {
                    id: 'parcial',
                    label: 'Reforma Parcial',
                    desc: 'Cambias piezas clave manteniendo parte de lo que ya tienes.',
                    icon: '🛠️',
                    tooltip: 'Por ejemplo: muebles nuevos y suelo nuevo pero conservas tuberías y electricidad existentes.',
                    social: ''
                  },
                  {
                    id: 'acabados',
                    label: 'Solo Acabados',
                    desc: 'Pintura, azulejos o revestimientos sin tocar instalaciones.',
                    icon: '🎨',
                    tooltip: 'Ideal si las instalaciones están en buen estado y solo quieres renovar la estética.',
                    social: ''
                  }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setConfig({ ...config, alcance: opt.id as ConfigState['alcance'] }); nextStep(); }}
                    className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 relative ${config.alcance === opt.id ? 'border-brand-accent bg-brand-accent/5 shadow-md' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{opt.icon}</div>
                      <Tooltip text={opt.tooltip} />
                    </div>
                    <div>
                      <div className="text-xl font-bold mb-1">{opt.label}</div>
                      <div className="text-sm text-brand-muted leading-tight">{opt.desc}</div>
                    </div>
                    {opt.social && (
                      <div className="text-[10px] text-brand-accent font-bold bg-orange-50 px-2 py-1 rounded-full self-start">{opt.social}</div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 4: ESTADO ACTUAL */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-2xl">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm text-center">{STEP_MOOD[4]}</div>
              <h2 className="text-4xl font-display font-bold mb-3 text-center">Cuéntanos cómo está ahora</h2>
              <p className="text-brand-muted mb-10 text-center text-sm">
                Queremos conocer tu caso real para no darte sorpresas en el precio.
                Todo lo que dices aquí es confidencial y solo lo ve tu técnico.
              </p>

              <div className="space-y-6">
                <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border space-y-8">
                  <ToggleRow
                    label="¿Hay humedades visibles?"
                    sublabel="Manchas en techo, paredes o suelo"
                    active={config.humedades}
                    onClick={() => setConfig({ ...config, humedades: !config.humedades })}
                  />
                  <ToggleRow
                    label="¿Hay elementos ya demolidos?"
                    sublabel="Si ya empezaste a quitar cosas"
                    active={config.demolidos}
                    onClick={() => setConfig({ ...config, demolidos: !config.demolidos })}
                  />
                  <ToggleRow
                    label="¿El espacio estará en uso durante la reforma?"
                    sublabel="Afecta al ritmo de trabajo del equipo"
                    active={config.enUso}
                    onClick={() => setConfig({ ...config, enUso: !config.enUso })}
                  />

                  <div className="pt-4 border-t border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="block text-sm font-bold uppercase tracking-widest text-brand-muted">¿Cuándo fue la última reforma?</label>
                      <Tooltip text="Las instalaciones antiguas pueden necesitar actualización aunque no lo parezca a simple vista." />
                    </div>
                    <p className="text-xs text-brand-muted mb-4">Cuenta la antigüedad del {espacioLabel} que vas a reformar.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { val: '0-5', label: '0–5 años' },
                        { val: '5-15', label: '5–15 años' },
                        { val: '+15', label: 'Más de 15' },
                        { val: 'Nunca', label: 'Primera vez' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setConfig({ ...config, antiguedad: opt.val })}
                          className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${config.antiguedad === opt.val ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Validación - Humedades */}
                {config.humedades && config.alcance === 'acabados' && (
                  <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl flex gap-4">
                    <AlertTriangle className="w-10 h-10 text-red-600 shrink-0" />
                    <div>
                      <p className="font-bold text-red-900">Aviso de seguridad</p>
                      <p className="text-sm text-red-800">Con humedades activas, pintar por encima no soluciona el problema — lo oculta. Te recomendamos una reforma parcial para sanear primero.</p>
                      <button onClick={() => setConfig({ ...config, alcance: 'parcial' })} className="mt-2 text-sm font-bold text-red-600 underline hover:no-underline">Cambiar a Reforma Parcial</button>
                    </div>
                  </div>
                )}

                {/* Validación - Antigüedad */}
                {config.antiguedad === '+15' && config.alcance === 'acabados' && (
                  <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-2xl flex gap-4">
                    <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold text-amber-900">Recomendación técnica</p>
                      <p className="text-sm text-amber-800">Con más de 15 años, las tuberías y el cableado pueden estar al límite. Pintar encima y que falle la instalación después sale más caro que revisarlo ahora.</p>
                      <button onClick={() => setConfig({ ...config, alcance: 'parcial' })} className="mt-2 text-sm font-bold text-amber-600 underline hover:no-underline">Ver Reforma Parcial (Instalaciones)</button>
                    </div>
                  </div>
                )}

                <button onClick={nextStep} className="w-full bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {/* PASO 5: ACCESO */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-2xl">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm text-center">{STEP_MOOD[5]}</div>
              <h2 className="text-4xl font-display font-bold mb-3 text-center">¿Cómo llegamos a tu casa?</h2>
              <p className="text-brand-muted mb-10 text-center text-sm">
                El acceso al edificio afecta al tiempo de obra y al coste de transporte de materiales.
              </p>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ACCESO_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setConfig({ ...config, tipoAcceso: opt.id })}
                      className={`p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 ${config.tipoAcceso === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                    >
                      <Truck className={`w-8 h-8 ${config.tipoAcceso === opt.id ? 'text-brand-accent' : 'text-brand-muted'}`} />
                      <span className="font-bold text-sm leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border space-y-8">
                  <ToggleRow
                    label="¿Hay zona de carga y descarga cerca?"
                    sublabel="En la puerta o a menos de 50 metros"
                    active={config.cargaDescarga}
                    onClick={() => setConfig({ ...config, cargaDescarga: !config.cargaDescarga })}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Planta de la vivienda</p>
                      <p className="text-xs text-brand-muted">0 = Planta baja</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      className="w-20 p-3 rounded-xl border-2 border-brand-border text-center font-bold"
                      value={config.planta}
                      onChange={e => setConfig({ ...config, planta: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4 justify-center">
                    <label className="block text-sm font-bold uppercase tracking-widest text-brand-muted">¿Cuándo necesitas empezar?</label>
                    <Tooltip text="Si tienes urgencia lo tenemos en cuenta para la planificación del equipo. Puede afectar levemente al precio." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setConfig({ ...config, urgencia: 'urgente' })} className={`p-4 rounded-xl border-2 transition-all font-bold ${config.urgencia === 'urgente' ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border bg-white'}`}>
                      Lo antes posible
                    </button>
                    <button onClick={() => setConfig({ ...config, urgencia: 'flexible' })} className={`p-4 rounded-xl border-2 transition-all font-bold ${config.urgencia === 'flexible' ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border bg-white'}`}>
                      Soy flexible
                    </button>
                  </div>
                </div>

                <button onClick={nextStep} className="w-full bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {/* PASO 6: MATERIALES */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center max-w-5xl">
              <div className="mb-3 text-brand-accent font-bold tracking-widest text-sm">{STEP_MOOD[6]}</div>
              <h2 className="text-4xl font-display font-bold mb-3">Elige tu estilo y materiales</h2>
              <p className="text-brand-muted mb-10 text-sm">
                En un momento generamos una simulación realista con el estilo que elijas aplicado a tu espacio.
              </p>

              <div className="space-y-12">
                <div>
                  <label className="block text-sm font-bold mb-6 uppercase tracking-widest text-brand-muted">1. ¿Qué estilo te inspira?</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {ESTILOS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setConfig({ ...config, estilo: opt.id })}
                        className={`group relative aspect-[4/5] rounded-2xl overflow-hidden border-4 transition-all ${config.estilo === opt.id ? 'border-brand-accent scale-105 shadow-lg' : 'border-transparent hover:border-brand-accent/30'}`}
                      >
                        <img src={opt.image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" alt={opt.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white text-left">
                          <div className="font-bold text-sm">{opt.name}</div>
                          <div className="text-[10px] opacity-80 leading-tight">{opt.desc}</div>
                        </div>
                        {config.estilo === opt.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-6 uppercase tracking-widest text-brand-muted">2. ¿Qué gama de materiales?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CALIDADES.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setConfig({ ...config, calidad: opt.id })}
                        className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 ${config.calidad === opt.id ? 'border-brand-accent bg-brand-accent/5 shadow-sm' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                      >
                        <div className="font-bold text-xl">{opt.name}</div>
                        <div className="text-xs text-brand-muted leading-tight">{opt.desc}</div>
                        {opt.id === 'estandar' && (
                          <div className="text-[10px] text-brand-accent font-bold bg-orange-50 px-2 py-1 rounded-full self-start mt-1">El más elegido</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!config.estilo || !config.calidad}
                className={`w-full mt-12 py-5 rounded-2xl text-xl font-bold shadow-xl transition-all ${config.estilo && config.calidad ? 'bg-brand-dark text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Ver cómo quedaría ✨
              </button>
            </motion.div>
          )}

          {/* PASO 7: CARGA */}
          {step === 7 && isGenerating && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-20 h-20 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-8" />
              <h2 className="text-3xl font-display font-bold mb-4">Generando tu {espacioLabel}...</h2>
              <p className="text-xl text-brand-muted animate-pulse">Aplicando estilo {config.estilo} a las medidas indicadas.</p>
            </motion.div>
          )}

          {/* PASO 8: RESUMEN + PAGO */}
          {step === 7 && !isGenerating && (
            <motion.div key="step8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl py-4">
              <div className="text-center mb-8">
                <div className="text-brand-accent font-bold tracking-widest text-sm mb-2">{STEP_MOOD[7]}</div>
                <h2 className="text-3xl font-display font-bold">Tu reforma, lista para reservar</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Render + Price Card */}
                <div className="space-y-8">
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                    <img src={config.renderUrl!} className="w-full h-full object-cover" alt="Render" />
                    <div
                      className="absolute inset-0 w-full h-full overflow-hidden"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src={config.fotoUrl || 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=1200&auto=format&fit=crop'}
                        alt="Original"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize"
                      style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                        if (rect) setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
                      }}
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-widest">
                      Desliza para comparar
                    </div>
                  </div>

                  <div className="bg-brand-dark text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Presupuesto Cerrado</p>
                    <p className="text-6xl font-display font-bold mb-2">{prices.total.toLocaleString('es-ES')}€</p>
                    <p className="text-sm opacity-80 leading-relaxed">IVA e instalación incluidos. Válido 15 días.</p>

                    <div className="mt-8 space-y-4 pt-8 border-t border-white/10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="opacity-60">Reforma {config.alcance}</span>
                        <span className="font-bold">Incluida</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="opacity-60">Materiales {config.calidad}</span>
                        <span className="font-bold">Incluidos</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="opacity-60">Gestión de residuos</span>
                        <span className="font-bold">Incluida</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Muro de Confianza + Lead Form */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="bg-brand-bg p-5 rounded-2xl border border-brand-border flex items-center gap-4">
                      <ShieldCheck className="w-8 h-8 text-brand-accent shrink-0" />
                      <div>
                        <p className="font-bold">Garantía 2 años por contrato</p>
                        <p className="text-xs text-brand-muted">Si algo falla, volvemos sin coste adicional</p>
                      </div>
                    </div>
                    <div className="bg-brand-bg p-5 rounded-2xl border border-brand-border flex items-center gap-4">
                      <Clock className="w-8 h-8 text-brand-accent shrink-0" />
                      <div>
                        <p className="font-bold">Fecha garantizada</p>
                        <p className="text-xs text-brand-muted">Si nos retrasamos, te compensamos</p>
                      </div>
                    </div>
                    {/* Testimonio social proof */}
                    <div className="bg-brand-bg p-5 rounded-2xl border border-brand-border">
                      <div className="flex text-yellow-400 mb-2">{'★★★★★'}</div>
                      <p className="text-sm text-brand-dark italic">"Pedí presupuesto online un martes y el jueves ya teníamos visita técnica. El precio final fue exactamente el que me dieron aquí."</p>
                      <p className="text-xs text-brand-muted mt-2 font-bold">— Laura M., Barcelona · Cocina reformada en 2024</p>
                    </div>
                  </div>

                  {!isSubmitted ? (
                    <form onSubmit={handleFinalSubmit} className="space-y-4 bg-white p-8 rounded-3xl border-2 border-brand-border shadow-sm">
                      <h3 className="text-xl font-bold mb-1">Reserva tu visita gratuita</h3>
                      <p className="text-xs text-brand-muted mb-4">Un técnico te llama en menos de 24h para confirmar y concretar fecha.</p>
                      <input
                        required
                        type="text"
                        placeholder="Nombre completo"
                        className="w-full p-4 rounded-xl border border-brand-border outline-none focus:border-brand-accent"
                        value={config.nombre}
                        onChange={e => setConfig({ ...config, nombre: e.target.value })}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Teléfono"
                        className="w-full p-4 rounded-xl border border-brand-border outline-none focus:border-brand-accent"
                        value={config.telefono}
                        onChange={e => setConfig({ ...config, telefono: e.target.value })}
                      />
                      <button type="submit" className="w-full bg-brand-accent text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                        Reservar mi reforma →
                      </button>
                      <p className="text-[10px] text-brand-muted text-center">Puedes cambiar o cancelar hasta 48h antes de la visita.</p>
                    </form>
                  ) : (
                    <div className="bg-green-50 p-10 rounded-3xl border-2 border-green-100 text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-900 mb-2">¡Reserva enviada!</h3>
                      <p className="text-green-800">Te llamaremos hoy mismo para confirmar la visita.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// Sub-componentes internos

function RangeInput({ label, value, min, max, step, hint, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  hint?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">{label}</label>
        <span className="text-2xl font-display font-bold text-brand-accent">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent"
      />
      {hint && <p className="text-[11px] text-brand-muted leading-relaxed">{hint}</p>}
    </div>
  );
}

function ToggleRow({ label, sublabel, active, onClick }: {
  label: string;
  sublabel?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between cursor-pointer gap-4" onClick={onClick}>
      <div>
        <p className="font-bold text-brand-dark leading-tight">{label}</p>
        {sublabel && <p className="text-xs text-brand-muted mt-0.5">{sublabel}</p>}
      </div>
      <div className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${active ? 'bg-brand-accent' : 'bg-brand-border'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="text-brand-muted hover:text-brand-accent transition-colors"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={e => { e.stopPropagation(); setVisible(v => !v); }}
        aria-label="Más información"
      >
        <Info className="w-4 h-4" />
      </button>
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-brand-dark text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-dark rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
