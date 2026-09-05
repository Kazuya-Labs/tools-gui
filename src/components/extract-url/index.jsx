import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, useCopy, Icon } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function ExtractUrl({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["extract-url"].ui;
  const C = s.ui;
  const [input, setInput] = useState("");
  const [urls, setUrls] = useState([]);
  const { copied, copy } = useCopy();

  const extract = () => {
    if (!input.trim()) { alert(d.errEmpty); return; }
    const regex = /https?:\/\/[^\s<>"')\]]+/gi;
    const found = [...new Set(input.match(regex) || [])];
    setUrls(found);
    if (found.length === 0) alert(d.errNone);
  };

  const fmt = (str, n) => (str || "").replace("{n}", n);

  return (
    <ToolShell>
      <ToolHeader bg="#38c8ff" bgOpacity="/10" icon="mdi:link" iconBg="#38c8ff" iconColor="#ffffff" title={s.tools["extract-url"].title.split(" — ")[0]} desc={s.tools["extract-url"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldLabel}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={6} placeholder={d.fieldPh} className="focus:border-[#38c8ff] focus:ring-2 focus:ring-blue-100" />
        </Field>

        <PrimaryButton bg="#38c8ff" icon="mdi:magnify" onClick={extract} className="mt-3">{d.btn}</PrimaryButton>

        {urls.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{fmt(d.found, urls.length)}</span>
              <button onClick={() => copy(urls.join("\n"))} className="inline-flex items-center gap-1 text-xs text-[#38c8ff] font-medium cursor-pointer hover:underline bg-transparent border-none">
                <Icon name="mdi:content-copy" className="text-sm" /> {copied ? C.copied : C.copyAll}
              </button>
            </div>
            <div className="space-y-1.5">
              {urls.map((url, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                  <Icon name="mdi:open-in-new" className="text-sm text-gray-400 flex-shrink-0" />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#38c8ff] break-all hover:underline">{url}</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </ToolShell>
  );
}