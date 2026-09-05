import { useEffect, useRef } from "react";

export function AdBanner({ adKey, width = 728, height = 90 }) {
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

export function AdNative({ src, containerId }) {
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

const ADSTERRA = {
  BANNER_KEY: "c08f303fc0e88a1cdc37f7f6bc369bf9e",
  NATIVE_SRC:
    "https://pl29824427.effectivecpmnetwork.com/ab7e911393d9872b30f287eed16ab794/invoke.js",
  NATIVE_CONTAINER_ID: "container-ab7e911393d9872b30f287eed16ab794",
};

export { ADSTERRA };
