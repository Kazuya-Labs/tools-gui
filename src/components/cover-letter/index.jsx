import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, SegmentedButtons, PrimaryButton, OutputBox, CopyButton, Icon } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function CoverLetter({ lang = "id", t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["cover-letter"].ui;
  const C = s.ui;
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [tone, setTone] = useState("formal");
  const [letter, setLetter] = useState("");

  const fill = (str) =>
    (str || "")
      .replace(/\{name\}/g, name.trim())
      .replace(/\{position\}/g, position.trim())
      .replace(/\{company\}/g, company.trim())
      .replace(/\{summary\}/g, summary.trim());

  const generate = () => {
    if (!name.trim()) { alert(d.errName); return; }
    if (!position.trim()) { alert(d.errPosition); return; }
    if (!company.trim()) { alert(d.errCompany); return; }
    const g = d.letter;
    const date = new Date().toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" });
    const paras = [];
    if (tone === "friendly") {
      paras.push(fill(g.openingFriendly));
    } else {
      paras.push(fill(g.salutation));
      if (g.opening) paras.push(g.opening);
    }
    paras.push(fill(g.intro));
    paras.push(summary.trim() ? fill(g.bodyWithSummary) : fill(g.bodyGeneric));
    paras.push(g.closing);
    const signoff = tone === "friendly" ? g.signoffFriendly : g.signoff;
    setLetter([date, ...paras, "", signoff, name.trim()].join("\n"));
  };

  const download = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${name.trim().replace(/[^a-zA-Z0-9]+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell>
      <ToolHeader bg="#7c3aed" bgOpacity="/10" icon="mdi:email-edit-outline" iconBg="#7c3aed" iconColor="#ffffff" title={s.tools["cover-letter"].title.split(" — ")[0]} desc={s.tools["cover-letter"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <Field label={d.fieldName}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={d.phName} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100" />
        </Field>
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="flex-1">
            <Field label={d.fieldPosition} mb="mb-1">
              <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder={d.phPosition} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100" />
            </Field>
          </div>
          <div className="flex-1">
            <Field label={d.fieldCompany} mb="mb-1">
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={d.phCompany} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100" />
            </Field>
          </div>
        </div>
        <div className="mt-3">
          <Field label={d.fieldSummary} mb="mb-1">
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder={d.phSummary} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm resize-none text-gray-900 bg-gray-50 outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100" />
          </Field>
        </div>
        <div className="mt-3">
          <Field label={d.toneLabel} mb="mb-1">
            <SegmentedButtons options={[{ id: "formal", label: d.toneFormal }, { id: "friendly", label: d.toneFriendly }]} value={tone} onChange={setTone} activeBg="#7c3aed" size="sm" />
          </Field>
        </div>
        <PrimaryButton bg="#7c3aed" icon="mdi:email-edit-outline" onClick={generate} className="mt-4">{d.btn}</PrimaryButton>

        {letter && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{d.resultLabel}</span>
              <div className="flex items-center gap-3">
                <button onClick={download} className="inline-flex items-center gap-1 text-xs font-medium cursor-pointer hover:underline bg-transparent border-none" style={{ color: "#7c3aed" }}>
                  <Icon name="mdi:download" className="text-sm" /> {d.downloadLabel}
                </button>
                <CopyButton text={letter} color="#7c3aed" label={C.copy} copiedLabel={C.copied} />
              </div>
            </div>
            <OutputBox value={letter} rows={14} mono={false} />
          </div>
        )}
      </Card>
    </ToolShell>
  );
}