import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonIcon, IonRow, IonToolbar } from "@ionic/react"
import { folderOpenOutline, personOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import { FilesActive, SettingsActive, TrendingActive, UsersActive, VisualizationActive } from "./ActiveAdminPage"
import { useAuthContext } from "../../context/Auth.context"
import { useHistory, useLocation } from "react-router"

export const AdminContainer = () => {
    const adminButtonsPagesTemplate = [
        {
            id: 0,
            typeActivePage: 'files',
            icon: folderOpenOutline,
            active: true
        },
        {
            id: 1,
            typeActivePage: 'users',
            icon: personOutline,
            active: false
        },
    ]
    const {styleCompany} = useAuthContext()
    const [pageActive, setPageActive] = useState<string>('')
    const [adminButtonsPages, setAdminButtonsPage] = useState(adminButtonsPagesTemplate)

    const history = useHistory()

    const location = useLocation()

    useEffect(() => {
        console.log(location)
        if (location.pathname.includes('users')) {
            setPageActive('users')
        } else if (location.pathname.includes('files')) {
            setPageActive('files')
        } else {
            history.push('/admin/files')
        }
    }, [location])

    const activePage = (value: string, index: any) => {
        history.push('/admin/' + value)
        setPageActive(value)
        const buttons = [...adminButtonsPages]
        buttons.forEach(b => {
            b.active = false
        })
        buttons[index].active = true
        setAdminButtonsPage(buttons)
    }

    return (
        <IonContent className={`appContent${styleCompany}`}>
            <IonGrid>
                <IonRow>
                    <IonCol size={'auto'}>
                        <div className="admin-content">
                            <IonToolbar>
                                <IonButtons slot="start">
                                    {
                                        adminButtonsPages.map((button, index) => {
                                            return (
                                                <IonButton key={button.id} onClick={() => {activePage(button.typeActivePage, index)}} className={`side-menu-button ${button.active ? 'button-active' : ''}`} shape={'round'} fill={'clear'}>
                                                    <IonIcon slot={'icon-only'} icon={button.icon} />
                                                </IonButton>
                                            )
                                        })
                                    }
                                </IonButtons>
                            </IonToolbar>
                            {
                                (pageActive === 'trending') ?
                                <TrendingActive />
                                :
                                (pageActive === 'files') ?
                                <FilesActive />
                                :
                                (pageActive === 'setting') ?
                                <SettingsActive />
                                :
                                (pageActive === 'visualization') ?
                                <VisualizationActive />
                                :
                                (pageActive === 'users') ?
                                <UsersActive />
                                :
                                null
                                
                            }
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}