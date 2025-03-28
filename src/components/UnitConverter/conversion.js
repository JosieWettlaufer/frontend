/**
 * @file conversions.js
 * @description Defines unit conversion formulas for various common measurements.
 */

/**
 * Object containing unit conversion formulas and metadata.
 * Each key represents a unit category and provides:
 * - `label`: A description of the conversion.
 * - `formula`: Function to convert from unit1 to unit2.
 * - `reverseFormula`: Function to convert from unit2 to unit1.
 * - `unit1`: The source unit.
 * - `unit2`: The target unit.
 * - `conversionFactor`: The numerical conversion factor.
 */
export const conversions = {
  mL: {
    label: "Cups to Milliliters",
    formula: (cups) => cups * 236.588,
    reverseFormula: (ml) => ml / 236.588,
    unit1: "Cups",
    unit2: "mL",
    conversionFactor: 236.588,
  },
  Fahrenheit: {
    label: "Celsius to Fahrenheit",
    formula: (c) => (c * 9) / 5 + 32,
    reverseFormula: (f) => ((f - 32) * 5) / 9,
    unit1: "Celsius",
    unit2: "Fahrenheit",
    conversionFactor: 1.8, // Scaling factor for linear conversion
  },
  grams: {
    label: "Ounces to Grams",
    formula: (oz) => oz * 28.35,
    reverseFormula: (g) => g / 28.35,
    unit1: "oz",
    unit2: "g",
    conversionFactor: 28.35,
  },
  pounds: {
    label: "Kilograms to Pounds",
    formula: (kg) => kg * 2.20462,
    reverseFormula: (lb) => lb / 2.20462,
    unit1: "kg",
    unit2: "lb",
    conversionFactor: 2.20462,
  },
  tbsp: {
    label: "Tablespoons to Milliliters",
    formula: (tbsp) => tbsp * 14.787,
    reverseFormula: (ml) => ml / 14.787,
    unit1: "tbsp",
    unit2: "mL",
    conversionFactor: 14.787,
  },
  tsp: {
    label: "Teaspoons to Milliliters",
    formula: (tsp) => tsp * 4.929,
    reverseFormula: (ml) => ml / 4.929,
    unit1: "tsp",
    unit2: "mL",
    conversionFactor: 4.929,
  },
};
