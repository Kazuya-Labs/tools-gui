import { useState } from "react";
import { ToolShell, ToolHeader, Card, Field, TextArea, PrimaryButton, OutputBox, CopyButton } from "../ui/index.jsx";
import idDict from "../../i18n/id.js";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateText(paragraphs, wordsPerParagraph) {
  const result = [];
  for (let p = 0; p < paragraphs; p++) {
    const words = [];
    for (let w = 0; w < wordsPerParagraph; w++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    result.push(words.join(" ") + ".");
  }
  return result.join("\n\n");
}

export default function LoremIpsum({ t: T }) {
  const s = T && T.tools ? T : idDict;
  const d = s.tools["lorem-ipsum"].ui;
  const C = s.ui;
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [output, setOutput] = useState("");

  const generate = () => {
    if (paragraphs < 1 || paragraphs > 50) { alert(d.errParagraphs); return; }
    if (wordsPerParagraph < 5 || wordsPerParagraph > 500) { alert(d.errWords); return; }
    setOutput(generateText(paragraphs, wordsPerParagraph));
  };

  return (
    <ToolShell>
      <ToolHeader bg="#868685" bgOpacity="/15" icon="mdi:file-document" iconBg="#868685" iconColor="#ffffff" title={s.tools["lorem-ipsum"].title.split(" — ")[0]} desc={s.tools["lorem-ipsum"].desc} titleColor="#0e0f0c" descColor="rgba(0,0,0,0.6)" />
      <Card>
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Field label={d.labelParagraphs} mb="mb-1">
              <input type="number" min="1" max="50" value={paragraphs} onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100" />
            </Field>
          </div>
          <div className="flex-1">
            <Field label={d.labelWords} mb="mb-1">
              <input type="number" min="5" max="500" value={wordsPerParagraph} onChange={(e) => setWordsPerParagraph(parseInt(e.target.value) || 50)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100" />
            </Field>
          </div>
        </div>

        <PrimaryButton bg="#868685" icon="mdi:refresh" onClick={generate}>{d.btn}</PrimaryButton>

        {output && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{C.result}</span>
              <CopyButton text={output} label={C.copy} copiedLabel={C.copied} color="#868685" />
            </div>
            <OutputBox value={output} rows={10} mono={false} />
          </div>
        )}
      </Card>
    </ToolShell>
  );
}