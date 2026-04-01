export const SHOCK_TYPES_BY_SANITIZER = {
  Chlorine: [
    { label: "Cal-Hypo (Calcium Hypochlorite)", value: "cal-hypo" },
    { label: "Dichlor (Sodium Dichloro-s-triazinetrione)", value: "dichlor" },
    { label: "Lithium Hypochlorite", value: "lithium-hypo" },
    { label: "Non-Chlorine (MPS/Potassium Monopersulfate)", value: "mps" },
  ],
  Bromine: [
    { label: "Non-Chlorine (MPS/Potassium Monopersulfate)", value: "mps" },
    { label: "Bromine Granules", value: "bromine-granules" },
  ],
  Biguanide: [
    { label: "Hydrogen Peroxide Shock", value: "h2o2" },
    { label: "Biguanide-Compatible Shock", value: "biguanide-shock" },
  ],
  "Salt Water": [
    { label: "Non-Chlorine (MPS)", value: "mps" },
    { label: "Let Salt Cell Handle It", value: "salt-cell" },
  ],
};

/**
 * Shock types that add sanitizer and should be excluded from consumption calculations
 */
const SANITIZER_ADDING_SHOCKS = [
  "cal-hypo",
  "dichlor",
  "lithium-hypo",
  "bromine-granules",
];

/**
 * Check if a shock type adds sanitizer to the water
 * @param {string} shockType - The shock type value
 * @returns {boolean} - True if shock adds sanitizer and should be excluded from consumption calculations
 */
export function isChlorineBasedShock(shockType) {
  if (!shockType) return false;
  return SANITIZER_ADDING_SHOCKS.includes(shockType);
}

export function getShockTypesForSanitizer(sanitizerType) {
  return (
    SHOCK_TYPES_BY_SANITIZER[sanitizerType] ||
    SHOCK_TYPES_BY_SANITIZER["Chlorine"]
  );
}

export function getShockTypeLabel(shockTypeValue, sanitizerType) {
  const types = getShockTypesForSanitizer(sanitizerType);
  const found = types.find((t) => t.value === shockTypeValue);
  return found ? found.label : shockTypeValue;
}
