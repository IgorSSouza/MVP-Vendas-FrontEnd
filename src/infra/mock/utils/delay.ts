export function delay(milliseconds = 250) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}
