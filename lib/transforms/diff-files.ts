import { lines as getLines } from '../strings'
import { FileChange, FileDiff } from '../models'

const DEVNULL = '/dev/null'
const TRIPLE_PLUS = new RegExp("^\\+\\+\\+ (?:(?:a|b)/)?(.*)$")
const TRIPLE_MINUS = new RegExp("^--- (?:(?:a|b)/)?(.*)$")

export default function getDiffFiles(diff: FileChange): FileDiff {
  let seed = {
    additions: 0,
    deletions: 0,
    isCreated: false,
    isDeleted: false,
    plusFile: '',
    minusFile: ''
  }

  let fileStats = getLines(diff.file)
    .reduce((acc, line) => {
      let matches
      if (matches = line.match(TRIPLE_PLUS)) {
        acc.plusFile = matches[1]
      } else if (matches = line.match(TRIPLE_MINUS)) {
        acc.minusFile = matches[1]
      } else if (/^\+/.test(line)) {
        acc.additions++
      } else if (/^-/.test(line)) {
        acc.deletions++
      }
      return acc
    }, seed)

  let { additions, deletions } = fileStats
  let isCreated = fileStats.minusFile === DEVNULL
  let isDeleted = fileStats.plusFile === DEVNULL
  let filename = isCreated ? fileStats.plusFile : fileStats.minusFile

  return {
    ...diff,
    additions,
    deletions,
    isCreated,
    isDeleted,
    filename
  }
}
