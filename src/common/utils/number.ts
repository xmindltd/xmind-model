export function stripNum(num: number, precision = 12): number {
  return +parseFloat(num.toPrecision(precision))
}
