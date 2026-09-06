import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, SegmentedButtons, ErrorBox, OutputBox, CopyButton } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

export default function Base64Codec({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["base64-codec"].ui;
  const C = s.ui;
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    if (!input.trim()) return;
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.replace(/\s/g, "")))));
      }
    } catch {
      setError(d.errInvalid);
      setOutput("");
    }
  };

  return (
    <ToolShell>
      <ToolHeader bg="#d03238" bgOpacity="/10" icon="mdi:swap-horizontal" iconBg="#d03238" iconColor="#ffffff" title={s.tools["base64-codec"].title.split(" — ")[0]} desc={s.tools["base64-codec"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <SegmentedButtons
          options={[{ id: "encode", label: C.encode }, { id: "decode", label: C.decode }]}
          value={mode}
          onChange={(v) => { setMode(v); setOutput(""); setError(""); }}
          activeBg="#d03238"
        />

        <div className="mt-4">
          <Field label={mode === "encode" ? d.labelEncode : d.labelDecode}>
            <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder={mode === "encode" ? d.phEncode : d.phDecode} mono className="focus:border-[#d03238] focus:ring-2 focus:ring-red-100" />
          </Field>
        </div>

        <PrimaryButton bg="#d03238" icon="mdi:swap-horizontal" onClick={process} className="mt-3">{mode === "encode" ? C.encode : C.decode}</PrimaryButton>

        {error && <ErrorBox>{error}</ErrorBox>}

        {output && (
          <div className="mt-4">
            <CopyButton text={output} label={C.copy} copiedLabel={C.copied} color="#d03238" className="mb-2" />
            <OutputBox value={output} rows={4} />
          </div>
        )}
      </Card>
    </ToolShell>
  );
}