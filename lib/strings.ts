export function lines(str: string) {
  let ret = [ ]
  let nextStart = 0;
  let nextEnd = 0;
  while ((nextEnd = str.indexOf('\n', nextStart)) !== -1) {
    let next = str.substring(nextStart, nextEnd)
    ret.push(next)
    nextStart = nextEnd + 1
  }

  if (nextStart !== str.length) {
    ret.push(str.substring(nextStart, str.length))
  }

  return ret
}
