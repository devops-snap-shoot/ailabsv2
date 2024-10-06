import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./Auth.context";
import usersRoutes from "../routes/users.routes";
import { UserInterface } from "../interfaces/Auth.interface";
import { useHistory } from "react-router";

interface UsersType {
    users: UserInterface[],
    deleteUser: (_id: string) => void
    permitCreate: boolean
    permitRead: boolean
    permitEdit: boolean
    nameRole: string
    createNewUser: (user: UserInterface) => void
    editUser: (user: UserInterface) => void
    pages: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    group: any
} 

export const UsersContext = createContext<UsersType>({} as UsersType)

export const UsersProvider = (props: any) => {
    const history = useHistory()
    const {user, isAuth, roles} = useAuthContext()
    const [users, setUsers] = useState<UserInterface[]>([])
    const [nameRole, setNameRole] = useState('')
    const [permitCreate, setPermitCreate] = useState(false)
    const [permitRead, setPermitRead] = useState(false)
    const [permitEdit, setPermitEdit] = useState(false)
    const [pages, setPages] = useState(0)
    const [page, setPage] = useState(1)
    const [group, setGroup] = useState<any>()

    useEffect(() => {
        if (users && users.length > 0) {
            console.log(users)
            const usersGroup: any = {}
            let initIndex = 0
            let numberUsersByGroup = 14
            const pagesCache = (Math.floor(users.length / 14) + 1)
            setPages(pagesCache)
            for (let i = 1; i < (pagesCache + 1); i++) {
                if (!usersGroup[i]) {
                    usersGroup[i] = users.slice(initIndex, (numberUsersByGroup))
                    initIndex = initIndex + 14
                    numberUsersByGroup = numberUsersByGroup + 14
                }
            }
            setGroup(usersGroup)
        }
    }, [users])

    useEffect(() => {
        console.log(roles)
        if (roles[0]) {
            console.log(roles[0])
            if (roles[0] && roles[0].resources && roles[0].resources.OrganizationPermission) {
                if (roles[0].resources.OrganizationPermission['read:any']) {
                    console.log('Data')
                    if (roles[0].resources.User['read:any']) {
                        console.log('Data2')
                        readAllUsers()
                        setPermitCreate(true)
                        setPermitRead(true)
                        setPermitEdit(true)
                    }
                }
            } else {
                console.log(user)
                setNameRole(roles[0] ? roles[0].name : '')
                if (roles[0] && roles[0].resources) {
                    Object.keys(roles[0].resources).forEach((key) => {
                        console.log(key)
                        if (key === 'create:any') {
                            setPermitCreate(true)
                        }
                        if (key === 'read:any') {
                            setPermitRead(true)
                        }
                        if (key === 'edit:any') {
                            setPermitEdit(true)
                        }
                    })
                }
            }
        }
    },[roles])

    useEffect(() => {
        if (nameRole && nameRole.length > 0) {
            if (nameRole === 'admin') {
                readUsers()
            }
        }
    }, [nameRole])

    const readAllUsers = async () => {
        const response = await usersRoutes.getUsers()
        setUsers(response.data)
    }

    const readUsers = async () => {
        const response = await usersRoutes.getUsersByCompany(user!.organization[0]._id)
        setUsers(response.data)
    }

    const deleteUser = async (_id: string) => {
        const response = await usersRoutes.getUsers()
        readAllUsers()
    }

    const createNewUser = async (userEdit: UserInterface) => {
        const response = await usersRoutes.createUser(userEdit)
        if(response && response.message === 'created') {
            history.goBack()
        }
    }

    const editUser = async (userEdit: UserInterface) => {
        const response = await usersRoutes.editUser(userEdit)
        if(response) {
            history.goBack()
        }
    }

    const value: UsersType = {
        users,
        deleteUser,
        permitCreate,
        permitRead,
        permitEdit,
        nameRole,
        createNewUser,
        editUser,
        pages,
        page,
        setPage,
        group
    }

    return (
        <UsersContext.Provider value={value} >
            {props.children}
        </UsersContext.Provider>
    )
}

export const useUsersContext = () => useContext(UsersContext)