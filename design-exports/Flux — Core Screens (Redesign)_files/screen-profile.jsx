// screen-profile.jsx — Flux Profile, restyled. Dark Mode toggle removed. Exports ScreenProfile.
const { PhoneFrame, RoundBtn, Ico, FLUX } = window;

function Row({ icon, label, last }) {
  return (
    <div className={'fl-set-row' + (last ? ' last' : '')}>
      <span className="fl-set-ico">{icon}</span>
      <span className="fl-set-label">{label}</span>
      <span style={{ marginLeft: 'auto', display: 'flex' }}>{Ico.chevR('rgba(255,255,255,0.35)', 18)}</span>
    </div>
  );
}

function ScreenProfile() {
  return (
    <PhoneFrame active="profile">
      <div className="fl-screenhead">
        <h1 className="fl-screentitle big">Profile</h1>
        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
          <RoundBtn>{Ico.search('rgba(255,255,255,0.8)', 20)}</RoundBtn>
          <RoundBtn>{Ico.menu('rgba(255,255,255,0.8)', 20)}</RoundBtn>
        </div>
      </div>

      <div className="fl-card fl-profile-card">
        <div className="fl-avatar lg">{Ico.user('rgba(255,255,255,0.85)', 30)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{FLUX.user.name}</span>
          <span style={{ fontSize: 13, color: '#8A91A3' }}>{FLUX.user.email}</span>
        </div>
        <button className="fl-roundbtn sm" style={{ marginLeft: 'auto' }}>{Ico.edit('rgba(255,255,255,0.8)', 18)}</button>
      </div>

      <div className="fl-set-section-label">Account</div>
      <div className="fl-card fl-set-group">
        <Row icon={Ico.user('#A78BFA', 20)} label="Personal data" />
        <Row icon={Ico.faceid('#A78BFA', 20)} label="Face ID" />
        <Row icon={Ico.shield('#A78BFA', 20)} label="Safety" />
        <Row icon={Ico.globe('#A78BFA', 20)} label="Languages" />
        <Row icon={Ico.bell('#A78BFA', 20)} label="Notifications" last />
      </div>

      <div className="fl-set-section-label">Payments</div>
      <div className="fl-card fl-set-group">
        <Row icon={Ico.card('#A78BFA', 20)} label="Bank Accounts" />
        <Row icon={Ico.crown('#A78BFA', 20)} label="Subscription" last />
      </div>

      <button className="fl-logout">{Ico.logout('#F87171', 20)}<span>Log out</span></button>
    </PhoneFrame>
  );
}

window.ScreenProfile = ScreenProfile;
