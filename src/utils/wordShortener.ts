export const getShortenedWord = (
  str: string | undefined,
  truncationStart = 5,
  truncationEnd = 5
): string => {
  if (!str) return "TBD"
  if (str.length < 10) return str
  return (
    str.substring(0, truncationStart) +
    "..." +
    str.substring(str.length - truncationEnd, str.length)
  )
}
