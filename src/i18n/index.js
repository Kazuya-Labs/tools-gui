import { LOCALES, SITE_URL } from "./locales.js";
import { TOOLS, TOOL_IDS } from "./tools.js";
import id from "./id.js";
import en from "./en.js";
import ru from "./ru.js";
import zh from "./zh.js";
import ms from "./ms.js";
import tl from "./tl.js";
import ja from "./ja.js";
import pt from "./pt.js";
import hi from "./hi.js";

const DICTS = { id, en, ru, "zh-CN": zh, ms, tl, ja, "pt-BR": pt, hi };

export function getLocale(lang) {
  return DICTS[lang] || id;
}

export function t(lang, path, vars) {
  const parts = path.split(".");
  let node = DICTS[lang] || id;
  for (const p of parts) {
    if (node === undefined || node === null) return path;
    node = node[p];
  }
  if (typeof node === "string") {
    return vars
      ? node.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`))
      : node;
  }
  return node ?? path;
}

export function toolDict(lang, toolId) {
  const d = DICTS[lang] || id;
  const tool = d.tools?.[toolId];
  if (!tool) return d;
  return {
    ui: d.ui,
    ats: d.ats,
    tools: {
      [toolId]: {
        slug: tool.slug,
        title: tool.title,
        desc: tool.desc,
        ui: tool.ui,
      },
    },
  };
}

export function toolSlug(lang, toolId) {
  const node = DICTS[lang]?.tools?.[toolId];
  if (node && node.slug) return node.slug;
  const fallback = id.tools?.[toolId];
  return fallback?.slug || toolId || "";
}

export function localePath(locCode, kind, toolId) {
  if (kind === "tool" && toolId) return `/${locCode}/tools/${toolSlug(locCode, toolId)}/`;
  return `/${locCode}/`;
}

const FOOTER_TOOLS = ['daget-hunter', 'repeater-text', 'extract-phone', 'password-generator', 'cv-builder', 'base64-codec'];

export function footerLinks(lang) {
  const d = DICTS[lang] || id;
  const links = [{ label: d.seo?.breadcrumbHome || 'Home', href: `/${lang}/` }];
  for (const toolId of FOOTER_TOOLS) {
    const tool = d.tools?.[toolId];
    if (tool) {
      links.push({
        label: tool.title.split(' — ')[0],
        href: `/${lang}/tools/${toolSlug(lang, toolId)}/`,
      });
    }
  }
  return links;
}

export { LOCALES, SITE_URL, TOOLS, TOOL_IDS };