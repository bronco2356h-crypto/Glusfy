import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Camera, Palette, Sparkles, CalendarCheck, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10" />
            <img 
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2000&auto=format&fit=crop" 
              alt="Baño reformado" 
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block py-2 px-4 rounded-full bg-brand-accent/10 text-brand-accent font-bold text-sm mb-6 uppercase tracking-widest">
                Reforma tu espacio en 8 pasos
              </span>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-brand-dark mb-8 tracking-tighter text-balance leading-[0.9]">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-brand-muted mb-12 max-w-3xl mx-auto text-balance font-medium">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate('/configurador')}
                  className="bg-brand-accent hover:opacity-90 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all shadow-2xl shadow-brand-accent/20 hover:-translate-y-1 w-full md:w-auto"
                >
                  {t('hero.cta')}
                </button>
                <button 
                  onClick={() => navigate('/configurador')}
                  className="bg-brand-dark text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all hover:opacity-90 w-full md:w-auto"
                >
                  Ver ejemplos
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-32 px-4 bg-brand-bg relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-24 tracking-tight">{t('howItWorks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
              {[
                { icon: Camera, title: t('howItWorks.step1'), desc: "Sube una foto real" },
                { icon: Palette, title: t('howItWorks.step2'), desc: "Elige materiales" },
                { icon: Sparkles, title: t('howItWorks.step3'), desc: "Mira la simulación" },
                { icon: CalendarCheck, title: t('howItWorks.step4'), desc: "Reserva tu fecha" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group relative">
                  {i < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-brand-border" />}
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8 group-hover:scale-110 transition-transform border border-brand-border">
                    <step.icon className="w-10 h-10 text-brand-accent" />
                  </div>
                  <div className="text-xs font-black text-brand-accent mb-2 tracking-widest uppercase">Paso {i + 1}</div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">{step.title}</h3>
                  <p className="text-brand-muted text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATÁLOGO SIMPLIFICADO */}
        <section className="py-32 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Nuestros Planes</h2>
              <p className="text-brand-muted text-xl max-w-2xl mx-auto">Precios transparentes calculados por m² para que no pagues ni un céntimo de más.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {[
                { name: 'Reformas de Baño', price: 'desde 2.800€', icon: '🛁', color: 'blue' },
                { name: 'Reformas de Cocina', price: 'desde 2.800€', icon: '🍳', color: 'orange' }
              ].map((item, i) => (
                <div key={i} className="bg-brand-bg rounded-[3rem] p-10 flex flex-col items-center text-center border border-brand-border hover:border-brand-accent transition-all group">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl mb-8 ${item.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">{item.name}</h3>
                  <div className="text-brand-accent font-black text-2xl mb-8">{item.price}</div>
                  <button 
                    onClick={() => navigate('/configurador')}
                    className="w-full py-5 rounded-2xl bg-brand-dark text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl"
                  >
                    Calcular mi presupuesto →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GARANTÍAS */}
        <section className="py-32 px-4 bg-brand-dark text-white rounded-t-[4rem]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <ShieldCheck className="w-8 h-8 text-brand-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{t('guarantees.fixedPriceTitle')}</h3>
                <p className="text-white/60 leading-relaxed">{t('guarantees.fixedPriceDesc')}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <Clock className="w-8 h-8 text-brand-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{t('guarantees.guaranteedDateTitle')}</h3>
                <p className="text-white/60 leading-relaxed">{t('guarantees.guaranteedDateDesc')}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-8 h-8 text-brand-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{t('guarantees.aiRenderTitle')}</h3>
                <p className="text-white/60 leading-relaxed">{t('guarantees.aiRenderDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
