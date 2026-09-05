import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, SegmentedButtons, useCopy, Icon } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function ExtractPhone({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["extract-phone"].ui;
  const C = s.ui;
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("default");
  const [phones, setPhones] = useState([]);
  const { copied: copiedOne, copy: copyOne } = useCopy();
  const { copied: copiedAll, copy: copyAll } = useCopy();

  const defaultCode = d.defaultCode || "62";

  const extract = () => {
    if (!input.trim()) { alert(d.errEmpty); return; }
    const cleaned = input.replace(/[\s\-\(\)\.]/g, "");
    const found = new Set();

    if (mode === "default" || mode === "all") {
      const localRegex = new RegExp(`(?:\\+${defaultCode}|${defaultCode}|0)[1-9]\\d{6,13}`, "g");
      let match;
      while ((match = localRegex.exec(cleaned)) !== null) {
        let num = match[0];
        if (num.startsWith("0")) num = `+${defaultCode}` + num.slice(1);
        else if (!num.startsWith("+")) num = "+" + num;
        found.add(num);
      }
    }
    if (mode === "all") {
      const intlRegex = /\+\d{7,15}/g;
      let match;
      while ((match = intlRegex.exec(cleaned)) !== null) {
        found.add(match[0]);
      }
      const noPlus = /(?<!\d)(0[1-9]\d{6,12})(?!\d)/g;
      while ((match = noPlus.exec(cleaned)) !== null) {
        found.add(`+${defaultCode}` + match[0].slice(1));
      }
    }
    const sorted = [...found].sort((a, b) => a.localeCompare(b));
    setPhones(sorted);
    if (sorted.length === 0) alert(d.errNone);
  };

  const fmt = (str, n) => (str || "").replace("{n}", n);

  return (
    <ToolShell>
      <ToolHeader bg="#1473E6" bgOpacity="/10" icon="mdi:phone" iconBg="#1473E6" iconColor="#ffffff" title={s.tools["extract-phone"].title.split(" — ")[0]} desc={s.tools["extract-phone"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldLabel}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={6} placeholder={d.fieldPh} className="focus:border-[#1473E6] focus:ring-2 focus:ring-blue-100" />
        </Field>

        <div className="mt-3">
          <SegmentedButtons
            options={[{ id: "default", label: d.segDefault }, { id: "all", label: d.segAll }]}
            value={mode}
            onChange={(v) => { setMode(v); setPhones([]); }}
            activeBg="#1473E6"
          />
        </div>

        <PrimaryButton bg="#1473E6" icon="mdi:phone" onClick={extract} className="mt-3">{d.btn}</PrimaryButton>

        {phones.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{fmt(d.found, phones.length)}</span>
              <button onClick={() => copyAll(phones.join("\n"))} className="inline-flex items-center gap-1 text-xs text-[#1473E6] font-medium cursor-pointer hover:underline bg-transparent border-none">
                <Icon name="mdi:content-copy" className="text-sm" /> {copiedAll ? C.copied : C.copyAll}
              </button>
            </div>
            <div className="space-y-1.5">
              {phones.map((num, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                  <Icon name="mdi:phone" className="text-sm text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm font-mono text-gray-900">{num}</span>
                  <button onClick={() => copyOne(num)} className="flex-shrink-0 bg-transparent border-none text-xs text-gray-500 cursor-pointer hover:text-gray-800 px-2 py-1">
                    {copiedOne ? C.ok : C.copy}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </ToolShell>
  );
}