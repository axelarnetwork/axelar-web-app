export const roundUp = (inputNum: number) => {
  const num = parseFloat((Math.ceil(inputNum * 10) / 10).toString())

  return parseFloat(
    num - Math.floor(num) === 0 || num / 100 > 1
      ? Math.ceil(num).toString()
      : num.toFixed(1)
  )
}
