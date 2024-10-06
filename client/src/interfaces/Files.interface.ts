import { MessageFormat } from "./Messages.interface"

export interface FilesData {
    _id?: string
    file: string
    id: number
    name: string
    userId: any[]
    messages: MessageFormat[]
    url: string
    wait: boolean
    state: boolean
    createdAt?: string
}