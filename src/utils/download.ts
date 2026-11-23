export const downloadName = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `emma-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.png`;
};

/** Descarga un PNG; si el navegador no soporta `download`, usa la hoja de compartir. */
export async function downloadBlob(blob: Blob, name = downloadName()): Promise<boolean> {
  if (typeof document !== 'undefined' && 'download' in HTMLAnchorElement.prototype) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }
  try {
    const file = new File([blob], name, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file] }); return true; }
  } catch { /* cancelado */ }
  return false;
}
