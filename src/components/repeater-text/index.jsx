import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, OutputBox, useCopy, Icon } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function RepeaterText({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["repeater-text"].ui;
  const C = s.ui;
  const [input, setInput] = useState("");
  const [count, setCount] = useState(2);
  const [delimiter, setDelimiter] = useState("\n");
  const [output, setOutput] = useState("");
  const { copied, copy } = useCopy();

  const process = () => {
    if (!input.trim()) { alert(d.errEmpty); return; }
    if (count < 1 || count > 10000) { alert(d.errCount); return; }
    const sep = delimiter === "\\n" ? "\n" : delimiter === "\\t" ? "\t" : delimiter;
    setOutput(Array(count).fill(input.trim()).join(sep));
  };

  return (
    <ToolShell>
      <ToolHeader bg="#9fe870" icon="mdi:content-copy" iconBg="#163300" iconColor="#ffffff" title={s.tools["repeater-text"].title.split(" — ")[0]} desc={s.tools["repeater-text"].desc} titleColor="#163300" descColor="rgba(22,51,0,0.75)" />
      <Card>
        <Field label={d.labelText}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder={d.phText} className="focus:border-[#9fe870] focus:ring-2 focus:ring-green-100" />
        </Field>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <Field label={d.labelCount} mb="mb-1">
              <input type="number" min="1" max="10000" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#9fe870] focus:ring-2 focus:ring-green-100" />
            </Field>
          </div>
          <div className="flex-1">
            <Field label={d.labelSep} mb="mb-1">
              <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#9fe870] focus:ring-2 focus:ring-green-100">
                <option value="\n">{d.sepNewline}</option>
                <option value=" ">{d.sepSpace}</option>
                <option value=", ">{d.sepComma}</option>
                <option value=" | ">{d.sepPipe}</option>
                <option value="">{d.sepNone}</option>
              </select>
            </Field>
          </div>
        </div>

        <PrimaryButton bg="#9fe870" dark={false} icon="mdi:play" onClick={process} className="mt-3">{d.btn}</PrimaryButton>

        {output && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{C.result}</span>
              <span className="text-xs text-gray-400">{output.length} {C.chars}</span>
            </div>
            <OutputBox value={output} rows={6} />
            <button onClick={() => copy(output)} className="mt-2 inline-flex items-center gap-2 bg-[#9fe870] text-[#163300] border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform">
              <Icon name="mdi:content-copy" className="text-sm" /> {copied ? C.copied : d.copyResult}
            </button>
          </div>
        )}
      </Card>
    </ToolShell>
  );
}