// Ottawa, ON pricing (CAD)

export const BASE_PRICES = {
  nails: {
    Subtle: 35,
    Balanced: 55,
    "Full Glam": 80,
  },
  skincare: {
    Subtle: 65,
    Balanced: 95,
    "Full Glam": 135,
  },
  lashes: {
    Subtle: 85,
    Balanced: 120,
    "Full Glam": 160,
  },
};

export const BASE_LABELS = {
  nails: { Subtle: "Basic Manicure", Balanced: "Gel Manicure", "Full Glam": "Full Set Extensions" },
  skincare: { Subtle: "Express Facial", Balanced: "Signature Facial", "Full Glam": "Premium Treatment" },
  lashes: { Subtle: "Classic Set", Balanced: "Volume Set", "Full Glam": "Mega Volume Set" },
};

export const STYLE_ADD_ONS = {
  nails: {
    "Floral Art": 15,
    "Chrome / Mirror": 20,
    "3D Nail Art": 25,
    "Ombré": 15,
    "Marble": 15,
    "Glitter Accent": 10,
    "Cat Eye": 12,
    "Stiletto": 10,
    "Coffin Shape": 10,
  },
  skincare: {
    "Glass Skin": 20,
    "K-Beauty": 20,
    "Brightening": 25,
    "Anti-Aging": 30,
    "Hydrated & Plump": 15,
  },
  lashes: {
    "Hybrid": 20,
    "Mega Volume": 30,
    "Bottom Lashes": 25,
    "Fox Eye": 15,
    "Colored Tips": 20,
    "Kim K": 25,
    "Wispy": 15,
  },
};

export function calculatePrice(service, intensity, styles = []) {
  if (!service || !intensity) return null;

  const base = BASE_PRICES[service]?.[intensity] ?? 0;
  const addOns = styles.reduce((sum, style) => {
    return sum + (STYLE_ADD_ONS[service]?.[style] ?? 0);
  }, 0);

  const breakdown = [];
  if (base) {
    breakdown.push({ label: BASE_LABELS[service]?.[intensity] || "Base Service", price: base });
  }
  styles.forEach((style) => {
    const price = STYLE_ADD_ONS[service]?.[style];
    if (price) breakdown.push({ label: style, price });
  });

  return {
    base,
    addOns,
    total: base + addOns,
    breakdown,
  };
}