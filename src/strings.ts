export function* lines(str: string) {
  let nextStart = 0;
  let nextEnd = 0;
  while ((nextEnd = str.indexOf('\n', nextStart)) !== -1) {
    let next = str.substring(nextStart, nextEnd)
    yield next
    nextStart = nextEnd + 1
  }
}
