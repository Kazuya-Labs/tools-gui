import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, CopyButton } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

const CASES = [
  { id: "upper", label: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { id: "lower", label: "lower case", fn: (s) => s.toLowerCase() },
  { id: "title", label: "Title Case", fn: (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id: "sentence", label: "Sentence case", fn: (s) => s.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()) },
  { id: "camel", label: "camelCase", fn: (s) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase()) },
  { id: "pascal", label: "PascalCase", fn: (s) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase()) },
  { id: "snake", label: "snake_case", fn: (s) => s.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase() },
  { id: "kebab", label: "kebab-case", fn: (s) => s.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() },
];

export default function CaseConverter({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["case-converter"].ui;
  const C = s.ui;
  const [input, setInput] = useState("");
  const [results, setResults] = useState({});

  const convert = () => {
    if (!input.trim()) { alert(d.errEmpty); return; }
    const r = {};
    CASES.forEach((c) => { r[c.id] = c.fn(input); });
    setResults(r);
  };

  return (
    <ToolShell>
      <ToolHeader bg="#ffd11a" bgOpacity="/15" icon="mdi:format-letter-case" iconBg="#ffd11a" iconColor="#0e0f0c" title={s.tools["case-converter"].title.split(" — ")[0]} desc={s.tools["case-converter"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldLabel}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder={d.fieldPh} className="focus:border-[#ffd11a] focus:ring-2 focus:ring-yellow-100" />
        </Field>

        <PrimaryButton bg="#ffd11a" dark={false} icon="mdi:refresh" onClick={convert} className="mt-3">{d.btn}</PrimaryButton>

        {Object.keys(results).length > 0 && (
          <div className="space-y-2 mt-4">
            {CASES.map((c) => (
              <div key={c.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{c.label}</div>
                  <div className="text-sm text-gray-900 font-mono truncate">{results[c.id]}</div>
                </div>
                <CopyButton text={results[c.id]} color="#6b7280" label={C.copy} copiedLabel={C.copied} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </ToolShell>
  );
}