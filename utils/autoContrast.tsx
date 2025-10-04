export const wcagTextColor = (bg: string): string => {
  const m = bg.match(/\d+(\.\d+)?/g);
  if (!m) return '#111'; // fallback
  const [r, g, b] = m.map(Number);
  const calculateRelativeLuminance = (v: number): number => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const calculateContrastRatio = (l1: number, l2: number): number => {
    const bright = Math.max(l1, l2) + 0.05;
    const dark = Math.min(l1, l2) + 0.05;
    return bright / dark;
  };
  const Y = 0.2126 * calculateRelativeLuminance(r) + 0.7152 * calculateRelativeLuminance(g) + 0.0722 * calculateRelativeLuminance(b);
  const white = calculateContrastRatio(Y, 1) >= calculateContrastRatio(Y, 0);
  return white ? '#fff' : '#111';
};

export const applyAutoContrast = (root = document): void => {
  const getEffectiveBackgroundColor = (el: Element): string => {
    let element: Element | null = el;
    while (element) {
      const bg = getComputedStyle(element).backgroundColor;
      if (bg && !/rgba?\(0,\s*0,\s*0(?:,\s*0)?\)|transparent/i.test(bg)) return bg;
      element = element.parentElement;
    }
    return 'rgb(255,255,255)'; // default page background
  };
  root.querySelectorAll('.auto-contrast').forEach((element: Element) => {
    (element as HTMLElement).style.color = wcagTextColor(getEffectiveBackgroundColor(element));
  });
};

