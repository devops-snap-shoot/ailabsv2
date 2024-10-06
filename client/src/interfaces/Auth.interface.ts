export interface UserInterface {
    emailVerifiedAt: boolean
    state: boolean
    roles: Role[]
    organization: any[]
    _id: string
    email: string
    createdAt: string
    lastName: string
    name: string
    run: string
    updatedAt: string
    totalDocsByMonth: number
    isPremium: boolean
    image: string
    dateOfBirth: string
    phone: string
    password: string
}

export interface Role {
    name: string
    resources: {
        OrganizationPermission: any,
        RolePermission: any,
        User: any
    }
}

export interface UsertInvitedInterface {
    name: string
    lastName: string
    chatId: string
}