import { useState, useCallback } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, AddButton, SegmentedButtons, Icon } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

const emptyExp = { company: "", position: "", startDate: "", endDate: "", current: false, description: "" };
const emptyEdu = { school: "", degree: "", startDate: "", endDate: "", description: "" };
const emptySkill = { name: "" };

const INPUT_CLASS = "w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-white outline-none focus:border-[#054d28] focus:ring-2 focus:ring-green-100";
const TEXTAREA_CLASS = "w-full border border-gray-300 rounded-lg p-2.5 text-sm font-sans resize-none text-gray-900 bg-white outline-none focus:border-[#054d28] focus:ring-2 focus:ring-green-100";

function listActions(empty, onChange) {
  return {
    add: () => onChange((prev) => [...prev, { ...empty }]),
    remove: (i) => onChange((prev) => prev.filter((_, idx) => idx !== i)),
    update: (i, key, val) => onChange((prev) => prev.map((item, idx) => idx === i ? { ...item, [key]: val } : item)),
  };
}

function formatMonth(value, lang) {
  if (!value) return "";
  const [y, m] = value.split("-");
  if (!m) return y;
  const label = new Intl.DateTimeFormat(lang || "id", { month: "short", year: "numeric" }).format(new Date(y, parseInt(m, 10) - 1, 1));
  return label.charAt(0).toLocaleUpperCase(lang || "id") + label.slice(1);
}

function buildAtsRules(ats) {
  return [
    { test: (d) => !!d.personal.name, pts: 10, msg: ats.fbName },
    { test: (d) => !!d.personal.email, pts: 10, msg: ats.fbEmail },
    { test: (d) => !!d.personal.phone, pts: 5, msg: ats.fbPhone },
    { test: (d) => !!d.personal.jobTitle, pts: 5, msg: ats.fbJobTitle },
    { test: (d) => d.summary.length >= 50, pts: 15, msg: null, partialMsg: ats.fbSummaryShort, emptyMsg: ats.fbSummaryEmpty },
    { test: (d) => d.experiences.length >= 1, pts: 20, msg: ats.fbExp },
    { test: (d) => d.educations.length >= 1, pts: 15, msg: ats.fbEdu },
  ];
}

function scoreATS(data, ats) {
  const rules = buildAtsRules(ats);
  let score = 0;
  const feedback = [];
  const namedSkills = data.skills.filter((s) => s.name.trim());
  for (const rule of rules) {
    if (rule.test(data)) {
      score += rule.pts;
    } else if (rule.emptyMsg) {
      feedback.push(rule.emptyMsg);
    } else if (rule.partialMsg && data.summary.length > 0) {
      feedback.push(rule.partialMsg);
    } else if (rule.msg) {
      feedback.push(rule.msg);
    }
  }
  if (namedSkills.length >= 3) { score += 10; } else { feedback.push(ats.fbSkills); }
  if (data.skills.length > namedSkills.length) { feedback.push(ats.fbEmptySkill); }
  const hasDesc = data.experiences.some((e) => e.description.length >= 50);
  if (hasDesc) { score += 10; } else if (data.experiences.length > 0) { feedback.push(ats.fbDesc); }
  return { score, feedback };
}

