export const isValidDecimal = (input: string) => {
  return /^\d+\.\d{0,6}$/.test(input) || input?.toString().indexOf(".") <= 0
}
