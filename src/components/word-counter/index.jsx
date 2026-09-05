import { useState, useMemo } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function WordCounter({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["word-counter"].ui;
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const text = input;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter((x) => x.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split("\n").length : 0;
    return { chars, charsNoSpace, words, sentences, paragraphs, lines };
  }, [input]);

  const items = [
    { label: d.statChars, value: stats.chars },
    { label: d.statCharsNoSpace, value: stats.charsNoSpace },
    { label: d.statWords, value: stats.words },
    { label: d.statSentences, value: stats.sentences },
    { label: d.statParagraphs, value: stats.paragraphs },
    { label: d.statLines, value: stats.lines },
  ];

  return (
    <ToolShell>
      <ToolHeader bg="#054d28" bgOpacity="/20" icon="mdi:calculator" iconBg="#054d28" iconColor="#ffffff" title={s.tools["word-counter"].title.split(" — ")[0]} desc={s.tools["word-counter"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldLabel}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder={d.fieldLabel} className="focus:border-[#054d28] focus:ring-2 focus:ring-green-100" />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {items.map((item) => (
            <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[#0e0f0c]" style={{fontFeatureSettings:'calt'}}>{item.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}