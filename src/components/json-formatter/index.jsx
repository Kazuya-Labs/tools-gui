import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, ErrorBox, OutputBox, CopyButton } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function JsonFormatter({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["json-formatter"].ui;
  const C = s.ui;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const process = (space) => {
    setError("");
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, space));
    } catch (e) {
      setError((d.errInvalid || "").replace("{error}", e.message));
      setOutput("");
    }
  };

  return (
    <ToolShell>
      <ToolHeader bg="#054d28" bgOpacity="/10" icon="mdi:code-braces" iconBg="#054d28" iconColor="#ffffff" title={s.tools["json-formatter"].title.split(" — ")[0]} desc={s.tools["json-formatter"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldLabel}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder={d.fieldPh} mono className="focus:border-[#054d28] focus:ring-2 focus:ring-green-100" />
        </Field>

        <div className="flex gap-3 mt-3">
          <div className="w-32">
            <Field label={d.indentLabel} mb="mb-1">
              <select value={indent} onChange={(e) => setIndent(parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none">
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={0}>{d.indentTab}</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <PrimaryButton bg="#054d28" icon="mdi:auto-fix" onClick={() => process(indent)} className="flex-1">{d.btnPretty}</PrimaryButton>
          <PrimaryButton bg="#e5e7eb" dark={false} icon="mdi:unfold-less-horizontal" onClick={() => process(undefined)} className="flex-1 bg-gray-200 text-gray-700 hover:scale-[1.03] active:scale-[0.98]">{d.btnMinify}</PrimaryButton>
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        {output && (
          <div className="mt-4">
            <CopyButton text={output} label={C.copy} copiedLabel={C.copied} color="#054d28" className="mb-2" />
            <OutputBox value={output} rows={8} />
          </div>
        )}
      </Card>
    </ToolShell>
  );
}