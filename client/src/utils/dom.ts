export function scrollToId(id: string) {
  const el = document.getElementById(id.replace("#", ""));
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
