// settingsflow.jsx — Flux settings mockups: KYC / Languages / Add bank. Exports 3 screens.
const { PhoneFrame, Ico, GROWTH } = window;

function SetHead({ title }) {
  return (
    <div className="fl-flow-head">
      <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
      <span className="fl-flow-title">{title}</span>
      <div style={{ width: 34 }} />
    </div>
  );
}

// labeled field (display value or placeholder)
function Field({ label, value, placeholder, icon }) {
  return (
    <div className="fl-field">
      <span className="fl-field-label">{label}</span>
      <div className="fl-field-box">
        {value
          ? <span className="fl-field-val">{value}</span>
          : <span className="fl-field-ph">{placeholder}</span>}
        {icon && <span style={{ marginLeft: 'auto', display: 'flex' }}>{icon}</span>}
      </div>
    </div>
  );
}

// ── 1 · Personal data / KYC ──────────────────────────────────
function ScreenKYC() {
  const status = 'Pending'; // 'Verified' | 'Pending'
  const verified = status === 'Verified';
  const footer = verified ? <TabBarSpacer /> : (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>Complete verification</button></div>
  );
  return (
    <PhoneFrame footer={footer} scroll>
      <SetHead title="Personal data" />

      <div className="fl-kyc-status">
        <div className="fl-avatar lg">{Ico.user('rgba(255,255,255,0.85)', 30)}</div>
        <div className={'fl-kyc-pill' + (verified ? ' ok' : ' pending')}>
          {verified ? Ico.check(GROWTH, 14) : Ico.shield('#F8C66B', 14)}
          <span>{verified ? 'Verified' : 'Verification pending'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
        <Field label="Full name" value="Nikola Jokić" icon={Ico.edit('rgba(255,255,255,0.4)', 17)} />
        <Field label="Email" value="nikola@flux.app" icon={Ico.edit('rgba(255,255,255,0.4)', 17)} />
        <Field label="Phone" value="+381 64 123 45 67" icon={Ico.edit('rgba(255,255,255,0.4)', 17)} />
        <Field label="Country" value="Serbia" icon={Ico.chevD('rgba(255,255,255,0.4)', 17)} />
      </div>

      {!verified && (
        <div className="fl-warn" style={{ marginTop: 18, color: '#E6C58C', background: 'rgba(248,198,107,0.08)', borderColor: 'rgba(248,198,107,0.2)' }}>
          {Ico.shield('#F8C66B', 18)}
          <span>Finish identity verification to lift limits and unlock withdrawals.</span>
        </div>
      )}
    </PhoneFrame>
  );
}
function TabBarSpacer() { return <div style={{ height: 12 }} />; }

// ── 2 · Languages ────────────────────────────────────────────
const LANGS = [
  { name: 'Русский', sub: 'Russian' },
  { name: 'English', sub: 'English' },
  { name: 'Deutsch', sub: 'German' },
  { name: 'Español', sub: 'Spanish' },
  { name: 'Français', sub: 'French' },
  { name: 'Türkçe', sub: 'Turkish' },
];
function ScreenLanguages() {
  const [sel, setSel] = React.useState('English');
  return (
    <PhoneFrame scroll>
      <SetHead title="Languages" />
      <div className="fl-card fl-set-group" style={{ marginTop: 10 }}>
        {LANGS.map((l, i) => (
          <button key={l.name} className={'fl-lang-row' + (i === LANGS.length - 1 ? ' last' : '')} onClick={() => setSel(l.name)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{l.name}</span>
              <span style={{ fontSize: 12.5, color: '#8A91A3' }}>{l.sub}</span>
            </div>
            <div className={'fl-radio' + (sel === l.name ? ' on' : '')}>{sel === l.name && <div className="fl-radio-dot" />}</div>
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ── 3 · Add bank account ─────────────────────────────────────
function ScreenAddBank() {
  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>Add account</button></div>
  );
  return (
    <PhoneFrame footer={footer} scroll>
      <SetHead title="Add bank account" />
      <p className="fl-flow-sub" style={{ marginTop: 8, marginBottom: 4 }}>Link a bank account to deposit and withdraw in euros.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
        <Field label="IBAN" placeholder="RS35 2600 0560 1001 6113 79" />
        <Field label="Account holder" placeholder="Full name" />
        <Field label="Bank" placeholder="Select your bank" icon={Ico.chevD('rgba(255,255,255,0.4)', 17)} />
      </div>

      <div className="fl-warn" style={{ marginTop: 18, color: '#A9B0C2', background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
        {Ico.lock('#A78BFA', 18)}
        <span>Your banking details are encrypted and only used for transfers.</span>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ScreenKYC, ScreenLanguages, ScreenAddBank });
