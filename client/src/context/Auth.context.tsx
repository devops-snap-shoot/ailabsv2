import { createContext, useContext, useEffect, useState } from 'react'
import { Role, UserInterface, UsertInvitedInterface } from '../interfaces/Auth.interface'
import { useHistory, useParams } from 'react-router-dom'
import authRouter from '../routes/auth.routes'
import companiesRoutes from '../routes/companies.routes'
import rolesRoutes from '../routes/roles.routes'
import { AiLabs, ImKChatLogo, KEternalIsotype, KEternalLogo } from '../icons'

export interface AuthType {
    isAuth: boolean
    initials: string
    login: (email: string, password: string) => Promise<boolean>
    initForgotPassword: (email: string, subdomain: string, logo: string, iconPage: string) => Promise<{state: boolean, data: string}>
    restorePassword: (password: string, token: string) => Promise<{state: boolean, data: string}>
    logout: () => void
    isDesktop: boolean
    loading: boolean
    token: string
    totalDocsByMonth: number
    isPremium: boolean
    userId: string
    logo: string
    iconPage: string
    styleCompany: string
    user?: UserInterface
    userInvited?: UsertInvitedInterface
    subdomain: string
    roles: Role[]
    companies: any[]
    allRoles: any[]
    avatars: any[]
    avatarSelected: any
    setAvatarSelected: React.Dispatch<any>
    outWelcome: () => void
    verifyToken: (token: string) => Promise<void>
    setEnableNavbar: React.Dispatch<React.SetStateAction<boolean>>
    enableNavbar: boolean
    setContainerWidth: React.Dispatch<React.SetStateAction<number | undefined>>
    containerWidth: number | undefined
    setContainerHeight: React.Dispatch<React.SetStateAction<number | undefined>>
    containerHeight: number | undefined
    isSmartPhone: boolean
    setIsSmartphone: React.Dispatch<React.SetStateAction<boolean>>
    apiKeyElevenLabs: string | undefined
    setAvatarIdLocal: React.Dispatch<React.SetStateAction<string>>
    disableButtons: boolean
    companyId: string
}

export const AuthContext = createContext<AuthType>({} as AuthType)

