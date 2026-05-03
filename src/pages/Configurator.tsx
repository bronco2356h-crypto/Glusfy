import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  ArrowLeft, 
  UploadCloud, 
  GripVertical, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Truck,
  Maximize,
  Layers
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

  // Lógica de Precios
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

    return {
      total: round(total),
      area: Math.round(area * 10) / 10
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

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
        espacio: config.espacio === 'ambos' ? 'cocina' : config.espacio || 'cocina',
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
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">COMIENZO</div>
              <h2 className="text-4xl font-display font-bold mb-4">¿Dónde es la reforma?</h2>
              <p className="text-brand-muted mb-12">Introduce tu código postal para calcular costes locales.</p>
              <div className="relative mb-8">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent w-6 h-6" />
                <input 
                  type="text" 
                  placeholder="Ej: 08001" 
                  maxLength={5}
                  className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-2xl font-bold transition-all"
                  value={config.codigoPostal}
                  onChange={e => setConfig({...config, codigoPostal: e.target.value.replace(/\D/g,'')})}
                />
              </div>
              <button 
                onClick={nextStep} 
                disabled={config.codigoPostal.length < 5}
                className={`w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-xl ${config.codigoPostal.length === 5 ? 'bg-brand-accent text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Empezar Configuración
              </button>
            </motion.div>
          )}

          {/* PASO 1: ESPACIO */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">1 de 8</div>
              <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step1Title')}</h2>
              <p className="text-brand-muted mb-12">{t('configurator.step1Subtitle')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { id: 'bano', label: t('configurator.bathroom'), icon: '🛁', desc: t('configurator.bathroomDesc') },
                  { id: 'cocina', label: t('configurator.kitchen'), icon: '🍳', desc: t('configurator.kitchenDesc') },
                  { id: 'ambos', label: 'Cocina + Baño', icon: '✨', desc: 'Ahorra en tu reforma integral' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => { setConfig({ ...config, espacio: opt.id as any }); nextStep(); }} 
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
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm text-center">2 de 8</div>
              <h2 className="text-4xl font-display font-bold mb-4 text-center">Danos las medidas</h2>
              <p className="text-brand-muted mb-12 text-center text-balance">Usa los controles para indicar el tamaño aproximado de tu {config.espacio}.</p>
              
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <RangeInput label="Largo (m)" value={config.largo} min={1} max={15} step={0.5} onChange={v => setConfig({...config, largo: v})} />
                  <RangeInput label="Ancho (m)" value={config.ancho} min={1} max={10} step={0.5} onChange={v => setConfig({...config, ancho: v})} />
                  <RangeInput label="Alto (m)" value={config.alto} min={2} max={4} step={0.1} onChange={v => setConfig({...config, alto: v})} />
                </div>
                
                <div className="pt-8 border-t border-brand-border">
                  <label className="block text-sm font-bold mb-4 uppercase tracking-widest text-brand-muted">Forma del espacio</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setConfig({...config, forma: 'rectangular'})}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${config.forma === 'rectangular' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                    >
                      <Maximize className="w-5 h-5" /> Rectangular
                    </button>
                    <button 
                      onClick={() => setConfig({...config, forma: 'irregular'})}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${config.forma === 'irregular' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                    >
                      <Layers className="w-5 h-5" /> L o U
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-brand-border">
                  <label className="block text-sm font-bold mb-4 uppercase tracking-widest text-brand-muted">Foto actual (Recomendado)</label>
                  <div {...getRootProps()} className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${config.fotoUrl ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-brand-bg hover:border-brand-accent/50'}`}>
                    <input {...getInputProps()} />
                    {config.fotoUrl ? (
                      <div className="flex items-center gap-4">
                        <img src={config.fotoUrl} className="w-20 h-20 object-cover rounded-lg" />
                        <span className="text-brand-accent font-bold">¡Foto cargada! Toca para cambiar</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 text-brand-muted mb-2" />
                        <p className="font-bold">Sube una foto de tu {config.espacio}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={nextStep} className="w-full mt-12 bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                Continuar
              </button>
            </motion.div>
          )}

          {/* PASO 3: ALCANCE */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center max-w-4xl">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">3 de 8</div>
              <h2 className="text-4xl font-display font-bold mb-4">¿Qué tipo de reforma buscas?</h2>
              <p className="text-brand-muted mb-12">Elige el alcance para ajustar el presupuesto.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { id: 'completa', label: 'Reforma Completa', desc: 'Picar todo y rehacer instalaciones', icon: '🏢' },
                  { id: 'parcial', label: 'Reforma Parcial', desc: 'Mobiliario y piezas clave', icon: '🛠' },
                  { id: 'acabados', label: 'Solo Acabados', desc: 'Estética, pintura y azulejos', icon: '🎨' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => { setConfig({...config, alcance: opt.id as any}); nextStep(); }}
                    className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${config.alcance === opt.id ? 'border-brand-accent bg-brand-accent/5 shadow-md' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                  >
                    <div className="text-3xl">{opt.icon}</div>
                    <div>
                      <div className="text-xl font-bold mb-1">{opt.label}</div>
                      <div className="text-sm text-brand-muted leading-tight">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 4: ESTADO ACTUAL */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-2xl">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm text-center">4 de 8</div>
              <h2 className="text-4xl font-display font-bold mb-4 text-center">Estado del espacio</h2>
              <p className="text-brand-muted mb-12 text-center">Danos detalles técnicos para evitar sorpresas.</p>
              
              <div className="space-y-6">
                <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border space-y-8">
                  <ToggleRow label="¿Hay humedades visibles?" active={config.humedades} onClick={() => setConfig({...config, humedades: !config.humedades})} />
                  <ToggleRow label="¿Hay elementos ya demolidos?" active={config.demolidos} onClick={() => setConfig({...config, demolidos: !config.demolidos})} />
                  <ToggleRow label="¿El espacio estará en uso?" active={config.enUso} onClick={() => setConfig({...config, enUso: !config.enUso})} />
                  
                  <div className="pt-4">
                    <label className="block text-sm font-bold mb-4 uppercase tracking-widest text-brand-muted">Antigüedad de la última reforma</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['0-5', '5-15', '+15', 'Nunca'].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => setConfig({...config, antiguedad: opt})}
                          className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${config.antiguedad === opt ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                        >
                          {opt} años
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Validación HUECO 2 - Humedades */}
                {config.humedades && config.alcance === 'acabados' && (
                  <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl flex gap-4">
                    <AlertTriangle className="w-10 h-10 text-red-600 shrink-0" />
                    <div>
                      <p className="font-bold text-red-900">Aviso de seguridad</p>
                      <p className="text-sm text-red-800">Has marcado humedades pero solo acabados. Te recomendamos una reforma parcial para sanear las instalaciones.</p>
                      <button onClick={() => setConfig({...config, alcance: 'parcial'})} className="mt-2 text-sm font-bold text-red-600 underline hover:no-underline">Cambiar a Reforma Parcial</button>
                    </div>
                  </div>
                )}

                {/* Validación HUECO 2 - Antigüedad */}
                {config.antiguedad === '+15' && config.alcance === 'acabados' && (
                  <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-2xl flex gap-4">
                    <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold text-amber-900">Recomendación técnica</p>
                      <p className="text-sm text-amber-800">Tu vivienda tiene más de 15 años. Al reformar, te aconsejamos revisar fontanería y electricidad para evitar averías futuras tras pintar.</p>
                      <button onClick={() => setConfig({...config, alcance: 'parcial'})} className="mt-2 text-sm font-bold text-amber-600 underline hover:no-underline">Ver Reforma Parcial (Instalaciones)</button>
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
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm text-center">5 de 8</div>
              <h2 className="text-4xl font-display font-bold mb-4 text-center">Acceso y Logística</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ACCESO_OPTIONS.map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setConfig({...config, tipoAcceso: opt.id})}
                      className={`p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 ${config.tipoAcceso === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                    >
                      <Truck className={`w-8 h-8 ${config.tipoAcceso === opt.id ? 'text-brand-accent' : 'text-brand-muted'}`} />
                      <span className="font-bold text-sm leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border space-y-8">
                  <ToggleRow label="¿Zona de carga cerca?" active={config.cargaDescarga} onClick={() => setConfig({...config, cargaDescarga: !config.cargaDescarga})} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Planta de la vivienda</p>
                      <p className="text-xs text-brand-muted">0 = Planta baja</p>
                    </div>
                    <input type="number" className="w-20 p-3 rounded-xl border-2 border-brand-border text-center font-bold" value={config.planta} onChange={e => setConfig({...config, planta: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-bold mb-4 uppercase tracking-widest text-brand-muted text-center">Urgencia</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setConfig({...config, urgencia: 'urgente'})} className={`p-4 rounded-xl border-2 transition-all font-bold ${config.urgencia === 'urgente' ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border bg-white'}`}>Lo antes posible</button>
                    <button onClick={() => setConfig({...config, urgencia: 'flexible'})} className={`p-4 rounded-xl border-2 transition-all font-bold ${config.urgencia === 'flexible' ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border bg-white'}`}>Flexible</button>
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
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">6 de 8</div>
              <h2 className="text-4xl font-display font-bold mb-4">Estilo y Calidad</h2>
              
              <div className="space-y-12 mt-12">
                <div>
                  <label className="block text-sm font-bold mb-6 uppercase tracking-widest text-brand-muted">1. Elige tu estilo visual</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {ESTILOS.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setConfig({...config, estilo: opt.id})}
                        className={`group relative aspect-[4/5] rounded-2xl overflow-hidden border-4 transition-all ${config.estilo === opt.id ? 'border-brand-accent scale-105 shadow-lg' : 'border-transparent hover:border-brand-accent/30'}`}
                      >
                        <img src={opt.image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white text-left font-bold text-sm">{opt.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-6 uppercase tracking-widest text-brand-muted">2. Gama de materiales</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CALIDADES.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setConfig({...config, calidad: opt.id})}
                        className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 ${config.calidad === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}
                      >
                        <div className="font-bold text-xl">{opt.name}</div>
                        <div className="text-xs text-brand-muted leading-tight">{opt.desc}</div>
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
                Generar Simulación ✨
              </button>
            </motion.div>
          )}

          {/* PASO 7: CARGA */}
          {step === 7 && isGenerating && (
            <motion.div key="step7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-20 h-20 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-8" />
              <h2 className="text-3xl font-display font-bold mb-4">Generando tu {config.espacio}...</h2>
              <p className="text-xl text-brand-muted animate-pulse">Aplicando estilo {config.estilo} a las medidas indicadas.</p>
            </motion.div>
          )}

          {/* PASO 8: RESUMEN + PAGO */}
          {step === 7 && !isGenerating && (
            <motion.div key="step8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Render + Price Card */}
                <div className="space-y-8">
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
                    <img src={config.renderUrl!} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 w-full h-full object-cover overflow-hidden" style={{ width: `${sliderPos}%` }}>
                      <img src={config.fotoUrl || 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=1200&auto=format&fit=crop'} alt="Original" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%' }} />
                    </div>
                    <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }} onMouseMove={(e) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
                    }} />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-widest">Desliza para comparar</div>
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
                    </div>
                  </div>
                </div>

                {/* Muro de Confianza + Lead Form */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="bg-brand-bg p-6 rounded-2xl border border-brand-border flex items-center gap-4">
                      <ShieldCheck className="w-8 h-8 text-brand-accent" />
                      <div><p className="font-bold">Garantía 2 años</p><p className="text-xs text-brand-muted">Por contrato legal</p></div>
                    </div>
                    <div className="bg-brand-bg p-6 rounded-2xl border border-brand-border flex items-center gap-4">
                      <Clock className="w-8 h-8 text-brand-accent" />
                      <div><p className="font-bold">Fecha garantizada</p><p className="text-xs text-brand-muted">O te compensamos</p></div>
                    </div>
                  </div>

                  {!isSubmitted ? (
                    <form onSubmit={handleFinalSubmit} className="space-y-4 bg-white p-8 rounded-3xl border-2 border-brand-border shadow-sm">
                      <h3 className="text-xl font-bold mb-4">Reserva tu visita gratuita</h3>
                      <input required type="text" placeholder="Nombre completo" className="w-full p-4 rounded-xl border border-brand-border outline-none focus:border-brand-accent" value={config.nombre} onChange={e => setConfig({...config, nombre: e.target.value})} />
                      <input required type="tel" placeholder="Teléfono" className="w-full p-4 rounded-xl border border-brand-border outline-none focus:border-brand-accent" value={config.telefono} onChange={e => setConfig({...config, telefono: e.target.value})} />
                      <button type="submit" className="w-full bg-brand-accent text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                        Reservar mi reforma
                      </button>
                      <p className="text-[10px] text-brand-muted text-center">Un técnico te llamará en < 24h.</p>
                    </form>
                  ) : (
                    <div className="bg-green-50 p-10 rounded-3xl border-2 border-green-100 text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-900 mb-2">¡Reserva enviada!</h3>
                      <p className="text-green-800">Te llamaremos hoy mismo.</p>
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
function RangeInput({ label, value, min, max, step, onChange }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">{label}</label>
        <span className="text-2xl font-display font-bold text-brand-accent">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent" />
    </div>
  );
}

function ToggleRow({ label, active, onClick }: any) {
  return (
    <div className="flex items-center justify-between cursor-pointer" onClick={onClick}>
      <p className="font-bold text-brand-dark">{label}</p>
      <div className={`w-12 h-7 rounded-full p-1 transition-colors ${active ? 'bg-brand-accent' : 'bg-brand-border'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}
