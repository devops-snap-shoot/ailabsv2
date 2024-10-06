import { ObjectId } from "mongoose"

export interface File {
    name: string,
    user: ObjectId,
    idFile: number,
    createdAt: Date,
    updatedAt: Date,
    state: boolean
}