export type Log = {
  id: string
  createdAt: Date
  content: string
  project?: {
    id: string
    name: string
  }
}
