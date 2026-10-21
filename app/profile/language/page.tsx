"use client";
// app/profile/language/page.tsx — Language (Figma 2302:4753 / 2302:5166). The
// prototype is English only: another language opens the quiet state, the check stays.
import React from "react";
import Link from "next/link";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE, useGoBack } from "@/components/NotInPrototype";
import { Divider, Note, ScreenHeader } from "@/components/ui";
import { IconCheckBold, IconGlobe } from "@/components/icons";
import { LANGUAGES } from "@/lib/legend";

export default function LanguagePage() {
  const back = useGoBack();
  return (
    <Screen>
      <ScreenHeader title="Language" onLeading={back} />
      <div className="card languages">
        {LANGUAGES.map(([native, en], i) => {
          const body = (
            <>
              <span className="list-row-main">
                <span className="settings-label">{native}</span>
                <span className="list-row-sub">{en}</span>
              </span>
              {i === 0 && (
                <span className="lang-check">
                  <IconCheckBold size={22} />
                </span>
              )}
            </>
          );
          return (
            <React.Fragment key={native}>
              {i > 0 && <Divider />}
              {i === 0 ? (
                <div className="lang-row" aria-current="true">
                  {body}
                </div>
              ) : (
                <Link href={NOT_IN_PROTOTYPE} className="lang-row">
                  {body}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="language-note">
        <Note icon={<IconGlobe size={18} />}>
          Numbers and dates look like 1{" "}234,56{" "}€ and 19.10.2026. Change the format in iPhone Settings → Language &amp; Region.
        </Note>
      </div>
    </Screen>
  );
}
