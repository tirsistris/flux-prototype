"use client";
// app/send/page.tsx — Send 1 · To (Figma 2298:2457 / 2298:3564) and its address
// states: Wrong network (2317:7128 / 2317:7381) and "doesn't look like an address"
// (agreed copy). Entry from Home's Send goes straight here — there is no coin
// picker in the design, ETH is assumed. Paste cycles the two demo values.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { RecipientAvatar } from "@/components/RecipientAvatar";
import { Button, Coin, Divider, Note, ScreenHeader } from "@/components/ui";
import { IconArrowUpRight, IconChevDown, IconChevR, IconCloseCircle, IconScan, IconSearch, IconWarn } from "@/components/icons";
import { SEND_CONTACTS, type ContactId } from "@/lib/legend";
import { detectAddress } from "@/lib/address";
import { cryptoText } from "@/lib/format";
import { useStore } from "@/lib/store";

const ORDER: ContactId[] = ["maxim", "anna", "ledger"];

export default function SendToPage() {
  const router = useRouter();
  const { send, setSendTo, nextPaste, pickRecipient, resetSend, activity, holdings } = useStore();
  const value = send.to;
  const trimmed = value.trim();
  const kind = trimmed ? detectAddress(trimmed) : "none";
  const q = trimmed.toLowerCase();
  const matches = ORDER.filter((id) => !q || kind !== "none" || SEND_CONTACTS[id].name.toLowerCase().includes(q))
    // Wrong network (Figma 2317:7128) lists people only — no My Ledger (agreed).
    .filter((id) => kind !== "btc" || !SEND_CONTACTS[id].own);
  // A name that matches a contact is a filter, not an error (agreed).
  const garbage = !!trimmed && kind === "none" && matches.length === 0;
  const error = kind === "btc" || garbage;
  const addressLike = kind !== "none" || /^(0x|bc1)/i.test(trimmed);

  // Maxim's subtitle names the last note sent to him (Figma: last “Dinner split”).
  const lastMaximNote = activity.find((a) => a.send?.recipient.kind === "contact" && a.send.recipient.id === "maxim" && a.send.note)?.send?.note;
  const subFor = (id: ContactId) => {
    const c = SEND_CONTACTS[id];
    if (id === "maxim" && lastMaximNote) return `${c.short} · last “${lastMaximNote}”`;
    return c.tag ? `${c.short} · ${c.tag}` : c.short;
  };

  const choose = (id: ContactId) => {
    pickRecipient({ kind: "contact", id });
    router.push("/send/amount");
  };
  const toAddress = () => {
    pickRecipient({ kind: "address", address: trimmed });
    router.push("/send/amount");
  };

  const textRef = React.useRef<HTMLTextAreaElement>(null);
  React.useLayoutEffect(() => {
    const t = textRef.current;
    if (!t) return;
    t.style.height = "0px";
    t.style.height = t.scrollHeight + "px";
  }, [value, addressLike]);

  const actions = !trimmed || (kind === "none" && !garbage) ? (
    <Button variant="secondary" glyph={<IconScan />} onClick={() => router.push("/send/scan")}>
      Scan QR code
    </Button>
  ) : (
    <Button disabled={kind !== "eth"} onClick={toAddress}>
      Continue
    </Button>
  );

  return (
    <Screen actions={actions}>
      <ScreenHeader
        coin="ETH"
        title="Send ETH"
        onLeading={() => {
          resetSend();
          router.push("/home");
        }}
      />

      <div className={"to-field" + (trimmed ? " filled" : "") + (error ? " error" : "")}>
        {!trimmed && (
          <span className="to-field-icon">
            <IconSearch />
          </span>
        )}
        <textarea
          ref={textRef}
          rows={1}
          className={"to-input" + (addressLike ? " mono" : "")}
          placeholder="Name, address or ENS"
          aria-label="Recipient name or address"
          value={value}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onChange={(e) => setSendTo(e.target.value.replace(/\n/g, ""))}
        />
        {trimmed ? (
          <button type="button" className="to-clear" aria-label="Clear" onClick={() => setSendTo("")}>
            <IconCloseCircle />
          </button>
        ) : (
          <button type="button" className="paste-chip" onClick={nextPaste}>
            Paste
          </button>
        )}
      </div>

      {error ? (
        <p className="field-error" role="alert">
          <IconWarn size={16} />
          {kind === "btc" ? "This is a Bitcoin address, not Ethereum" : "This doesn’t look like an address"}
        </p>
      ) : (
        <div className="network-row">
          <span>Network</span>
          <span className="network-chip">
            <Coin asset="ETH" size={22} />
            Ethereum
            <IconChevDown />
          </span>
        </div>
      )}

      {kind === "btc" && (
        <section className="card suggestion" aria-label="Send Bitcoin instead">
          <div className="suggestion-top">
            <Coin asset="BTC" size={36} />
            <div>
              <p className="suggestion-title">Send Bitcoin instead?</p>
              <p className="suggestion-body">
                You have {cryptoText(holdings.BTC, "BTC", 4)}. Ethereum can’t be sent to a Bitcoin address.
              </p>
            </div>
          </div>
          {/* Sending Bitcoin is not in this prototype. */}
          <Button variant="secondary" glyph={<IconArrowUpRight />} onClick={() => router.push(NOT_IN_PROTOTYPE)}>
            Send Bitcoin
          </Button>
        </section>
      )}

      {matches.length > 0 && (
        <>
          <h2 className={"day-label send-people-label" + (kind === "btc" ? " after-suggestion" : "")}>PEOPLE</h2>
          <div className="card">
            {matches.map((id, i) => (
              <React.Fragment key={id}>
                {i > 0 && <Divider inset />}
                <button type="button" className="list-row method" onClick={() => choose(id)}>
                  <RecipientAvatar kind={id === "ledger" ? "wallet" : id} size={40} />
                  <span className="list-row-main">
                    <span className="list-row-title">{SEND_CONTACTS[id].name}</span>
                    <span className="list-row-sub">{subFor(id)}</span>
                  </span>
                  <span className="row-chev">
                    <IconChevR />
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      {!error && (
        <div className="send-note">
          <Note icon={<IconWarn />}>Only send ETH and Ethereum tokens here. Coins sent on another network can’t be recovered.</Note>
        </div>
      )}
    </Screen>
  );
}
