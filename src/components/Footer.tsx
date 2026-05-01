import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-cream border-t border-brand-border py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-display font-bold text-brand-dark mb-2">Glusfy</h2>
          <p className="text-brand-muted text-sm">Terrassa · Barcelona</p>
          <a href="mailto:hola@glusfy.com" className="text-brand-muted hover:text-brand-dark transition-colors block text-sm mt-1">hola@glusfy.com</a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-brand-muted">
          <a href="#" className="hover:text-brand-dark transition-colors">{t('footer.legal')}</a>
          <a href="#" className="hover:text-brand-dark transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-brand-dark transition-colors">{t('footer.cookies')}</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center text-xs text-brand-muted border-t border-brand-border pt-8">
        {t('footer.rights')}
      </div>
    </footer>
  );
}
