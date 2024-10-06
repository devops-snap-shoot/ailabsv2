import { ObjectId } from 'mongoose'
import { LatLng, Project } from './project.interface'

/* export interface Organization {
    _id: ObjectId
    name: string
    description?: string
    state: boolean
    contracts: Contract[]
    imageBgLoginUrl: string[]
    themes: string[]
    idOrg: number
    nation: string
    region: string
    city: string
    address: string
    coords: LatLng
} */

export interface Organization {
    _id: ObjectId
    name: string
    subdomain?: string
    state: boolean
    logo: string
    isotype: string
    theme: string
    idorg: number
    language: string
}

export interface Contract {
    init: Date
    finish: Date
    contractDescription: string
    projects: Project[]
}

export interface Role {
    _id: ObjectId
    name: string
    resources: object
    organizationId: Organization
    description: string
}

export interface RoleId {
    _id: ObjectId
}

export interface OrganizationUsers {
    organization: ObjectId
    users: ObjectId[]
}