function PersonalForm({ d, data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  const fields = [
    ["jobTitle", d.fieldJobTitle, "text", d.phJobTitle],
    ["name", d.fieldName, "text", d.phName],
    ["email", d.fieldEmail, "email", d.phEmail],
    ["phone", d.fieldPhone, "tel", d.phPhone],
    ["address", d.fieldAddress, "text", d.phAddress],
    ["linkedin", d.fieldLinkedin, "url", d.phLinkedin],
    ["portfolio", d.fieldPortfolio, "url", d.phPortfolio],
  ];
  return (
    <div className="space-y-3">
      {fields.map(([key, label, type, placeholder]) => (
        <Field key={key} label={label} mb="mb-1">
          <input type={type} value={data[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={INPUT_CLASS} />
        </Field>
      ))}
    </div>
  );
}

function ExperienceForm({ d, items, onChange }) {
  const { add, remove, update } = listActions(emptyExp, onChange);
  return (
    <div className="space-y-4">
      {items.map((exp, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
          <button onClick={() => remove(i)} className="absolute top-2 right-2 text-xs text-red-500 bg-transparent border-none cursor-pointer hover:text-red-700">{d.removeItem}</button>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label={d.fieldPosition} mb="mb-1"><input type="text" value={exp.position} onChange={(e) => update(i, "position", e.target.value)} placeholder={d.phPosition} className={INPUT_CLASS} /></Field>
            <Field label={d.fieldCompany} mb="mb-1"><input type="text" value={exp.company} onChange={(e) => update(i, "company", e.target.value)} placeholder={d.phCompany} className={INPUT_CLASS} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label={d.fieldStart} mb="mb-1"><input type="month" value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} className={INPUT_CLASS} /></Field>
            <Field label={d.fieldEnd} mb="mb-1"><input type="month" value={exp.current ? "" : exp.endDate} onChange={(e) => update(i, "endDate", e.target.value)} disabled={exp.current} className={`${INPUT_CLASS} disabled:bg-gray-100`} /></Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600 mb-3 cursor-pointer"><input type="checkbox" checked={exp.current} onChange={(e) => update(i, "current", e.target.checked)} /> {d.currentCheck}</label>
          <Field label={d.fieldDesc} mb="mb-0"><textarea value={exp.description} onChange={(e) => update(i, "description", e.target.value)} rows="3" placeholder={d.phDesc} className={TEXTAREA_CLASS} /></Field>
        </div>
      ))}
      <AddButton label={d.addExperience} onClick={add} />
    </div>
  );
}

function EducationForm({ d, items, onChange }) {
  const { add, remove, update } = listActions(emptyEdu, onChange);
  return (
    <div className="space-y-4">
      {items.map((edu, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
          <button onClick={() => remove(i)} className="absolute top-2 right-2 text-xs text-red-500 bg-transparent border-none cursor-pointer hover:text-red-700">{d.removeItem}</button>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label={d.fieldSchool} mb="mb-1"><input type="text" value={edu.school} onChange={(e) => update(i, "school", e.target.value)} placeholder={d.phSchool} className={INPUT_CLASS} /></Field>
            <Field label={d.fieldDegree} mb="mb-1"><input type="text" value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} placeholder={d.phDegree} className={INPUT_CLASS} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={d.fieldStart} mb="mb-1"><input type="month" value={edu.startDate} onChange={(e) => update(i, "startDate", e.target.value)} className={INPUT_CLASS} /></Field>
            <Field label={d.fieldEnd} mb="mb-1"><input type="month" value={edu.endDate} onChange={(e) => update(i, "endDate", e.target.value)} className={INPUT_CLASS} /></Field>
          </div>
        </div>
      ))}
      <AddButton label={d.addEducation} onClick={add} />
    </div>
  );
}

function SkillsForm({ d, items, onChange }) {
  const { add, remove, update } = listActions(emptySkill, onChange);
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3" dangerouslySetInnerHTML={{ __html: d.skillsInfo }}></p>
      <div className="space-y-3">
        {items.map((skill, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
            <input type="text" value={skill.name} onChange={(e) => update(i, "name", e.target.value)} placeholder={d.skillsPh} className={`flex-1 ${INPUT_CLASS}`} />
            <button onClick={() => remove(i)} className="text-red-500 bg-transparent border-none cursor-pointer hover:text-red-700 text-sm"><Icon name="mdi:close" className="text-sm" /></button>
          </div>
        ))}
        <AddButton label={d.addSkill} onClick={add} />
      </div>
    </div>
  );
}

