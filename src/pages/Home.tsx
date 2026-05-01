import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Camera, Palette, Sparkles, CalendarCheck, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-brand-dark/20">
            <img 
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2000&auto=format&fit=crop" 
              alt="Baño reformado" 
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6 tracking-tight text-balance">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-brand-dark/80 mb-10 max-w-2xl mx-auto text-balance">
              {t('hero.subtitle')}
            </p>
            <button 
              onClick={() => navigate('/configurador')}
              className="bg-brand-accent hover:opacity-90 text-white px-10 py-5 rounded-full text-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {t('hero.cta')}
            </button>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-24 px-4 bg-brand-bg">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-center mb-16">{t('howItWorks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { icon: Camera, title: t('howItWorks.step1') },
                { icon: Palette, title: t('howItWorks.step2') },
                { icon: Sparkles, title: t('howItWorks.step3') },
                { icon: CalendarCheck, title: t('howItWorks.step4') }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-brand-accent" />
                  </div>
                  <div className="text-sm font-bold text-brand-accent mb-2">PASO {i + 1}</div>
                  <h3 className="text-xl font-medium text-brand-dark text-balance">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATÁLOGO */}
        <section className="py-24 px-4 bg-white border-y border-brand-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-center mb-16">Nuestros Espacios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Baño Esencial', price: 9900, monthly: 275, inc: ['Mobiliario base', 'Grifería cromada', 'Plato de ducha', 'Azulejos estándar', 'Instalación fontanería'], notInc: ['Espejo led', 'Mampara cristal'], path: '/configurador' },
                { name: 'Baño Premium', price: 14900, monthly: 414, inc: ['Mobiliario diseño', 'Grifería diseño', 'Plato de ducha extraplano', 'Azulejos premium', 'Instalación fontanería', 'Espejo led'], notInc: [], path: '/configurador' },
                { name: 'Cocina Esencial', price: 12900, monthly: 358, inc: ['Mobiliario base', 'Encimera laminada', 'Fregadero acero', 'Grifería estándar', 'Instalación básica'], notInc: ['Electrodomésticos', 'Iluminación led'], path: '/configurador' },
                { name: 'Cocina Premium', price: 19900, monthly: 553, inc: ['Mobiliario premium', 'Encimera cuarzo', 'Fregadero integrado', 'Grifería diseño', 'Instalación completa', 'Iluminación led'], notInc: [], path: '/configurador' }
              ].map((item, i) => (
                <div key={i} className="bg-brand-bg rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-shadow">
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">{item.name}</h3>
                    <div className="text-2xl font-bold text-brand-dark mb-1">{item.price.toLocaleString('es-ES')}€</div>
                    <div className="text-brand-accent font-medium mb-6">desde {item.monthly}€/mes</div>
                    
                    <div className="mb-6">
                      <div className="text-sm font-bold text-brand-dark mb-3">{t('catalog.includes')}</div>
                      <ul className="space-y-2">
                        {item.inc.map((inc, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-brand-muted"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> {inc}</li>
                        ))}
                      </ul>
                    </div>
                    {item.notInc.length > 0 && (
                      <div className="mb-6">
                        <div className="text-sm font-bold text-brand-dark mb-3">{t('catalog.notIncludes')}</div>
                        <ul className="space-y-2">
                          {item.notInc.map((notInc, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-brand-muted/70"><div className="w-4 h-4 rounded-full border border-gray-400 mt-0.5 shrink-0" /> {notInc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button onClick={() => navigate(item.path)} className="w-full py-3 rounded-full border-2 border-brand-accent text-brand-accent font-medium hover:bg-brand-accent hover:text-white transition-colors mt-auto">
                    {t('catalog.configureThis')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GARANTÍAS */}
        <section className="py-24 px-4 bg-brand-bg border-y border-brand-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <ShieldCheck className="w-12 h-12 text-brand-accent mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4">{t('guarantees.fixedPriceTitle')}</h3>
                <p className="text-brand-muted">{t('guarantees.fixedPriceDesc')}</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-12 h-12 text-brand-accent mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4">{t('guarantees.guaranteedDateTitle')}</h3>
                <p className="text-brand-muted">{t('guarantees.guaranteedDateDesc')}</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle2 className="w-12 h-12 text-brand-accent mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4">{t('guarantees.aiRenderTitle')}</h3>
                <p className="text-brand-muted">{t('guarantees.aiRenderDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
