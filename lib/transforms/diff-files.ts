import { Observable, from, zip } from 'rxjs'
import { flatMap, map, partition, reduce, takeUntil } from 'rxjs/operators'
import { lines as getLines } from '../strings'

interface DiffHeader {
  hash: string
  authorName: string
  authorEmail: string
  timestamp: number
}

interface FileHeader {
  filename: string
  isCreated: boolean
  isDeleted: boolean
}

interface DiffFile extends FileHeader {
  contents: string[]
}

export type FileDiff = DiffHeader & DiffFile

const DIFF_HEADER = /^diff --git (?:a\/|\/dev\/null)(.*) (?:b\/|\/dev\/null)(.*)$/
const DEVNULL = '/dev/null'

export function getCommitFiles(diff: string): Observable<FileDiff> {
  let lines = getLines(diff)

  // Parse header
  let [ hash, authorEmail, authorName, timestamp, ...bodyLines ] = lines

  // Emits a single value; this diff's header
  let headerStream = from([ { hash, authorEmail, authorName, timestamp: parseInt(timestamp) } ])

  // Emits each line of the diff
  let diffStream = from(bodyLines)

  // headersStream emits whenever a diff header is found
  // linesStream emits whenever a non-diff-header line is found
  let [ headerLineStream, linesStream ] = partition(DIFF_HEADER.test)(diffStream)

  let fileHeadersStream = headerLineStream
    .pipe(map(mapHeaderLine))

  let filesStream = fileHeadersStream
    .pipe(flatMap((header: FileHeader) => {
      return linesStream
        .pipe(takeUntil(fileHeadersStream))
        .pipe(reduce((acc: string[], x: string) => [ ...acc, x ]))
        .pipe(map(lines => ({ ...header, contents: lines })))
    }))

  return zip(headerStream, filesStream)
    .pipe(map(([ header, file ]) => ({ ...header, ...file })))
}

function mapHeaderLine(header: string): FileHeader {
  let [ , aFile, bFile ] = header.match(DIFF_HEADER)!
  let isCreated = aFile === DEVNULL
  let isDeleted = bFile === DEVNULL
  let filename = isDeleted ? aFile : bFile
  return { isCreated, isDeleted, filename }
}