export const AuthProvider = (props: any) => {
    const [isAuth, setIsAuth] = useState((localStorage.getItem('isAuth') === 'true') ? true : false)
    const [isDesktop, setIsDesktop] = useState(false)
    const [user, setUser] = useState<UserInterface>()
    const [userInvited, setUserInvited] = useState<UsertInvitedInterface>()
    const [companies, setCompanies] = useState<any[]>([])
    const [allRoles, setAllRoles] = useState<any[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [userId, setUserId] = useState<string>('')
    const [totalDocsByMonth, setTotalDocsByMonth] = useState(0)
    const [token, setToken] = useState('')
    const [initials, setInitials] = useState('')
    const [loading, setLoading] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [logo, setLogo] = useState('')
    const [iconPage, setIconPage] = useState('')
    const [pageTitle, setPageTitle] = useState('')
    const [styleCompany, setStyleCompany] = useState('')
    const [subdomain, setSubdomain] = useState('')
    const [avatars, setAvatars] = useState<any[]>([])
    const [avatarSelected, setAvatarSelected] = useState<any>()
    const [enableNavbar, setEnableNavbar] = useState(false)
    const [port, setPort] = useState()

    const [myRole, setMyRole] = useState<Role>()
    const [companyId, setCompanyId] = useState('')

    const [containerWidth, setContainerWidth] = useState<number>()
    const [containerHeight, setContainerHeight] = useState<number>()
    const [isSmartPhone, setIsSmartphone] = useState(true)

    const [apiKeyElevenLabs, setApiKeyElevenLabs] = useState<string>()

    const [admin, setAdmin] = useState(false)

    const [avatarIdLocal, setAvatarIdLocal] = useState('')

    const [disableButtons, setDisableButtons] = useState(false)


    const history = useHistory()

    useEffect(() => {
        if (avatarIdLocal.length > 0) {
            setEnableNavbar(true)
            /* setIsSmartphone(true) */
            const userInvited = {
                name: 'Invitado',
                lastName: '',
                chatId: avatarIdLocal
            }
            setUserInvited(userInvited)
        }
    }, [avatarIdLocal])

    useEffect(() => {
        if (myRole) {
            if (myRole.name === 'doctor') {
                setDisableButtons(true)
            }
        }
    }, [myRole])
 
    useEffect(() => {
        
        setApiKeyElevenLabs(process.env.REACT_APP_ELEVENLABS_API_KEY)
        if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
            setIsDesktop(false)
        } else {
            setIsDesktop(true)
        }
        const subdomainCache = window.location.host.split('.')[0]
        if (subdomainCache==='demo') {
            setSubdomain(subdomainCache)
        } else if (subdomainCache.includes('ailabs')) {
            setSubdomain('ailabs')
        } else {
            const subD = window.location.port === '8101' ? 'ailabs' : window.location.port === '8102' ? 'demo' : 'app'
            setSubdomain(subD)
        }
    }, [])

    useEffect(() => {
        /* if (subdomain === 'ailabs') { */
            setStyleCompany('MEGALABS')
            setLogo(AiLabs)
            setIconPage(AiLabs)
            const title = document.getElementById('app-title')
            if (title) {
                title.innerText = 'AiLab Helper'
            }
        /* } else if (subdomain === 'demo') {
            setStyleCompany('K-ETERNAL')
            setLogo(KEternalLogo)
            setIconPage(KEternalIsotype)
            const title = document.getElementById('app-title')
            if (title) {
                title.innerText = 'K-Eternal'
            }
        } else {
            setStyleCompany('DEFAULT')
            setLogo(ImKChatLogo)
            const title = document.getElementById('app-title')
            if (title) {
                title.innerText = 'K-Chat PDF AI'
            }
        } */
    }, [subdomain])

    useEffect(() => {
        if (iconPage.length > 0) {
            const img: any = document.getElementById('icon-page')
            if (img) {
                img.href = iconPage
            }
        }
    }, [iconPage])

    useEffect(() => {
        if (containerWidth) {
            if (containerWidth < 768) {
                setIsSmartphone(true)
            } else {
                setIsSmartphone(false)
            }
        }
    }, [containerWidth])

    useEffect(() => {
        if (isAuth) {
            /* const avatarsSaved = localStorage.getItem('avatars')
            if (avatarsSaved) {
                setAvatars(JSON.parse(avatarsSaved))
            } */
            const tokenSaved = localStorage.getItem('token')
            if (tokenSaved) {
                setToken(tokenSaved)
            }
            const userIdSaved = localStorage.getItem('userId')
            if (userIdSaved) {
                setUserId(userIdSaved)
            }
            const userCache = localStorage.getItem('user')
            if (userCache) {
                setUser(JSON.parse(userCache))
            }
        }
    }, [isAuth])

    useEffect(() => {
        if (user) {
            setInitials(`${user.name} ${user.lastName}`)
            setTotalDocsByMonth(user.totalDocsByMonth)
            setIsPremium(user.isPremium)
            setUserId(user._id)
            setRoles(user.roles as Role[])
            if (user.organization && user.organization.length > 0) {
                getRolesByCompany()
            }
        }
    }, [user])

    useEffect(() => {
        window.addEventListener('resize', () => {
          const container = document.getElementById('main-content')
          if (container) {
            const resizeObserver = new ResizeObserver(() => { 
              setContainerWidth(container.offsetWidth)
            });
            resizeObserver.observe(container)
              
          }
        })
    }, [])

    const outWelcome = async () => {
        if (user) {
            history.replace('/home')
        } else {
            history.replace('/login')
        }
    }

    const getCompanies = async () => {
        const companiesCache = await companiesRoutes.getCompanies()
        setCompanies(companiesCache.data)
    }

    const getAllRoles = async () => {
        const rolesCache = await rolesRoutes.getAllRoles()
        setAllRoles(rolesCache.data)
    }

    const getRolesByCompany = async () => {
        const rolesCache = await rolesRoutes.getRolesByCompany(user?.organization[0])
        setAllRoles(rolesCache.data)
    }

    const verifyToken = async (token: string) => {
        try {
            if (token.length > 0) {
                const response = await authRouter.verifyUserToken(token)
                if (response.data) {
                    setUser(response.data)
                    localStorage.setItem('user', JSON.stringify(response.data))
                    setIsAuth(true)
                    localStorage.setItem('isAuth', 'true')
                    history.replace('/home')
                }
            } else {
                history.replace('/login')
            }
        } catch (error) {
            console.log(error)
            logout()
        }
    }

    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            const response = await authRouter.login(email, password, subdomain)
            console.log(response)
            /* if (response.avatars.length === 0) {
                history.replace('/upload_audio')
            } else { */
                setMyRole(response.data.roles[0])
                if(response.data.organization[0])
                setCompanyId(response.data.organization[0]._id)
                /* setAvatars(response.avatars) */
                /* localStorage.setItem('avatars', JSON.stringify(response.avatars)) */
                setUser(response.data)
                localStorage.setItem('user', JSON.stringify(response.data))
                setToken(response.token)
                localStorage.setItem('token', response.token)
                localStorage.setItem('userId', response.data._id)
                setIsAuth(true)
                localStorage.setItem('isAuth', 'true')
                setLoading(false)
                history.replace('/home')
            /* } */
            return response
        } catch (error) {
            console.log(error)
            setLoading(false)
            return error
        }
    }

    const initForgotPassword = async (email: string, subdomain: string, logo: string, iconPage: string) => {
        setLoading(true)
        try {
            const response = await authRouter.initForgotPassword(email, subdomain, logo, iconPage)
            setLoading(false)
            return {state: true, data: ''}
        } catch (error: any) {
            setLoading(false)
            return {state: false, data: error}
        }
    }

    const restorePassword = async (password: string, token: string) => {
        setLoading(true)
        try {
            const response = await authRouter.restorePassword(password, token)
            console.log(response)
            setLoading(false)
            return {state: true, data: ''}
        } catch (error: any) {
            setLoading(false)
            console.log(error.response.data.message)
            return {state: false, data: error.response.data.message}
        }
    }

    const logout = () => {
        setIsAuth(false)
        setUser(undefined)
        setToken('')
        localStorage.clear()
        setEnableNavbar(false)
        setUserInvited(undefined)
        history.replace('/login')
    }

    const value:AuthType = {
        isAuth,
        initials,
        login,
        initForgotPassword,
        restorePassword,
        logout,
        isDesktop,
        loading,
        token,
        totalDocsByMonth,
        isPremium,
        userId,
        logo,
        iconPage,
        styleCompany,
        user,
        userInvited,
        subdomain,
        roles,
        companies,
        allRoles,
        avatarSelected,
        avatars,
        setAvatarSelected,
        outWelcome,
        verifyToken,
        enableNavbar,
        setEnableNavbar,
        containerWidth,
        setContainerWidth,
        containerHeight,
        setContainerHeight,
        isSmartPhone,
        setIsSmartphone,
        apiKeyElevenLabs,
        setAvatarIdLocal,
        disableButtons,
        companyId
    }

    return (
        <AuthContext.Provider value={value} >
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)