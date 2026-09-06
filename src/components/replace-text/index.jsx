import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, OutputBox, CopyButton } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function ReplaceText({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["replace-text"].ui;
  const C = s.ui;
  const [input, setInput] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [useRegex, setUseRegex] = useState(false);
  const [output, setOutput] = useState("");
  const [matchCount, setMatchCount] = useState(0);

  const process = () => {
    if (!input.trim()) { alert(d.errEmptySrc); return; }
    if (!findText) { alert(d.errEmptyFind); return; }
    try {
      let regex;
      if (useRegex) {
        regex = new RegExp(findText, caseSensitive ? "g" : "gi");
      } else {
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        regex = new RegExp(escaped, caseSensitive ? "g" : "gi");
      }
      const matches = input.match(regex);
      setMatchCount(matches ? matches.length : 0);
      setOutput(input.replace(regex, replaceWith));
    } catch {
      alert(d.errRegex);
    }
  };

  const fmt = (str, n) => (str || "").replace("{n}", n);

  return (
    <ToolShell>
      <ToolHeader bg="#ffc091" bgOpacity="/15" icon="mdi:swap-horizontal" iconBg="#ffc091" iconColor="#ffffff" title={s.tools["replace-text"].title.split(" — ")[0]} desc={s.tools["replace-text"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldSrc}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder={d.phSrc} className="focus:border-[#ffc091] focus:ring-2 focus:ring-orange-100" />
        </Field>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <Field label={d.labelFind} mb="mb-1">
              <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} placeholder={d.phFind} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#ffc091] focus:ring-2 focus:ring-orange-100" />
            </Field>
          </div>
          <div className="flex-1">
            <Field label={d.labelReplace} mb="mb-1">
              <input type="text" value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)} placeholder={d.phReplace} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#ffc091] focus:ring-2 focus:ring-orange-100" />
            </Field>
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded" />
            {d.checkCase}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="rounded" />
            {d.checkRegex}
          </label>
        </div>

        <PrimaryButton bg="#ffc091" dark={false} icon="mdi:swap-horizontal" onClick={process} className="mt-3">{d.btn}</PrimaryButton>

        {output && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{fmt(d.result, matchCount)}</span>
              <CopyButton text={output} color="#ffc091" label={C.copy} copiedLabel={C.copied} />
            </div>
            <OutputBox value={output} rows={6} />
          </div>
        )}
      </Card>
    </ToolShell>
  );
}