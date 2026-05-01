
// GLUSFY — Configurador rediseñado (9 pasos, funnel estratégico)
const GlusfyConfigurator = ({ onComplete, onBack }) => {
  const [step, setStep] = React.useState(1);

  // Respuestas del usuario
  const [space, setSpace] = React.useState(null);       // 'bano' | 'cocina'
  const [metros, setMetros] = React.useState(null);     // m²
  const [estado, setEstado] = React.useState(null);     // estado actual
  const [acceso, setAcceso] = React.useState(null);     // accesibilidad
  const [photoUploaded, setPhotoUploaded] = React.useState(false);
  const [palette, setPalette] = React.useState(null);
  const [plan, setPlan] = React.useState(null);
  const [animDot, setAnimDot] = React.useState(0);
  const [sliderPos, setSliderPos] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef(null);

  const TOTAL_STEPS = 9;

  // ── Precios dinámicos según m² ──────────────────────────────────
  const getBasePrice = () => {
    const m = metros || 6;
    const rate = space === 'cocina' ? 1400 : 1100;
    return Math.round(m * rate / 100) * 100;
  };
  const plans = [
    {
      id: 'esencial', label: 'Esencial',
      multiplier: 1,
      desc: 'Lo necesario, bien hecho.',
      items: ['Desmontaje y retirada', 'Alicatado completo', 'Sanitarios / mobiliario básico', 'Instalación agua y electricidad', 'Mano de obra y materiales']
    },
    {
      id: 'confort', label: 'Confort',
      multiplier: 1.45,
      badge: 'Más elegido',
      desc: 'Diseño y calidad sin compromiso.',
      items: ['Todo lo Esencial', 'Materiales de gama media-alta', 'Diseño personalizado', 'Grifería y accesorios incluidos', 'Iluminación integrada']
    },
    {
      id: 'premium', label: 'Premium',
      multiplier: 1.9,
      desc: 'La mejor versión de tu espacio.',
      items: ['Todo lo Confort', 'Materiales premium / microcemento', 'Domótica básica', 'Espejo/isla a medida', 'Garantía extendida 5 años']
    }
  ];
  const getPlanPrice = (p) => Math.round(getBasePrice() * p.multiplier / 50) * 50;
  const getMonthly = (price, months = 36) => Math.ceil(price / months);

  // ── Navegación ──────────────────────────────────────────────────
  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => { if (step === 1) onBack(); else setStep(s => s - 1); };

  // ── Animación paso 5 ────────────────────────────────────────────
  React.useEffect(() => {
    if (step !== 5) return;
    const iv = setInterval(() => setAnimDot(d => (d + 1) % 4), 600);
    const tm = setTimeout(() => { clearInterval(iv); setStep(6); }, 4000);
    return () => { clearInterval(iv); clearTimeout(tm); };
  }, [step]);

  // ── Slider drag ─────────────────────────────────────────────────
  const handleSliderMove = React.useCallback((clientX) => {
    if (!sliderRef.current) return;
    const r = sliderRef.current.getBoundingClientRect();
    setSliderPos(Math.max(5, Math.min(95, ((clientX - r.left) / r.width) * 100)));
  }, []);
  React.useEffect(() => {
    if (!isDragging) return;
    const mv = e => handleSliderMove(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setIsDragging(false);
    window.addEventListener('mousemove', mv);
    window.addEventListener('touchmove', mv, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('touchmove', mv); window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, [isDragging, handleSliderMove]);

  const selectedPalette = [
    { id: 'nordico', name: 'Blanco nórdico', colors: ['#F0F4FF', '#3B82F6', '#94A3B8'] },
    { id: 'natural', name: 'Natural stone', colors: ['#E8E0D5', '#9C8B7A', '#C8BFB4'] },
    { id: 'midnight', name: 'Midnight spa', colors: ['#0A0E1A', '#3B82F6', '#CBD5E1'] },
  ].find(p => p.id === palette);

  // ── Barra de progreso ────────────────────────────────────────────
  const ProgressBar = () => (
    <div style={{ padding: '14px 20px 0', background: 'white', borderBottom: '1px solid #E2E8F4', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#64748B', fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Atrás
        </button>
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
          {step <= 6 ? `${step} de 6` : step === 7 ? 'Casi listo' : step === 8 ? 'Elige tu plan' : '¡Reserva!'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1B4FD8', fontFamily: "'Playfair Display', serif" }}>Glusfy</span>
      </div>
      <div style={{ display: 'flex', gap: 3, paddingBottom: 14 }}>
        {[1,2,3,4,5,6,7,8,9].map(s => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: s <= step ? '#1B4FD8' : '#E2E8F4',
            transition: 'background 0.35s ease'
          }}/>
        ))}
      </div>
    </div>
  );

  // ── PASO 1 — Espacio ─────────────────────────────────────────────
  const Step1 = () => (
    <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#0A0E1A', margin: '0 0 6px', letterSpacing: '-0.8px' }}>¿Qué reformamos?</h2>
      <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 28px' }}>Elige el espacio para empezar.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {[
          { id: 'bano', label: 'Baño', sub: 'Completo o parcial — azulejos, sanitarios, instalación' },
          { id: 'cocina', label: 'Cocina', sub: 'Mobiliario, encimera, electrodomésticos y más' }
        ].map(({ id, label, sub }) => (
          <button key={id} onClick={() => setSpace(id)} style={{
            background: space === id ? '#EEF2FF' : 'white',
            border: `2px solid ${space === id ? '#1B4FD8' : '#E2E8F4'}`,
            borderRadius: 14, padding: '22px 18px', cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 16, flex: 1,
            transition: 'all 0.18s', fontFamily: "'DM Sans', sans-serif"
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: space === id ? '#1B4FD8' : '#F5F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.18s' }}>
              {id === 'bano'
                ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><ellipse cx="11" cy="16" rx="7" ry="4" stroke={space===id?'white':'#64748B'} strokeWidth="1.8"/><path d="M11 12V7M7 7h8" stroke={space===id?'white':'#64748B'} strokeWidth="1.8" strokeLinecap="round"/></svg>
                : <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="8" width="16" height="10" rx="2" stroke={space===id?'white':'#64748B'} strokeWidth="1.8"/><path d="M3 12h16" stroke={space===id?'white':'#64748B'} strokeWidth="1.5"/><circle cx="7" cy="6" r="1.5" fill={space===id?'white':'#64748B'}/><circle cx="11" cy="6" r="1.5" fill={space===id?'white':'#64748B'}/><circle cx="15" cy="6" r="1.5" fill={space===id?'white':'#64748B'}/></svg>
              }
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.3px', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.4 }}>{sub}</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: `2px solid ${space === id ? '#1B4FD8' : '#E2E8F4'}`, background: space === id ? '#1B4FD8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
              {space === id && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M2 4.5l2 2L7 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </button>
        ))}
      </div>
      <button onClick={goNext} disabled={!space} style={{ background: space ? '#0A0E1A' : '#E2E8F4', color: space ? 'white' : '#64748B', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: space ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", width: '100%', marginTop: 20, transition: 'all 0.18s' }}>Continuar</button>
    </div>
  );

  // ── PASO 2 — Datos del espacio ───────────────────────────────────
  const metrosOpts = ['Menos de 5m²', '5–8m²', '8–12m²', 'Más de 12m²'];
  const metrosVals = [4, 6, 10, 14];
  const estadoOpts = ['Necesita reforma total', 'Solo acabados', 'Reforma parcial'];
  const accesoOpts = ['Fácil acceso (planta baja / ascensor)', 'Escaleras sin ascensor', 'Acceso complicado'];

  const Step2 = () => (
    <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#0A0E1A', margin: '0 0 6px', letterSpacing: '-0.8px' }}>Cuéntanos tu espacio</h2>
      <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>Necesitamos esto para calcular tu presupuesto.</p>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A', marginBottom: 10, letterSpacing: 0.2 }}>¿Cuántos m² tiene?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {metrosOpts.map((o, i) => (
            <button key={o} onClick={() => setMetros(metrosVals[i])} style={{ background: metros === metrosVals[i] ? '#EEF2FF' : 'white', border: `1.5px solid ${metros === metrosVals[i] ? '#1B4FD8' : '#E2E8F4'}`, borderRadius: 10, padding: '12px 10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: metros === metrosVals[i] ? '#1B4FD8' : '#0A0E1A', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.18s', textAlign: 'center' }}>{o}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A', marginBottom: 10 }}>Estado actual</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {estadoOpts.map(o => (
            <button key={o} onClick={() => setEstado(o)} style={{ background: estado === o ? '#EEF2FF' : 'white', border: `1.5px solid ${estado === o ? '#1B4FD8' : '#E2E8F4'}`, borderRadius: 10, padding: '12px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: estado === o ? '#1B4FD8' : '#64748B', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.18s', textAlign: 'left' }}>{o}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A', marginBottom: 10 }}>Acceso a la vivienda</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {accesoOpts.map(o => (
            <button key={o} onClick={() => setAcceso(o)} style={{ background: acceso === o ? '#EEF2FF' : 'white', border: `1.5px solid ${acceso === o ? '#1B4FD8' : '#E2E8F4'}`, borderRadius: 10, padding: '12px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: acceso === o ? '#1B4FD8' : '#64748B', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.18s', textAlign: 'left' }}>{o}</button>
          ))}
        </div>
      </div>

      <button onClick={goNext} disabled={!metros || !estado || !acceso} style={{ background: (metros && estado && acceso) ? '#0A0E1A' : '#E2E8F4', color: (metros && estado && acceso) ? 'white' : '#64748B', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: (metros && estado && acceso) ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", width: '100%', marginTop: 4, transition: 'all 0.18s', flexShrink: 0 }}>Continuar</button>
    </div>
  );

  // ── PASO 3 — Foto ────────────────────────────────────────────────
  const Step3 = () => (
    <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#0A0E1A', margin: '0 0 6px', letterSpacing: '-0.8px' }}>Ahora la magia.</h2>
      <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px', lineHeight: 1.55 }}>Sube una foto de tu {space} actual — como esté, sin ordenar — y la IA lo transformará delante de tus ojos.</p>

      <div onClick={() => setPhotoUploaded(true)} style={{ flex: 1, minHeight: 220, border: `2px dashed ${photoUploaded ? '#1B4FD8' : '#E2E8F4'}`, borderRadius: 18, background: photoUploaded ? '#EEF2FF' : '#F5F7FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 12, transition: 'all 0.25s', padding: 24 }}>
        {photoUploaded ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1B4FD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14l4.5 4.5L21 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>Foto cargada</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>mi_{space}_actual.jpg</div>
            </div>
            <button onClick={e => { e.stopPropagation(); setPhotoUploaded(false); }} style={{ fontSize: 12, color: '#1B4FD8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif" }}>Cambiar foto</button>
          </>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E2E8F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="13" r="5" stroke="#64748B" strokeWidth="1.8"/><path d="M3 22l4-4 3 3 5-6 10 7" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="7" width="22" height="16" rx="3.5" stroke="#64748B" strokeWidth="1.8"/><path d="M10 7l2-3.5h4L18 7" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>Toca para añadir foto</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>JPG, PNG o HEIC · Máx. 20MB</div>
            </div>
          </>
        )}
      </div>

      <div style={{ background: '#EEF2FF', borderRadius: 10, padding: '12px 14px', marginTop: 14, display: 'flex', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="7" stroke="#1B4FD8" strokeWidth="1.5"/><path d="M8 5.5v3M8 10.5h.01" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <p style={{ fontSize: 12, color: '#1B4FD8', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>Cuanta más luz natural, mejor resultado. No hace falta que esté ordenado.</p>
      </div>

      <button onClick={goNext} disabled={!photoUploaded} style={{ background: photoUploaded ? '#0A0E1A' : '#E2E8F4', color: photoUploaded ? 'white' : '#64748B', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: photoUploaded ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", width: '100%', marginTop: 14, transition: 'all 0.18s' }}>
        Generar render con IA →
      </button>
    </div>
  );

  // ── PASO 4 — Paleta ──────────────────────────────────────────────
  const palettes = [
    { id: 'nordico', name: 'Blanco nórdico', desc: 'Porcelana blanca · Roble natural · Cromado', colors: ['#F0F4FF', '#3B82F6', '#94A3B8'] },
    { id: 'natural', name: 'Natural stone', desc: 'Travertino · Madera oscura · Latón mate', colors: ['#E8E0D5', '#9C8B7A', '#C8BFB4'] },
    { id: 'midnight', name: 'Midnight spa', desc: 'Negro mate · Acero · Microcemento gris', colors: ['#0A0E1A', '#3B82F6', '#CBD5E1'] },
  ];
  const Step4 = () => (
    <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#0A0E1A', margin: '0 0 6px', letterSpacing: '-0.8px' }}>¿Cómo lo imaginas?</h2>
      <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px', lineHeight: 1.55 }}>Elige el ambiente que más te gusta. La IA aplicará estos materiales y colores a la foto real de tu {space}.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {palettes.map(p => (
          <button key={p.id} onClick={() => setPalette(p.id)} style={{ background: palette === p.id ? '#EEF2FF' : 'white', border: `2px solid ${palette === p.id ? '#1B4FD8' : '#E2E8F4'}`, borderRadius: 14, padding: '18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, flex: 1, transition: 'all 0.18s' }}>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              {p.colors.map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -8 : 0, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}/>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.3px', marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${palette === p.id ? '#1B4FD8' : '#E2E8F4'}`, background: palette === p.id ? '#1B4FD8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {palette === p.id && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M2 4.5l2 2L7 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </button>
        ))}
      </div>
      <button onClick={goNext} disabled={!palette} style={{ background: palette ? '#0A0E1A' : '#E2E8F4', color: palette ? 'white' : '#64748B', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: palette ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", width: '100%', marginTop: 20, transition: 'all 0.18s' }}>Generar mi render</button>
    </div>
  );

  // ── PASO 5 — Cargando IA ─────────────────────────────────────────
  const Step5 = () => {
    const pal = selectedPalette || palettes[0];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 28 }}>
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          {pal.colors.map((c, i) => (
            <div key={i} style={{ position: 'absolute', width: 48, height: 48, borderRadius: '50%', background: c, border: '3px solid white', transform: `rotate(${i * 120}deg) translateX(28px)`, animation: `gOrbit${i} 2.2s ease-in-out infinite`, boxShadow: '0 4px 14px rgba(0,0,0,0.13)' }}/>
          ))}
          <style>{`
            @keyframes gOrbit0 { 0%,100%{transform:rotate(0deg) translateX(28px)} 50%{transform:rotate(25deg) translateX(32px)} }
            @keyframes gOrbit1 { 0%,100%{transform:rotate(120deg) translateX(28px)} 50%{transform:rotate(145deg) translateX(32px)} }
            @keyframes gOrbit2 { 0%,100%{transform:rotate(240deg) translateX(28px)} 50%{transform:rotate(265deg) translateX(32px)} }
          `}</style>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#0A0E1A', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Imaginando tu {space}{'.'.repeat(animDot)}
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0, maxWidth: 260 }}>Estamos aplicando <strong style={{ color: '#0A0E1A' }}>{pal.name}</strong> a tu foto real. En segundos verás el resultado.</p>
        </div>
        <div style={{ width: '100%', maxWidth: 260 }}>
          {['Analizando tu foto', 'Aplicando materiales', 'Generando render IA'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: animDot > i ? '#1B4FD8' : '#E2E8F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.4s' }}>
                {animDot > i && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M2 4.5l2 2L7 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontSize: 13, color: animDot > i ? '#0A0E1A' : '#64748B', fontWeight: animDot > i ? 600 : 400, transition: 'all 0.4s' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── PASO 6 — Antes/Después ───────────────────────────────────────
  const Step6 = () => {
    const pal = selectedPalette || palettes[0];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Slider */}
        <div ref={sliderRef} onMouseDown={() => setIsDragging(true)} onTouchStart={() => setIsDragging(true)}
          style={{ position: 'relative', height: 260, overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none', flexShrink: 0 }}>
          {/* DESPUÉS */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <svg width="100%" height="260" viewBox="0 0 390 260" preserveAspectRatio="xMidYMid slice">
              <rect width="390" height="260" fill="#E8ECF5"/>
              {[0,1,2,3].map(r => [0,1,2,3,4,5].map(c => (
                <rect key={`a${r}-${c}`} x={c*65+1} y={r*65+1} width="63" height="63" rx="4" fill={pal.colors[0]} opacity="0.55" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
              )))}
              <rect x="30" y="170" width="330" height="60" rx="8" fill={pal.colors[1]} opacity="0.85"/>
              {[50,140,240,320].map((x,i) => <rect key={i} x={x} y="182" width="70" height="35" rx="4" fill="rgba(255,255,255,0.25)"/>)}
              <ellipse cx="195" cy="120" rx="55" ry="18" fill="white" opacity="0.75"/>
              <rect x="190" y="88" width="4" height="30" rx="2" fill={pal.colors[2]}/>
              <text x="195" y="250" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="DM Sans,sans-serif" fontWeight="600">✨ DESPUÉS — Render IA</text>
            </svg>
          </div>
          {/* ANTES */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${sliderPos}%`, overflow: 'hidden' }}>
            <svg width="390" height="260" viewBox="0 0 390 260" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
              <rect width="390" height="260" fill="#A8A098"/>
              {[0,1,2,3].map(r => [0,1,2,3,4,5].map(c => (
                <rect key={`b${r}-${c}`} x={c*65+1} y={r*65+1} width="63" height="63" rx="2" fill="#908880" opacity="0.5" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              )))}
              <rect x="30" y="170" width="330" height="60" rx="4" fill="#706860" opacity="0.9"/>
              {[50,140,240,320].map((x,i) => <rect key={i} x={x} y="182" width="70" height="35" rx="2" fill="rgba(255,255,255,0.1)"/>)}
              <text x="195" y="250" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="DM Sans,sans-serif">← ANTES</text>
            </svg>
          </div>
          {/* Handle */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`, width: 2, background: 'white', transform: 'translateX(-50%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', top: '50%', left: `${sliderPos}%`, transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', background: 'white', boxShadow: '0 4px 18px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 9H3M3 9L5 7M3 9L5 11" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9H15M15 9L13 7M15 9L13 11" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {/* Hint */}
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.45)', borderRadius: 20, padding: '4px 12px' }}>
            <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Arrastra para comparar</span>
          </div>
        </div>

        {/* CTA emocional tras WOW */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#1B4FD8', textTransform: 'uppercase', marginBottom: 8 }}>Así quedará tu {space}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 700, color: '#0A0E1A', margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Esto no es un catálogo.<br/>Es <em style={{ fontStyle: 'italic', color: '#1B4FD8' }}>tu espacio</em>, transformado.
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              La IA ha aplicado tu paleta elegida sobre la foto real de tu {space}. Lo que ves es lo que haremos — con precio cerrado y fecha garantizada.
            </p>
          </div>
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['3–4 sem.', 'duración media'], ['100%', 'precio cerrado'], ['4.9★', 'satisfacción']].map(([n, l]) => (
              <div key={n} style={{ flex: 1, background: '#F5F7FF', borderRadius: 10, padding: '10px 8px', textAlign: 'center', border: '1px solid #E2E8F4' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif" }}>{n}</div>
                <div style={{ fontSize: 10, color: '#64748B', marginTop: 2, lineHeight: 1.3 }}>{l}</div>
              </div>
            ))}
          </div>
          <button onClick={goNext} style={{ background: '#0A0E1A', color: 'white', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%', marginBottom: 10 }}>
            Quiero este resultado →
          </button>
          <button onClick={() => setStep(8)} style={{ background: 'white', color: '#64748B', border: '1.5px solid #E2E8F4', borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%' }}>
            Ver precios directamente
          </button>
        </div>
      </div>
    );
  };

  // ── PASO 7 — Ventajas + testimonios + comparativa ───────────────
  const Step7 = () => {
    const ventajas = [
      {
        title: 'Precio cerrado, punto.',
        desc: 'Materiales, mano de obra, desplazamientos, gestión de residuos… todo dentro. El precio que ves el día 1 es el que pagas el día final. Firmado en contrato.',
        icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="#1B4FD8"/><path d="M5 10l3.5 3.5L15 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      },
      {
        title: 'Lo diseñas tú, desde el móvil.',
        desc: 'Elige materiales, acabados y colores sin salir de casa. Sin visitas a tiendas, sin catálogos físicos, sin reuniones que no llevan a nada.',
        icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="#1B4FD8"/><rect x="7" y="3" width="6" height="14" rx="2" stroke="white" strokeWidth="1.5"/><circle cx="10" cy="14.5" r="0.8" fill="white"/></svg>
      },
      {
        title: 'Fecha de entrega garantizada.',
        desc: 'No "en unas semanas". Una fecha concreta. Si nos retrasamos, te devolvemos el 5% del total. Así de claro.',
        icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="#1B4FD8"/><rect x="4" y="5" width="12" height="11" rx="2" stroke="white" strokeWidth="1.5"/><path d="M4 8.5h12M7.5 4v3M12.5 4v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
      },
      {
        title: 'Experto asignado, siempre disponible.',
        desc: 'Desde el primer día tienes un experto Glusfy por chat. Cualquier duda — sobre materiales, plazos, lo que sea — respondida en menos de 2 horas.',
        icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="#1B4FD8"/><path d="M4 13.5C4 11 5.5 9 8 8.5M16 13.5C16 11 14.5 9 12 8.5M10 14v2M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="6.5" r="2" stroke="white" strokeWidth="1.5"/></svg>
      },
    ];

    const testimonios = [
      {
        nombre: 'Sara M.',
        ciudad: 'Terrassa',
        texto: 'Llevaba 2 años posponiendo la reforma del baño porque me daba pánico los imprevistos. Con Glusfy vi el resultado antes de pagar, el precio fue el mismo del principio al final. Ojalá lo hubiera hecho antes.',
        estrellas: 5,
        reforma: 'Baño Premium · 7m²'
      },
      {
        nombre: 'Jordi P.',
        ciudad: 'Barcelona',
        texto: 'Me habían pedido 4 presupuestos diferentes y ninguno incluía todo. Glusfy fue directo: esto es lo que hay, esto cuesta, esta es la fecha. Terminaron 3 días antes.',
        estrellas: 5,
        reforma: 'Cocina Confort · 10m²'
      },
      {
        nombre: 'Marta & Toni',
        ciudad: 'Sabadell',
        texto: 'El render de IA nos convenció. Cuando vimos cómo iba a quedar nuestra cocina con los azulejos que elegimos… ya no hubo dudas. El resultado real fue prácticamente idéntico.',
        estrellas: 5,
        reforma: 'Cocina Premium · 12m²'
      },
    ];

    const comparativa = [
      ['Precio cerrado desde el día 1', true, false],
      ['Ves el resultado antes de pagar', true, false],
      ['Gestión 100% desde el móvil', true, false],
      ['Fecha de entrega garantizada', true, false],
      ['Materiales y mano de obra incluidos', true, false],
      ['Experto asignado por chat', true, false],
      ['Sin presupuestos parciales', true, false],
    ];

    const [testiIdx, setTestiIdx] = React.useState(0);
    const testi = testimonios[testiIdx];

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 32px' }}>
        {/* Título */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#1B4FD8', textTransform: 'uppercase', marginBottom: 8 }}>Por qué Glusfy</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 700, color: '#0A0E1A', margin: '0 0 6px', letterSpacing: '-0.8px', lineHeight: 1.15 }}>
          Las reformas tradicionales<br/>tienen un problema.
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px', lineHeight: 1.6 }}>
          Presupuestos que crecen, obras que se alargan, materiales que "no estaban incluidos". Nosotros lo resolvimos.
        </p>

        {/* Ventajas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {ventajas.map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#F5F7FF', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A', marginBottom: 12 }}>Lo que dicen nuestros clientes</div>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F4', padding: '18px', marginBottom: 10, position: 'relative' }}>
          {/* Estrellas */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5l1.5 3 3.3.5-2.4 2.3.6 3.3L7 9l-3 1.6.6-3.3L2.2 5l3.3-.5L7 1.5z" fill={i <= testi.estrellas ? '#1B4FD8' : '#E2E8F4'}/>
              </svg>
            ))}
          </div>
          {/* Texto */}
          <p style={{ fontSize: 13, color: '#0A0E1A', lineHeight: 1.65, margin: '0 0 14px', fontStyle: 'italic' }}>
            "{testi.texto}"
          </p>
          {/* Autor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1B4FD8' }}>{testi.nombre[0]}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A' }}>{testi.nombre} · {testi.ciudad}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{testi.reforma}</div>
            </div>
          </div>
        </div>

        {/* Dots navegación testimonios */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
          {testimonios.map((_, i) => (
            <button key={i} onClick={() => setTestiIdx(i)} style={{ width: i === testiIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === testiIdx ? '#1B4FD8' : '#E2E8F4', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }}/>
          ))}
        </div>

        {/* Comparativa */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A', marginBottom: 12 }}>Glusfy vs. empresa tradicional</div>
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E2E8F4', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 72px', background: '#0A0E1A', padding: '10px 14px' }}>
            <span></span>
            <span style={{ fontSize: 12, color: 'white', fontWeight: 700, textAlign: 'center' }}>Glusfy</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textAlign: 'center' }}>Otros</span>
          </div>
          {comparativa.map(([feat], i) => (
            <div key={feat} style={{ display: 'grid', gridTemplateColumns: '1fr 72px 72px', padding: '10px 14px', borderBottom: i < comparativa.length - 1 ? '1px solid #E2E8F4' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#0A0E1A', fontWeight: 500, lineHeight: 1.3 }}>{feat}</span>
              <div style={{ textAlign: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#1B4FD8"/><path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#E2E8F4"/><path d="M6 6l6 6M12 6l-6 6" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
            </div>
          ))}
        </div>

        <button onClick={goNext} style={{ background: '#0A0E1A', color: 'white', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%' }}>
          Ver mi presupuesto personalizado →
        </button>
      </div>
    );
  };

  // ── PASO 8 — Planes y precios ────────────────────────────────────
  const Step8 = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#1B4FD8', textTransform: 'uppercase', marginBottom: 6 }}>Tu presupuesto personalizado</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#0A0E1A', margin: '0 0 4px', letterSpacing: '-0.8px' }}>Elige tu plan</h2>
      <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px', lineHeight: 1.5 }}>Basado en tu {space} de {metros}m². Precio cerrado, todo incluido.</p>

      {/* Banner cuotas */}
      <div style={{ background: '#EEF2FF', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#1B4FD8"/><path d="M6 10l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p style={{ fontSize: 12, color: '#1B4FD8', margin: 0, fontWeight: 600, lineHeight: 1.4 }}>Paga en cómodos plazos mensuales — sin intereses hasta 12 meses</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {plans.map(p => {
          const price = getPlanPrice(p);
          const mo12 = getMonthly(price, 12);
          const mo36 = getMonthly(price, 36);
          const sel = plan === p.id;
          return (
            <button key={p.id} onClick={() => setPlan(p.id)} style={{ background: sel ? '#EEF2FF' : 'white', border: `2px solid ${sel ? '#1B4FD8' : '#E2E8F4'}`, borderRadius: 16, padding: '18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
              {p.badge && <div style={{ position: 'absolute', top: 14, right: 14, background: '#1B4FD8', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '3px 10px', letterSpacing: 0.3 }}>{p.badge}</div>}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.3px', marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{p.desc}</div>
                </div>
              </div>
              {/* Precio — CUOTAS primero */}
              <div style={{ background: sel ? 'rgba(27,79,216,0.08)' : '#F5F7FF', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4, letterSpacing: 0.5 }}>DESDE</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: sel ? '#1B4FD8' : '#0A0E1A', fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{mo36.toLocaleString('es')}€</span>
                  <span style={{ fontSize: 13, color: '#64748B' }}>/mes × 36</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>o {mo12.toLocaleString('es')}€/mes × 12 · Total: {price.toLocaleString('es')}€</div>
              </div>
              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {p.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill={sel ? '#1B4FD8' : '#E2E8F4'}/><path d="M4.5 7l2 2 3-3" stroke={sel ? 'white' : '#94A3B8'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{item}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ background: '#F5F7FF', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
        💡 <strong style={{ color: '#0A0E1A' }}>Precio final calculado</strong> en la visita de medición gratuita. Este es tu estimado basado en {metros}m².
      </div>

      <button onClick={goNext} disabled={!plan} style={{ background: plan ? '#0A0E1A' : '#E2E8F4', color: plan ? 'white' : '#64748B', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: plan ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", width: '100%', transition: 'all 0.18s' }}>
        Reservar mi reforma →
      </button>
    </div>
  );

  // ── PASO 9 — Confirmación / Reserva ─────────────────────────────
  const Step9 = () => {
    const [nombre, setNombre] = React.useState('');
    const [tel, setTel] = React.useState('');
    const [done, setDone] = React.useState(false);
    const selPlan = plans.find(p => p.id === plan);
    const price = selPlan ? getPlanPrice(selPlan) : 0;
    const mo = selPlan ? getMonthly(price, 36) : 0;

    if (done) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center', gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2FF', border: '2px solid #1B4FD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M7 16l5.5 5.5L25 10" stroke="#1B4FD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#1B4FD8', textTransform: 'uppercase', marginBottom: 8 }}>¡Reservado!</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#0A0E1A', margin: '0 0 10px', letterSpacing: '-0.8px' }}>Tu reforma está<br/>reservada</h2>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>Un experto Glusfy te llamará en <strong style={{ color: '#0A0E1A' }}>menos de 24h</strong> para la visita de medición gratuita.</p>
          </div>
          <div style={{ width: '100%', background: 'white', borderRadius: 14, border: '1px solid #E2E8F4', overflow: 'hidden' }}>
            <div style={{ background: '#0A0E1A', padding: '14px 18px' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1, marginBottom: 2 }}>RESUMEN</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'white' }}>{space === 'bano' ? 'Baño' : 'Cocina'} {selPlan?.label} · {metros}m²</div>
            </div>
            {[
              ['Plan elegido', selPlan?.label || '-'],
              ['Desde', `${mo.toLocaleString('es')}€/mes × 36`],
              ['Total estimado', `${price.toLocaleString('es')}€`],
              ['Inicio estimado', 'Jul 2026'],
            ].map(([l, v], i, arr) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < arr.length - 1 ? '1px solid #E2E8F4' : 'none' }}>
                <span style={{ fontSize: 13, color: '#64748B' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A0E1A' }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={onComplete} style={{ background: '#0A0E1A', color: 'white', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%' }}>Volver al inicio</button>
        </div>
      );
    }

    return (
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#1B4FD8', textTransform: 'uppercase', marginBottom: 6 }}>Último paso</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#0A0E1A', margin: '0 0 6px', letterSpacing: '-0.8px' }}>Reserva tu visita gratuita</h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>Sin compromiso. Un experto viene a medir y confirmar el presupuesto.</p>

        {/* Resumen elegido */}
        {selPlan && (
          <div style={{ background: '#EEF2FF', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: '#1B4FD8', fontWeight: 600, marginBottom: 2 }}>Plan {selPlan.label} · {metros}m²</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0E1A', fontFamily: "'Playfair Display', serif" }}>Desde {mo.toLocaleString('es')}€/mes</div>
            </div>
            <div style={{ fontSize: 13, color: '#64748B' }}>{price.toLocaleString('es')}€ total</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0A0E1A', display: 'block', marginBottom: 6 }}>Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" style={{ width: '100%', border: '1.5px solid #E2E8F4', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#0A0E1A', background: 'white', outline: 'none', boxSizing: 'border-box' }}/>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0A0E1A', display: 'block', marginBottom: 6 }}>Teléfono</label>
            <input value={tel} onChange={e => setTel(e.target.value)} placeholder="+34 600 000 000" type="tel" style={{ width: '100%', border: '1.5px solid #E2E8F4', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#0A0E1A', background: 'white', outline: 'none', boxSizing: 'border-box' }}/>
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 12, marginBottom: 14, lineHeight: 1.5 }}>
          Al continuar, aceptas nuestra política de privacidad. Te llamamos en &lt;24h.
        </div>
        <button onClick={() => (nombre && tel) && setDone(true)} disabled={!nombre || !tel} style={{ background: (nombre && tel) ? '#0A0E1A' : '#E2E8F4', color: (nombre && tel) ? 'white' : '#64748B', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: (nombre && tel) ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", width: '100%', transition: 'all 0.18s' }}>
          Confirmar reserva gratuita
        </button>
      </div>
    );
  };

  const steps = { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5, 6: Step6, 7: Step7, 8: Step8, 9: Step9 };
  const StepComponent = steps[step];

  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {step !== 5 && <ProgressBar />}
      {step === 5 && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F4', textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1B4FD8', fontFamily: "'Playfair Display', serif" }}>Glusfy</span>
        </div>
      )}
      <div style={{ flex: 1, overflow: [6,7,8,9].includes(step) ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
        <StepComponent />
      </div>
    </div>
  );
};

Object.assign(window, { GlusfyConfigurator });
