// StatusBar.tsx — the 6:19 status bar. The markup/SVGs are identical across the
// fl (core) and fx (onboarding/login) exports; only the class prefix differs, so
// one component serves both via the `system` prop.
import React from "react";

export function StatusBar({ system = "fl" }: { system?: "fl" | "fx" }) {
  const c = "#fff";
  return (
    <div className={`${system}-statusbar`}>
      <span className={`${system}-time`}>6:19</span>
      <div className={`${system}-status-icons`}>
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill={c} /><rect x="4.5" y="4.7" width="3" height="6.3" rx="0.6" fill={c} /><rect x="9" y="2.4" width="3" height="8.6" rx="0.6" fill={c} /><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c} /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.8c2.1 0 4 .8 5.4 2.2l1-1C12.7 2.3 10.5 1.3 8 1.3S3.3 2.3 1.6 4l1 1C4 3.6 5.9 2.8 8 2.8Z" fill={c} /><path d="M8 6c1.2 0 2.3.5 3.1 1.3l1-1C11 5.2 9.6 4.6 8 4.6s-3 .6-4.1 1.7l1 1C5.7 6.5 6.8 6 8 6Z" fill={c} /><circle cx="8" cy="9.4" r="1.3" fill={c} /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none" /><rect x="2" y="2" width="18" height="8" rx="1.8" fill={c} /><path d="M23 4v4c.7-.3 1.2-1 1.2-2S23.7 4.3 23 4Z" fill={c} fillOpacity="0.5" /></svg>
      </div>
    </div>
  );
}
