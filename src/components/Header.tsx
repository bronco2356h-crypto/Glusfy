import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Header() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'ca' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="text-3xl font-display font-bold text-brand-dark">
          Glusfy
        </Link>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleLanguage}
            className="text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors uppercase"
          >
            {i18n.language === 'es' ? 'ES | ca' : 'es | CA'}
          </button>
          <button onClick={() => window.scrollTo({ top: document.getElementById('configurator')?.offsetTop || 0, behavior: 'smooth' })} className="hidden md:inline-flex bg-brand-dark text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors">
            {t('header.startFree')}
          </button>
        </div>
      </div>
    </header>
  );
}
