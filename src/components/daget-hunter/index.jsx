import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, SegmentedButtons, useCopy, Icon } from "../ui/index.jsx";
import { AdBanner, AdNative, ADSTERRA } from "../ads/AdBanner.jsx";
import idDict from "../../i18n/id.js";

export default function DagetHunter({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["daget-hunter"].ui;
  const C = s.ui;
  const [activeTab, setActiveTab] = useState("encode");
  const [encodeInput, setEncodeInput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [encodedOutput, setEncodedOutput] = useState("");
  const [decodedLink, setDecodedLink] = useState("");
  const [showEncodeResult, setShowEncodeResult] = useState(false);
  const [showDecodeResult, setShowDecodeResult] = useState(false);
  const { copied, copy } = useCopy();

  const SECRET = "DGTK2024";
  const PREFIX = "DAGET-";
  const SEP = "-V3JaX-";

  const scramble = (str) => {
    let r = "";
    for (let i = 0; i < str.length; i++) {
      r += String.fromCharCode(str.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
    }
    return r;
  };

  const doEncode = () => {
    const raw = encodeInput.trim();
    if (!raw) { alert(d.errEmptyEncode); return; }
    if (!raw.startsWith("http")) { alert(d.errInvalidLink); return; }
    const encoded = PREFIX + btoa(scramble(raw)).replace(/=/g, "") + SEP + btoa(SECRET + raw.length).replace(/=/g, "");
    setEncodedOutput(encoded);
    setShowEncodeResult(true);
  };

  const doDecode = () => {
    const raw = decodeInput.trim();
    if (!raw) { alert(d.errEmptyDecode); return; }
    try {
      if (!raw.startsWith(PREFIX) || !raw.includes(SEP)) throw new Error("bad");
      const parts = raw.substring(PREFIX.length).split(SEP);
      if (parts.length !== 2) throw new Error("bad");
      const b64 = parts[0];
      const padding = "=".repeat((4 - (b64.length % 4)) % 4);
      const decoded = scramble(atob(b64 + padding));
      if (!decoded.startsWith("http")) throw new Error("bad");
      setDecodedLink(decoded);
      setShowDecodeResult(true);
    } catch {
      alert(d.errInvalidCode);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowEncodeResult(false);
    setShowDecodeResult(false);
  };

  return (
    <ToolShell>
      <h2 className="sr-only">{d.srOnly}</h2>

      <ToolHeader
        bg="#1473E6"
        title={s.tools["daget-hunter"].title.split(" — ")[0]}
        desc={s.tools["daget-hunter"].desc}
        titleColor="#ffffff"
        descColor="#ffffff"
        iconBg="#ffffff"
        icon={<span className="text-lg font-bold text-[#1473E6]">D</span>}
      />

      <SegmentedButtons
        options={[
          { id: "encode", label: d.segEncode, icon: "mdi:lock" },
          { id: "decode", label: d.segDecode, icon: "mdi:lock-open" },
        ]}
        value={activeTab}
        onChange={switchTab}
        activeBg="#1473E6"
      />

      {activeTab === "encode" && (
        <>
          <Card className="mt-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-medium mb-4">
              <Icon name="mdi:information" className="text-sm" /> {d.badgeEncode}
            </div>
            <Field label={d.labelEncode}>
              <TextArea value={encodeInput} onChange={(e) => setEncodeInput(e.target.value)} rows={3} placeholder={d.phEncode} className="focus:border-[#1473E6] focus:ring-2 focus:ring-blue-100" />
            </Field>
            <PrimaryButton bg="#1473E6" icon="mdi:shield-lock" onClick={doEncode} className="mt-3 hover:bg-[#0F5DC2] active:bg-[#0D4FA8] hover:scale-100 active:scale-100 transition-colors">{d.btnEncode}</PrimaryButton>
            {showEncodeResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <div className="text-xs font-medium text-blue-800 uppercase tracking-wide mb-2">{d.resultTitle}</div>
                <div className="font-mono text-sm text-blue-900 break-all p-2 bg-white rounded border border-blue-100">{encodedOutput}</div>
                <button onClick={() => copy(encodedOutput)} className="mt-2 inline-flex items-center gap-2 bg-[#1473E6] text-white border-none rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-[#0F5DC2] transition-colors">
                  <Icon name="mdi:content-copy" className="text-sm" /> {copied ? C.copied : d.copyCode}
                </button>
              </div>
            )}
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="flex flex-col gap-2">
              {[["1", d.step1], ["2", d.step2], ["3", d.step3]].map(([n, text]) => (
                <div key={n} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#1473E6] text-white rounded-full flex items-center justify-center text-xs font-medium">{n}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{text}</div>
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-4">
            <AdBanner adKey={ADSTERRA.BANNER_KEY} width={728} height={90} />
          </div>
        </>
      )}

      {activeTab === "decode" && (
        <>
          <Card className="mt-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-medium mb-4">
              <Icon name="mdi:account-group" className="text-sm" /> {d.badgeDecode}
            </div>
            <Field label={d.labelDecode}>
              <TextArea value={decodeInput} onChange={(e) => setDecodeInput(e.target.value)} rows={3} placeholder={d.phDecode} className="focus:border-[#1473E6] focus:ring-2 focus:ring-blue-100" />
            </Field>
            <PrimaryButton bg="#1473E6" icon="mdi:gift" onClick={doDecode} className="mt-3 hover:bg-[#0F5DC2] active:bg-[#0D4FA8] hover:scale-100 active:scale-100 transition-colors">{d.btnDecode}</PrimaryButton>
            {showDecodeResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3 text-center">
                <div className="inline-flex w-12 h-12 bg-blue-100 rounded-full items-center justify-center text-blue-600 text-xl mb-2 flex-shrink-0">
                  <Icon name="mdi:check" />
                </div>
                <div className="text-xs font-medium text-blue-800 uppercase tracking-wide mb-2">{d.successTitle}</div>
                <a href={decodedLink} target="_blank" rel="noopener noreferrer" className="text-[#1473E6] text-sm font-medium break-all block my-2 hover:underline">{decodedLink}</a>
                <a href={decodedLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1473E6] text-white border-none rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-[#0F5DC2] transition-colors mt-2">
                  <Icon name="mdi:open-in-new" className="text-sm" /> {d.openLink}
                </a>
              </div>
            )}
            <div className="bg-gray-50 border-l-4 border-[#1473E6] rounded-r-lg p-3 mt-3">
              <p className="text-xs text-gray-700 leading-relaxed">{d.note}</p>
            </div>
          </Card>
          <div className="mt-4">
            <AdNative src={ADSTERRA.NATIVE_SRC} containerId={ADSTERRA.NATIVE_CONTAINER_ID} />
          </div>
        </>
      )}
    </ToolShell>
  );
}