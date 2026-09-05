import { iconsData } from "./icons-data.js";

export function Icon({ name, size, className = "", style }) {
  const data = iconsData[name];
  if (!data) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || "1em"}
      height={size || "1em"}
      viewBox={`0 0 ${data.w} ${data.h}`}
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: data.body }}
    />
  );
}