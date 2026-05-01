import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, ChevronRight, UploadCloud, GripVertical } from 'lucide-react';
import { PRICING, PALETTES } from '../lib/constants';
import { saveLead } from '../lib/firebase';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

type ConfigState = {
  espacio: 'baño' | 'cocina' | null;
  nivel: 'esencial' | 'premium' | null;
  fotoUrl: string | null;
  paletaId: string | null;
  renderUrl: string | null;
};

export default function Configurator() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    espacio: null,
    nivel: null,
    fotoUrl: null,
    paletaId: null,
    renderUrl: null
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleEspacio = (val: 'baño' | 'cocina') => { setConfig({ ...config, espacio: val }); nextStep(); };
  const handleNivel = (val: 'esencial' | 'premium') => { setConfig({ ...config, nivel: val }); nextStep(); };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setConfig(c => ({ ...c, fotoUrl: url }));
      nextStep();
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [] }, maxFiles: 1 });

  const handlePaleta = async (id: string) => {
    setConfig(c => ({ ...c, paletaId: id }));
    setStep(5);
    generateRender(id);
  };

  const generateRender = async (paletaId: string) => {
    setIsGenerating(true);
    // MOCK DELAY for generation
    await new Promise(res => setTimeout(res, 8000));
    
    // Fallback if Replicate fails or we don't have real endpoint
    const mockRender = config.espacio === 'baño' 
      ? 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=1000&auto=format&fit=crop';
    
    setConfig(c => ({ ...c, renderUrl: mockRender }));
    setIsGenerating(false);
    setStep(6);
    
    // Save to Firebase
    try {
      if (import.meta.env.VITE_FIREBASE_API_KEY) {
        await saveLead({
          email: '', telefono: '', // Collected later
          espacio: config.espacio!,
          nivel: config.nivel!,
          paletaElegida: paletaId,
          url_foto_subida: 'local_blob',
          url_render_generado: mockRender,
          precio_total: PRICING[config.espacio!][config.nivel!].total
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;
    // In a real app, you would call your backend to create a checkout session
    console.log("Redirect to checkout for:", config);
    alert("Redirigiendo a Stripe Checkout para: " + PRICING[config.espacio!][config.nivel!].total + "€");
  };

  const paletasDisp = config.espacio && config.nivel ? PALETTES[config.espacio][config.nivel] : [];
  const selectedPalette = paletasDisp.find(p => p.id === config.paletaId);

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-brand-border sticky top-0 z-50">
        <div className="h-full bg-brand-accent transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-5xl mx-auto relative">
        {step > 1 && step < 6 && !isGenerating && (
          <button onClick={prevStep} className="absolute top-8 left-4 text-brand-muted hover:text-brand-dark flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: ESPACIO */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center">
              <h2 className="text-4xl font-display font-bold mb-12">{t('configurator.step1Title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
                <button onClick={() => handleEspacio('baño')} className="group relative bg-white rounded-3xl p-12 shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-brand-accent overflow-hidden">
                  <div className="text-3xl font-display font-medium text-brand-dark group-hover:text-brand-accent transition-colors">{t('configurator.bathroom')}</div>
                </button>
                <button onClick={() => handleEspacio('cocina')} className="group relative bg-white rounded-3xl p-12 shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-brand-accent overflow-hidden">
                  <div className="text-3xl font-display font-medium text-brand-dark group-hover:text-brand-accent transition-colors">{t('configurator.kitchen')}</div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: NIVEL */}
          {step === 2 && config.espacio && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center">
              <h2 className="text-4xl font-display font-bold mb-12">{t('configurator.step2Title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
                <button onClick={() => handleNivel('esencial')} className="bg-white rounded-3xl p-8 text-left shadow-sm hover:shadow-xl border-2 border-transparent hover:border-brand-accent transition-all flex flex-col justify-between h-64">
                  <div>
                    <div className="text-2xl font-display font-bold mb-2">{t('configurator.essential')}</div>
                    <div className="text-brand-muted">Lo básico con calidad garantizada.</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-brand-dark mb-1">{PRICING[config.espacio].esencial.total.toLocaleString('es-ES')}€</div>
                    <div className="text-brand-accent font-medium">{t('configurator.fromMonthly', { price: PRICING[config.espacio].esencial.monthly })}</div>
                  </div>
                </button>
                
                <button onClick={() => handleNivel('premium')} className="bg-white rounded-3xl p-8 text-left shadow-md hover:shadow-xl border-2 border-brand-accent transition-all relative flex flex-col justify-between h-64">
                  <div className="absolute -top-4 right-8 bg-brand-accent text-white px-4 py-1 rounded-full text-sm font-medium tracking-wide">
                    {t('configurator.mostChosen')}
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold mb-2">{t('configurator.premium')}</div>
                    <div className="text-brand-muted">Acabados de lujo y diseño exclusivo.</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-brand-dark mb-1">{PRICING[config.espacio].premium.total.toLocaleString('es-ES')}€</div>
                    <div className="text-brand-accent font-medium">{t('configurator.fromMonthly', { price: PRICING[config.espacio].premium.monthly })}</div>
                  </div>
                </button>
              </div>
              <p className="mt-8 text-brand-muted text-sm">{t('configurator.priceDisclaimer')}</p>
            </motion.div>
          )}

          {/* STEP 3: FOTO */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center">
              <h2 className="text-4xl font-display font-bold mb-12">{t('configurator.step3Title')}</h2>
              
              <div {...getRootProps()} className={`w-full max-w-2xl mx-auto border-2 border-dashed rounded-3xl p-20 cursor-pointer transition-colors ${isDragActive ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-white hover:border-brand-accent/50'}`}>
                <input {...getInputProps()} />
                <UploadCloud className="w-16 h-16 text-brand-muted mx-auto mb-6" />
                <p className="text-xl text-brand-dark font-medium">{t('configurator.dragDrop')}</p>
              </div>
              <p className="mt-6 text-brand-muted">{t('configurator.uploadDisclaimer')}</p>
            </motion.div>
          )}

          {/* STEP 4: PALETA */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center">
              <h2 className="text-4xl font-display font-bold mb-12">{t('configurator.step4Title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                {paletasDisp.map(p => (
                  <button key={p.id} onClick={() => handlePaleta(p.id)} className="bg-white rounded-3xl p-6 text-left shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-brand-accent group">
                    <div className="flex gap-2 mb-6">
                      {p.colors.map((c, i) => (
                        <div key={i} className="w-12 h-12 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors">{p.name}</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{p.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: GENERANDO */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full text-center flex flex-col items-center justify-center min-h-[50vh]">
              <div className="flex gap-4 mb-12">
                {selectedPalette?.colors.map((c, i) => (
                  <motion.div 
                    key={i} 
                    className="w-16 h-16 rounded-full shadow-lg"
                    style={{ backgroundColor: c }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">{t('configurator.step5Title')}</h2>
              <p className="text-xl text-brand-muted animate-pulse">{t('configurator.generatingText')}</p>
            </motion.div>
          )}

          {/* STEP 6: RESULTADO */}
          {step === 6 && config.renderUrl && config.fotoUrl && (
            <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mx-auto py-8">
              <h2 className="text-4xl font-display font-bold text-center mb-10">{t('configurator.step6Title')}</h2>
              
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 select-none"
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
                  <img src={config.fotoUrl} alt="Original" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100vw' }} />
                </div>
                <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                    <GripVertical className="w-5 h-5 text-brand-dark" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded backdrop-blur-sm text-sm font-medium">Antes</div>
                <div className="absolute top-4 right-4 bg-brand-accent text-white px-3 py-1 rounded text-sm font-medium shadow-lg">Después</div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm text-center max-w-2xl mx-auto">
                <div className="flex justify-center items-end gap-2 mb-2">
                  <div className="text-5xl font-bold text-brand-dark">{PRICING[config.espacio!][config.nivel!].total.toLocaleString('es-ES')}€</div>
                </div>
                <div className="text-xl text-brand-accent font-medium mb-8">
                  {t('configurator.fromMonthly', { price: PRICING[config.espacio!][config.nivel!].monthly })}
                </div>

                <div className="flex flex-col gap-4">
                  <button onClick={handleCheckout} className="w-full bg-brand-dark text-white py-4 rounded-xl text-lg font-medium hover:bg-black transition-colors flex items-center justify-center gap-2">
                    {t('configurator.payAndBook')} <ChevronRight className="w-5 h-5" />
                  </button>
                  <button className="w-full bg-brand-bg text-brand-dark py-4 rounded-xl text-lg font-medium border border-brand-border hover:bg-[#E2E8F0] transition-colors">
                    {t('configurator.bookVisitFirst')}
                  </button>
                </div>
                
                <p className="text-brand-muted text-sm mt-6">
                  {t('configurator.estimatedStart', { date: new Date(Date.now() + 15 * 86400000).toLocaleDateString('es-ES') })}
                </p>
                <p className="text-xs text-brand-muted mt-2">{t('configurator.legalNote')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
