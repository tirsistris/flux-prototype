// login.jsx — Flux Login screen, sibling of onboarding "Create account". Two states.
const { FluxLogo, PrimaryButton, Ico } = window;

const T = { accent: { from: '#7B61FF', to: '#4A6FE8', glow: 'rgba(74,111,232,0.45)' }, radius: 16 };

function StatusBar() {
  const c = '#fff';
  return (
    <div className="fx-statusbar">
      <span className="fx-time">6:19</span>
      <div className="fx-status-icons">
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill={c} /><rect x="4.5" y="4.7" width="3" height="6.3" rx="0.6" fill={c} /><rect x="9" y="2.4" width="3" height="8.6" rx="0.6" fill={c} /><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c} /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.8c2.1 0 4 .8 5.4 2.2l1-1C12.7 2.3 10.5 1.3 8 1.3S3.3 2.3 1.6 4l1 1C4 3.6 5.9 2.8 8 2.8Z" fill={c} /><path d="M8 6c1.2 0 2.3.5 3.1 1.3l1-1C11 5.2 9.6 4.6 8 4.6s-3 .6-4.1 1.7l1 1C5.7 6.5 6.8 6 8 6Z" fill={c} /><circle cx="8" cy="9.4" r="1.3" fill={c} /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none" /><rect x="2" y="2" width="18" height="8" rx="1.8" fill={c} /><path d="M23 4v4c.7-.3 1.2-1 1.2-2S23.7 4.3 23 4Z" fill={c} fillOpacity="0.5" /></svg>
      </div>
    </div>
  );
}

// state: 'empty' | 'filled'  (filled = email typed, password field focused)
function ScreenLogin({ state }) {
  const filled = state === 'filled';
  const [hide, setHide] = React.useState(true);
  return (
    <div className="fx-phone">
      <div className="fx-herohlow" style={{ background: 'radial-gradient(125% 62% at 50% -8%, rgba(123,97,255,0.34), rgba(74,111,232,0.12) 42%, transparent 70%)' }} />
      <div className="fx-island" />
      <StatusBar />

      <div className="fx-screen fx-login">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 22 }}>
          <FluxLogo T={T} size={46} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="fx-h1">Welcome back</h1>
          <p className="fx-body">Log in to pick up where you left off.</p>
        </div>

        <div className="fx-field">
          <span className="fx-label">Email</span>
          <div className="fx-input">
            {filled
              ? <span className="fx-input-val">you@email.com</span>
              : <span className="fx-input-ph">you@email.com</span>}
          </div>
        </div>

        <div className="fx-field" style={{ marginTop: 14 }}>
          <span className="fx-label">Password</span>
          <div className={'fx-input' + (filled ? ' focus' : '')}>
            {filled
              ? <><span className="fx-dots">{hide ? '•••••••••' : 'flux1234!'}</span><span className="fx-caret" /></>
              : <span className="fx-input-ph">Enter your password</span>}
            <button className="fx-eye" onClick={() => setHide(h => !h)} aria-label="Show password">
              {hide ? Ico.eye('rgba(235,235,245,0.55)', 21) : Ico.eyeOff('rgba(235,235,245,0.55)', 21)}
            </button>
          </div>
        </div>

        <button className="fx-forgot">Forgot password?</button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
          <PrimaryButton label="Log in" onClick={() => {}} T={T} />
          <button className="fx-outline-wide">{Ico.faceid('#fff', 22)}<span>Log in with Face ID</span></button>
        </div>

        <div className="fx-or" style={{ margin: '18px 0' }}><span>or continue with</span></div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="fx-outline">{Ico.apple('#fff', 19)}<span>Apple</span></button>
          <button className="fx-outline">{Ico.google('#fff', 18)}<span>Google</span></button>
        </div>

        <div style={{ flex: 1 }} />
        <p className="fx-footer">New to Flux? <a>Create account</a></p>
      </div>

      <div className="fx-home-ind" />
    </div>
  );
}

function LoginBoard() {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      const s = Math.min((window.innerWidth - 120) / (390 * 2 + 80), (window.innerHeight - 150) / 844, 1);
      setScale(s);
    };
    fit(); window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="stage">
      <div className="row" style={{ transform: `scale(${scale})` }}>
        <div className="col">
          <div className="cap"><span className="cap-kick">State A</span><span className="cap-title">Resting</span></div>
          <ScreenLogin state="empty" />
        </div>
        <div className="col">
          <div className="cap"><span className="cap-kick">State B</span><span className="cap-title">Filled · password focused</span></div>
          <ScreenLogin state="filled" />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LoginBoard />);
