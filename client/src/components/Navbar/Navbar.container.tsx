import { IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react"
import { Admin, AiHumans, Dashboard, Documents, Files, Home, ImKChatLogo, KauelLogoTransparent, Logout, Menu, Specialities, User } from "../../icons"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../context/Auth.context"
import SelectFileModal from "../../modals/SelectFile.modal"
import AvatarOptionsModal from "../../modals/AvatarOptions.modal"
import { useHistory, useLocation } from "react-router"
import { createOutline } from "ionicons/icons"
import { DashboardIcon } from "../../icons/dashboard.icon"
import { AiHumansIcon } from "../../icons/ai-humans.icon"
import { UserAdminIcon } from "../../icons/user-admin.icon"
import { FilesIcon } from "../../icons/files.icon"
import { SpecialitiesIcon } from "../../icons/specialities.icon"

const navBarButtonsInit: {
    id: number,
    name: string,
    disabled: boolean,
    icon: string,
    url: string,
    state: boolean
}[] = [
    {
        id: 0,
        name: 'dashboard',
        disabled: false,
        icon: Dashboard,
        url: '/home',
        state: true
    },
    {
        id: 1,
        name: 'specialities',
        disabled: false,
        icon: Specialities,
        url: '/specialities',
        state: false
    },
    {
        id: 2,
        name: 'files',
        disabled: false,
        icon: Files,
        url: '/files',
        state: false
    },
    {
        id: 3,
        name: 'admin',
        disabled: false,
        icon: Admin,
        url: '/user-admin',
        state: false
    },
    {
        id: 4,
        name: 'ai-humans',
        disabled: false,
        icon: AiHumans,
        url: '/ai-humans',
        state: false
    },
]


export const NavbarContainer = () => {
    const {logout, isSmartPhone, logo, iconPage, userInvited, styleCompany, disableButtons} = useAuthContext()
    const [navBarExpanded, setNavBarExpanded] = useState(false)
    const [enableText, setEnableText] = useState(false)
    const [openSelectFileModal, setOpenSelectFileModal] = useState(false)
    const [openAvatarOptionModal, setOpenAvatarOptionModal] = useState(false)

    const [navBarButtons, setNavBarButtons] = useState<{
        id: number,
        name: string,
        disabled: boolean,
        icon: string,
        url: string,
        state: boolean
    }[]>(navBarButtonsInit)
    /* const [openSelectAvatarModal, setOpenSelectAvatarModal] = useState(false) */

    const history = useHistory()
    const location = useLocation()

    /* useEffect(() => {
        setNavBarButtons(navBarButtonsInit)
    }, []) */

    useEffect(() => {
        console.log(location.pathname)
        const navBarListCache: {
            id: number,
            name: string,
            disabled: boolean,
            icon: string,
            url: string, 
            state: boolean
        }[] = [...navBarButtons]
        navBarListCache.forEach((button) => {
            if (button.url === location.pathname) {
                button.state = true
            } else {
                button.state = false
            }
        })
        console.log(navBarListCache)
        setNavBarButtons(navBarListCache)
        /* setNavBarButtons(navBarListCache.map(button => {
            if (button.url === location.pathname) {
                button.state = true
            } else {
                button.state = false
            }
            return button
        })) */
        /* const navBarList: {
            id: number,
            name: string,
            disabled: boolean,
            icon: JSX.Element,
            url: string
        }[] = navBarListCache.map((button) => {
            console.log(button.icon.props)
            if (button.url === location.pathname) {
                button.icon.props
            } else {
                button.icon.props.fill = '#A3AED0'
            }
            return button
        }) */
        /* setNavBarButtons(navBarList) */
    }, [location.pathname])

    useEffect(() => {
        window.addEventListener('click', (e: any) => {
            const navBar = document.getElementById('navBar')
            if (navBar && navBar.contains(e.target)){
              // Clicked in box
            } else{
              if (navBarExpanded) {
                expandMenu()
              }
            }
        });
    })

    useEffect(() => {
        const navBar = document.getElementById('navBar')
        if (navBarExpanded) {
            if (navBar) {
                navBar.style.width = '299px'
                navBar.style.transition = '1s'
                setTimeout(() => {
                    setEnableText(true)
                }, 600);
            }    
        } else {
            if (navBar) {
                setTimeout(() => {
                    setEnableText(false)
                }, 100);
                navBar.style.width = '108px'
                navBar.style.transition = '1s'
            } 
        }
    }, [navBarExpanded])

    useEffect(() => {
        if (isSmartPhone) {
            setEnableText(true)
        }
    }, [isSmartPhone])

    const expandMenu = () => {
        setNavBarExpanded(navBarExpanded ? false : true)
    }

    return (
        <div className="navBar-container" id={'navBar-container'}>
            {
                openSelectFileModal && <SelectFileModal
                    open={openSelectFileModal}
                    handleClose={() => {setOpenSelectFileModal(false)}}
                />
            }
            {openAvatarOptionModal && <AvatarOptionsModal
                open={openAvatarOptionModal}
                handleClose={() => {setOpenAvatarOptionModal(false)}}
            />}
            <button style={{backgroundColor: 'transparent'}} onClick={() => {expandMenu()}}>
                <IonGrid style={{padding: 0, height: 85}}>
                    <IonRow style={{padding: 0}}>
                        <div style={{textAlign: 'left', maxWidth: 140}}>
                            {
                                !enableText && <IonCol style={{padding: 0}} /* size={enableText ? 'auto' : '12'} */>
                                    <img width={'100%'} style={{maxWidth: 140}} src={iconPage}/>
                                </IonCol>
                            }
                            {
                                enableText && 
                                <IonCol style={{padding: 0}} size="auto">
                                    <img /* width={'60%'} */ style={{maxWidth: 140}} src={logo} alt="" />
                                </IonCol>
                            }
                        </div>
                    </IonRow>
                </IonGrid>
            </button>
            <div style={{marginTop: 30, marginBottom: 30, textAlign: 'center', maxWidth: 48}}>
                <p style={{fontFamily:'Manrope'}}>Menu</p>
            </div>
            {userInvited && <IonButton fill="clear" className={`navBar-button icon-button-${styleCompany}`} onClick={() => {alert('Demo no permite creación de cuentas.')}}>
                <IonIcon icon={createOutline} style={{marginLeft: enableText ? 11.5 : 0, marginRight: enableText ? 11.5 : 0}} /> {enableText && <IonText style={{marginRight: 10}}>Create account</IonText>}
            </IonButton>}
            {!userInvited && <div>
                {
                    navBarButtons.map((button) => {
                        return (
                            <div key={button.id}>
                                <IonButton style={{'--background-hover':'var(--k-eternal-button-second)', '--background-focused': 'var(--k-eternal-button-second)'}} fill="clear" slot="icon-only" className={`navBar-button icon-button-${styleCompany}`} onClick={() => {history.push(`${button.url}`)}}>
                                    <img
                                        height={24}
                                        width={24} 
                                        src={button.icon}
                                        style={
                                            {
                                                filter: button.state ? 'brightness(0) saturate(100%) invert(52%) sepia(11%) saturate(1484%) hue-rotate(186deg) brightness(81%) contrast(91%)' : 'brightness(0) saturate(100%) invert(80%) sepia(16%) saturate(672%) hue-rotate(192deg) brightness(86%) contrast(89%)',
                                                marginRight: 10
                                            }
                                        } /> {
                                            enableText && 
                                            <IonText style={{marginRight: 10, filter: button.state ? 'brightness(0) saturate(100%) invert(52%) sepia(11%) saturate(1484%) hue-rotate(186deg) brightness(81%) contrast(91%)' : 'brightness(0) saturate(100%) invert(80%) sepia(16%) saturate(672%) hue-rotate(192deg) brightness(86%) contrast(89%)'}}>{button.name}</IonText>}
                                </IonButton>
                                <br />
                            </div>
                        )
                    })
                }
            </div>}
            <div className="navBar-container" style={{position: "absolute", left: 0, bottom: 0}}>
                <IonButton style={{'--background-hover':'var(--k-eternal-button-second)'}} fill="clear" slot="icon-only" className={`navBar-button icon-button-${styleCompany}`} onClick={() => {logout()}}>
                    <IonIcon style={{marginLeft: enableText ? 11.5 : 0, marginRight: enableText ? 11.5 : 0}} src={Logout} /> {enableText && <IonText style={{marginRight: 10}}>Log out</IonText>}
                </IonButton>
            </div>
        </div>
    )
}