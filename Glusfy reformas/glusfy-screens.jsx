
// GLUSFY — Catalog + Confirmation Screens

const GlusfyCatalog = ({ onStartConfigurator, onBack }) => {
  const products = [
    {
      id: 'bano-esencial', space: 'Baño', level: 'Esencial',
      price: 7900, monthly: 219,
      includes: ['Alicatado completo', 'Sanitarios básicos', 'Mueble de baño', 'Instalación eléctrica', 'Pintura y acabados'],
      color: '#F5F7FF'
    },
    {
      id: 'bano-premium', space: 'Baño', level: 'Premium',
      price: 12900, monthly: 358,
      includes: ['Todo lo Esencial', 'Diseño personalizado', 'Materiales premium', 'Grifo y accesorios', 'Suelo microcemento', 'Iluminación LED'],
      color: '#F5F7FF', badge: 'Más elegido'
    },
    {
      id: 'cocina-esencial', space: 'Cocina', level: 'Esencial',
      price: 9900, monthly: 275,
      includes: ['Mobiliario IKEA/similar', 'Encimera básica', 'Campana extractora', 'Instalación completa', 'Pintura y acabados'],
      color: '#F5F7FF'
    },
    {
      id: 'cocina-premium', space: 'Cocina', level: 'Premium',
      price: 16900, monthly: 469,
      includes: ['Mobiliario premium', 'Encimera silestone', 'Electrodomésticos', 'Isla o península', 'Iluminación integrada', 'Acabados a medida'],
      color: '#F5F7FF', badge: 'Top ventas'
    }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#F5F7FF', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F4', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Inicio
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0A0E1A' }}>Catálogo</span>
        </div>
        <div style={{ width: 60 }}/>
      </div>

      <div style={{ padding: '24px 20px', flex: 1 }}>
        <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>Precio cerrado. Sin sorpresas. Todo incluido.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F4', overflow: 'hidden', position: 'relative' }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: '#1B4FD8', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 12px', zIndex: 1 }}>{p.badge}</div>
              )}

              {/* Card header */}
              <div style={{ background: p.space === 'Baño' ? '#0A0E1A' : '#1B4FD8', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{p.space}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 10, letterSpacing: '-0.5px' }}>{p.level}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>{p.price.toLocaleString('es')}€</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>o {p.monthly}€/mes</span>
                </div>
              </div>

              {/* Includes */}
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: '#64748B', textTransform: 'uppercase', marginBottom: 12 }}>Incluye</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {p.includes.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="8" fill="#1B4FD8" opacity="0.12"/>
                        <path d="M5 8l2 2 4-4" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: 14, color: '#0A0E1A' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <button onClick={onStartConfigurator} style={{
                  background: '#1B4FD8', color: 'white', border: 'none', borderRadius: 10,
                  padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", width: '100%'
                }}>Configurar este espacio →</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0A0E1A', borderRadius: 20, padding: '28px 24px', marginTop: 24, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' }}>¿No sabes cuál elegir?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20, lineHeight: 1.5 }}>Usa el configurador y la IA te ayuda a visualizar el resultado antes de decidir.</p>
          <button onClick={onStartConfigurator} style={{
            background: '#1B4FD8', color: 'white', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif"
          }}>Empezar gratis</button>
        </div>

        <div style={{ height: 32 }}/>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
const GlusfyConfirmation = ({ onHome }) => {
  const [added, setAdded] = React.useState(false);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#F5F7FF', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F4', padding: '16px 20px', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0A0E1A' }}>Glusfy</span>
      </div>

      <div style={{ flex: 1, padding: '48px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Check icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF2FF', border: '2px solid #1B4FD8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l6 6L28 12" stroke="#1B4FD8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: '#1B4FD8', textTransform: 'uppercase', marginBottom: 12 }}>¡Reservado!</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#0A0E1A', margin: '0 0 14px', letterSpacing: '-1px', lineHeight: 1.2 }}>Tu reforma está<br/>reservada</h1>
        <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.65, maxWidth: 300, margin: '0 0 36px' }}>Te contactamos en menos de 24h para confirmar todos los detalles.</p>

        {/* Summary card */}
        <div style={{ width: '100%', background: 'white', borderRadius: 20, border: '1px solid #E2E8F4', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ background: '#0A0E1A', padding: '16px 20px', textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Resumen</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'white' }}>Baño Premium</div>
          </div>
          <div style={{ padding: '0' }}>
            {[
              { label: 'Precio total', value: '12.900€' },
              { label: 'Cuota mensual', value: '358€/mes × 36' },
              { label: 'Paleta elegida', value: 'Blanco nórdico' },
              { label: 'Fecha estimada', value: 'Inicio junio 2025' },
              { label: 'Duración', value: '3–4 semanas' }
            ].map(({ label, value }, i) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderBottom: i < 4 ? '1px solid #E2E8F4' : 'none'
              }}>
                <span style={{ fontSize: 14, color: '#64748B' }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0E1A' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info block */}
        <div style={{ width: '100%', background: '#EEF2FF', border: '1px solid rgba(27,79,216,0.2)', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 28, textAlign: 'left' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="10" cy="10" r="9" stroke="#1B4FD8" strokeWidth="1.5"/>
            <path d="M10 7v4M10 13h.01" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.55 }}>
            Un experto Glusfy te llamará en <strong style={{ color: '#0A0E1A' }}>menos de 24 horas</strong> para confirmar la visita de medición gratuita.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => setAdded(true)}
            style={{
              background: added ? '#0A0E1A' : '#1B4FD8', color: 'white',
              border: 'none', borderRadius: 12, padding: '16px', fontSize: 16,
              fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.3s'
            }}>
            {added ? (
              <><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9l3.5 3.5L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Añadido al calendario</>
            ) : (
              <><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="12" rx="2" stroke="white" strokeWidth="1.5"/><path d="M6 2v4M12 2v4M2 8h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>Añadir al calendario</>
            )}
          </button>

          <button onClick={onHome} style={{
            background: 'white', color: '#0A0E1A', border: '1.5px solid #E2E8F4',
            borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%'
          }}>Volver al inicio</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { GlusfyCatalog, GlusfyConfirmation });
