import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, ChevronRight, UploadCloud, GripVertical, CheckCircle2, Star, ShieldCheck, Clock } from 'lucide-react';
import { RATES, PLAN_MULTIPLIERS, M2_OPTIONS, ESTADO_OPTIONS, ACCESO_OPTIONS, PALETTES } from '../lib/constants';
import { saveLead } from '../lib/firebase';

type ConfigState = {
  espacio: 'baño' | 'cocina' | null;
  m2: number;
  estado: string;
  acceso: string;
  fotoUrl: string | null;
  paletaId: string | null;
  renderUrl: string | null;
  nombre: string;
  telefono: string;
};

export default function Configurator() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    espacio: null,
    m2: 6,
    estado: 'total',
    acceso: 'facil',
    fotoUrl: null,
    paletaId: null,
    renderUrl: null,
    nombre: '',
    telefono: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 9));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const prices = useMemo(() => {
    if (!config.espacio) return { esencial: 0, confort: 0, premium: 0 };
    const baseRate = RATES[config.espacio];
    const estadoMult = ESTADO_OPTIONS.find(o => o.id === config.estado)?.multiplier || 1;
    const accesoExtra = ACCESO_OPTIONS.find(o => o.id === config.acceso)?.extra || 0;
    const basePrice = config.m2 * baseRate * (1 + accesoExtra) * estadoMult;
    const round = (n: number) => Math.round(n / 50) * 50;
    return {
      esencial: round(basePrice * PLAN_MULTIPLIERS.esencial),
      confort: round(basePrice * PLAN_MULTIPLIERS.confort),
      premium: round(basePrice * PLAN_MULTIPLIERS.premium)
    };
  }, [config.espacio, config.m2, config.estado, config.acceso]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setConfig(c => ({ ...c, fotoUrl: url }));
      nextStep();
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [] }, maxFiles: 1 });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(5);
    await new Promise(res => setTimeout(res, 4000));
    const mockRender = config.espacio === 'baño' 
      ? 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=1000&auto=format&fit=crop';
    setConfig(c => ({ ...c, renderUrl: mockRender }));
    setIsGenerating(false);
    setStep(6);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveLead({
        nombre: config.nombre,
        email: 'no-email@glusfy.com',
        telefono: config.telefono,
        espacio: config.espacio!,
        nivel: 'premium', // Default or selected
        paletaElegida: config.paletaId || 'default',
        url_foto_subida: 'local_blob',
        url_render_generado: config.renderUrl || '',
        precio_total: prices.premium
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const paletasDisp = config.espacio ? PALETTES[config.espacio].premium : [];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-brand-dark">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-brand-bg sticky top-0 z-50">
        <div className="h-full bg-brand-accent transition-all duration-500" style={{ width: `${(step / 9) * 100}%` }} />
      </div>

      <div className="flex-grow flex flex-col items-center p-4 w-full max-w-4xl mx-auto relative pt-12">
        {step > 1 && step < 9 && !isGenerating && (
          <button onClick={prevStep} className="absolute top-4 left-4 p-2 text-brand-muted hover:text-brand-dark transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* PASO 1: ESPACIO */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">1 de 9</div>
              <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step1Title')}</h2>
              <p className="text-brand-muted mb-12">{t('configurator.step1Subtitle')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button onClick={() => { setConfig({ ...config, espacio: 'baño' }); nextStep(); }} className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${config.espacio === 'baño' ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl">🛁</div>
                  <div>
                    <div className="text-2xl font-bold">{t('configurator.bathroom')}</div>
                    <div className="text-brand-muted text-sm">{t('configurator.bathroomDesc')}</div>
                  </div>
                </button>
                <button onClick={() => { setConfig({ ...config, espacio: 'cocina' }); nextStep(); }} className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${config.espacio === 'cocina' ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}>
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-2xl">🍳</div>
                  <div>
                    <div className="text-2xl font-bold">{t('configurator.kitchen')}</div>
                    <div className="text-brand-muted text-sm">{t('configurator.kitchenDesc')}</div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* PASO 2: DETALLES TÉCNICOS */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-2xl">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm text-center">2 de 9</div>
              <h2 className="text-4xl font-display font-bold mb-4 text-center">{t('configurator.step2Title')}</h2>
              <p className="text-brand-muted mb-12 text-center">{t('configurator.step2Subtitle')}</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold mb-4">{t('configurator.m2Label')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {M2_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setConfig({ ...config, m2: opt.value })} className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${config.m2 === opt.value ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-border hover:border-brand-accent/50'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-4">{t('configurator.estadoLabel')}</label>
                  <div className="space-y-3">
                    {ESTADO_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => setConfig({ ...config, estado: opt.id })} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${config.estado === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border hover:border-brand-accent/30'}`}>
                        <span className="font-medium">{opt.label}</span>
                        {config.estado === opt.id && <CheckCircle2 className="w-5 h-5 text-brand-accent" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-4">{t('configurator.accesoLabel')}</label>
                  <div className="space-y-3">
                    {ACCESO_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => setConfig({ ...config, acceso: opt.id })} className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${config.acceso === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border hover:border-brand-accent/30'}`}>
                        <span className="font-medium">{opt.label}</span>
                        {config.acceso === opt.id && <CheckCircle2 className="w-5 h-5 text-brand-accent" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={nextStep} className="w-full mt-12 bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                Continuar
              </button>
            </motion.div>
          )}

          {/* PASO 3: FOTO */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center max-w-2xl">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">3 de 9</div>
              <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step3Title')}</h2>
              <p className="text-brand-muted mb-12">{t('configurator.step3Subtitle', { space: config.espacio })}</p>
              
              <div {...getRootProps()} className={`relative w-full aspect-square md:aspect-video rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-brand-bg hover:border-brand-accent/50'}`}>
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                  <UploadCloud className="w-10 h-10 text-brand-accent" />
                </div>
                <p className="text-xl font-bold mb-2">{t('configurator.dragDrop')}</p>
                <p className="text-sm text-brand-muted">JPG, PNG o HEIC · Máx. 20MB</p>
                
                <div className="absolute bottom-8 left-8 right-8 bg-blue-50/80 backdrop-blur-sm p-4 rounded-2xl flex gap-3 items-center text-left">
                  <div className="text-xl shrink-0">💡</div>
                  <p className="text-xs text-blue-900 leading-tight">{t('configurator.uploadDisclaimer')}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* PASO 4: ESTILO */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center max-w-4xl">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">4 de 9</div>
              <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step4Title')}</h2>
              <p className="text-brand-muted mb-12">{t('configurator.step4Subtitle', { space: config.espacio })}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {paletasDisp.map(p => (
                  <button key={p.id} onClick={() => setConfig({ ...config, paletaId: p.id })} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${config.paletaId === p.id ? 'border-brand-accent bg-brand-accent/5 shadow-md' : 'border-brand-border bg-white hover:border-brand-accent/30'}`}>
                    <div className="flex shrink-0">
                      {p.colors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{p.name}</div>
                      <div className="text-xs text-brand-muted">{p.desc}</div>
                    </div>
                    <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.paletaId === p.id ? 'bg-brand-accent border-brand-accent' : 'border-brand-border'}`}>
                      {config.paletaId === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={handleGenerate} disabled={!config.paletaId} className={`w-full mt-12 py-5 rounded-2xl text-xl font-bold shadow-xl transition-all ${config.paletaId ? 'bg-brand-dark text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {t('configurator.generateBtn')}
              </button>
            </motion.div>
          )}

          {/* PASO 5: CARGA */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center flex flex-col items-center justify-center min-h-[60vh]">
              <div className="relative w-32 h-32 mb-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-brand-bg border-t-brand-accent" />
                <div className="absolute inset-4 rounded-full bg-brand-bg flex items-center justify-center text-3xl">✨</div>
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">{t('configurator.step5Title')}</h2>
              <p className="text-xl text-brand-muted animate-pulse">{t('configurator.generatingText')}</p>
            </motion.div>
          )}

          {/* PASO 6 & 7: RESULTADO + CONFIANZA */}
          {(step === 6 || step === 7) && config.renderUrl && (
            <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl py-4">
              <div className="text-center mb-8">
                <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">{step === 6 ? '6 de 9' : '7 de 9'}</div>
                <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step6Title', { space: config.espacio })}</h2>
              </div>

              {step === 6 ? (
                <>
                  <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 select-none group"
                       onMouseMove={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                         setSliderPos((x / rect.width) * 100);
                       }}
                       onTouchMove={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                         setSliderPos((x / rect.width) * 100);
                       }}>
                    <img src={config.renderUrl} alt="Simulación personalizada" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 w-full h-full object-cover overflow-hidden" style={{ width: `${sliderPos}%` }}>
                      <img src={config.fotoUrl!} alt="Original" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%' }} />
                    </div>
                    <div className="absolute top-0 bottom-0 w-1.5 bg-white shadow-2xl cursor-ew-resize" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center">
                        <GripVertical className="w-6 h-6 text-brand-dark" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Arrastra para comparar
                    </div>
                  </div>

                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <h3 className="text-2xl font-display font-bold mb-4">{t('configurator.wowTitle')}</h3>
                    <p className="text-brand-muted leading-relaxed">{t('configurator.wowDesc', { space: config.espacio })}</p>
                  </div>

                  <div className="flex flex-col gap-4 max-w-md mx-auto">
                    <button onClick={nextStep} className="w-full bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3">
                      {t('configurator.wantThisResult')}
                    </button>
                    <button onClick={() => setStep(8)} className="text-brand-muted text-sm font-medium hover:text-brand-dark transition-colors">
                      {t('configurator.viewPrices')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-brand-bg p-8 rounded-[2.5rem] text-center border border-brand-border">
                      <Clock className="w-10 h-10 text-brand-accent mx-auto mb-4" />
                      <div className="text-2xl font-bold mb-1">{t('configurator.benefits.time')}</div>
                      <div className="text-xs text-brand-muted uppercase tracking-widest">Compromiso real</div>
                    </div>
                    <div className="bg-brand-bg p-8 rounded-[2.5rem] text-center border border-brand-border">
                      <ShieldCheck className="w-10 h-10 text-brand-accent mx-auto mb-4" />
                      <div className="text-2xl font-bold mb-1">{t('configurator.benefits.price')}</div>
                      <div className="text-xs text-brand-muted uppercase tracking-widest">Sin sorpresas</div>
                    </div>
                    <div className="bg-brand-bg p-8 rounded-[2.5rem] text-center border border-brand-border">
                      <Star className="w-10 h-10 text-brand-accent mx-auto mb-4" />
                      <div className="text-2xl font-bold mb-1">{t('configurator.benefits.rating')}</div>
                      <div className="text-xs text-brand-muted uppercase tracking-widest">Media clientes</div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-brand-border rounded-[2.5rem] p-8 md:p-12">
                    <div className="flex gap-1 mb-6 justify-center">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-brand-accent text-brand-accent" />)}
                    </div>
                    <p className="text-xl md:text-2xl font-medium text-center italic mb-8 leading-relaxed">
                      "Lo que más me gustó fue ver cómo quedaría mi cocina antes de pagar nada. El resultado final fue idéntico a la simulación. 100% recomendados."
                    </p>
                    <div className="text-center font-bold text-brand-muted">— Marc R., Barcelona</div>
                  </div>

                  <button onClick={nextStep} className="w-full bg-brand-dark text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all">
                    Ver mi presupuesto detallado
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* PASO 8: PLANES/PRECIOS */}
          {step === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center">
              <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">8 de 9</div>
              <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step8Title')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
                {[
                  { id: 'esencial', name: t('configurator.essential'), price: prices.esencial, monthly: Math.round(prices.esencial / 36), accent: false },
                  { id: 'confort', name: t('configurator.confort'), price: prices.confort, monthly: Math.round(prices.confort / 36), accent: true },
                  { id: 'premium', name: t('configurator.premium'), price: prices.premium, monthly: Math.round(prices.premium / 36), accent: false }
                ].map((plan) => (
                  <div key={plan.id} className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col justify-between ${plan.accent ? 'border-brand-accent bg-white shadow-2xl scale-105 relative z-10' : 'border-brand-border bg-brand-bg opacity-80'}`}>
                    {plan.accent && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-white px-6 py-1 rounded-full text-sm font-bold uppercase tracking-tighter">Más equilibrado</div>}
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                      <div className="text-4xl font-black mb-1">{plan.price.toLocaleString('es-ES')}€</div>
                      <div className="text-brand-accent font-bold text-lg mb-8">{t('configurator.fromMonthly', { price: plan.monthly })}</div>
                      <ul className="space-y-4">
                        {['Todo incluido', 'Instalación completa', 'Garantía 2 años', plan.id === 'premium' ? 'Materiales exclusivos' : 'Materiales calidad'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={nextStep} className={`w-full mt-10 py-4 rounded-xl font-bold transition-all ${plan.accent ? 'bg-brand-accent text-white' : 'bg-brand-dark text-white'}`}>
                      Elegir este plan
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASO 9: CAPTACIÓN */}
          {step === 9 && (
            <motion.div key="step9" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl text-center">
              {!isSubmitted ? (
                <>
                  <div className="mb-2 text-brand-accent font-bold tracking-widest text-sm">9 de 9</div>
                  <h2 className="text-4xl font-display font-bold mb-4">{t('configurator.step9Title')}</h2>
                  <p className="text-brand-muted mb-12">{t('configurator.step9Subtitle')}</p>
                  
                  <form onSubmit={handleFinalSubmit} className="space-y-6 text-left bg-brand-bg p-8 rounded-[2.5rem] border border-brand-border shadow-sm">
                    <div>
                      <label className="block text-sm font-bold mb-2 ml-2">{t('configurator.fullName')}</label>
                      <input required type="text" value={config.nombre} onChange={e => setConfig({...config, nombre: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none transition-all text-lg" placeholder="Ej: Juan Pérez" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 ml-2">{t('configurator.phone')}</label>
                      <input required type="tel" value={config.telefono} onChange={e => setConfig({...config, telefono: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none transition-all text-lg" placeholder="600 000 000" />
                    </div>
                    <button type="submit" className="w-full bg-brand-accent text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:opacity-90 transition-all mt-4">
                      {t('configurator.sendRequest')}
                    </button>
                    <p className="text-[10px] text-brand-muted text-center px-8 leading-tight">
                      Al enviar, aceptas nuestra política de privacidad. Tus datos están seguros y solo se usarán para esta propuesta técnica.
                    </p>
                  </form>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 p-12 rounded-[3rem] border-2 border-green-100 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-green-200">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-green-900 mb-4">{t('configurator.successTitle')}</h2>
                  <p className="text-green-800 text-xl">{t('configurator.successSubtitle')}</p>
                  <button onClick={() => window.location.href = '/'} className="mt-12 text-green-700 font-bold hover:underline">Volver al inicio</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-8 text-center border-t border-brand-border mt-auto bg-brand-bg/30">
        <p className="text-xs text-brand-muted max-w-xl mx-auto leading-relaxed">
          {t('configurator.legalNote')} Glusfy Reformas S.L. · C.I.F B-00000000 · Av. Diagonal, Barcelona
        </p>
      </div>
    </div>
  );
}
