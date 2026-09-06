import { useState } from "react";
import { Icon } from "./Icon.jsx";

export { Icon } from "./Icon.jsx";

export function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  };
  return { copied, copy };
}

export function ToolShell({ children, className = "" }) {
  return <div className={`max-w-[680px] mx-auto py-4 px-4 ${className}`}>{children}</div>;
}

export function ToolHeader({ bg, bgOpacity, title, desc, titleColor = "#ffffff", descColor = "rgba(255,255,255,0.75)", iconBg = "#ffffff", iconColor, icon }) {
  return (
    <div className="rounded-lg p-6 mb-4 flex items-center gap-3" style={{ backgroundColor: bgOpacity ? `${bg}${bgOpacity}` : bg }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        {typeof icon === "string" ? (
          <Icon name={icon} className="text-lg" style={{ color: iconColor }} />
        ) : icon}
      </div>
      <div>
        <h1 className="text-lg font-medium mb-1" style={{ color: titleColor }}>{title}</h1>
        <p className="text-sm" style={{ color: descColor }}>{desc}</p>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`bg-white border border-gray-200 rounded-lg p-5 ${className}`}>{children}</div>;
}

export function Field({ label, children, mb = "mb-2" }) {
  return (
    <div>
      <label className={`block text-xs font-medium text-gray-600 uppercase tracking-wide ${mb}`}>{label}</label>
      {children}
    </div>
  );
}

export function TextArea({ value, onChange, rows = 4, placeholder, bg = "bg-gray-50", mono = false, fontSerif = false, className = "" }) {
  const font = mono ? "font-mono" : fontSerif ? "font-serif" : "font-sans";
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`w-full border border-gray-300 rounded-lg p-3 text-sm ${font} resize-none text-gray-900 ${bg} outline-none ${className}`}
    />
  );
}

export function OutputBox({ value, rows = 8, mono = true, readOnly = true }) {
  const font = mono ? "font-mono" : "font-serif";
  return (
    <textarea
      readOnly={readOnly}
      value={value}
      rows={rows}
      className={`w-full border border-gray-200 rounded-lg p-3 text-sm ${font} resize-none text-gray-900 bg-gray-50`}
    />
  );
}

export function PrimaryButton({ bg, dark = true, icon, children, onClick, className = "", disabled = false }) {
  const txt = dark ? "text-white" : "text-[#0e0f0c]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${txt} border-none rounded-lg py-2.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ backgroundColor: bg }}
    >
      {icon && <Icon name={icon} className="text-lg" />} {children}
    </button>
  );
}

export function CopyButton({ text, label = "Salin", copiedLabel = "Tersalin!", className = "", color }) {
  const { copied, copy } = useCopy();
  return (
    <button onClick={() => copy(text)} className={`inline-flex items-center gap-1 text-xs font-medium cursor-pointer hover:underline bg-transparent border-none ${className}`} style={color ? { color } : undefined}>
      <Icon name="mdi:content-copy" className="text-sm" /> {copied ? copiedLabel : label}
    </button>
  );
}

export function CopyResultHeader({ text, label = "Hasil", copyLabel = "Salin", copiedLabel = "Tersalin!", color }) {
  const { copied, copy } = useCopy();
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</span>
      <button onClick={() => copy(text)} className="inline-flex items-center gap-1 text-xs font-medium cursor-pointer hover:underline bg-transparent border-none" style={color ? { color } : undefined}>
        <Icon name="mdi:content-copy" className="text-sm" /> {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export function AddButton({ label, onClick }) {
  return (
    <button onClick={onClick} className="w-full bg-gray-100 text-gray-700 border border-dashed border-gray-300 rounded-lg py-2.5 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
      <Icon name="mdi:plus" className="text-base" /> {label}
    </button>
  );
}

export function ErrorBox({ children }) {
  return <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{children}</div>;
}

export function SegmentedButtons({ options, value, onChange, activeBg = "#054d28", size = "md" }) {
  const sizeClass = size === "sm" ? "py-2 px-3 text-xs" : "py-2.5 px-3 text-sm";
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex-1 ${sizeClass} rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${active ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            style={active ? { backgroundColor: activeBg, borderColor: activeBg } : undefined}
          >
            {opt.icon && <Icon name={opt.icon} className="text-base" />} {opt.label}
          </button>
        );
      })}
    </div>
  );
}
