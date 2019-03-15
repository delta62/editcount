export interface FileChange {
  hash: string
  authorName: string
  authorEmail: string
  timestamp: number
  file: string
}

export interface FileDiff {
  hash: string
  authorName: string
  authorEmail: string
  timestamp: number
  filename: string
  isCreated: boolean
  isDeleted: boolean
  isRename: boolean
  additions: number
  deletions: number
}
