import { useState } from "react";
import { ToolShell, ToolHeader, Card, PrimaryButton, Field, useCopy, Icon } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

function getStrength(len, opts) {
  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (opts.lower && opts.upper) score++;
  if (opts.numbers) score++;
  if (opts.symbols) score++;
  if (len >= 16) score++;
  if (score <= 2) return 0;
  if (score <= 3) return 1;
  if (score <= 4) return 2;
  return 3;
}

const STRENGTH_COLORS = ["#e5484d", "#f5a524", "#f7d154", "#9fe870"];

export default function PasswordGenerator({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["password-generator"].ui;
  const C = s.ui;
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const { copied, copy } = useCopy();

  const gen = () => {
    const pools = [];
    if (opts.lower) pools.push("abcdefghijklmnopqrstuvwxyz");
    if (opts.upper) pools.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (opts.numbers) pools.push("0123456789");
    if (opts.symbols) pools.push("!@#$%^&*()-_=+[]{};:,.?/");
    if (pools.length === 0) { alert(d.errNone); return; }
    let result = "";
    for (let i = 0; i < length; i++) {
      const pool = pools[Math.floor(Math.random() * pools.length)];
      result += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(result);
  };

  const toggle = (key) => setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  const strength = getStrength(length, opts);
  const strengthLabels = [d.strWeak, d.strMedium, d.strStrong, d.strVeryStrong];

  const checkboxes = [
    ["lower", "a-z", d.optLower],
    ["upper", "A-Z", d.optUpper],
    ["numbers", "0-9", d.optNumbers],
    ["symbols", "!@#", d.optSymbols],
  ];

  return (
    <ToolShell>
      <ToolHeader bg="#054d28" bgOpacity="/15" icon="mdi:key" iconBg="#054d28" iconColor="#ffffff" title={s.tools["password-generator"].title.split(" — ")[0]} desc={s.tools["password-generator"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <input type="range" min="6" max="32" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-[#054d28]" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>6</span>
          <span className="font-medium text-gray-800">{length} {C.chars}</span>
          <span>32</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {checkboxes.map(([key, display, label]) => (
            <label key={key} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer text-sm hover:border-gray-300 transition-colors">
              <input type="checkbox" checked={opts[key]} onChange={() => toggle(key)} className="rounded accent-[#054d28]" />
              <span className="font-mono text-xs">{display}</span>
              <span className="text-xs text-gray-600">{label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full transition-all duration-300" style={{ width: `${((strength + 1) / 4) * 100}%`, backgroundColor: STRENGTH_COLORS[strength] }}></div>
          </div>
          <div className="text-xs font-medium mt-1.5" style={{ color: STRENGTH_COLORS[strength] }}>{strengthLabels[strength]}</div>
        </div>

        <PrimaryButton bg="#054d28" icon="mdi:refresh" onClick={gen} className="mt-4">{d.btn}</PrimaryButton>

        {password && (
          <div className="mt-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex-1 font-mono text-sm text-gray-900 break-all">{password}</div>
              <button onClick={() => copy(password)} className="flex-shrink-0 inline-flex items-center gap-1 bg-[#054d28] text-white border-none rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform">
                <Icon name="mdi:content-copy" className="text-sm" /> {copied ? C.copied : C.copy}
              </button>
            </div>
          </div>
        )}
      </Card>
    </ToolShell>
  );
}