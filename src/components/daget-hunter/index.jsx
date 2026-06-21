import { useState, useEffect, useRef } from "react";

/* ============================================================
   ADSTERRA SETUP — baca ini dulu
   ============================================================
   1) BANNER_KEY  -> dari unit iklan "Banner 728x90"
   2) NATIVE_SRC  -> src lengkap dari unit "Native Banner" (URL polos, JANGAN
                     ditempel sebagai tag <script>...</script>)
   3) NATIVE_CONTAINER_ID -> id <div> yang diberikan bareng kode Native Banner
   4) POPUNDER_SRC -> src dari unit "Popunder" (disimpan tapi TIDAK dipakai
                       secara default, lihat catatan di bawah komponen utama)
============================================================= */
const BANNER_KEY = "c08f303fc0e88a1cdc37f7f6bc369bf9e";
const NATIVE_SRC =
  "https://pl29824427.effectivecpmnetwork.com/ab7e911393d9872b30f287eed16ab794/invoke.js";
const NATIVE_CONTAINER_ID = "container-ab7e911393d9872b30f287eed16ab794";
const POPUNDER_SRC =
  "https://pl29824428.effectivecpmnetwork.com/ea/13/1f/ea131f88233e0a012b98a066cfc03777.js";

/* ---------- Banner 728x90 (format atOptions + invoke.js) ---------- */
function AdsterraBanner({ adKey, width = 728, height = 90 }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || !adKey || adKey.startsWith("GANTI")) return;
    hostRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `atOptions = {
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    hostRef.current.appendChild(optionsScript);
    hostRef.current.appendChild(invokeScript);
  }, [adKey, width, height]);

  return (
    <div
      ref={hostRef}
      style={{
        minHeight: height,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}

/* ---------- Native Banner (script async + div container) ---------- */
function AdsterraNative({ src, containerId }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || !src || src.includes("GANTI")) return;
    hostRef.current.innerHTML = `<div id="${containerId}"></div>`;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = src;
    hostRef.current.appendChild(script);
  }, [src, containerId]);

  return <div ref={hostRef} style={{ width: "100%" }} />;
}

/* ---------- Popunder ----------
   SENGAJA TIDAK DIPAKAI di tab decode (lihat pemanggilan di bawah).
   Popunder memasang click-listener di level document, sehingga BISA ikut
   kepicu bareng klik tombol "Ambil link daget" — ini berisiko bikin user
   ngerasa "ketipu" pas lagi nunggu klaim uang. Hook-nya saya biarkan ada
   kalau suatu saat kamu mau pasang lagi di tempat yang lebih aman
   (misal hanya di tab "encode", yang dipakai pembuat daget bukan penerima).
------------------------------------------------------------------ */
function useAdsterraPopunder(src, active) {
  useEffect(() => {
    if (!active || !src || src.includes("GANTI")) return;
    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, [src, active]);
}

export default function DagetHunter() {
  const [activeTab, setActiveTab] = useState("encode");
  const [encodeInput, setEncodeInput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [encodedOutput, setEncodedOutput] = useState("");
  const [decodedOutput, setDecodedOutput] = useState("");
  const [decodedLink, setDecodedLink] = useState("");
  const [showEncodeResult, setShowEncodeResult] = useState(false);
  const [showDecodeResult, setShowDecodeResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const SECRET = "DGTK2024";
  const PREFIX = "DAGET-";
  const SEP = "-V3JaX-";

  // Popunder DIMATIKAN di tab decode supaya tidak bentrok dengan klik
  // "Ambil link daget". Ganti `false` jadi `activeTab === "encode"` kalau
  // kamu mau aktifkan khusus untuk pembuat daget (bukan penerima).
  useAdsterraPopunder(POPUNDER_SRC, false);

  const scramble = (str) => {
    let r = "";
    for (let i = 0; i < str.length; i++) {
      r += String.fromCharCode(
        str.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length),
      );
    }
    return r;
  };

  const doEncode = () => {
    const raw = encodeInput.trim();
    if (!raw) {
      alert("Masukkan link dana kaget dulu ya!");
      return;
    }
    if (!raw.startsWith("http")) {
      alert("Sepertinya link tidak valid. Pastikan dimulai dengan https://");
      return;
    }
    const encoded =
      PREFIX +
      btoa(scramble(raw)).replace(/=/g, "") +
      SEP +
      btoa(SECRET + raw.length).replace(/=/g, "");
    setEncodedOutput(encoded);
    setShowEncodeResult(true);
  };

  const doDecode = () => {
    const raw = decodeInput.trim();
    if (!raw) {
      alert("Masukkan kode dari grup WA dulu ya!");
      return;
    }
    try {
      if (!raw.startsWith(PREFIX) || !raw.includes(SEP)) {
        throw new Error("Format tidak valid");
      }
      const parts = raw.substring(PREFIX.length).split(SEP);
      if (parts.length !== 2) {
        throw new Error("Kode tidak lengkap");
      }

      // FIX: hitung padding base64 yang benar (0, 1, atau 2 '='),
      // bukan asumsi selalu "==" — sebelumnya ini bikin ~2/3 kode gagal decode.
      const b64 = parts[0];
      const padding = "=".repeat((4 - (b64.length % 4)) % 4);
      const decoded = scramble(atob(b64 + padding));

      if (!decoded.startsWith("http")) {
        throw new Error("Kode tidak valid atau sudah diubah");
      }
      setDecodedLink(decoded);
      setDecodedOutput(decoded);
      setShowDecodeResult(true);
    } catch (e) {
      alert(
        "Kode tidak valid. Pastikan kamu menyalin kode dengan lengkap dari grup WA.",
      );
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(encodedOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyLink = () => {
    window.open(decodedLink, "_blank");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowEncodeResult(false);
    setShowDecodeResult(false);
  };

  return (
    <div className="max-w-[680px] mx-auto py-4 px-4">
      <h2 className="sr-only">
        DagetKode — platform enkripsi dan distribusi link dana kaget
      </h2>

      {/* Header */}
      <div className="bg-[#1473E6] rounded-lg p-6 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-[#1473E6]">D</span>
        </div>
        <div>
          <h1 className="text-lg font-medium text-white mb-1">DagetKode</h1>
          <p className="text-sm text-white/75">
            Encode & decode link dana kaget dengan aman
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchTab("encode")}
          className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "encode"
              ? "bg-[#1473E6] text-white border-[#1473E6]"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          <i className="ti ti-lock text-base"></i> Encode (pembuat)
        </button>
        <button
          onClick={() => switchTab("decode")}
          className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "decode"
              ? "bg-[#1473E6] text-white border-[#1473E6]"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          <i className="ti ti-lock-open text-base"></i> Decode (klaim)
        </button>
      </div>

      {/* Encode Section */}
      {activeTab === "encode" && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-medium mb-4">
              <i className="ti ti-info-circle text-sm"></i> Untuk pembuat daget
            </div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Masukkan link dana kaget asli
            </label>
            <textarea
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              rows="3"
              placeholder="https://link.dana.id/kaget/xxxxx"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm font-sans resize-none text-gray-900 bg-gray-50 outline-none focus:border-[#1473E6] focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={doEncode}
              className="w-full mt-3 bg-[#1473E6] text-white border-none rounded-lg py-2.5 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-[#0F5DC2] active:bg-[#0D4FA8] transition-colors"
            >
              <i className="ti ti-shield-lock text-lg"></i> Generate kode
              eksklusif
            </button>

            {showEncodeResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <div className="text-xs font-medium text-blue-800 uppercase tracking-wide mb-2">
                  Kode eksklusif siap disebar
                </div>
                <div className="font-mono text-sm text-blue-900 break-all p-2 bg-white rounded border border-blue-100">
                  {encodedOutput}
                </div>
                <button
                  onClick={copyCode}
                  className="mt-2 inline-flex items-center gap-2 bg-[#1473E6] text-white border-none rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-[#0F5DC2] transition-colors"
                >
                  <i className="ti ti-copy text-sm"></i>{" "}
                  {copied ? "Tersalin!" : "Salin kode"}
                </button>
              </div>
            )}

            <div className="h-px bg-gray-200 my-4"></div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#1473E6] text-white rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <strong>Generate kode</strong> dari link daget kamu di sini
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#1473E6] text-white rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <strong>Sebar kode</strong> ke grup WA komunitas kamu
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#1473E6] text-white rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Anggota <strong>decode di website ini</strong> untuk dapat
                  link asli
                </div>
              </div>
            </div>
          </div>

          {/* Banner 728x90 */}
          <div className="mt-4">
            <AdsterraBanner adKey={BANNER_KEY} width={728} height={90} />
          </div>
        </>
      )}

      {/* Decode Section */}
      {activeTab === "decode" && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-medium mb-4">
              <i className="ti ti-users text-sm"></i> Untuk anggota komunitas
            </div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Masukkan kode dari grup WA
            </label>
            <textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              rows="3"
              placeholder="DAGET-aHR0cHM6Ly9saW5r-V3JaX-..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm font-sans resize-none text-gray-900 bg-gray-50 outline-none focus:border-[#1473E6] focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={doDecode}
              className="w-full mt-3 bg-[#1473E6] text-white border-none rounded-lg py-2.5 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-[#0F5DC2] active:bg-[#0D4FA8] transition-colors"
            >
              <i className="ti ti-gift text-lg"></i> Ambil link daget
            </button>

            {showDecodeResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3 text-center">
                <div className="inline-flex w-12 h-12 bg-blue-100 rounded-full items-center justify-center text-blue-600 text-xl mb-2">
                  <i className="ti ti-check"></i>
                </div>
                <div className="text-xs font-medium text-blue-800 uppercase tracking-wide mb-2">
                  Link daget berhasil didapat!
                </div>
                <a
                  href={decodedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1473E6] text-sm font-medium break-all block my-2 hover:underline"
                >
                  {/* {decodedOutput} */}
                </a>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 bg-[#1473E6] text-white border-none rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-[#0F5DC2] transition-colors mt-2"
                >
                  <i className="ti ti-external-link text-sm"></i> Buka link
                </button>
              </div>
            )}

            <div className="bg-gray-50 border-l-4 border-[#1473E6] rounded-r-lg p-3 mt-3">
              <p className="text-xs text-gray-700 leading-relaxed">
                🔐 Kode ini <strong>hanya bisa didecode di sini</strong>. Jika
                kamu coba decode dengan tools base64 biasa, hasilnya tidak akan
                terbaca.
              </p>
            </div>
          </div>

          {/* Native Banner */}
          <div className="mt-4">
            <AdsterraNative
              src={NATIVE_SRC}
              containerId={NATIVE_CONTAINER_ID}
            />
          </div>
          {/* Popunder sengaja tidak dipasang di sini, lihat catatan di atas */}
        </>
      )}
    </div>
  );
}