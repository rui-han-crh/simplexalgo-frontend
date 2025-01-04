
export function formatFraction(n: string): string {
  const isNegative = n.startsWith("-")

  const [numerator, denominator] = n.replace("-", "").split("/")

  if (denominator) {
      return `${isNegative ? "-" : ""}\\frac{${numerator}}{${denominator}}`
  } else {
      return `${isNegative ? "-" : ""}${numerator}`
  }
}
  
export function formatVariable(v: string | undefined): string {
  if (v === undefined) {
      return ""
  }
  
  return v.split(/(\d+)/).map((s, i) => i % 2 === 0 ? s : `_${s}`).join('')
}