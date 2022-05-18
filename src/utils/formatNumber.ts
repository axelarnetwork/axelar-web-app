export function getNumber(num: number, decimals?: number) {

  if (num * 1000 < 1) return num?.toFixed(Math.min(6, decimals || 6));

  const units: string[] = ["K", "M", "B", "T", "Q"]
  const unit: number = Math.floor((num / 1.0e1).toFixed(0).toString().length)
  const r: number = unit % 3
  const x = Math.abs(Number(num)) / Number("1.0e+" + (unit - r))
  return unit >= 3 ? x.toFixed(2) + units[Math.floor(unit / 3) - 1] : num?.toFixed(2)
}
