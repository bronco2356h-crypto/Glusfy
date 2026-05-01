
// GLUSFY — Landing Page Component
const GlusfyLanding = ({ onStartConfigurator, onCatalog }) => {
  const [lang, setLang] = React.useState('ES');

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'white', minHeight: '100vh', color: '#0A0E1A' }}>

      {/* HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F4',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 5vw, 80px)', height: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#1B4FD8"/>
            <path d="M7 20 L14 8 L21 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M10 16 L18 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: '#0A0E1A' }}>Glusfy</span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          <a href="#como" style={{ fontSize: 15, color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>Cómo funciona</a>
          <a href="#catalogo" onClick={e => { e.preventDefault(); onCatalog(); }} style={{ fontSize: 15, color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>Catálogo</a>
          <a href="#garantias" style={{ fontSize: 15, color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>Garantías</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setLang(lang === 'ES' ? 'CA' : 'ES')} style={{
            background: 'none', border: '1px solid #E2E8F4', borderRadius: 20,
            padding: '5px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            color: '#64748B', fontFamily: "'DM Sans', sans-serif"
          }}>{lang}</button>
          <button onClick={onStartConfigurator} style={{
            background: '#0A0E1A', color: 'white', border: 'none', borderRadius: 8,
            padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.2px'
          }}>Empieza gratis</button>
        </div>
      </header>

      {/* HERO — split layout, fondo blanco */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        paddingTop: 64,
        background: 'white'
      }}>
        {/* Columna izquierda — texto */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 4vw, 72px) clamp(48px, 8vw, 96px) clamp(24px, 6vw, 100px)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#EEF2FF', borderRadius: 20,
            padding: '6px 14px', marginBottom: 32, alignSelf: 'flex-start'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B4FD8', display: 'block' }}/>
            <span style={{ fontSize: 13, color: '#1B4FD8', fontWeight: 600 }}>Terrassa · Barcelona · 2026</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(38px, 4.5vw, 68px)', fontWeight: 700,
            color: '#0A0E1A', lineHeight: 1.08, margin: '0 0 24px',
            letterSpacing: '-2px', textWrap: 'pretty'
          }}>
            Ve cómo quedará<br/>
            <em style={{ fontStyle: 'italic', color: '#1B4FD8' }}>tu cocina o baño</em><br/>
            antes de pagar.
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.4vw, 18px)', color: '#64748B',
            lineHeight: 1.7, margin: '0 0 40px', maxWidth: 420
          }}>
            Sube una foto, elige tu estilo y la IA genera el resultado real. Precio cerrado, fecha garantizada, y paga desde <strong style={{ color: '#0A0E1A' }}>275€/mes</strong>.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onStartConfigurator} style={{
              background: '#0A0E1A', color: 'white', border: 'none',
              borderRadius: 10, padding: '15px 28px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              Configurar mi reforma
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={onCatalog} style={{
              background: 'white', color: '#0A0E1A',
              border: '1.5px solid #E2E8F4',
              borderRadius: 10, padding: '15px 24px', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>Ver catálogo</button>
          </div>

          <div style={{ display: 'flex', gap: 36, marginTop: 48, paddingTop: 36, borderTop: '1px solid #E2E8F4' }}>
            {[['+500', 'reformas'], ['4.9★', 'valoración'], ['100%', 'precio cerrado']].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.5px' }}>{n}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — foto salón moderno */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&auto=format&fit=crop&q=85"
            alt="Cocina moderna reformada por Glusfy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          {/* Fade izquierda para fusión suave con fondo blanco */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, white 0%, rgba(255,255,255,0.2) 20%, transparent 45%)'
          }}/>

          {/* Card flotante — precio */}
          <div style={{
            position: 'absolute', bottom: 36, left: 36,
            background: 'white', borderRadius: 16, padding: '16px 20px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.14)',
            display: 'flex', alignItems: 'center', gap: 14
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#1B4FD8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l3 3 9-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 2, letterSpacing: 0.3 }}>RENDER IA GENERADO</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif" }}>Desde 275€/mes</div>
            </div>
          </div>

          {/* Badge precio cerrado */}
          <div style={{
            position: 'absolute', top: 36, right: 36,
            background: '#0A0E1A', borderRadius: 10, padding: '9px 16px',
            display: 'flex', alignItems: 'center', gap: 7
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B4FD8', display: 'block' }}/>
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>Precio cerrado</span>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como" style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,100px)', background: '#F5F7FF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: '#1B4FD8', textTransform: 'uppercase' }}>El proceso</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px,4vw,52px)', margin: '12px 0 0', letterSpacing: '-1px', color: '#0A0E1A' }}>Cómo funciona</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { n: '01', title: 'Elige tu espacio', desc: 'Baño o cocina. Esencial o Premium. Tú decides el nivel de reforma.' },
              { n: '02', title: 'Sube una foto', desc: 'Una foto de tu espacio actual. Nada más. En menos de 1 minuto.' },
              { n: '03', title: 'Ve el render IA', desc: 'Nuestra IA genera cómo quedará tu espacio reformado. En tiempo real.' },
              { n: '04', title: 'Reserva y paga a plazos', desc: 'Precio cerrado desde el día 1. Fecha garantizada. Sin sorpresas.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{
                background: 'white', borderRadius: 16, padding: '32px 28px',
                border: '1px solid #E2E8F4', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 700, color: '#E2E8F4', position: 'absolute', top: 16, right: 20, lineHeight: 1 }}>{n}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1B4FD8' }}>{n}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#0A0E1A', margin: '0 0 10px', letterSpacing: '-0.5px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button onClick={onStartConfigurator} style={{
              background: '#1B4FD8', color: 'white', border: 'none', borderRadius: 10,
              padding: '16px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif"
            }}>Empezar ahora — es gratis</button>
          </div>
        </div>
      </section>

      {/* GARANTÍAS */}
      <section id="garantias" style={{ background: '#0A0E1A', padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,100px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: '#1B4FD8', textTransform: 'uppercase' }}>Sin letra pequeña</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px,4vw,52px)', margin: '12px 0 0', letterSpacing: '-1px', color: 'white' }}>Tres garantías reales</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { title: 'Precio cerrado', desc: 'El precio que ves es el precio que pagas. Sin extras. Sin imprevistos. Garantizado por contrato.' },
              { title: 'Fecha garantizada', desc: 'Te damos una fecha de inicio y una de fin. Si no la cumplimos, te devolvemos el 5% del total.' },
              { title: 'Render previo', desc: 'Ves cómo quedará tu espacio antes de pagar. La IA genera el resultado con tu foto real.' }
            ].map(({ title, desc }, i) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 16,
                padding: '36px 32px', border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1B4FD8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {i === 0 && <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
                    {i === 1 && <><circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5"/><path d="M10 7v3.5l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
                    {i === 2 && <><rect x="3" y="6" width="14" height="10" rx="2" stroke="white" strokeWidth="1.5"/><path d="M7 6V5a3 3 0 016 0v1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'white', margin: '0 0 12px', letterSpacing: '-0.5px' }}>{title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ background: 'white', padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,100px)', textAlign: 'center', borderTop: '1px solid #E2E8F4' }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: '#1B4FD8', textTransform: 'uppercase' }}>Empieza hoy</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px,4vw,56px)', margin: '12px auto 20px', letterSpacing: '-1.5px', color: '#0A0E1A', maxWidth: 560 }}>
          Tu espacio,<br/>transformado.
        </h2>
        <p style={{ fontSize: 17, color: '#64748B', marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>Sin obras interminables. Sin presupuestos sorpresa.</p>
        <button onClick={onStartConfigurator} style={{
          background: '#0A0E1A', color: 'white', border: 'none', borderRadius: 10,
          padding: '18px 40px', fontSize: 17, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif"
        }}>Configura tu reforma gratis</button>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 16 }}>Sin tarjeta. Sin compromiso.</p>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0E1A', padding: '32px clamp(24px,6vw,100px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="6" fill="#1B4FD8"/><path d="M7 20 L14 8 L21 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M10 16 L18 16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'white' }}>Glusfy</span>
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>© 2026 Glusfy · Terrassa, Barcelona</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Aviso legal', 'Privacidad', 'Cookies'].map(t => (
            <a key={t} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{t}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          section[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

Object.assign(window, { GlusfyLanding });