function LanguagesForm({ d, items, onChange }) {
  const levels = [d.levelBasic, d.levelIntermediate, d.levelAdvanced, d.levelNative];
  const { add, remove, update } = listActions({ name: "", level: d.levelIntermediate }, onChange);
  return (
    <div className="space-y-3">
      {items.map((lang, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
          <input type="text" value={lang.name} onChange={(e) => update(i, "name", e.target.value)} placeholder={d.langPh} className={`flex-1 ${INPUT_CLASS}`} />
          <select value={lang.level} onChange={(e) => update(i, "level", e.target.value)} className={INPUT_CLASS}>
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => remove(i)} className="text-red-500 bg-transparent border-none cursor-pointer hover:text-red-700 text-sm"><Icon name="mdi:close" className="text-sm" /></button>
        </div>
      ))}
      <AddButton label={d.addLanguage} onClick={add} />
    </div>
  );
}

function CVSection({ title, children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      <h3 className="text-xs font-bold text-[#054d28] uppercase tracking-widest mb-2">{title}</h3>
      {children}
    </div>
  );
}

function CVPreview({ d, lang, data }) {
  const hasContent = data.personal.name || data.experiences.length > 0 || data.educations.length > 0;
  if (!hasContent) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500 text-sm">
        <Icon name="mdi:file-document" className="text-3xl mb-3 block" />
        {d.emptyPrefill}
      </div>
    );
  }
  const namedSkills = data.skills.filter((s) => s.name.trim());
  const namedLanguages = data.languages.filter((l) => l.name.trim());
  return (
    <div id="cv-preview" className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#0e0f0c] mb-1">{data.personal.name || d.emptyName}</h2>
        {data.personal.jobTitle && <div className="text-sm font-semibold text-[#054d28] mb-2">{data.personal.jobTitle}</div>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.address && <span>{data.personal.address}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.portfolio && <span>{data.personal.portfolio}</span>}
        </div>
      </div>

      {data.summary && (
        <CVSection title={d.sectionSummary}>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </CVSection>
      )}

      {data.experiences.length > 0 && (
        <CVSection title={d.sectionExperience} className="mb-0">
          {data.experiences.map((exp, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#0e0f0c]">{exp.position || d.fbPosition}</span>
                <span className="text-xs text-gray-400">{formatMonth(exp.startDate, lang)}{exp.current ? ` — ${d.presentWord}` : exp.endDate ? ` — ${formatMonth(exp.endDate, lang)}` : ""}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{exp.company || d.fbCompany}</div>
              {exp.description && <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </CVSection>
      )}

      {data.educations.length > 0 && (
        <CVSection title={d.sectionEducation}>
          {data.educations.map((edu, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#0e0f0c]">{edu.degree || d.fbDegree}</span>
                <span className="text-xs text-gray-400">{formatMonth(edu.startDate, lang)}{edu.endDate ? ` — ${formatMonth(edu.endDate, lang)}` : ""}</span>
              </div>
              <div className="text-xs text-gray-500">{edu.school || d.fbSchool}</div>
            </div>
          ))}
        </CVSection>
      )}

      {namedSkills.length > 0 && (
        <CVSection title={d.sectionSkills}>
          <p className="text-sm text-gray-700 leading-relaxed">{namedSkills.map((s) => s.name).join(", ")}</p>
        </CVSection>
      )}

      {namedLanguages.length > 0 && (
        <CVSection title={d.sectionLanguages} className="border-b-0">
          <p className="text-sm text-gray-700 leading-relaxed">{namedLanguages.map((l) => `${l.name} (${l.level})`).join(", ")}</p>
        </CVSection>
      )}
    </div>
  );
}

export default function CvBuilder({ t: T, lang }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["cv-builder"].ui;
  const ats = s.ats;
  const LOCALE = lang && s ? lang : "id";

  const TABS = [
    { id: "personal", label: d.tabPersonal, icon: "mdi:account" },
    { id: "experience", label: d.tabExperience, icon: "mdi:briefcase" },
    { id: "education", label: d.tabEducation, icon: "mdi:school" },
    { id: "skills", label: d.tabSkills, icon: "mdi:toolbox" },
    { id: "languages", label: d.tabLanguages, icon: "carbon:language" },
    { id: "summary", label: d.tabSummary, icon: "mdi:note" },
  ];

  const [activeTab, setActiveTab] = useState("personal");
  const [personal, setPersonal] = useState({ jobTitle: "", name: "", email: "", phone: "", address: "", linkedin: "", portfolio: "" });
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [summary, setSummary] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [exporting, setExporting] = useState(false);

  const data = { personal, experiences, educations, skills, languages, summary };

  const calcScore = useCallback(() => {
    setAtsResult(scoreATS(data, ats));
  }, [personal, experiences, educations, skills, languages, summary, ats]);

  const exportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("cv-preview");
      if (!element) { alert(d.errNoPreview); return; }
      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `${personal.name || "CV"}-ATS.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(element).save();
    } catch (err) {
      alert(d.exportFail);
    } finally {
      setExporting(false);
    }
  }, [personal.name, d.errNoPreview, d.exportFail]);

  return (
    <ToolShell>
      <ToolHeader bg="#054d28" bgOpacity="/10" icon="mdi:file-account" iconBg="#054d28" iconColor="#ffffff" title={d.headerTitle} desc={d.headerDesc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <SegmentedButtons options={TABS} value={activeTab} onChange={setActiveTab} activeBg="#054d28" size="sm" />
      </div>

      <Card className="mb-4">
        {activeTab === "personal" && <PersonalForm d={d} data={personal} onChange={setPersonal} />}
        {activeTab === "experience" && <ExperienceForm d={d} items={experiences} onChange={setExperiences} />}
        {activeTab === "education" && <EducationForm d={d} items={educations} onChange={setEducations} />}
        {activeTab === "skills" && <SkillsForm d={d} items={skills} onChange={setSkills} />}
        {activeTab === "languages" && <LanguagesForm d={d} items={languages} onChange={setLanguages} />}
        {activeTab === "summary" && (
          <div>
            <Field label={d.summaryLabel}>
              <TextArea value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} placeholder={d.phSummary || ""} className="focus:border-[#054d28] focus:ring-2 focus:ring-green-100" />
            </Field>
            <p className="text-xs text-gray-500 mt-1">{summary.length} {s.ui.chars} {summary.length > 0 && summary.length < 50 ? ` — ${d.summaryHint}` : ""}</p>
          </div>
        )}
      </Card>

      <div className="flex gap-2 mb-4">
        <PrimaryButton bg="#054d28" icon="mdi:download" onClick={exportPDF} disabled={exporting} className="flex-1">{exporting ? d.exporting : d.btnExport}</PrimaryButton>
        <PrimaryButton bg="#f3f4f6" dark={false} icon="mdi:chart-bar" onClick={calcScore} className="flex-1 bg-gray-100 text-gray-700">{d.btnScore}</PrimaryButton>
      </div>

      {atsResult && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${atsResult.score >= 80 ? "bg-[#054d28] text-white" : atsResult.score >= 50 ? "bg-[#ffd11a] text-[#0e0f0c]" : "bg-[#d03238] text-white"}`}>
              {atsResult.score}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0e0f0c]">{d.scoreTitle}</div>
              <div className="text-xs text-gray-500">{atsResult.score >= 80 ? d.scoreGood : atsResult.score >= 50 ? d.scoreMed : d.scoreBad}</div>
            </div>
          </div>
          {atsResult.feedback.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{d.fbTitle}</div>
              {atsResult.feedback.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Icon name="mdi:alert-circle" className="text-[#ffd11a] mt-0.5 flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-2">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{d.previewLabel}</div>
        <CVPreview d={d} lang={LOCALE} data={data} />
      </div>
    </ToolShell>
  );
}